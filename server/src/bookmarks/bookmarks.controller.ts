import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiOkResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Response } from "express";
import { ParseBookmarkDto } from './dto/parse-bookmark.dto';
import { CustomHttpException } from 'src/common/exception';
import { isValidUrl } from 'src/utils';

@ApiTags('Bookmarks')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) { }

  @ApiOperation({ summary: '上传书签文件并解析为JSON格式' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: '书签文件', type: ParseBookmarkDto })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async parseBookmarks(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.bookmarksService.parseBookmarks(file);
    } catch (error) {
      console.error('Error parsing bookmarks file:', error); // 添加错误日志
      throw new CustomHttpException(500, error.message);
    }
  }

  @ApiOperation({ summary: '获取指定条件下的整个目录结构数据' })
  @ApiQuery({ name: 'id', type: String, description: '书签日志的 ID' })
  @ApiOkResponse({ description: '成功返回目录结构数据' })
  @Get('directory')
  async getDirectoryStructure(
    @Query('id') id: string,
  ) {
    try {
      return await this.bookmarksService.getDirectoryStructure(id);
    } catch (error) {
      throw new CustomHttpException(500, error.message);
    }
  }

  @ApiOperation({ summary: '根据目录的 uuid 查询子元素数据' })
  @ApiBody({
    description: '包含父目录 UUID 和子目录 UUIDs 的请求体',
  })
  @ApiOkResponse({ description: '成功返回子元素数据' })
  @Post('children')
  async getChildrenByUuid(@Body() body: { uuid: string; childUUids: string[] }) {
    try {
      const { uuid, childUUids } = body;
      return await this.bookmarksService.getChildrenByUuid(uuid, childUUids);
    } catch (error) {
      throw new CustomHttpException(500, error.message);
    }
  }

  @ApiOperation({ summary: '创建新书签' })
  @ApiBody({ description: '创建书签的请求体', type: CreateBookmarkDto })
  @ApiOkResponse({ description: '成功创建书签', type: CreateBookmarkDto })
  @Post()
  async create(@Body() createBookmarkDto: CreateBookmarkDto) {
    return await this.bookmarksService.create(createBookmarkDto);
  }

  @ApiOperation({ summary: '获取所有书签集合' })
  @ApiOkResponse({ description: '成功返回所有书签集合', type: [CreateBookmarkDto] })
  @Get('logs')
  async findAllBookLogs() {
    try {
      return await this.bookmarksService.findAllBookLogs();
    } catch (error) {
      throw new CustomHttpException(500, error.message);
    }
  }

  @ApiOperation({ summary: '获取所有书签' })
  @ApiOkResponse({ description: '成功返回所有书签', type: [CreateBookmarkDto] })
  @Get()
  async findAll() {
    return await this.bookmarksService.findAll();
  }

  @ApiOperation({ summary: '根据ID获取书签' })
  @ApiParam({ name: 'id', type: String, description: '书签的 ID' })
  @ApiOkResponse({ description: '成功返回书签数据', type: CreateBookmarkDto })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('Url info retrieved: findOne'); // 添加日志
    return await this.bookmarksService.findOne(id);
  }

  @ApiOperation({ summary: '更新书签信息' })
  @ApiParam({ name: 'id', type: String, description: '书签的 ID' })
  @ApiBody({ description: '更新书签的请求体', type: UpdateBookmarkDto })
  @ApiOkResponse({ description: '成功更新书签数据', type: UpdateBookmarkDto })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookmarkDto: UpdateBookmarkDto) {
    return await this.bookmarksService.update(id, updateBookmarkDto);
  }

  @ApiOperation({ summary: '删除书签' })
  @ApiParam({ name: 'id', type: String, description: '书签的 ID' })
  @ApiOkResponse({ description: '成功删除书签' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.bookmarksService.remove(id);
  }

  @ApiOperation({ summary: '通过URL获取网页信息' })
  @ApiQuery({ name: 'url', type: String, description: '需要获取信息的 URL' })
  @ApiOkResponse({ description: '成功返回 URL 元数据', type: Object })
  @Post('fetchUrlMetadata')
  async fetchUrlMetadata(@Query('url') url: string, @Res() res: Response) {
    try {
      // 校验url合法性
      if (!isValidUrl(url)) {
        throw new CustomHttpException(400, 'Url is invalid.');
      }
      const data = await this.bookmarksService.fetchUrlMetadata(url);
      return res.status(HttpStatus.OK).json({
        code: 200,
        data,
        message: "Url info retrieved successfully.",
      });
    } catch (error) {
      console.error('Error retrieving URL metadata:', error); // 添加错误日志
      throw new CustomHttpException(500, error.message);
    }
  }
}
