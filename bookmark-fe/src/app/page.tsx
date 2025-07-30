import React from 'react'
import ErrorBoundary from '@/components/hocs/ErrorBoundary'
import CreateBookmark from '@/components/ui/CreateBookmark'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookmarkList from '@/components/ui/BookmarkList'

export default function BookmarkManager() {
  return (
    <div className='min-h-screen bg-bg'>
      <Header />

      <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[75vh]'>
        <div className='space-y-8'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-text'>My Bookmarks</h1>
              <p className='text-text-secondary text-sm mt-1'>Organize and manage your favorite links</p>
            </div>

            <ErrorBoundary>
              <CreateBookmark />
            </ErrorBoundary>
          </div>

          {/* Search and List Section */}
          <div className='space-y-6'>
            <ErrorBoundary fallback={<p className='text-center text-error'>Failed to load bookmark list</p>}>
              <BookmarkList />
            </ErrorBoundary>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
