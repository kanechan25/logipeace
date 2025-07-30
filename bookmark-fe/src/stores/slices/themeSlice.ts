import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ThemeState, ThemeMode, ThemeColor } from '../../types'

// Default theme state - same for SSR and CSR to prevent hydration mismatches
const defaultThemeState: ThemeState = {
  mode: 'light',
  color: 'blue',
}

// Initial state is always default to prevent hydration mismatches
const initialState: ThemeState = defaultThemeState

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // New action to hydrate theme from localStorage after mount
    hydrateTheme: (state) => {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('bookmark-theme')
        if (savedTheme) {
          try {
            const parsed = JSON.parse(savedTheme)
            state.mode = parsed.mode || 'light'
            state.color = parsed.color || 'blue'
            return
          } catch {
            // Fall through to system preference check
          }
        }

        // Check system preference for dark mode if no saved theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        state.mode = prefersDark ? 'dark' : 'light'
      }
    },
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

export const { hydrateTheme, setThemeMode, setThemeColor, toggleThemeMode } = themeSlice.actions
export default themeSlice.reducer
