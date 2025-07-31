import { http, HttpResponse } from 'msw'
import type { Bookmark, CreateBookmarkRequest, PaginatedResponse, DeleteBookmarkResponse } from '@/types'

// Mock data for testing
const mockBookmarks: Bookmark[] = [
  {
    id: '1',
    title: 'React Documentation',
    url: 'https://react.dev',
    description: 'Official React documentation',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Redux Toolkit',
    url: 'https://redux-toolkit.js.org',
    description: 'The official, opinionated, batteries-included toolset for efficient Redux development',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs',
    description: 'TypeScript documentation and handbook',
    createdAt: '2025-01-03T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
  },
]

// Track API calls for testing cache invalidation
export const apiCallTracker = {
  getBookmarks: 0,
  getBookmark: 0,
  addBookmark: 0,
  deleteBookmark: 0,
  reset: () => {
    apiCallTracker.getBookmarks = 0
    apiCallTracker.getBookmark = 0
    apiCallTracker.addBookmark = 0
    apiCallTracker.deleteBookmark = 0
  },
}

let testBookmarks = [...mockBookmarks]

export const handlers = [
  // Get paginated bookmarks
  http.get('*/bookmarks', ({ request }) => {
    apiCallTracker.getBookmarks++
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = testBookmarks.slice(startIndex, endIndex)

    const response: PaginatedResponse<Bookmark> = {
      data: paginatedData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: testBookmarks.length,
        totalPages: Math.ceil(testBookmarks.length / limit),
        hasNextPage: endIndex < testBookmarks.length,
        hasPreviousPage: page > 1,
      },
    }

    return HttpResponse.json(response)
  }),

  // Get single bookmark
  http.get('*/bookmarks/:id', ({ params }) => {
    apiCallTracker.getBookmark++

    const { id } = params
    const bookmark = testBookmarks.find((b) => b.id === id)

    if (!bookmark) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Bookmark not found',
      })
    }

    return HttpResponse.json(bookmark)
  }),

  // POST Create new bookmark
  http.post('*/bookmarks', async ({ request }) => {
    apiCallTracker.addBookmark++
    const newBookmarkData = (await request.json()) as CreateBookmarkRequest
    if (!newBookmarkData.title || !newBookmarkData.url) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Title and URL are required',
      })
    }

    const newBookmark: Bookmark = {
      id: Date.now().toString(), // Simple ID generation for tests
      title: newBookmarkData.title,
      url: newBookmarkData.url,
      description: newBookmarkData.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    testBookmarks.unshift(newBookmark) // Add to beginning to simulate most recent
    return HttpResponse.json(newBookmark, { status: 201 })
  }),

  // DELETE bookmark
  http.delete('*/bookmarks/:id', ({ params }) => {
    apiCallTracker.deleteBookmark++
    const { id } = params
    const bookmarkIndex = testBookmarks.findIndex((b) => b.id === id)

    if (bookmarkIndex === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Bookmark not found',
      })
    }
    testBookmarks.splice(bookmarkIndex, 1)
    const response: DeleteBookmarkResponse = {
      message: 'Bookmark deleted successfully',
      id: id as string,
    }

    return HttpResponse.json(response)
  }),

  // PUT update bookmark (for future reference)
  http.put('*/bookmarks/:id', async ({ params, request }) => {
    const { id } = params
    const updateData = (await request.json()) as Partial<CreateBookmarkRequest>
    const bookmarkIndex = testBookmarks.findIndex((b) => b.id === id)
    if (bookmarkIndex === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Bookmark not found',
      })
    }
    const updatedBookmark: Bookmark = {
      ...testBookmarks[bookmarkIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    }
    testBookmarks[bookmarkIndex] = updatedBookmark

    return HttpResponse.json(updatedBookmark)
  }),
]

export const resetTestBookmarks = () => {
  testBookmarks = [...mockBookmarks]
  apiCallTracker.reset()
}

export const getTestBookmarks = () => [...testBookmarks]

export const addTestBookmark = (bookmark: Bookmark) => {
  testBookmarks.push(bookmark)
}

export const removeTestBookmark = (id: string) => {
  const index = testBookmarks.findIndex((b) => b.id === id)
  if (index !== -1) {
    testBookmarks.splice(index, 1)
  }
}
