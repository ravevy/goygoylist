import { GetResults } from '@/types/shared.types'
import { supabase } from '../supabase/client'
import {
  listMembersSchema,
  ListMembersSchemaType
} from '../validation/listMembers.schema'

export async function fetchListMembers(
  listId: string
): Promise<GetResults<ListMembersSchemaType>> {
  const { data, error } = await supabase
    .from('list_members')
    .select('*')
    .eq('list_id', listId)
    .single()

  if (error) {
    return { success: false, type: 'supabase', error }
  }

  const parsed = listMembersSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, type: 'validation', error: parsed.error }
  }

  return { success: true, data: parsed.data }
}

export async function updateListMembers(
  listId: string,
  userIds: string[]
): Promise<GetResults<null>> {
  const { error } = await supabase
    .from('list_members')
    .upsert({ list_id: listId, user_ids: userIds }, { onConflict: 'list_id' })

  if (error) {
    return { success: false, type: 'supabase', error }
  }

  return { success: true, data: null }
}

export async function removeListMembers(
  listId: string
): Promise<GetResults<null>> {
  const { error } = await supabase
    .from('list_members')
    .delete()
    .eq('list_id', listId)

  if (error) {
    return { success: false, type: 'supabase', error }
  }

  return { success: true, data: null }
}
