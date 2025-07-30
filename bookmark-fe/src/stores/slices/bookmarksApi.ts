import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Bookmark, CreateBookmarkRequest, PaginatedResponse } from '../../types'

// Mock data for development
const mockBookmarks: Bookmark[] = [
  {
    id: '1',
    title: 'React Documentation',
    url: 'https://react.dev',
    description: 'The official React documentation with guides and API reference',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs',
    description: 'Learn TypeScript with comprehensive guides and examples',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    description: 'A utility-first CSS framework for rapidly building custom designs',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '4',
    title: 'Next.js Documentation',
    url: 'https://nextjs.org/docs',
    description: 'The React framework for production applications',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '5',
    title: 'Redux Toolkit',
    url: 'https://redux-toolkit.js.org',
    description: 'The official, opinionated, batteries-included toolset for efficient Redux development',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
]

// Mock storage
// eslint-disable-next-line prefer-const
let mockData = [...mockBookmarks]

export const bookmarksApi = createApi({
  reducerPath: 'bookmarksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    // Simple mock implementation
    prepareHeaders: () => new Headers(),
  }),
  tagTypes: ['Bookmark'],
  endpoints: (builder) => ({
    getBookmarks: builder.query<PaginatedResponse<Bookmark>, { page?: number; limit?: number }>({
      queryFn: async ({ page = 1, limit = 20 }) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const sortedData = [...mockData].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        const paginatedData = sortedData.slice(startIndex, endIndex)

        const response: PaginatedResponse<Bookmark> = {
          data: paginatedData,
          meta: {
            page,
            limit,
            total: mockData.length,
            totalPages: Math.ceil(mockData.length / limit),
          },
        }

        return { data: response }
      },
      providesTags: ['Bookmark'],
    }),

    addBookmark: builder.mutation<Bookmark, CreateBookmarkRequest>({
      queryFn: async (newBookmark) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 200))

        const bookmark: Bookmark = {
          id: Date.now().toString(),
          title: newBookmark.title,
          url: newBookmark.url,
          description: newBookmark.description || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        mockData.unshift(bookmark)
        return { data: bookmark }
      },
      invalidatesTags: ['Bookmark'],
    }),

    deleteBookmark: builder.mutation<void, string>({
      queryFn: async (id) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 150))

        const index = mockData.findIndex((bookmark) => bookmark.id === id)
        if (index !== -1) {
          mockData.splice(index, 1)
          return { data: undefined }
        }

        return { error: { status: 404, data: 'Bookmark not found' } }
      },
      invalidatesTags: ['Bookmark'],
    }),
  }),
})

export const { useGetBookmarksQuery, useAddBookmarkMutation, useDeleteBookmarkMutation } = bookmarksApi
