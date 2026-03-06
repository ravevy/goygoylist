import { supabase } from '../supabase/client'
import {
  ListInsertSchema,
  listInsertSchema,
  listsSchema,
  listsWithItemsSchema,
  ListsWithItemsSchema,
  ListUpdateSchema,
  listUpdateSchema,
  ListWithItemsSchema,
  listWithItemsSchema
} from '../validation/lists.schema'

export async function getListsWithItems(): Promise<ListsWithItemsSchema> {
  const { data, error } = await supabase
    .from('list_with_items_ordered')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return listsWithItemsSchema.parse(data)
}

export async function getListWithItems(
  listId: string
): Promise<ListWithItemsSchema> {
  const { data, error } = await supabase
    .from('list_with_items_ordered')
    .select('*')
    .eq('id', listId)
    .single()

  if (error) throw error

  return listWithItemsSchema.parse(data)
}

export async function insertList(payload: ListInsertSchema) {
  const validatedPayload = listInsertSchema.parse(payload)

  const { data, error } = await supabase
    .from('lists')
    .insert(validatedPayload)
    .select()
    .single()

  if (error) throw error

  return listsSchema.parse(data)
}

export async function updateList(listId: string, payload: ListUpdateSchema) {
  const validatedPayload = listUpdateSchema.parse(payload)

  const { data, error } = await supabase
    .from('lists')
    .update(validatedPayload)
    .eq('id', listId)
    .select()
    .single()

  if (error) throw error

  return listsSchema.parse(data)
}
