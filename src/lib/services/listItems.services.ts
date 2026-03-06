import { supabase } from '../supabase/client'
import {
  ListItemInsertSchema,
  listItemInsertSchema,
  listItemUpdateSchema,
  ListItemUpdateSchema
} from '../validation/listItems.schema'

export async function insertListItem(
  listId: string,
  payload: ListItemInsertSchema
) {
  const validatedPayload = listItemInsertSchema.parse(payload)

  const { data, error } = await supabase
    .from('list_items')
    .insert({ ...validatedPayload, list_id: listId })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function updateListItem(
  listItemId: string,
  payload: ListItemUpdateSchema
) {
  const validatedPayload = listItemUpdateSchema.parse(payload)

  const { data, error } = await supabase
    .from('list_items')
    .update(validatedPayload)
    .eq('id', listItemId)
    .select()
    .single()

  if (error) throw error

  return data
}
