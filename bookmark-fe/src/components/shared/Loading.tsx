import React from 'react'

const Loading = () => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-center py-8'>
        <div className='flex items-center space-x-2 text-text-secondary'>
          <div className='w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
          <span>Loading ...</span>
        </div>
      </div>
    </div>
  )
}

export default Loading
