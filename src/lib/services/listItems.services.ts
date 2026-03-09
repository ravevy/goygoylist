import { GetResults } from '@/types/shared.types'
import { supabase } from '../supabase/client'
import {
  ListItemInsertSchemaType,
  listItemInsertSchema,
  ListItemSchemaType,
  listItemSchema,
  listItemUpdateSchema,
  ListItemUpdateSchemaType
} from '../validation/listItems.schema'

export async function insertListItem(
  listId: string,
  payload: ListItemInsertSchemaType
): Promise<GetResults<ListItemInsertSchemaType>> {
  const validatedPayload = listItemInsertSchema.safeParse(payload)

  if (!validatedPayload.success) {
    return {
      success: false,
      type: 'validation',
      error: validatedPayload.error
    }
  }

  const { data, error } = await supabase
    .from('list_items')
    .insert({ ...validatedPayload.data, list_id: listId })
    .select()
    .single()

  if (error) {
    return {
      success: false,
      type: 'supabase',
      error
    }
  }

  const parsed = listItemSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      type: 'validation',
      error: parsed.error
    }
  }

  return {
    success: true,
    data: parsed.data
  }
}

export async function updateListItem(
  itemId: string,
  payload: ListItemUpdateSchemaType
): Promise<GetResults<ListItemSchemaType>> {
  const validatedPayload = listItemUpdateSchema.safeParse(payload)

  if (!validatedPayload.success) {
    return {
      success: false,
      type: 'validation',
      error: validatedPayload.error
    }
  }

  const { data, error } = await supabase
    .from('list_items')
    .update(validatedPayload.data)
    .eq('id', itemId)
    .select()
    .single()

  if (error) {
    return {
      success: false,
      type: 'supabase',
      error
    }
  }

  const parsed = listItemSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      type: 'validation',
      error: parsed.error
    }
  }

  return {
    success: true,
    data: parsed.data
  }
}

export async function removeListItem(
  itemId: string
): Promise<GetResults<null>> {
  const { data, error } = await supabase
    .from('list_items')
    .delete()
    .eq('id', itemId)

  if (error) {
    return {
      success: false,
      type: 'supabase',
      error
    }
  }

  return {
    success: true,
    data: data
  }
}
