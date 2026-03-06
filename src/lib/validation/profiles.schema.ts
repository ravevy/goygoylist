import { z } from 'zod'

export const profileSchema = z.object({
  id: z.uuid('Invalid id'),
  display_name: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional()
})

export const profileUpdateSchema = z.object({
  display_name: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional()
})

export type ProfileSchemaType = z.infer<typeof profileSchema>

export type ProfileUpdateSchemaType = z.infer<typeof profileUpdateSchema>
