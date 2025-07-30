import { createSlice } from '@reduxjs/toolkit'
import { ThemeState } from '../../types'

const defaultThemeState: ThemeState = {
  mode: 'light',
}

// Initial state is always default to prevent hydration mismatches
const initialState: ThemeState = defaultThemeState

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    hydrateTheme: (state) => {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('bookmark-theme')
        if (savedTheme) {
          try {
            const parsed = JSON.parse(savedTheme)
            state.mode = parsed.mode || 'light'
            return
          } catch {}
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        state.mode = prefersDark ? 'dark' : 'light'
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

export const { hydrateTheme, toggleThemeMode } = themeSlice.actions
export default themeSlice.reducer
