import z from 'zod'

export const listMembersSchema = z.object({
  id: z.uuid('Invalid id'),
  list_id: z.uuid('Invalid list id'),
  user_ids: z.array(z.uuid()).nullable(),
  created_at: z.string().nullable()
})

export type ListMembersSchemaType = z.infer<typeof listMembersSchema>
