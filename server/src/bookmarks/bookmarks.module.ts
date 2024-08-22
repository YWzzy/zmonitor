import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service.js';
import { BookmarksController } from './bookmarks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { BookmarkLog } from './entities/bookmarkLogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, BookmarkLog])],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule { }
