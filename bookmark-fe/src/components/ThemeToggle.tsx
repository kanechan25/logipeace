'use client'

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../stores'
import { toggleThemeMode, setThemeColor } from '../stores/slices/themeSlice'
import { ThemeColor } from '../types'

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch()
  const { mode, color } = useSelector((state: RootState) => state.theme)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const colors: { value: ThemeColor; name: string; class: string }[] = [
    { value: 'blue', name: 'Blue', class: 'bg-blue-500' },
    { value: 'green', name: 'Green', class: 'bg-green-500' },
    { value: 'red', name: 'Red', class: 'bg-red-500' },
    { value: 'purple', name: 'Purple', class: 'bg-purple-500' },
    { value: 'orange', name: 'Orange', class: 'bg-orange-500' },
  ]

  const handleColorChange = (newColor: ThemeColor) => {
    dispatch(setThemeColor(newColor))
    setShowColorPicker(false)
  }

  return (
    <div className='flex items-center space-x-2'>
      {/* Dark/Light mode toggle */}
      <button
        onClick={() => dispatch(toggleThemeMode())}
        className='p-2 rounded-lg border border-border hover:border-primary transition-colors'
      >
        {mode === 'light' ? (
          <svg className='w-4 h-4 text-text' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
            />
          </svg>
        ) : (
          <svg className='w-4 h-4 text-text' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
            />
          </svg>
        )}
      </button>

      {/* Color picker */}
      <div className='relative'>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className='p-2 rounded-lg border border-border hover:border-primary transition-colors'
          aria-label='Change color theme'
        >
          <div className={`w-4 h-4 rounded-full ${colors.find((c) => c.value === color)?.class}`}></div>
        </button>

        {showColorPicker && (
          <div className='absolute right-0 top-12 bg-bg-secondary border border-border rounded-lg shadow-lg p-3 z-10 min-w-[120px]'>
            <p className='text-xs text-text-secondary mb-2 font-medium'>Colors</p>
            <div className='space-y-1'>
              {colors.map((colorOption) => (
                <button
                  key={colorOption.value}
                  onClick={() => handleColorChange(colorOption.value)}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    color === colorOption.value ? 'bg-primary/10 text-primary' : 'hover:bg-bg-tertiary text-text'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${colorOption.class}`}></div>
                  <span>{colorOption.name}</span>
                  {color === colorOption.value && (
                    <svg className='w-3 h-3 ml-auto' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ThemeToggle
