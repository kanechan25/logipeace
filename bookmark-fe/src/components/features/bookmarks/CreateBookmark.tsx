'use client'

import React, { useState } from 'react'
import { Modal, Button } from '@/components/shared'
import { BookmarkForm } from '@/components/features/bookmarks'

interface CreateBookmarkProps {
  trigger?: React.ReactNode
}

const CreateBookmark: React.FC<CreateBookmarkProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  return (
    <>
      {trigger ? (
        <div onClick={handleOpen} className='cursor-pointer'>
          {trigger}
        </div>
      ) : (
        <Button onClick={handleOpen} variant='primary' size='lg' className='shadow-sm'>
          <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          Create Bookmark
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={handleClose} title='Add New Bookmark' size='md'>
        <BookmarkForm onSuccess={handleClose} />
      </Modal>
    </>
  )
}

export default CreateBookmark
