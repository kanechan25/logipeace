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
  tagTypes: ['Bookmark', 'BookmarkList'],
  endpoints: (builder) => ({
    // Get paginated bookmarks
    getBookmarks: builder.query<PaginatedResponse<Bookmark>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => ({
        url: '/bookmarks',
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Bookmark' as const, id })),
              { type: 'BookmarkList' as const, id: 'LIST' },
            ]
          : [{ type: 'BookmarkList', id: 'LIST' }],
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
      invalidatesTags: [{ type: 'BookmarkList', id: 'LIST' }],
    }),

    // update NOT required, but I built it for future reference
    updateBookmark: builder.mutation<Bookmark, { id: string; data: UpdateBookmarkRequest }>({
      query: ({ id, data }) => ({
        url: `/bookmarks/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Bookmark', id },
        { type: 'BookmarkList', id: 'LIST' },
      ],
    }),

    // Delete bookmark
    deleteBookmark: builder.mutation<DeleteBookmarkResponse, string>({
      query: (id) => ({
        url: `/bookmarks/${id}`,
        method: 'DELETE',
      }),
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const state = getState() as { [key: string]: { queries?: Record<string, unknown> } }
        const queries = state[bookmarksApi.reducerPath]?.queries || {}
        const patchResults: Array<{ undo?: () => void }> = []

        Object.keys(queries).forEach((queryKey) => {
          if (queryKey.includes('getBookmarks')) {
            try {
              const queryMatch = queryKey.match(/getBookmarks\((.+)\)/)
              if (queryMatch) {
                const queryParams = JSON.parse(queryMatch[1])
                if (queryParams.page && queryParams.limit) {
                  const patchResult = dispatch(
                    bookmarksApi.util.updateQueryData('getBookmarks', queryParams, (draft) => {
                      if (draft && draft.data) {
                        const index = draft.data.findIndex((bookmark) => bookmark.id === id)
                        if (index !== -1) {
                          // Remove the item
                          draft.data.splice(index, 1)
                          // Update pagination
                          draft.meta.totalItems = Math.max(0, draft.meta.totalItems - 1)
                          draft.meta.totalPages = Math.ceil(draft.meta.totalItems / draft.meta.itemsPerPage)
                          // if (draft.data.length === 0 && draft.meta.currentPage > 1) {}
                        }
                      }
                    })
                  )
                  patchResults.push(patchResult)
                }
              }
            } catch {}
          }
        })

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((patchResult) => {
            if (patchResult.undo) {
              patchResult.undo()
            }
          })
        }
      },
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
