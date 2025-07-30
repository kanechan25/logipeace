'use client'

import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { toast } from 'react-toastify'
import { useGetBookmarksQuery } from '../../stores/slices/bookmarks'
import BookmarkItem from './BookmarkItem'
import { Bookmark } from '../../types'
import SearchBar from './SearchBar'
import Loading from '../shared/Loading'
import Error from '../shared/Error'

const ITEM_HEIGHT = 120
const ITEMS_PER_PAGE = 20

const BookmarkList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])
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
      setHasNextPage(bookmarksData.meta.hasNextPage)
      setCurrentPage(bookmarksData.meta.currentPage)
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

  // Load more bookmarks using RTK Query
  const loadMoreBookmarks = useCallback(async () => {
    if (!hasNextPage || isFetching) return

    try {
      const nextPage = currentPage + 1
      // Manually trigger a new query for the next page
      const result = await fetch(`http://localhost:3001/api/v1/bookmarks?page=${nextPage}&limit=${ITEMS_PER_PAGE}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (result.ok) {
        const newData = await result.json()
        // Append new data to existing bookmarks
        setAllBookmarks((prev) => [...prev, ...newData.data])
        setCurrentPage(nextPage)
        setHasNextPage(newData.meta.hasNextPage)
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

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error />
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
      {/* Search Bar */}
      <div className='max-w-md'>
        <SearchBar onSearch={handleSearch} />
      </div>
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
