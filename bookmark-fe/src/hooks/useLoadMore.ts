import { useCallback } from 'react'
import { bookmarksApi } from '../stores/slices/query/bookmarks'
import { toast } from 'react-toastify'
import { Bookmark, PaginatedResponse } from '@/types'

interface UseLoadMoreOptions {
  limit?: number
  onSuccess?: (data: PaginatedResponse<Bookmark>) => void
  onError?: (error: Error) => void
}

export const useLoadMore = (options: UseLoadMoreOptions = {}) => {
  const { limit = 20, onSuccess, onError } = options

  const [triggerGetBookmarks, { isFetching }] = bookmarksApi.useLazyGetBookmarksQuery()

  const loadMore = useCallback(
    async (page: number) => {
      try {
        const result = await triggerGetBookmarks({
          page,
          limit,
        }).unwrap()

        onSuccess?.(result)
        return result
      } catch (error) {
        console.error('Failed to load more data:', error)
        toast.error('Failed to load more data')
        onError?.(error as Error)
        throw error
      }
    },
    [limit, triggerGetBookmarks, onSuccess, onError]
  )

  return {
    loadMore,
    isLoading: isFetching,
  }
}
