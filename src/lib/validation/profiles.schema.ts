import { z } from 'zod'

export const iconTypes = [
  'bulbasaur',
  'charmander',
  'squirtle',
  'pokeball'
] as const

export const profileSchema = z.object({
  id: z.uuid('Invalid id'),
  display_name: z.string().nullable().optional(),
  avatar_icon: z.enum(iconTypes).optional()
})

export const profilesArraySchema = z.array(profileSchema)

export const profileUpdateSchema = z.object({
  display_name: z.string().nullable().optional(),
  avatar_icon: z.enum(iconTypes).optional()
})

export type ProfileSchemaType = z.infer<typeof profileSchema>

export type ProfileUpdateSchemaType = z.infer<typeof profileUpdateSchema>
