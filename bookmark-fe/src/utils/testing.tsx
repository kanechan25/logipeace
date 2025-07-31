import React, { PropsWithChildren } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { setupListeners } from '@reduxjs/toolkit/query'
import { bookmarksApi } from '@/stores/slices/query/bookmarks'
import themeReducer from '@/stores/slices/theme'
import type { RootState } from '@/stores'
import '@testing-library/jest-dom'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>
  store?: ReturnType<typeof setupStore>
}

export function setupStore(preloadedState?: Partial<RootState>) {
  const store = configureStore({
    reducer: {
      [bookmarksApi.reducerPath]: bookmarksApi.reducer,
      theme: themeReducer,
    } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(bookmarksApi.middleware),
    preloadedState,
  })

  setupListeners(store.dispatch)

  return store
}

function createWrapper(store: ReturnType<typeof setupStore>) {
  return function Wrapper({ children }: PropsWithChildren): React.ReactElement {
    return <Provider store={store}>{children}</Provider>
  }
}

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState, store = setupStore(preloadedState), ...renderOptions }: ExtendedRenderOptions = {}
) {
  const Wrapper = createWrapper(store)
  const user = userEvent.setup()

  return {
    store,
    user,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

export function createTestStore(preloadedState?: Partial<RootState>) {
  return setupStore(preloadedState)
}

export * from '@testing-library/react'
