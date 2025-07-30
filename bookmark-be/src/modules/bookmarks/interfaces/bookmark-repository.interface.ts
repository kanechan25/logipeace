import { Bookmark } from '../entities/bookmark.entity';

export interface PaginationResult<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IBookmarkRepository {
  /**
   * Save a new bookmark
   * @param bookmark - The bookmark to save
   * @returns The saved bookmark
   */
  save(bookmark: Bookmark): Promise<Bookmark>;

  /**
   * Find all bookmarks with pagination
   * @param page - Page number (starting from 1)
   * @param limit - Number of items per page
   * @returns Paginated bookmarks result
   */
  findAll(page: number, limit: number): Promise<PaginationResult<Bookmark>>;

  /**
   * Find a bookmark by ID
   * @param id - The bookmark ID
   * @returns The bookmark if found, null otherwise
   */
  findById(id: string): Promise<Bookmark | null>;

  /**
   * Update an existing bookmark
   * @param id - The bookmark ID to update
   * @param updateData - Partial bookmark data to update
   * @returns The updated bookmark if found, null otherwise
   */
  update(id: string, updateData: Partial<Bookmark>): Promise<Bookmark | null>;

  /**
   * Delete a bookmark by ID
   * @param id - The bookmark ID to delete
   * @returns True if deleted, false if not found
   */
  deleteById(id: string): Promise<boolean>;

  /**
   * Get total count of bookmarks
   * @returns Total number of bookmarks
   */
  count(): Promise<number>;
}

export const IBookmarkRepository = Symbol('IBookmarkRepository');
