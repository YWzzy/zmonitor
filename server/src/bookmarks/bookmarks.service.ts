import { Injectable, Logger, ConflictException } from '@nestjs/common';
import * as parse5 from 'parse5';
import * as puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Transaction, In } from 'typeorm';
import { parse as urlParse } from 'url';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { isValidUrl, timestampToDateString } from 'src/utils';
import { CustomHttpException } from 'src/common/exception';
import { Bookmark } from './entities/bookmark.entity';
import { ConcurrencyLimiter } from 'src/utils/limit';
import { BookmarkLog } from './entities/bookmarkLogs.entity';

@Injectable()
export class BookmarksService {
  private logger = new Logger(BookmarksService.name);
  private readonly CONCURRENCY_LIMIT = 5; // 并发限制
  private limiter: ConcurrencyLimiter;

  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(BookmarkLog)
    private readonly bookmarkLogRepository: Repository<BookmarkLog>,
  ) {
    this.limiter = new ConcurrencyLimiter(this.CONCURRENCY_LIMIT);
  }

  async parseBookmarks(file: Express.Multer.File): Promise<void> {
    try {
      const fileName = file.originalname;
      // 检查是否存在具有相同 fileName 的记录
      // 检查是否存在相同的日志记录
      const existingLog = await this.bookmarkLogRepository.findOne({
        where: { fileName: fileName },
      });
      if (existingLog) {
        throw new ConflictException('Log with the same fileName already exists.');
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
    return new Promise(async (resolve, reject) => {
      try {
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
            document.querySelector(`meta[name="twitter:${name}"]`)?.getAttribute('content') ||
            document.querySelector(`meta[itemprop="${name}"]`)?.getAttribute('content') ||
            document.querySelector(`link[rel="image_src"]`)?.getAttribute('href') ||
            document.querySelector(`link[rel="shortcut icon"]`)?.getAttribute('href') ||
            document.querySelector('img')?.getAttribute('src');
          return {
            name: document.title,
            description: getMetaContent('description'),
            cover: getMetaContent('image'),
            href: window.location.href,
          };
        });

        await browser.close();
        console.log('====================================');
        console.log('metadata:', metadata);
        console.log('====================================');
        resolve(metadata);
      } catch (error) {
        reject(error);
      }
    });
  }

  private async createBookmarksInTransaction(bookmarks: any[], fileName: string): Promise<void> {
    try {
      await this.bookmarkRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
        // 1. 创建 BookmarkLog 实体
        const bookmarkLog = new BookmarkLog();
        bookmarkLog.fileName = fileName;
        bookmarkLog.operator = 'zzy';
        bookmarkLog.operation = 'Create';
        bookmarkLog.note = 'Parsing bookmarks';
        const savedLog = await this.bookmarkLogRepository.save(bookmarkLog);
        for (const bookmark of bookmarks) {
          // 解析 URL 并获取域名
          const domain = bookmark.url ? urlParse(bookmark.url).hostname : null;
          const createBookmarkDto = {
            type: bookmark.type,
            uuid: bookmark.uuid,
            pid: bookmark.pid,
            bookId: savedLog.id, // 使用 BookmarkLog 的 id 作为 bookId
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
            domain: domain,
            important: 1,
            isExpanded: 1,
            sort: bookmark.sort || 0,
            removed: bookmark.removed || 0
          };

          await transactionalEntityManager.save(Bookmark, createBookmarkDto)
        }
      });
      // 事务完成后异步更新元数据
      const updatePromises = bookmarks
        .filter(bookmark => bookmark.url)
        .map(bookmark => this.limiter.addTask(() => this.updateBookmarkMetadata(bookmark.uuid, bookmark.url)));

      // 并发执行更新任务，限制并发数量
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error creating bookmarks in transaction:', error);
      throw new CustomHttpException(500, error.message);
    }
  }


  // 更新书签元数据
  private async updateBookmarkMetadata(uuid: string, url: string): Promise<void> {
    try {
      const metadata = await this.fetchUrlMetadata(url);
      const item = await this.bookmarkRepository.findOneBy({ uuid: uuid });
      if (!item) {
        throw new CustomHttpException(406, 'Bookmark not found.');
      }
      const updatedItem = { ...item, ...metadata };
      await this.update(updatedItem.id, updatedItem);
    } catch (error) {
      this.logger.error(`Failed to update metadata for bookmark ${uuid}:`, error.message);
    }
  }

  // 获取指定条件下的目录结构
  async getDirectoryStructure(fileName: string, creator: string): Promise<Bookmark[]> {
    // 查询所有文件夹节点
    const allFolders = await this.bookmarkRepository.find({
      where: { fileName, creator, type: 'folder' },
      order: { sort: 'ASC' }, // 假设有一个 sort 字段用于排序
    });

    // 构建一个以uuid为key的Map，用于快速查找节点
    const folderMap = new Map<string, Bookmark>();
    for (const folder of allFolders) {
      folderMap.set(folder.uuid, folder);
    }

    // 计算每个文件夹下的书签数量
    for (const folder of allFolders) {
      folder['bookmarkCount'] = await this.bookmarkRepository.count({
        where: { pid: folder.uuid, type: 'bookmark', fileName, creator }
      });
    }

    // 将所有节点按pid分组
    const rootNodes: Bookmark[] = [];
    for (const folder of allFolders) {
      if (!folder.pid || !folderMap.has(folder.pid)) {
        // 如果节点没有pid或者pid不存在于folderMap中，则为根节点
        rootNodes.push(folder);
      } else {
        // 将节点添加到其父节点的children数组中
        const parent = folderMap.get(folder.pid);
        if (parent) {
          if (!parent['children']) {
            parent['children'] = [];
          }
          parent['children'].push(folder);
        }
      }
    }

    // 递归函数，用于对每个文件夹的子文件夹进行排序
    const sortChildren = (node: Bookmark) => {
      if (node['children']) {
        node['children'].sort((a, b) => a.sort - b.sort);
        node['children'].forEach(sortChildren);
      }
    };

    // 对根节点进行排序，并递归排序所有子节点
    rootNodes.sort((a, b) => a.sort - b.sort);
    rootNodes.forEach(sortChildren);

    return rootNodes;
  }


  // 根据目录的uuid查询子元素数据
  async getChildrenByUuid(uuid: string, childUUids: string[]): Promise<Bookmark[]> {
    // 将逗号分隔的 childUUids 转换为数组
    return this.bookmarkRepository.find({
      where: [
        { pid: uuid },
        { pid: In(childUUids) },
      ],
    });
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
