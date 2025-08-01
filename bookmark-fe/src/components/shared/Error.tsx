import React from 'react'

const Error = () => {
  return (
    <div className='text-center py-8'>
      <div className='flex text-error mb-2 justify-center'>
        <svg width='48' height='48' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
          <path
            d='M5.9 62c-3.3 0-4.8-2.4-3.3-5.3L29.3 4.2c1.5-2.9 3.9-2.9 5.4 0l26.7 52.5c1.5 2.9 0 5.3-3.3 5.3z'
            fill='#ffce31'
          />
          <g fill='#231f20'>
            <path d='m27.8 23.6 2.8 18.5c.3 1.8 2.6 1.8 2.9 0l2.7-18.5c.5-7.2-8.9-7.2-8.4 0' />
            <circle cx='32' cy='49.6' r='4.2' />
          </g>
        </svg>
      </div>
      <h3 className='text-lg font-medium text-text mb-2'>Failed to load bookmarks</h3>
      <p className='text-text-secondary text-sm'>
        There was an error loading your bookmarks. Please try refreshing the page.
      </p>
    </div>
  )
}

export default Error
