'use client'

import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { toast } from 'react-toastify'
import { useGetBookmarksQuery } from '../stores/slices/bookmarksApi'
import BookmarkItem from './BookmarkItem'
import { Bookmark } from '../types'

interface BookmarkListProps {
  searchQuery?: string
}

const ITEM_HEIGHT = 120
const ITEMS_PER_PAGE = 20

const BookmarkList: React.FC<BookmarkListProps> = ({ searchQuery = '' }) => {
  const [allBookmarks, setAllBookmarks] = useState<Bookmark[]>([])
  const [hasNextPage, setHasNextPage] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch first page
  const {
    data: bookmarksData,
    error,
    isLoading,
    isFetching,
  } = useGetBookmarksQuery(
    { page: 1, limit: ITEMS_PER_PAGE },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  // Update bookmarks when data changes
  useEffect(() => {
    if (bookmarksData) {
      setAllBookmarks(bookmarksData.data)
      setHasNextPage(bookmarksData.meta.page < bookmarksData.meta.totalPages)
      setCurrentPage(1)
    }
  }, [bookmarksData])

  // Filter bookmarks based on search query
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return allBookmarks

    const query = searchQuery.toLowerCase()
    return allBookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query) ||
        bookmark.description?.toLowerCase().includes(query)
    )
  }, [allBookmarks, searchQuery])

  // Load more bookmarks
  const loadMoreBookmarks = useCallback(async () => {
    if (!hasNextPage || isFetching) return

    try {
      const nextPage = currentPage + 1
      const response = await fetch(`/api/bookmarks?page=${nextPage}&limit=${ITEMS_PER_PAGE}`)

      if (response.ok) {
        // In a real app, this would be handled by RTK Query
        // For now, we'll use the mock data from our store
        setCurrentPage(nextPage)
        // Since we're using mock data, we'll simulate reaching the end
        if (nextPage >= 3) {
          setHasNextPage(false)
        }
      }
    } catch (error) {
      console.error('Failed to load more bookmarks:', error)
      toast.error('Failed to load more bookmarks')
    }
  }, [hasNextPage, isFetching, currentPage])

  // Check if item is loaded
  const isItemLoaded = useCallback((index: number) => !!filteredBookmarks[index], [filteredBookmarks])

  // Render individual bookmark item
  const renderItem = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const bookmark = filteredBookmarks[index]

      if (!bookmark) {
        return (
          <div style={style} className='px-2'>
            <div className='bg-bg-secondary border border-border rounded-lg p-4 animate-pulse'>
              <div className='h-4 bg-border rounded mb-2 w-3/4'></div>
              <div className='h-3 bg-border rounded mb-2 w-1/2'></div>
              <div className='h-3 bg-border rounded w-1/4'></div>
            </div>
          </div>
        )
      }

      return <BookmarkItem key={bookmark.id} bookmark={bookmark} style={style} />
    },
    [filteredBookmarks]
  )

  // Loading state
  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-center py-8'>
          <div className='flex items-center space-x-2 text-text-secondary'>
            <div className='w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
            <span>Loading bookmarks...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className='text-center py-8'>
        <div className='text-error mb-2'>
          <svg className='w-12 h-12 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-medium text-text mb-2'>Failed to load bookmarks</h3>
        <p className='text-text-secondary text-sm'>
          There was an error loading your bookmarks. Please try refreshing the page.
        </p>
      </div>
    )
  }

  // Empty state
  if (filteredBookmarks.length === 0 && !isLoading) {
    return (
      <div className='text-center py-12'>
        <div className='text-text-muted mb-4'>
          <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-medium text-text mb-2'>
          {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
        </h3>
        <p className='text-text-secondary text-sm'>
          {searchQuery
            ? `No bookmarks match "${searchQuery}". Try a different search term.`
            : 'Start by adding your first bookmark using the form above.'}
        </p>
      </div>
    )
  }

  const itemCount = hasNextPage ? filteredBookmarks.length + 1 : filteredBookmarks.length

  return (
    <div className='space-y-4'>
      {/* Results count */}
      <div className='flex items-center justify-between text-sm text-text-secondary'>
        <span>
          {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        {isFetching && (
          <div className='flex items-center space-x-2'>
            <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
            <span className='text-xs'>Loading...</span>
          </div>
        )}
      </div>

      {/* Virtualized list */}
      <div className='border border-border rounded-lg overflow-hidden'>
        <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreBookmarks}>
          {({ onItemsRendered, ref }) => (
            <List
              ref={ref}
              height={Math.min(600, itemCount * ITEM_HEIGHT)} // Max height of 600px
              width='100%'
              itemCount={itemCount}
              itemSize={ITEM_HEIGHT}
              onItemsRendered={onItemsRendered}
              className='scrollbar-thin scrollbar-thumb-border scrollbar-track-bg-secondary'
            >
              {renderItem}
            </List>
          )}
        </InfiniteLoader>
      </div>

      {/* Load more indicator */}
      {hasNextPage && (
        <div className='text-center py-4'>
          <button
            onClick={loadMoreBookmarks}
            disabled={isFetching}
            className='text-primary hover:text-primary-hover text-sm font-medium transition-colors disabled:opacity-50'
          >
            {isFetching ? 'Loading more...' : 'Load more bookmarks'}
          </button>
        </div>
      )}
    </div>
  )
}

export default BookmarkList
