import { z } from 'zod'

const urlRegex = /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/

export const bookmarkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').trim(),
  url: z
    .string()
    .min(1, 'URL is required')
    .regex(urlRegex, 'Please enter a valid URL (must start with http:// or https://)')
    .max(2000, 'URL must be less than 2000 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
})

export const bookmarkApiSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const paginatedBookmarksSchema = z.object({
  data: z.array(bookmarkApiSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
})

export const themeSchema = z.object({
  mode: z.enum(['light', 'dark']),
})

export type BookmarkFormData = z.infer<typeof bookmarkSchema>
export type BookmarkApi = z.infer<typeof bookmarkApiSchema>
export type PaginatedBookmarks = z.infer<typeof paginatedBookmarksSchema>
export type ThemeConfig = z.infer<typeof themeSchema>
