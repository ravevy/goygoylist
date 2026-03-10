import { supabase } from '../supabase/client'
import {
  ListInsertSchemaType,
  listInsertSchema,
  listSchema,
  ListSchemaType,
  listsWithItemsSchema,
  ListsWithItemsSchemaType,
  ListUpdateSchemaType,
  listUpdateSchema,
  ListWithItemsSchemaType,
  listWithItemsSchema
} from '../validation/lists.schema'
import { GetResults } from '@/types/shared.types'

export async function getListsWithItems(): Promise<
  GetResults<ListsWithItemsSchemaType>
> {
  const { data, error } = await supabase
    .from('list_with_items_ordered')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, type: 'supabase', error }
  }

  const parsed = listsWithItemsSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, type: 'validation', error: parsed.error }
  }

  return { success: true, data: parsed.data }
}

export async function getListWithItems(
  listId: string
): Promise<GetResults<ListWithItemsSchemaType>> {
  const { data, error } = await supabase
    .from('list_with_items_ordered')
    .select('*')
    .eq('id', listId)
    .single()

  if (error) {
    return { success: false, type: 'supabase', error }
  }

  const parsed = listWithItemsSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, type: 'validation', error: parsed.error }
  }

  return { success: true, data: parsed.data }
}

export async function insertList(
  payload: ListInsertSchemaType
): Promise<GetResults<ListSchemaType>> {
  const payloadValidation = listInsertSchema.safeParse(payload)

  if (!payloadValidation.success) {
    return {
      success: false,
      type: 'validation',
      error: payloadValidation.error
    }
  }

  const { data, error } = await supabase
    .from('lists')
    .insert(payloadValidation.data)
    .select()
    .single()

  if (error) {
    return { success: false, type: 'supabase', error }
  }

  const parsed = listSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, type: 'validation', error: parsed.error }
  }

  return { success: true, data: parsed.data }
}

export async function updateList(
  listId: string,
  payload: ListUpdateSchemaType
): Promise<GetResults<ListSchemaType>> {
  const payloadValidation = listUpdateSchema.safeParse(payload)

  if (!payloadValidation.success) {
    return {
      success: false,
      type: 'validation',
      error: payloadValidation.error
    }
  }

  const { data, error } = await supabase
    .from('lists')
    .update(payloadValidation.data)
    .eq('id', listId)
    .select()
    .single()

  if (error) {
    return { success: false, type: 'supabase', error }
  }

  const parsed = listSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, type: 'validation', error: parsed.error }
  }

  return { success: true, data: parsed.data }
}

export async function removeList(listId: string): Promise<GetResults<null>> {
  const { data, error } = await supabase.from('lists').delete().eq('id', listId)

  if (error) {
    return { success: false, type: 'supabase', error }
  }

  return { success: true, data: data }
}
