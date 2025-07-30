import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ThemeState, ThemeMode, ThemeColor } from '../../types'

// Get initial theme from localStorage or use defaults
const getInitialTheme = (): ThemeState => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('bookmark-theme')
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme)
      } catch {
        // Fall through to defaults
      }
    }

    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return {
      mode: prefersDark ? 'dark' : 'light',
      color: 'blue',
    }
  }

  return {
    mode: 'light',
    color: 'blue',
  }
}

const initialState: ThemeState = getInitialTheme()

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('bookmark-theme', JSON.stringify(state))
      }
    },
    setThemeColor: (state, action: PayloadAction<ThemeColor>) => {
      state.color = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('bookmark-theme', JSON.stringify(state))
      }
    },
    toggleThemeMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      if (typeof window !== 'undefined') {
        localStorage.setItem('bookmark-theme', JSON.stringify(state))
      }
    },
  },
})

export const { setThemeMode, setThemeColor, toggleThemeMode } = themeSlice.actions
export default themeSlice.reducer
