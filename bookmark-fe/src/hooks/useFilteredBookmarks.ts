import { useMemo } from 'react'
import { Bookmark } from '@/types'

export const useFilteredBookmarks = (allBookmarks: Bookmark[], searchQuery: string) => {
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return allBookmarks

    const query = searchQuery.toLowerCase()
    return allBookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query) ||
        bookmark.description?.toLowerCase().includes(query)
    )
  }, [allBookmarks, searchQuery])

  return filteredBookmarks
}
