import React from 'react'

interface SearchNotFoundProps {
  searchQuery?: string
}

const SearchNotFound: React.FC<SearchNotFoundProps> = ({ searchQuery = '' }) => {
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
      <h3 className='text-lg font-medium text-text mb-2'>{searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}</h3>
      <p className='text-text-secondary text-sm'>
        {searchQuery
          ? `No bookmarks match "${searchQuery}". Try a different search term.`
          : 'Start by adding your first bookmark using the form above.'}
      </p>
    </div>
  )
}

export default SearchNotFound
