import { renderHook } from '@testing-library/react'
import { useFilteredBookmarks } from './useFilteredBookmarks'
import { Bookmark } from '@/types'

describe('useFilteredBookmarks', () => {
  const mockBookmarks: Bookmark[] = [
    {
      id: '1',
      title: 'React Tutorial',
      url: 'https://react.dev',
      description: 'Learn React basics',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'TypeScript Guide',
      url: 'https://typescript.org',
      description: 'TypeScript documentation',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
    {
      id: '3',
      title: 'Next.js Framework',
      url: 'https://nextjs.org',
      description: 'React framework for production',
      createdAt: '2023-01-03T00:00:00Z',
      updatedAt: '2023-01-03T00:00:00Z',
    },
  ]

  it('should return all bookmarks when search query is empty', () => {
    const { result } = renderHook(() => useFilteredBookmarks(mockBookmarks, ''))
    expect(result.current).toEqual(mockBookmarks)
  })

  it('should return all bookmarks when search query is only whitespace', () => {
    const { result } = renderHook(() => useFilteredBookmarks(mockBookmarks, '   '))
    expect(result.current).toEqual(mockBookmarks)
  })

  it('should filter bookmarks by title (case insensitive)', () => {
    const { result } = renderHook(() => useFilteredBookmarks(mockBookmarks, 'tutorial'))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].title).toBe('React Tutorial')
  })

  it('should filter bookmarks by URL (case insensitive)', () => {
    const { result } = renderHook(() => useFilteredBookmarks(mockBookmarks, 'typescript.org'))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].title).toBe('TypeScript Guide')
  })

  it('should filter bookmarks by description (case insensitive)', () => {
    const { result } = renderHook(() => useFilteredBookmarks(mockBookmarks, 'production'))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].title).toBe('Next.js Framework')
  })

  it('should return multiple results when query matches multiple fields', () => {
    const { result } = renderHook(() => useFilteredBookmarks(mockBookmarks, 'react'))
    expect(result.current).toHaveLength(2)
  })

  it('should return empty array when no matches found', () => {
    const { result } = renderHook(() => useFilteredBookmarks(mockBookmarks, 'nonexistent'))
    expect(result.current).toEqual([])
  })

  it('should handle partial matches', () => {
    const { result } = renderHook(() => useFilteredBookmarks(mockBookmarks, 'tut'))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].title).toBe('React Tutorial')
  })

  it('should handle bookmarks without description', () => {
    const bookmarksWithoutDescription: Bookmark[] = [
      {
        id: '1',
        title: 'Test Bookmark',
        url: 'https://test.com',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    ]

    const { result } = renderHook(() => useFilteredBookmarks(bookmarksWithoutDescription, 'test'))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].title).toBe('Test Bookmark')
  })
})
