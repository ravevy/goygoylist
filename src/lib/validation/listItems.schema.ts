import { z } from 'zod'

export const listItemSchema = z.object({
  id: z.uuid(),
  list_id: z.uuid(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  created_at: z.string(),
  completed_at: z.string().nullable().optional(),
  created_by: z.uuid()
})

export const listItemInsertSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional()
})

export const listItemUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional()
})

export type ListItemSchemaType = z.infer<typeof listItemSchema>
export type ListItemInsertSchemaType = z.infer<typeof listItemInsertSchema>
export type ListItemUpdateSchemaType = z.infer<typeof listItemUpdateSchema>
