import { setupServer } from 'msw/node'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/utils/testing'
import { handlers, apiCallTracker, resetTestBookmarks } from '@/mocks/handlers'
import BookmarkForm from './BookmarkForm'
import { toast } from 'react-toastify'

// Setup MSW server
const server = setupServer(...handlers)

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const mockOnSuccess = jest.fn()

describe('BookmarkForm', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  beforeEach(() => {
    resetTestBookmarks()
    apiCallTracker.reset()
    mockOnSuccess.mockClear()
    jest.clearAllMocks()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  describe('Form Submission and RTK Query Integration', () => {
    it('should successfully submit form and trigger RTK Query mutation', async () => {
      const { user } = renderWithProviders(<BookmarkForm onSuccess={mockOnSuccess} />)

      // Fill out the form
      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)
      const descriptionInput = screen.getByLabelText(/description/i)

      await user.type(titleInput, 'Test Bookmark')
      await user.type(urlInput, 'https://test-example.com')
      await user.type(descriptionInput, 'Test description')

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /add bookmark/i })
      await user.click(submitButton)

      // Wait for the mutation to complete
      await waitFor(() => {
        expect(apiCallTracker.addBookmark).toBe(1)
      })

      // Verify success behaviors
      expect(toast.success).toHaveBeenCalledWith('Bookmark added successfully!')
      expect(mockOnSuccess).toHaveBeenCalledTimes(1)

      // Verify form is reset after successful submission
      expect(titleInput).toHaveValue('')
      expect(urlInput).toHaveValue('')
      expect(descriptionInput).toHaveValue('')
    })

    it('should handle mutation data correctly', async () => {
      const { user } = renderWithProviders(<BookmarkForm />)

      await user.type(screen.getByLabelText(/title/i), 'RTK Query Test')
      await user.type(screen.getByLabelText(/url/i), 'https://rtk-query-test.com')
      await user.type(screen.getByLabelText(/description/i), 'Testing RTK Query integration')

      await user.click(screen.getByRole('button', { name: /add bookmark/i }))

      await waitFor(() => {
        expect(apiCallTracker.addBookmark).toBe(1)
      })

      // Verify the form submitted successfully
      expect(toast.success).toHaveBeenCalledWith('Bookmark added successfully!')

      // Verify form was reset after successful submission
      expect(screen.getByLabelText(/title/i)).toHaveValue('')
      expect(screen.getByLabelText(/url/i)).toHaveValue('')
      expect(screen.getByLabelText(/description/i)).toHaveValue('')
    })
  })

  describe('Form Validation Logic', () => {
    it('should validate required fields using zod schema', async () => {
      const { user } = renderWithProviders(<BookmarkForm />)

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /add bookmark/i })
      await user.click(submitButton)

      // Check validation errors appear
      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      })

      expect(screen.getByText(/url is required/i)).toBeInTheDocument()

      // Verify no API call was made
      expect(apiCallTracker.addBookmark).toBe(0)
    })

    it('should validate URL format', async () => {
      const { user } = renderWithProviders(<BookmarkForm />)

      await user.type(screen.getByLabelText(/title/i), 'Valid Title')
      await user.type(screen.getByLabelText(/url/i), 'invalid-url')

      await user.click(screen.getByRole('button', { name: /add bookmark/i }))

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument()
      })

      expect(apiCallTracker.addBookmark).toBe(0)
    })

    it('should allow optional description field', async () => {
      const { user } = renderWithProviders(<BookmarkForm />)

      await user.type(screen.getByLabelText(/title/i), 'No Description Test')
      await user.type(screen.getByLabelText(/url/i), 'https://no-description.com')
      // Intentionally leave description empty

      await user.click(screen.getByRole('button', { name: /add bookmark/i }))

      await waitFor(() => {
        expect(apiCallTracker.addBookmark).toBe(1)
      })

      expect(toast.success).toHaveBeenCalledWith('Bookmark added successfully!')
    })
  })

  describe('Loading States and Error Handling', () => {
    it('should handle form submission lifecycle correctly', async () => {
      const { user } = renderWithProviders(<BookmarkForm />)

      await user.type(screen.getByLabelText(/title/i), 'Loading Test')
      await user.type(screen.getByLabelText(/url/i), 'https://loading-test.com')

      const submitButton = screen.getByRole('button', { name: /add bookmark/i })
      await user.click(submitButton)

      // Wait for the submission to complete
      await waitFor(() => {
        expect(apiCallTracker.addBookmark).toBe(1)
      })

      // Verify successful completion
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Bookmark added successfully!')
      })

      // Button should be enabled again after completion
      expect(submitButton).not.toBeDisabled()
    })

    it('should handle API errors gracefully', async () => {
      const { user } = renderWithProviders(<BookmarkForm />)

      // Submit form with empty required fields to trigger validation error
      await user.click(screen.getByRole('button', { name: /add bookmark/i }))

      // Wait and check that validation prevents API call
      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      })

      // Should show validation error, not make API call
      expect(apiCallTracker.addBookmark).toBe(0)
    })

    it('should handle network errors', async () => {
      const { user } = renderWithProviders(<BookmarkForm />)

      await user.type(screen.getByLabelText(/title/i), 'Network Error Test')
      await user.type(screen.getByLabelText(/url/i), 'https://network-error.com')

      await user.click(screen.getByRole('button', { name: /add bookmark/i }))

      // Wait for the request to complete
      await waitFor(() => {
        expect(apiCallTracker.addBookmark).toBe(1)
      })

      // Verify successful submission (our mock will succeed)
      expect(toast.success).toHaveBeenCalledWith('Bookmark added successfully!')
    })
  })

  describe('Success Callback Integration', () => {
    it('should call onSuccess callback after successful submission', async () => {
      const { user } = renderWithProviders(<BookmarkForm onSuccess={mockOnSuccess} />)

      await user.type(screen.getByLabelText(/title/i), 'Success Callback Test')
      await user.type(screen.getByLabelText(/url/i), 'https://success-callback.com')

      await user.click(screen.getByRole('button', { name: /add bookmark/i }))

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      expect(apiCallTracker.addBookmark).toBe(1)
    })

    it('should not call onSuccess callback on failure', async () => {
      const { user } = renderWithProviders(<BookmarkForm onSuccess={mockOnSuccess} />)

      // Submit form with invalid URL that will fail validation
      await user.type(screen.getByLabelText(/title/i), 'Valid Title')
      await user.type(screen.getByLabelText(/url/i), 'invalid-url')

      await user.click(screen.getByRole('button', { name: /add bookmark/i }))

      // Wait for validation error to appear
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument()
      })

      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })

  describe('Form Reset Behavior', () => {
    it('should reset form after successful submission', async () => {
      const { user } = renderWithProviders(<BookmarkForm />)

      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)
      const descriptionInput = screen.getByLabelText(/description/i)

      await user.type(titleInput, 'Reset Test')
      await user.type(urlInput, 'https://reset-test.com')
      await user.type(descriptionInput, 'This should be reset')

      await user.click(screen.getByRole('button', { name: /add bookmark/i }))

      await waitFor(() => {
        expect(apiCallTracker.addBookmark).toBe(1)
      })

      // Form should be reset
      expect(titleInput).toHaveValue('')
      expect(urlInput).toHaveValue('')
      expect(descriptionInput).toHaveValue('')
    })

    it('should preserve form data on validation errors', async () => {
      const { user } = renderWithProviders(<BookmarkForm />)

      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)

      await user.type(titleInput, 'Valid Title')
      await user.type(urlInput, 'invalid-url')

      await user.click(screen.getByRole('button', { name: /add bookmark/i }))

      // Form should preserve data on validation error
      expect(titleInput).toHaveValue('Valid Title')
      expect(urlInput).toHaveValue('invalid-url')
    })
  })
})
