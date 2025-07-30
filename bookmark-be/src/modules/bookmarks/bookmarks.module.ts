import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { InMemoryBookmarkRepository } from './repositories/in-memory-bookmark.repository';
import { IBookmarkRepository } from './interfaces/bookmark-repository.interface';

@Module({
  controllers: [BookmarksController],
  providers: [
    BookmarksService,
    {
      provide: IBookmarkRepository,
      useClass: InMemoryBookmarkRepository,
    },
  ],
  exports: [BookmarksService, IBookmarkRepository],
})
export class BookmarksModule {} 