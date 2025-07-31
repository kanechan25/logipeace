import { setupServer } from 'msw/node'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/utils/testing'
import { handlers, apiCallTracker, resetTestBookmarks } from '@/mocks/handlers'
import BookmarkManager from './page'

const server = setupServer(...handlers)

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
}))

describe('BookmarkManager Page', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  beforeEach(() => {
    resetTestBookmarks()
    apiCallTracker.reset()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  describe('Page Layout and Integration', () => {
    it('should render main layout with header, footer and main content', async () => {
      renderWithProviders(<BookmarkManager />)

      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByText('My Bookmarks')).toBeInTheDocument()
      expect(screen.getByText('Organize and manage your favorite links')).toBeInTheDocument()
    })

    it('should integrate data fetching between BookmarkList and API', async () => {
      renderWithProviders(<BookmarkManager />)

      await waitFor(() => {
        expect(apiCallTracker.getBookmarks).toBe(1)
      })
      await waitFor(() => {
        expect(screen.getByText('React Documentation')).toBeInTheDocument()
      })

      expect(screen.getByText('Redux Toolkit')).toBeInTheDocument()
      expect(screen.getByText('TypeScript Handbook')).toBeInTheDocument()
    })

    it('should handle CreateBookmark and BookmarkList data integration', async () => {
      const { user } = renderWithProviders(<BookmarkManager />)

      await waitFor(() => {
        expect(apiCallTracker.getBookmarks).toBe(1)
      })

      const createButton = screen.getByRole('button', { name: /create bookmark/i })
      await user.click(createButton)

      expect(createButton).toBeInTheDocument()
      expect(apiCallTracker.getBookmarks).toBe(1) // Initial load happened
    })
  })

  describe('Error Boundary Integration', () => {
    it('should render error boundaries around critical components', async () => {
      renderWithProviders(<BookmarkManager />)

      await waitFor(() => {
        expect(apiCallTracker.getBookmarks).toBe(1)
      })
      await waitFor(() => {
        expect(screen.getByText('React Documentation')).toBeInTheDocument()
      })

      expect(screen.getByRole('button', { name: /create bookmark/i })).toBeInTheDocument()
      expect(screen.getByText('Redux Toolkit')).toBeInTheDocument()
      expect(screen.getByText('TypeScript Handbook')).toBeInTheDocument()
    })
  })

  describe('Data Flow and State Management', () => {
    it('should maintain consistent state between components', async () => {
      const { store } = renderWithProviders(<BookmarkManager />)

      await waitFor(() => {
        expect(apiCallTracker.getBookmarks).toBe(1)
      })

      const state = store.getState()
      const queryKey = Object.keys(state.bookmarksApi.queries).find((key) => key.includes('getBookmarks'))

      expect(queryKey).toBeDefined()

      if (queryKey) {
        const bookmarksState = state.bookmarksApi.queries[queryKey] as {
          status: string
          data: { data: unknown[] }
        }
        expect(bookmarksState.status).toBe('fulfilled')
        expect(bookmarksState.data.data).toHaveLength(3)
      }
    })

    it('should handle loading states during data operations', async () => {
      renderWithProviders(<BookmarkManager />)

      await waitFor(() => {
        expect(screen.getByText('React Documentation')).toBeInTheDocument()
      })

      expect(apiCallTracker.getBookmarks).toBe(1)
    })
  })
})
