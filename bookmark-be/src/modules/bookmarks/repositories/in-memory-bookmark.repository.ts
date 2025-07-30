import { Injectable, OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Bookmark } from '../entities/bookmark.entity';
import { IBookmarkRepository, PaginationResult } from '../interfaces/bookmark-repository.interface';

@Injectable()
export class InMemoryBookmarkRepository implements IBookmarkRepository, OnModuleInit {
  private bookmarks: Map<string, Bookmark> = new Map();
  private bookmarkIds: string[] = []; // To maintain insertion order (newest first)

  async onModuleInit() {
    await this.generateMockBookmarks();
  }

  // Generate 5000 mock bookmarks
  private async generateMockBookmarks(): Promise<void> {
    const categories = [
      'Technology',
      'News',
      'Social Media',
      'Entertainment',
      'Education',
      'Shopping',
      'Sports',
      'Health',
      'Finance',
      'Travel',
    ];

    const domains = [
      'example.com',
      'demo.org',
      'sample.net',
      'test.io',
      'site.co',
      'web.app',
      'platform.dev',
      'service.com',
      'portal.net',
      'hub.org',
    ];

    const titlePrefixes = [
      'Ultimate Guide to',
      'Best Practices for',
      'Introduction to',
      'Advanced',
      'Complete Tutorial on',
      'Tips and Tricks for',
      'Comprehensive Guide to',
      'Getting Started with',
      'Mastering',
      'Essential',
    ];

    for (let i = 0; i < 5000; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const titlePrefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];

      // Create dates spread over the last year, with newer ones first
      const daysAgo = Math.floor(Math.random() * 365);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const bookmark = new Bookmark({
        id: uuidv4(),
        title: `${titlePrefix} ${category} ${i + 1}`,
        url: `https://${domain}/${category.toLowerCase().replace(' ', '-')}/item-${i + 1}`,
        description: `This is a detailed description for ${category} bookmark #${i + 1}. It contains valuable information and resources about ${category.toLowerCase()}.`,
        createdAt,
        updatedAt: createdAt,
      });

      this.bookmarks.set(bookmark.id, bookmark);
      this.bookmarkIds.unshift(bookmark.id);
    }
  }

  async save(bookmark: Bookmark): Promise<Bookmark> {
    this.bookmarks.set(bookmark.id, bookmark);
    // Add to the beginning of the array (newest first)
    this.bookmarkIds.unshift(bookmark.id);
    return bookmark;
  }

  async findAll(page: number = 1, limit: number = 20): Promise<PaginationResult<Bookmark>> {
    // Get all bookmarks and descending order sort by updatedAt (newest first)
    const allBookmarks = Array.from(this.bookmarks.values()).sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA;
    });

    const totalItems = allBookmarks.length;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.max(1, Math.min(page, totalPages));

    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    const data = allBookmarks.slice(startIndex, endIndex);

    return {
      data,
      totalItems,
      currentPage,
      itemsPerPage: limit,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }

  async findById(id: string): Promise<Bookmark | null> {
    return this.bookmarks.get(id) || null;
  }

  async deleteById(id: string): Promise<boolean> {
    const bookmark = this.bookmarks.get(id);
    if (!bookmark) {
      return false;
    }

    this.bookmarks.delete(id);
    const index = this.bookmarkIds.indexOf(id);
    if (index > -1) {
      this.bookmarkIds.splice(index, 1);
    }

    return true;
  }

  async count(): Promise<number> {
    return this.bookmarks.size;
  }
}
