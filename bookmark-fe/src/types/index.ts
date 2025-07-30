// Bookmark types
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

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  status: number
  details?: Record<string, unknown>
}

// Theme types
export type ThemeMode = 'light' | 'dark'
export type ThemeColor = 'blue' | 'green' | 'red' | 'purple' | 'orange'

export interface ThemeState {
  mode: ThemeMode
  color: ThemeColor
}

// Form types
export interface BookmarkFormData {
  title: string
  url: string
  description?: string
}

// UI State types
export interface UIState {
  isLoading: boolean
  error: string | null
}

// Virtualization types
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
