'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { bookmarkSchema, BookmarkFormData } from '@/utils/zodSchemas'
import { useAddBookmarkMutation } from '@/stores/slices/query/bookmarks'

interface BookmarkFormProps {
  onSuccess?: () => void
}

const BookmarkForm: React.FC<BookmarkFormProps> = ({ onSuccess }) => {
  const [addBookmark, { isLoading, error, isSuccess }] = useAddBookmarkMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookmarkFormData>({
    resolver: zodResolver(bookmarkSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: BookmarkFormData) => {
    try {
      await addBookmark({
        title: data.title,
        url: data.url,
        description: data.description || '',
      }).unwrap()

      reset()
      toast.success('Bookmark added successfully!')
      onSuccess?.()
    } catch (err) {
      toast.error('Failed to add bookmark. Please try again.')
      console.error('Failed to add bookmark:', err)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      reset()
    }
  }, [isSuccess, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {/* Title Field */}
      <div>
        <label htmlFor='title' className='block text-sm font-medium text-text mb-1'>
          Title *
        </label>
        <input
          {...register('title')}
          type='text'
          id='title'
          placeholder='Enter bookmark title'
          className={`w-full px-3 py-2 rounded-md border text-sm transition-colors bg-bg focus:outline-none ${
            errors.title ? 'border-error focus:border-error' : 'border-border focus:border-primary'
          }`}
        />
        {errors.title && <p className='text-error text-xs mt-1'>{errors.title.message}</p>}
      </div>

      {/* URL Field */}
      <div>
        <label htmlFor='url' className='block text-sm font-medium text-text mb-1'>
          URL *
        </label>
        <input
          {...register('url')}
          type='url'
          id='url'
          placeholder='https://example.com'
          className={`w-full px-3 py-2 rounded-md border text-sm transition-colors bg-bg focus:outline-none ${
            errors.url ? 'border-error focus:border-error' : 'border-border focus:border-primary'
          }`}
        />
        {errors.url && <p className='text-error text-xs mt-1'>{errors.url.message}</p>}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor='description' className='block text-sm font-medium text-text mb-1'>
          Description
        </label>
        <textarea
          {...register('description')}
          id='description'
          rows={3}
          placeholder='Optional description for your bookmark'
          className={`w-full px-3 py-2 rounded-md border text-sm transition-colors resize-none bg-bg focus:outline-none ${
            errors.description ? 'border-error focus:border-error' : 'border-border focus:border-primary'
          }`}
        />
        {errors.description && <p className='text-error text-xs mt-1'>{errors.description.message}</p>}
      </div>

      {/* Submit Button */}
      <div className='flex justify-end space-x-3 pt-4'>
        <button
          type='submit'
          disabled={isSubmitting || isLoading}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            isSubmitting || isLoading
              ? 'bg-border cursor-not-allowed text-text-muted'
              : 'btn-primary hover:bg-primary-hover text-white'
          }`}
        >
          {isSubmitting || isLoading ? (
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              <span>Adding...</span>
            </div>
          ) : (
            'Add Bookmark'
          )}
        </button>
      </div>

      {error && (
        <div className='text-error text-sm text-center bg-error/10 border border-error/20 rounded-md p-3'>
          Failed to add bookmark. Please try again.
        </div>
      )}
    </form>
  )
}

export default BookmarkForm
