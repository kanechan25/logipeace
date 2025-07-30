'use client'

import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { store } from '../stores'
import ThemeProvider from '../components/ThemeProvider'

interface ClientProvidersProps {
  children: React.ReactNode
}

// Loading component for hydration
const HydrationLoader = ({ children }: { children: React.ReactNode }) => (
  <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
    {/* Minimal skeleton loader during hydration */}
    <div className='animate-pulse'>
      <div className='h-16 bg-gray-200 dark:bg-gray-800 mb-4'></div>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='h-8 bg-gray-200 dark:bg-gray-800 rounded mb-4 w-1/3'></div>
        <div className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-24 bg-gray-200 dark:bg-gray-800 rounded'></div>
          ))}
        </div>
      </div>
    </div>
    {/* Hidden content for SEO */}
    <div className='sr-only'>{children}</div>
  </div>
)

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatches by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a loading state during SSR to prevent hydration mismatches
    return (
      <Provider store={store}>
        <HydrationLoader>{children}</HydrationLoader>
      </Provider>
    )
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='colored'
          className='!mt-16'
        />
      </ThemeProvider>
    </Provider>
  )
}
