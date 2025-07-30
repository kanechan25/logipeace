'use client'

import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../stores'
import { hydrateTheme } from '../stores/slices/theme'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useDispatch()
  const { mode } = useSelector((state: RootState) => state.theme)

  useEffect(() => {
    dispatch(hydrateTheme())
  }, [dispatch])

  useEffect(() => {
    if (mode) {
      const html = document.documentElement
      if (mode === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }, [mode])

  return <>{children}</>
}

export default ThemeProvider
