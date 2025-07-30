import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Bookmark } from './entities/bookmark.entity';
import { IBookmarkRepository } from './interfaces/bookmark-repository.interface';

@Injectable()
export class BookmarksService {
  constructor(
    @Inject(IBookmarkRepository)
    private readonly bookmarkRepository: IBookmarkRepository,
  ) {}

  async create(createBookmarkDto: CreateBookmarkDto): Promise<Bookmark> {
    try {
      // Validate URL format more strictly
      new URL(createBookmarkDto.url);
    } catch (error) {
      throw new BadRequestException('Invalid URL format provided');
    }

    const bookmark = new Bookmark({
      id: uuidv4(),
      title: createBookmarkDto.title.trim(),
      url: createBookmarkDto.url.trim(),
      description: createBookmarkDto.description?.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.bookmarkRepository.save(bookmark);
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 20 } = paginationQuery;

    // Ensure valid pagination parameters
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page

    const result = await this.bookmarkRepository.findAll(validPage, validLimit);

    return {
      data: result.data,
      meta: {
        currentPage: result.currentPage,
        itemsPerPage: result.itemsPerPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      },
    };
  }

  async findOne(id: string): Promise<Bookmark> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Invalid bookmark ID provided');
    }

    const bookmark = await this.bookmarkRepository.findById(id);
    if (!bookmark) {
      throw new NotFoundException(`Bookmark with ID ${id} not found`);
    }

    return bookmark;
  }

  async remove(id: string): Promise<{ message: string; id: string }> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Invalid bookmark ID provided');
    }

    const deleted = await this.bookmarkRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException(`Bookmark with ID ${id} not found`);
    }

    return {
      message: 'Bookmark deleted successfully',
      id,
    };
  }

  async getStats(): Promise<{ totalBookmarks: number }> {
    const totalBookmarks = await this.bookmarkRepository.count();
    return { totalBookmarks };
  }
} 