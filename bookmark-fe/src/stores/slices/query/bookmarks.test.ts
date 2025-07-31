import { setupServer } from 'msw/node'
import { waitFor } from '@testing-library/react'
import { bookmarksApi } from './bookmarks'
import { createTestStore } from '@/utils/testing'
import { handlers, apiCallTracker, resetTestBookmarks, getTestBookmarks } from '@/mocks/handlers'
import type { CreateBookmarkRequest } from '@/types'

const server = setupServer(...handlers)

let store: ReturnType<typeof createTestStore>

describe('bookmarksApi', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  beforeEach(() => {
    store = createTestStore()
    resetTestBookmarks()
    store.dispatch(bookmarksApi.util.resetApiState())
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  describe('getBookmarks (query)', () => {
    it('should fetch bookmarks and update store state', async () => {
      const promise = store.dispatch(bookmarksApi.endpoints.getBookmarks.initiate({ page: 1, limit: 20 }))
      const result = await promise

      expect(result.data).toBeDefined()
      expect(result.data?.data).toHaveLength(3)
      expect(result.data?.meta.totalItems).toBe(3)
      expect(result.data?.meta.currentPage).toBe(1)

      const firstBookmark = result.data?.data[0]
      expect(firstBookmark).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        url: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })

      const state = store.getState()
      const queryKey = Object.keys(state.bookmarksApi.queries).find((key) => key.includes('getBookmarks'))
      const bookmarksState = queryKey
        ? (state.bookmarksApi.queries[queryKey] as {
            status: string
            data?: { data: unknown[] }
          })
        : null

      expect(bookmarksState?.status).toBe('fulfilled')
      expect(bookmarksState?.data?.data).toHaveLength(3)
      expect(apiCallTracker.getBookmarks).toBe(1)

      promise.unsubscribe()
    })

    it('should handle pagination correctly', async () => {
      const promise = store.dispatch(bookmarksApi.endpoints.getBookmarks.initiate({ page: 1, limit: 2 }))
      const result = await promise
      expect(result.data?.data).toHaveLength(2)
      expect(result.data?.meta.itemsPerPage).toBe(2)
      expect(result.data?.meta.hasNextPage).toBe(true)
      expect(result.data?.meta.hasPreviousPage).toBe(false)

      promise.unsubscribe()
    })

    it('should cache results and not refetch on subsequent calls', async () => {
      const promise1 = store.dispatch(bookmarksApi.endpoints.getBookmarks.initiate({ page: 1, limit: 20 }))
      await promise1
      const promise2 = store.dispatch(bookmarksApi.endpoints.getBookmarks.initiate({ page: 1, limit: 20 }))
      await promise2

      expect(apiCallTracker.getBookmarks).toBe(1)
      promise1.unsubscribe()
      promise2.unsubscribe()
    })
  })

  describe('getBookmark (query)', () => {
    it('should fetch single bookmark by id', async () => {
      const promise = store.dispatch(bookmarksApi.endpoints.getBookmark.initiate('1'))
      const result = await promise
      expect(result.data).toMatchObject({
        id: '1',
        title: 'React Documentation',
        url: 'https://react.dev',
      })
      expect(apiCallTracker.getBookmark).toBe(1)
      promise.unsubscribe()
    })

    it('should handle not found error', async () => {
      const promise = store.dispatch(bookmarksApi.endpoints.getBookmark.initiate('nonexistent'))
      const result = await promise
      expect(result.error).toBeDefined()
      expect((result.error as { status: number })?.status).toBe(404)
      promise.unsubscribe()
    })
  })

  describe('addBookmark (mutation)', () => {
    it('should create new bookmark and update store state', async () => {
      const newBookmarkData: CreateBookmarkRequest = {
        title: 'New Test Bookmark',
        url: 'https://test.example.com',
        description: 'Test description',
      }
      const result = await store.dispatch(bookmarksApi.endpoints.addBookmark.initiate(newBookmarkData)).unwrap()
      expect(result).toMatchObject({
        id: expect.any(String),
        title: newBookmarkData.title,
        url: newBookmarkData.url,
        description: newBookmarkData.description,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
      expect(apiCallTracker.addBookmark).toBe(1)
      const testBookmarks = getTestBookmarks()
      expect(testBookmarks).toHaveLength(4) // Original 3 + 1 new
    })

    it('should invalidate cache and trigger refetch', async () => {
      const getBookmarksPromise = store.dispatch(bookmarksApi.endpoints.getBookmarks.initiate({ page: 1, limit: 20 }))
      await getBookmarksPromise

      expect(apiCallTracker.getBookmarks).toBe(1)

      const newBookmarkData: CreateBookmarkRequest = {
        title: 'Cache Invalidation Test',
        url: 'https://cache-test.com',
      }
      await store.dispatch(bookmarksApi.endpoints.addBookmark.initiate(newBookmarkData)).unwrap()
      const getBookmarksPromise2 = store.dispatch(bookmarksApi.endpoints.getBookmarks.initiate({ page: 1, limit: 20 }))
      await waitFor(() => {
        expect(apiCallTracker.getBookmarks).toBe(2)
      })
      const result = await getBookmarksPromise2

      expect(result.data?.data).toHaveLength(4)
      expect(result.data?.data.some((bookmark) => bookmark.title === 'Cache Invalidation Test')).toBe(true)

      getBookmarksPromise.unsubscribe()
      getBookmarksPromise2.unsubscribe()
    })

    it('should handle validation errors', async () => {
      const invalidBookmarkData = {
        title: '',
        url: '',
      } as CreateBookmarkRequest

      try {
        await store.dispatch(bookmarksApi.endpoints.addBookmark.initiate(invalidBookmarkData)).unwrap()

        expect(true).toBe(false)
      } catch (error) {
        expect((error as { status: number }).status).toBe(400)
      }
    })
  })

  describe('deleteBookmark (mutation)', () => {
    it('should delete bookmark and return success response', async () => {
      const bookmarkIdToDelete = '2'
      const testBookmarksBefore = getTestBookmarks()
      expect(testBookmarksBefore.find((b) => b.id === bookmarkIdToDelete)).toBeDefined()

      const result = await store.dispatch(bookmarksApi.endpoints.deleteBookmark.initiate(bookmarkIdToDelete)).unwrap()
      expect(result).toMatchObject({
        message: 'Bookmark deleted successfully',
        id: bookmarkIdToDelete,
      })

      expect(apiCallTracker.deleteBookmark).toBe(1)

      const testBookmarksAfter = getTestBookmarks()
      expect(testBookmarksAfter).toHaveLength(2) // Original 3 - 1 deleted
      expect(testBookmarksAfter.find((b) => b.id === bookmarkIdToDelete)).toBeUndefined()
    })

    it('should invalidate cache and trigger refetch after deletion', async () => {
      const getBookmarksPromise = store.dispatch(bookmarksApi.endpoints.getBookmarks.initiate({ page: 1, limit: 20 }))
      await getBookmarksPromise

      expect(apiCallTracker.getBookmarks).toBe(1)

      const bookmarkIdToDelete = '1'
      await store.dispatch(bookmarksApi.endpoints.deleteBookmark.initiate(bookmarkIdToDelete)).unwrap()

      const getBookmarksPromise2 = store.dispatch(bookmarksApi.endpoints.getBookmarks.initiate({ page: 1, limit: 20 }))

      await waitFor(() => {
        expect(apiCallTracker.getBookmarks).toBe(2)
      })

      const result = await getBookmarksPromise2

      expect(result.data?.data).toHaveLength(2)
      expect(result.data?.data.find((bookmark) => bookmark.id === bookmarkIdToDelete)).toBeUndefined()

      getBookmarksPromise.unsubscribe()
      getBookmarksPromise2.unsubscribe()
    })

    it('should handle not found error when deleting non-existent bookmark', async () => {
      const nonExistentId = 'nonexistent-id'

      try {
        await store.dispatch(bookmarksApi.endpoints.deleteBookmark.initiate(nonExistentId)).unwrap()

        expect(true).toBe(false)
      } catch (error) {
        expect((error as { status: number }).status).toBe(404)
      }
    })
  })

  describe('updateBookmark (mutation)', () => {
    it('should update bookmark and invalidate related cache', async () => {
      const bookmarkIdToUpdate = '1'
      const updateData = {
        title: 'Updated React Documentation',
        description: 'Updated description',
      }

      const result = await store
        .dispatch(
          bookmarksApi.endpoints.updateBookmark.initiate({
            id: bookmarkIdToUpdate,
            data: updateData,
          })
        )
        .unwrap()

      expect(result).toMatchObject({
        id: bookmarkIdToUpdate,
        title: updateData.title,
        description: updateData.description,
        updatedAt: expect.any(String),
      })

      const testBookmarks = getTestBookmarks()
      const updatedBookmark = testBookmarks.find((b) => b.id === bookmarkIdToUpdate)
      expect(updatedBookmark?.title).toBe(updateData.title)
      expect(updatedBookmark?.description).toBe(updateData.description)
    })
  })

  describe('Cache invalidation patterns', () => {
    it('should properly invalidate and refetch after multiple operations', async () => {
      const initialPromise = store.dispatch(bookmarksApi.endpoints.getBookmarks.initiate({ page: 1, limit: 20 }))
      await initialPromise
      expect(apiCallTracker.getBookmarks).toBe(1)

      await store
        .dispatch(
          bookmarksApi.endpoints.addBookmark.initiate({
            title: 'Test Add',
            url: 'https://test-add.com',
          })
        )
        .unwrap()

      const afterAddPromise = store.dispatch(bookmarksApi.endpoints.getBookmarks.initiate({ page: 1, limit: 20 }))
      await waitFor(() => {
        expect(apiCallTracker.getBookmarks).toBe(2)
      })

      const afterAddResult = await afterAddPromise
      expect(afterAddResult.data?.data).toHaveLength(4)

      await store.dispatch(bookmarksApi.endpoints.deleteBookmark.initiate('1')).unwrap()
      const afterDeletePromise = store.dispatch(bookmarksApi.endpoints.getBookmarks.initiate({ page: 1, limit: 20 }))
      await waitFor(() => {
        expect(apiCallTracker.getBookmarks).toBe(3)
      })
      const afterDeleteResult = await afterDeletePromise
      expect(afterDeleteResult.data?.data).toHaveLength(3)

      initialPromise.unsubscribe()
      afterAddPromise.unsubscribe()
      afterDeletePromise.unsubscribe()
    })
  })
})
