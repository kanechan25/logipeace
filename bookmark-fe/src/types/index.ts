export interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBookmarkRequest {
  title: string
  url: string
  description?: string
}

export interface UpdateBookmarkRequest {
  title?: string
  url?: string
  description?: string
}

export interface PaginationMeta {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Stats response from backend
export interface BookmarkStats {
  totalBookmarks: number
}

// Delete response from backend
export interface DeleteBookmarkResponse {
  message: string
  id: string
}

export interface ApiError {
  message: string
  status: number
  details?: Record<string, unknown>
}

export type ThemeMode = 'light' | 'dark'

export interface ThemeState {
  mode: ThemeMode
}

export interface BookmarkFormData {
  title: string
  url: string
  description?: string
}

export interface UIState {
  isLoading: boolean
  error: string | null
}

export interface VirtualizedListProps {
  height: number
  width: string | number
  itemCount: number
  itemSize: number
  itemData: Bookmark[]
}

export interface ListItemProps {
  index: number
  style: React.CSSProperties
  data: {
    items: Bookmark[]
    onDelete: (id: string) => void
  }
}
