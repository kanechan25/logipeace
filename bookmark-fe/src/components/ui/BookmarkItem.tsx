'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Bookmark } from '../../types'
import { useDeleteBookmarkMutation } from '../../stores/slices/query/bookmarks'

dayjs.extend(relativeTime)

interface BookmarkItemProps {
  bookmark: Bookmark
  style?: React.CSSProperties
}

const BookmarkItem: React.FC<BookmarkItemProps> = React.memo(({ bookmark, style }) => {
  const [deleteBookmark, { isLoading: isDeleting }] = useDeleteBookmarkMutation()
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)

  // Fix hydration issue - only show relative time after client-side mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDelete = async () => {
    try {
      await deleteBookmark(bookmark.id).unwrap()
      toast.success('Bookmark deleted successfully')
      setShowConfirm(false)
    } catch (error) {
      toast.error('Failed to delete bookmark')
      console.error('Delete error:', error)
    }
  }

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace(/^www\./, '')
    } catch {
      return url
    }
  }

  // Format date consistently for SSR/CSR
  const formatDate = (dateString: string) => {
    if (!mounted) {
      // Return consistent format for SSR
      return dayjs(dateString).format('MMM D, YYYY')
    }
    // Return relative time for CSR
    return dayjs(dateString).fromNow()
  }

  return (
    <div style={style} className='p-2'>
      <div className='bg-bg-secondary border border-border rounded-lg p-2 hover:border-primary/50 transition-colors animate-fade-in'>
        {/* Header */}
        <div className='flex items-start justify-between mb-2'>
          <div className='flex-1 min-w-0'>
            <h3 className='text-text font-medium text-sm line-clamp-2'>{bookmark.title}</h3>
            <a
              href={bookmark.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:text-primary-hover text-xs font-medium transition-colors inline-flex items-center'
            >
              <svg className='w-3 h-3 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                />
              </svg>
              {formatUrl(bookmark.url)}
            </a>
          </div>

          {/* Delete Button */}
          <div className='ml-4'>
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className='text-text-muted hover:text-error transition-colors p-1'
                aria-label='Delete bookmark'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              </button>
            ) : (
              <div className='flex items-center space-x-1'>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className='text-error hover:text-error/80 text-xs px-2 py-1 bg-error/10 rounded transition-colors disabled:opacity-50'
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className='text-text-muted hover:text-text text-xs px-2 py-1 bg-bg-tertiary rounded transition-colors'
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {bookmark.description && (
          <p className='text-text-secondary text-xs mb-1 line-clamp-2'>{bookmark.description}</p>
        )}

        {/* Metadata */}
        <div className='flex items-center justify-between text-xs text-text-muted'>
          <span suppressHydrationWarning>{formatDate(bookmark.createdAt)}</span>
        </div>
      </div>
    </div>
  )
})

BookmarkItem.displayName = 'BookmarkItem'

export default BookmarkItem
