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
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Response, Request } from "express";
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
  parseBookmarks(@UploadedFile() file: Express.Multer.File) {
    try {

      return this.bookmarksService.parseBookmarks(file);
    } catch (error) {
      console.error('Error parsing bookmarks file:', error); // 添加错误日志
      throw new CustomHttpException(500, error.message);
    }
  }

  @ApiOperation({ summary: '创建新书签' })
  @Post()
  create(@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.create(createBookmarkDto);
  }

  @ApiOperation({ summary: '获取所有书签' })
  @Get()
  findAll() {
    return this.bookmarksService.findAll();
  }

  @ApiOperation({ summary: '根据ID获取书签' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('Url info retrieved: findOne'); // 添加日志
    return this.bookmarksService.findOne(id);
  }

  @ApiOperation({ summary: '更新书签信息' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookmarkDto: UpdateBookmarkDto) {
    return this.bookmarksService.update(id, updateBookmarkDto);
  }

  @ApiOperation({ summary: '删除书签' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarksService.remove(id);
  }

  @ApiOperation({ summary: '通过URL获取网页信息' })
  @Post('fetchUrlMetadata')
  async fetchUrlMetadata(@Query('url') url: string, @Res() res: Response) {

    try {
      // 校验url合法性
      if (!isValidUrl) {
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
