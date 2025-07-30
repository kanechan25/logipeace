import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import themeReducer from './slices/theme'
import { bookmarksApi } from './slices/bookmarks'

export const store = configureStore({
  reducer: {
    [bookmarksApi.reducerPath]: bookmarksApi.reducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(bookmarksApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export { useGetBookmarksQuery, useAddBookmarkMutation, useDeleteBookmarkMutation } from './slices/bookmarks'
