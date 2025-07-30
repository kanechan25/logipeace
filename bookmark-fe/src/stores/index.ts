import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import themeReducer from './slices/themeSlice'
import { bookmarksApi } from './slices/bookmarksApi'

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

export { useGetBookmarksQuery, useAddBookmarkMutation, useDeleteBookmarkMutation } from './slices/bookmarksApi'
