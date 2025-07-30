'use client'

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../stores'
import { hydrateTheme } from '../stores/slices/themeSlice'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useDispatch()
  const { mode, color } = useSelector((state: RootState) => state.theme)
  const [mounted, setMounted] = useState(false)

  // Hydrate theme from localStorage after mount to prevent hydration mismatches
  useEffect(() => {
    dispatch(hydrateTheme())
    setMounted(true)
  }, [dispatch])

  // Apply theme classes after hydration
  useEffect(() => {
    if (!mounted) return

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
  }, [mode, color, mounted])

  return <>{children}</>
}

export default ThemeProvider
