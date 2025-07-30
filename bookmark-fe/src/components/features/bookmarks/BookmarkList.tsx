'use client'

import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { useGetBookmarksQuery } from '@/stores/slices/query/bookmarks'
import { useLoadMore } from '@/hooks/useLoadMore'
import { Bookmark } from '@/types'
import { BookmarkItem } from '@/components/features/bookmarks'
import SearchBar from '@/components/features/search/SearchBar'
import { Loading, Error, SearchNotFound } from '@/components/shared'

const ITEM_HEIGHT = 120
const ITEMS_PER_PAGE = 20

const BookmarkList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [allBookmarks, setAllBookmarks] = useState<Bookmark[]>([])
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)

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

  const { loadMore, isLoading: isLoadingMore } = useLoadMore({
    limit: ITEMS_PER_PAGE,
    onSuccess: (newData) => {
      setAllBookmarks((prev) => [...prev, ...newData.data])
      setCurrentPage((prev) => prev + 1)
      setHasNextPage(newData.meta.hasNextPage)
    },
  })

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  useEffect(() => {
    if (bookmarksData) {
      setAllBookmarks(bookmarksData.data)
      setHasNextPage(bookmarksData.meta.hasNextPage)
      setCurrentPage(bookmarksData.meta.currentPage)
    }
  }, [bookmarksData])

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

  const loadMoreBookmarks = useCallback(async () => {
    if (!hasNextPage || isFetching || isLoadingMore) return
    const nextPage = currentPage + 1
    await loadMore(nextPage)
  }, [hasNextPage, isFetching, isLoadingMore, currentPage, loadMore])

  const isItemLoaded = useCallback((index: number) => !!filteredBookmarks[index], [filteredBookmarks])

  const renderItem = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const bookmark = filteredBookmarks[index]
      if (!bookmark) return

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

  const itemCount = hasNextPage ? filteredBookmarks.length + 1 : filteredBookmarks.length

  return (
    <div className='space-y-4'>
      {/* Search Bar */}
      <div className='max-w-md'>
        <SearchBar onSearch={handleSearch} />
      </div>
      {filteredBookmarks.length === 0 && !isLoading ? (
        <SearchNotFound searchQuery={searchQuery} />
      ) : (
        <>
          {/* Search results count and loading indicator */}
          <div className='flex items-center justify-between text-sm text-text-secondary'>
            <span>
              {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
            {(isFetching || isLoadingMore) && (
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
                <span className='text-xs'>{isLoadingMore ? 'Loading more...' : 'Loading...'}</span>
              </div>
            )}
          </div>

          {/* Virtualized infinite loading list */}
          <div className='border border-border rounded-lg overflow-hidden'>
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreBookmarks}
              threshold={5}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  ref={ref}
                  height={Math.min(600, filteredBookmarks.length * ITEM_HEIGHT)} // Dynamic height
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

          {/* Manual load more fallback button */}
          {hasNextPage && (
            <div className='text-center py-4'>
              <button
                onClick={loadMoreBookmarks}
                disabled={isFetching || isLoadingMore}
                className='text-primary hover:text-primary-hover text-sm font-medium transition-colors disabled:opacity-50'
              >
                {isLoadingMore ? 'Loading more...' : 'Load more bookmarks'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BookmarkList
