'use client'

import React, { useState, useCallback } from 'react'
import ErrorBoundary from './ErrorBoundary'
import BookmarkForm from './BookmarkForm'
import BookmarkList from './BookmarkList'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'

export default function BookmarkManager() {
  const [searchQuery, setSearchQuery] = useState('')
  // TODO: move this function to searchbar component to keep this component is a server component
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  return (
    <div className='min-h-screen bg-bg'>
      {/* Header */}
      <header className='bg-bg-secondary border-b border-border sticky top-0 z-50'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo and Title */}
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                  />
                </svg>
              </div>
              <div>
                <h1 className='text-xl font-bold text-text'>Bookmark Manager</h1>
                <p className='text-xs text-text-secondary'>Save and organize your favorite links</p>
              </div>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

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
            {/* Search Bar */}
            <div className='max-w-md'>
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Bookmark List */}
            {/* TODO: 
              1. Infinite Loading (Cuộn vô hạn)
                Cách hoạt động:
                Frontend tải một phần dữ liệu ban đầu (ví dụ: 20 items) từ backend.
                Khi người dùng cuộn chuột đến cuối danh sách, frontend tự động gọi API để lấy thêm dữ liệu (ví dụ: GET /bookmarks?page=2&limit=20) và nối vào danh sách hiện tại.
                Triển khai:
                Sử dụng event scroll hoặc thư viện như IntersectionObserver để phát hiện khi người dùng cuộn đến cuối.
                Gọi API phân trang và cập nhật state để hiển thị thêm items.
              2. Virtualization (Danh sách ảo)
                Cách hoạt động:
                Frontend chỉ render các items đang hiển thị trong viewport (khu vực người dùng nhìn thấy trên màn hình), ví dụ: 10-20 items thay vì toàn bộ danh sách.
                Khi người dùng cuộn, các thành phần được tái sử dụng để hiển thị dữ liệu mới mà không tạo thêm DOM nodes.
                Triển khai:
                Sử dụng thư viện như react-window (NOT react-virtualized).
                kết hợp với phân trang, frontend chỉ cần tải dữ liệu cần thiết cho vùng hiển thị.
              3.PHẢI Kết hợp Infinite Loading + Virtualization
                Cách hoạt động:
                Tải dữ liệu theo từng phần từ backend (infinite loading).
                Chỉ render các items trong viewport bằng virtualization.
                Triển khai:
                Gọi GET /bookmarks?page=1&limit=20 để lấy dữ liệu ban đầu.
                Dùng react-window để render danh sách ảo.
                Khi cuộn đến gần cuối vùng hiển thị, nhớ là gần cuối nhé, cách 5 items nữa là hết, gọi API để lấy thêm dữ liệu (page=2, page=3, v.v.). */}
            <ErrorBoundary
              fallback={
                <div className='text-center py-8'>
                  <p className='text-error'>Failed to load bookmark list</p>
                </div>
              }
            >
              <BookmarkList searchQuery={searchQuery} />
            </ErrorBoundary>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-bg-secondary border-t border-border mt-16'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center text-text-secondary text-sm'>
            <p>&copy; 2024 Bookmark Manager. Built with Next.js, Redux Toolkit, and TailwindCSS.</p>
            <p className='mt-2'>Manage your bookmarks efficiently with modern web technologies.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
