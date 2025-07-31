import { setupServer } from 'msw/node'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/utils/testing'
import { handlers, apiCallTracker, resetTestBookmarks, getTestBookmarks } from '@/mocks/handlers'
import BookmarkItem from './BookmarkItem'
import { toast } from 'react-toastify'
import type { Bookmark } from '@/types'

const server = setupServer(...handlers)

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('@/components/shared/RelativeTime', () => ({
  RelativeTime: ({ dateString }: { dateString: string }) => (
    <span data-testid='relative-time'>{new Date(dateString).toLocaleDateString()}</span>
  ),
}))

const mockBookmark: Bookmark = {
  id: '1',
  title: 'Test Bookmark',
  url: 'https://test-example.com',
  description: 'Test description for bookmark',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

describe('BookmarkItem', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  beforeEach(() => {
    resetTestBookmarks()
    apiCallTracker.reset()
    jest.clearAllMocks()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  describe('Component Rendering and Basic Logic', () => {
    it('should render bookmark data correctly with proper URL formatting', () => {
      renderWithProviders(<BookmarkItem bookmark={mockBookmark} />)

      expect(screen.getByText('Test Bookmark')).toBeInTheDocument()
      expect(screen.getByText('Test description for bookmark')).toBeInTheDocument()

      expect(screen.getByText('test-example.com')).toBeInTheDocument()

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'https://test-example.com')
      expect(link).toHaveAttribute('target', '_blank')

      expect(screen.getByTestId('relative-time')).toBeInTheDocument()
    })
  })

  describe('URL Formatting Logic', () => {
    it('should format URLs correctly by removing www prefix', () => {
      const bookmarkWithWww: Bookmark = {
        ...mockBookmark,
        url: 'https://www.example.com/path',
      }
      renderWithProviders(<BookmarkItem bookmark={bookmarkWithWww} />)
      expect(screen.getByText('example.com')).toBeInTheDocument()
    })

    it('should handle invalid URLs gracefully', () => {
      const bookmarkWithInvalidUrl: Bookmark = {
        ...mockBookmark,
        url: 'invalid-url',
      }
      renderWithProviders(<BookmarkItem bookmark={bookmarkWithInvalidUrl} />)
      expect(screen.getByText('invalid-url')).toBeInTheDocument()
    })

    it('should handle complex URLs with subdomains and paths', () => {
      const complexBookmark: Bookmark = {
        ...mockBookmark,
        url: 'https://subdomain.example.com/path/to/resource',
      }
      renderWithProviders(<BookmarkItem bookmark={complexBookmark} />)
      expect(screen.getByText('subdomain.example.com')).toBeInTheDocument()
    })
  })

  describe('Delete Functionality and RTK Query Integration', () => {
    it('should handle delete confirmation flow and trigger RTK Query mutation', async () => {
      const { user } = renderWithProviders(<BookmarkItem bookmark={mockBookmark} />)

      expect(screen.getByLabelText('Delete bookmark')).toBeInTheDocument()
      expect(screen.queryByText('Delete')).not.toBeInTheDocument()
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument()

      await user.click(screen.getByLabelText('Delete bookmark'))

      expect(screen.getByText('Delete')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.queryByLabelText('Delete bookmark')).not.toBeInTheDocument()

      await user.click(screen.getByText('Delete'))

      await waitFor(() => {
        expect(apiCallTracker.deleteBookmark).toBe(1)
      })

      expect(toast.success).toHaveBeenCalledWith('Bookmark deleted successfully')

      const remainingBookmarks = getTestBookmarks()
      expect(remainingBookmarks.find((b) => b.id === '1')).toBeUndefined()
    })

    it('should handle cancel in delete confirmation flow', async () => {
      const { user } = renderWithProviders(<BookmarkItem bookmark={mockBookmark} />)

      await user.click(screen.getByLabelText('Delete bookmark'))
      expect(screen.getByText('Delete')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()

      await user.click(screen.getByText('Cancel'))
      expect(screen.getByLabelText('Delete bookmark')).toBeInTheDocument()
      expect(screen.queryByText('Delete')).not.toBeInTheDocument()
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument()

      expect(apiCallTracker.deleteBookmark).toBe(0)
    })

    it('should handle delete button states correctly', async () => {
      const { user } = renderWithProviders(<BookmarkItem bookmark={mockBookmark} />)

      await user.click(screen.getByLabelText('Delete bookmark'))
      const deleteButton = screen.getByText('Delete')
      expect(deleteButton).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()

      await user.click(deleteButton)
      await waitFor(() => {
        expect(apiCallTracker.deleteBookmark).toBe(1)
      })

      // Verify success toast was called
      expect(toast.success).toHaveBeenCalledWith('Bookmark deleted successfully')
    })
  })

  describe('Error Handling and Toast Integration', () => {
    it('should handle API delete errors gracefully', async () => {
      const nonExistentBookmark: Bookmark = {
        ...mockBookmark,
        id: 'nonexistent-id',
      }

      const { user } = renderWithProviders(<BookmarkItem bookmark={nonExistentBookmark} />)
      await user.click(screen.getByLabelText('Delete bookmark'))
      await user.click(screen.getByText('Delete'))

      await waitFor(() => {
        expect(apiCallTracker.deleteBookmark).toBe(1)
      })

      expect(toast.error).toHaveBeenCalledWith('Failed to delete bookmark')

      await waitFor(() => {
        expect(screen.getByText('Delete')).not.toBeDisabled()
      })
      expect(screen.getByText('Delete')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()

      await user.click(screen.getByText('Cancel'))
      expect(screen.getByLabelText('Delete bookmark')).toBeInTheDocument()
    })
  })

  describe('Data Props and Conditional Rendering', () => {
    it('should handle bookmark without description', () => {
      const bookmarkWithoutDescription: Bookmark = {
        ...mockBookmark,
        description: undefined,
      }

      renderWithProviders(<BookmarkItem bookmark={bookmarkWithoutDescription} />)

      expect(screen.getByText('Test Bookmark')).toBeInTheDocument()
      expect(screen.getByText('test-example.com')).toBeInTheDocument()
      expect(screen.queryByText('Test description for bookmark')).not.toBeInTheDocument()
    })

    it('should handle bookmark with empty description', () => {
      const bookmarkWithEmptyDescription: Bookmark = {
        ...mockBookmark,
        description: '',
      }
      renderWithProviders(<BookmarkItem bookmark={bookmarkWithEmptyDescription} />)

      expect(screen.getByText('Test Bookmark')).toBeInTheDocument()
      expect(screen.getByText('test-example.com')).toBeInTheDocument()

      const descriptionParagraph = screen.getByText('Test Bookmark').closest('.bg-bg-secondary')?.querySelector('p')
      expect(descriptionParagraph).not.toBeInTheDocument()
    })

    it('should apply custom style props correctly', () => {
      const customStyle = { backgroundColor: 'rgb(255, 0, 0)', padding: '20px' }
      renderWithProviders(<BookmarkItem bookmark={mockBookmark} style={customStyle} />)

      const container = screen.getByText('Test Bookmark').closest('[style]')
      expect(container).toHaveStyle(customStyle)
    })
  })

  describe('RTK Query State Management Integration', () => {
    it('should integrate properly with Redux store state', async () => {
      const { user, store } = renderWithProviders(<BookmarkItem bookmark={mockBookmark} />)

      await user.click(screen.getByLabelText('Delete bookmark'))
      await user.click(screen.getByText('Delete'))
      await waitFor(() => {
        expect(apiCallTracker.deleteBookmark).toBe(1)
      })

      expect(toast.success).toHaveBeenCalledWith('Bookmark deleted successfully')
      const remainingBookmarks = getTestBookmarks()
      expect(remainingBookmarks.find((b) => b.id === '1')).toBeUndefined()

      const state = store.getState()
      expect(Object.keys(state.bookmarksApi.mutations).length).toBeGreaterThan(0)
    })

    it('should handle concurrent delete operations properly', async () => {
      const bookmark1 = { ...mockBookmark, id: '1', title: 'Bookmark 1' }
      const bookmark2 = { ...mockBookmark, id: '2', title: 'Bookmark 2' }
      const { user } = renderWithProviders(
        <div>
          <BookmarkItem bookmark={bookmark1} />
          <BookmarkItem bookmark={bookmark2} />
        </div>
      )
      const deleteButtons = screen.getAllByLabelText('Delete bookmark')
      await user.click(deleteButtons[0])

      expect(screen.getAllByText('Delete')).toHaveLength(1)
      expect(screen.getAllByText('Cancel')).toHaveLength(1)
      expect(screen.getAllByLabelText('Delete bookmark')).toHaveLength(1)
    })
  })
})
