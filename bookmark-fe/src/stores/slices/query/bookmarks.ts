import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  Bookmark,
  CreateBookmarkRequest,
  UpdateBookmarkRequest,
  PaginatedResponse,
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

    // get bookmark by id
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

    // update NOT required, but I built it for future reference
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
  }),
})

export const {
  useGetBookmarksQuery,
  useGetBookmarkQuery,
  useAddBookmarkMutation,
  useUpdateBookmarkMutation,
  useDeleteBookmarkMutation,
} = bookmarksApi
