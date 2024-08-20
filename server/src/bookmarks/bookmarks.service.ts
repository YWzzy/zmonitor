import { Injectable, Logger, ConflictException } from '@nestjs/common';
import * as parse5 from 'parse5';
import * as puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Transaction } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { isValidUrl, timestampToDateString } from 'src/utils';
import { CustomHttpException } from 'src/common/exception';
import { Bookmark } from './entities/bookmark.entity';

@Injectable()
export class BookmarksService {
  private logger = new Logger(BookmarksService.name);

  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
  ) { }

  async parseBookmarks(file: Express.Multer.File): Promise<void> {
    try {
      const fileName = file.originalname;
      // 检查是否存在具有相同 fileName 的记录
      const existingBookmark = await this.bookmarkRepository.findOne({
        where: { fileName: fileName },
      });

      if (existingBookmark) {
        throw new ConflictException('Bookmark with the same fileName already exists.');
      }
      const htmlContent = file.buffer.toString('utf8');
      const parsedData = parse5.parse(htmlContent);
      const bookmarks = this.extractBookmarks(parsedData);

      // 使用事务保存书签
      await this.createBookmarksInTransaction(bookmarks, fileName);
    } catch (error) {
      console.error('Error parsing bookmarks file:', error);
      throw new CustomHttpException(500, error.message);
    }
  }

  private extractBookmarks(parsedData: any): any[] {
    const dlElements = this.findDLElements(parsedData);
    return this.processDLElements(dlElements[0], null); // Start with the root DL, no parent uuid
  }

  private findDLElements(node: any): any[] {
    if (node.nodeName === 'dl') {
      return [node];
    }
    if (node.childNodes) {
      return node.childNodes.flatMap(child => this.findDLElements(child));
    }
    return [];
  }

  private processDLElements(dl: any, parentUuid: string | null): any[] {
    const bookmarks: any[] = [];
    const stack: { node: any, parentUuid: string | null }[] = [{ node: dl, parentUuid }];

    while (stack.length > 0) {
      const { node, parentUuid } = stack.pop()!;

      for (const dt of node.childNodes.filter(node => node.nodeName === 'dt')) {
        const h3 = dt.childNodes.find(node => node.nodeName === 'h3');
        const a = dt.childNodes.find(node => node.nodeName === 'a');
        const nestedDl = dt.childNodes.find(node => node.nodeName === 'dl');

        const uuid = uuidv4();

        if (h3) {
          const folder = {
            type: 'folder',
            uuid: uuid,
            pid: parentUuid,
            title: this.getTextContent(h3),
            created: this.getAttributeValue(h3, 'add_date') ? timestampToDateString(this.getAttributeValue(h3, 'add_date')) : new Date().toISOString(),
            lastUpdate: this.getAttributeValue(h3, 'last_modified'),
            important: this.getAttributeValue(h3, 'personal_toolbar_folder') || false,
          };
          bookmarks.push(folder);

          if (nestedDl) {
            stack.push({ node: nestedDl, parentUuid: uuid });
          }
        } else if (a) {
          const bookmark = {
            type: 'bookmark',
            uuid: uuid,
            pid: parentUuid,
            title: this.getTextContent(a),
            url: this.getAttributeValue(a, 'href'),
            created: this.getAttributeValue(a, 'add_date') ? timestampToDateString(this.getAttributeValue(a, 'add_date')) : new Date().toISOString(),
            icon: this.getAttributeValue(a, 'icon'),
          };
          bookmarks.push(bookmark);
        }
      }
    }

    return bookmarks;
  }

  private getTextContent(node: any): string {
    if (node.childNodes) {
      return node.childNodes
        .filter(child => child.nodeName === '#text')
        .map(child => child.value)
        .join('')
        .trim();
    }
    return '';
  }

  private getAttributeValue(node: any, attributeName: string): string {
    const attribute = node.attrs.find(attr => attr.name.toLowerCase() === attributeName.toLowerCase());
    return attribute ? attribute.value : '';
  }

  // 通过url获取网页元数据
  async fetchUrlMetadata(url: string): Promise<any> {
    if (!isValidUrl(url)) {
      throw new CustomHttpException(400, 'Url is invalid.');
    }
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const metadata = await page.evaluate(() => {
      const getMetaContent = (name: string) =>
        document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ||
        document.querySelector(`meta[property="og:${name}"]`)?.getAttribute('content') ||
        document.querySelector(`meta[name="twitter:${name}"]`)?.getAttribute('content');
      return {
        name: document.title,
        description: getMetaContent('description'),
        cover: getMetaContent('image'),
        href: window.location.href,
      };
    });

    await browser.close();
    return metadata;
  }

  private async createBookmarksInTransaction(bookmarks: any[], fileName: string): Promise<void> {
    await this.bookmarkRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
      for (const bookmark of bookmarks) {
        const createBookmarkDto = {
          uuid: bookmark.uuid,
          pid: bookmark.pid,
          fileName: fileName,
          creator: 'zzy', // 默认创建者
          title: bookmark.title,
          url: bookmark.url,
          created: bookmark.created,
          icon: bookmark.icon,
          name: bookmark.title, // Assuming title as name for metadata
          description: bookmark.description || null,
          cover: bookmark.cover || null,
          href: bookmark.href || null,
        };

        await transactionalEntityManager.save(Bookmark, createBookmarkDto)
      }
    });

    // 事务完成后异步更新元数据
    const updateTasks = bookmarks
      .filter(bookmark => bookmark.url)
      .map(bookmark => this.updateBookmarkMetadata(bookmark.uuid, bookmark.url));

    // 并发执行更新任务
    await Promise.all(updateTasks);
  }

  // 更新书签元数据
  private async updateBookmarkMetadata(uuid: string, url: string): Promise<void> {
    try {
      const metadata = await this.fetchUrlMetadata(url);
      await this.bookmarkRepository.update(uuid, {
        name: metadata.name,
        description: metadata.description,
        cover: metadata.cover,
        href: metadata.href,
      });
      this.logger.log(`Metadata updated for bookmark ${uuid}`);
    } catch (error) {
      this.logger.error(`Failed to update metadata for bookmark ${uuid}:`, error);
      throw new CustomHttpException(500, error.message);
    }
  }

  async create(createBookmarkDto: CreateBookmarkDto) {
    this.logger.log('Creating bookmark:', createBookmarkDto);
    return this.bookmarkRepository.save(createBookmarkDto);
  }

  async findAll() {
    this.logger.log('Fetching all bookmarks');
    return this.bookmarkRepository.find();
  }

  async findOne(id: string) {
    this.logger.log('Fetching bookmark with ID:', id);
    return this.bookmarkRepository.findOneBy({ uuid: id });
  }

  async update(id: string, updateBookmarkDto: UpdateBookmarkDto) {
    this.logger.log('Updating bookmark with ID:', id, updateBookmarkDto);
    await this.bookmarkRepository.update(id, updateBookmarkDto);
    return this.bookmarkRepository.findOneBy({ uuid: id });
  }

  async remove(id: string) {
    this.logger.log('Removing bookmark with ID:', id);
    await this.bookmarkRepository.delete(id);
    return { id, deleted: true };
  }
}
