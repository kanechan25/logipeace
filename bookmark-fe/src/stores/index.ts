import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import themeReducer from './slices/themeSlice'

// Import the API to use in store configuration
import { bookmarksApi } from './slices/bookmarksApi'

export const store = configureStore({
  reducer: {
    // RTK Query API slice
    [bookmarksApi.reducerPath]: bookmarksApi.reducer,
    // Theme slice
    theme: themeReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(bookmarksApi.middleware),
})

// Enable listener behavior for the store
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Re-export ONLY the hooks we need, not the entire API
export { useGetBookmarksQuery, useAddBookmarkMutation, useDeleteBookmarkMutation } from './slices/bookmarksApi'
