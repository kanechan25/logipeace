'use client'

import React, { useState, useCallback } from 'react'
import { useDebounce } from '../../hooks'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Search bookmarks...' }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  React.useEffect(() => {
    onSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, onSearch])

  const handleClear = useCallback(() => {
    setSearchTerm('')
  }, [])

  return (
    <div className='relative'>
      <div className='relative flex items-center'>
        <div className='absolute left-3 text-text-muted'>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>

        <input
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className='w-full pl-10 pr-10 py-2 bg-bg border border-border rounded-lg text-sm transition-colors focus:border-primary focus:outline-none'
        />

        {searchTerm && (
          <button
            onClick={handleClear}
            className='absolute right-3 text-text-muted hover:text-text transition-colors'
            aria-label='Clear search'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
