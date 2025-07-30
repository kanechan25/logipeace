'use client'

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../stores'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { mode, color } = useSelector((state: RootState) => state.theme)

  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    // Apply theme mode
    if (mode === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    // Apply theme color
    html.setAttribute('data-theme', color)
    body.setAttribute('data-theme', color)
  }, [mode, color])

  return <>{children}</>
}

export default ThemeProvider
