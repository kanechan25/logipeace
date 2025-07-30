'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  const modalContent = (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/50 transition-opacity' onClick={onClose} aria-hidden='true' />

      <div
        className={`relative w-full ${sizeClasses[size]} bg-bg-secondary border border-border rounded-lg shadow-xl transform transition-all animate-fade-in`}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className='flex items-center justify-between p-6 border-b border-border'>
            <h2 id='modal-title' className='text-xl font-semibold text-text'>
              {title}
            </h2>
            <button
              onClick={onClose}
              className='text-text-muted hover:text-text transition-colors p-1 rounded-md hover:bg-bg-tertiary'
              aria-label='Close modal'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
        )}
        {/* Content */}
        <div className={title ? 'p-6' : 'p-6'}>{children}</div>
      </div>
    </div>
  )
  // Use portal to render modal at body level
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
}

export default Modal
