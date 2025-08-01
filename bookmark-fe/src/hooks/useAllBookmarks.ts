import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { bookmarksApi } from '@/stores/slices/query/bookmarks'
import { RootState } from '@/stores'
import { Bookmark } from '@/types'

interface QueryState {
  data?: {
    data?: Bookmark[]
  }
}

export const useAllBookmarks = () => {
  const queries = useSelector((state: RootState) => state[bookmarksApi.reducerPath]?.queries || {})
  const allBookmarks = useMemo(() => {
    const allItems: Bookmark[] = []

    Object.keys(queries).forEach((queryKey) => {
      if (queryKey.includes('getBookmarks')) {
        try {
          const queryMatch = queryKey.match(/getBookmarks\((.+)\)/)
          if (queryMatch) {
            const queryParams = JSON.parse(queryMatch[1])
            if (queryParams.page && queryParams.limit) {
              const queryState = queries[queryKey] as QueryState
              if (queryState?.data?.data && Array.isArray(queryState.data.data)) {
                allItems.push(...queryState.data.data)
              }
            }
          }
        } catch {}
      }
    })

    // Remove duplicates
    const uniqueItems = allItems.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))

    return uniqueItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [queries])

  return allBookmarks
}
