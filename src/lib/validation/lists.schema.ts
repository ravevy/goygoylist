import { z } from 'zod'
import { listItemsSchema } from './listItems.schema'

export const listsSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  created_at: z.string().nullable(),
  created_by: z.uuid().nullable()
})

export const listWithItemsSchema = listsSchema.extend({
  items: z.array(listItemsSchema)
})

export const listsWithItemsSchema = z.array(listWithItemsSchema)

export const listInsertSchema = z.object({
  title: z.string('No title has been entered')
})

export const listUpdateSchema = z.object({
  title: z.string('No title has been entered')
})

export type ListWithItemsSchema = z.infer<typeof listWithItemsSchema>
export type ListsWithItemsSchema = z.infer<typeof listsWithItemsSchema>
export type ListInsertSchema = z.infer<typeof listInsertSchema>
export type ListUpdateSchema = z.infer<typeof listUpdateSchema>
