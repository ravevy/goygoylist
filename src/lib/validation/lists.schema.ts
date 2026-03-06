import { z } from 'zod'
import { listItemSchema } from './listItems.schema'

export const listSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  created_at: z.string().nullable(),
  created_by: z.uuid().nullable()
})

export const listWithItemsSchema = listSchema.extend({
  items: z.array(listItemSchema)
})

export const listsWithItemsSchema = z.array(listWithItemsSchema)

export const listInsertSchema = z.object({
  title: z.string('No title has been entered')
})

export const listUpdateSchema = z.object({
  title: z.string('No title has been entered')
})

export type ListSchemaType = z.infer<typeof listSchema>
export type ListWithItemsSchemaType = z.infer<typeof listWithItemsSchema>
export type ListsWithItemsSchemaType = z.infer<typeof listsWithItemsSchema>
export type ListInsertSchemaType = z.infer<typeof listInsertSchema>
export type ListUpdateSchemaType = z.infer<typeof listUpdateSchema>
