import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  Bookmark,
  CreateBookmarkRequest,
  UpdateBookmarkRequest,
  PaginatedResponse,
  BookmarkStats,
  DeleteBookmarkResponse,
} from '@/types'
import { API_CONFIG } from '@/configs/api'

export const bookmarksApi = createApi({
  reducerPath: 'bookmarksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
    timeout: API_CONFIG.timeout,
  }),
  tagTypes: ['Bookmark'],
  endpoints: (builder) => ({
    // Get paginated bookmarks
    getBookmarks: builder.query<PaginatedResponse<Bookmark>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => ({
        url: '/bookmarks',
        params: { page, limit },
      }),
      providesTags: ['Bookmark'],
    }),

    // Get single bookmark by ID
    getBookmark: builder.query<Bookmark, string>({
      query: (id) => `/bookmarks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Bookmark', id }],
    }),

    // Create new bookmark
    addBookmark: builder.mutation<Bookmark, CreateBookmarkRequest>({
      query: (newBookmark) => ({
        url: '/bookmarks',
        method: 'POST',
        body: newBookmark,
      }),
      invalidatesTags: ['Bookmark'],
    }),

    // Update existing bookmark
    updateBookmark: builder.mutation<Bookmark, { id: string; data: UpdateBookmarkRequest }>({
      query: ({ id, data }) => ({
        url: `/bookmarks/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Bookmark', id }, 'Bookmark'],
    }),

    // Delete bookmark
    deleteBookmark: builder.mutation<DeleteBookmarkResponse, string>({
      query: (id) => ({
        url: `/bookmarks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bookmark'],
    }),

    // Get bookmark statistics
    getBookmarkStats: builder.query<BookmarkStats, void>({
      query: () => '/bookmarks/meta/stats',
      providesTags: ['Bookmark'],
    }),
  }),
})

export const {
  useGetBookmarksQuery,
  useGetBookmarkQuery,
  useAddBookmarkMutation,
  useUpdateBookmarkMutation,
  useDeleteBookmarkMutation,
  useGetBookmarkStatsQuery,
} = bookmarksApi
