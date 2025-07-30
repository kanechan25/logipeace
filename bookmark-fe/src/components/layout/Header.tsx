import React from 'react'
import ThemeToggle from '@/components/shared/ThemeToggle'

const Header = () => {
  return (
    <header className='bg-bg-secondary border-b border-border sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
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

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header
