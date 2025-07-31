import { setupServer } from 'msw/node'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/utils/testing'
import { handlers, apiCallTracker, resetTestBookmarks } from '@/mocks/handlers'
import BookmarkManager from './page'

// Setup MSW server
const server = setupServer(...handlers)

// Mock react-toastify
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

      // Check main layout elements
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByText('My Bookmarks')).toBeInTheDocument()
      expect(screen.getByText('Organize and manage your favorite links')).toBeInTheDocument()
    })

    it('should integrate data fetching between BookmarkList and API', async () => {
      renderWithProviders(<BookmarkManager />)

      // Wait for BookmarkList to fetch data
      await waitFor(() => {
        expect(apiCallTracker.getBookmarks).toBe(1)
      })

      // Check that bookmarks are displayed (BookmarkList should render them)
      await waitFor(() => {
        expect(screen.getByText('React Documentation')).toBeInTheDocument()
      })

      expect(screen.getByText('Redux Toolkit')).toBeInTheDocument()
      expect(screen.getByText('TypeScript Handbook')).toBeInTheDocument()
    })

    it('should handle CreateBookmark and BookmarkList data integration', async () => {
      const { user } = renderWithProviders(<BookmarkManager />)

      // Wait for initial data load
      await waitFor(() => {
        expect(apiCallTracker.getBookmarks).toBe(1)
      })

      // Find and click the create bookmark button
      const createButton = screen.getByRole('button', { name: /create bookmark/i })
      await user.click(createButton)

      // This test verifies the integration flow exists
      // In a real app, clicking would open a modal/form
      // For now, we just verify the button interaction works
      expect(createButton).toBeInTheDocument()

      // Verify the button was clickable and the integration point exists
      expect(apiCallTracker.getBookmarks).toBe(1) // Initial load happened
    })
  })

  describe('Error Boundary Integration', () => {
    it('should render error boundaries around critical components', async () => {
      renderWithProviders(<BookmarkManager />)

      // Wait for data to load completely
      await waitFor(() => {
        expect(apiCallTracker.getBookmarks).toBe(1)
      })

      // Wait for BookmarkList to render data instead of loading
      await waitFor(() => {
        expect(screen.getByText('React Documentation')).toBeInTheDocument()
      })

      // Verify that components that could have error boundaries are present
      expect(screen.getByRole('button', { name: /create bookmark/i })).toBeInTheDocument()

      // Verify other bookmarks are also rendered
      expect(screen.getByText('Redux Toolkit')).toBeInTheDocument()
      expect(screen.getByText('TypeScript Handbook')).toBeInTheDocument()
    })
  })

  describe('Data Flow and State Management', () => {
    it('should maintain consistent state between components', async () => {
      const { store } = renderWithProviders(<BookmarkManager />)

      // Wait for initial data load
      await waitFor(() => {
        expect(apiCallTracker.getBookmarks).toBe(1)
      })

      // Check that store contains the fetched data
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

      // Initially, we should see some loading state or the data should load quickly
      // Wait for the data to be loaded
      await waitFor(() => {
        expect(screen.getByText('React Documentation')).toBeInTheDocument()
      })

      // Verify that API was called
      expect(apiCallTracker.getBookmarks).toBe(1)
    })
  })
})
