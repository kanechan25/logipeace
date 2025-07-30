import React from 'react'
import ErrorBoundary from '@/components/hocs/ErrorBoundary'
import BookmarkForm from '@/components/ui/BookmarkForm'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookmarkList from '@/components/ui/BookmarkList'

export default function BookmarkManager() {
  return (
    <div className='min-h-screen bg-bg'>
      <Header />

      {/* Main Content */}
      <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='space-y-8'>
          {/* Add Bookmark Section */}
          {/* TODO: move this to separate Modal component => Click Create Bookmark Button to open Modal*/}
          <ErrorBoundary>
            <BookmarkForm />
          </ErrorBoundary>

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
