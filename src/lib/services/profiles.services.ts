import { supabase } from '../supabase/client'
import {
  ProfileSchema,
  profileSchema,
  ProfileUpdateSchema,
  profileUpdateSchema
} from '../validation/profiles.schema'

export async function getProfile(): Promise<ProfileSchema> {
  const { data, error } = await supabase.from('profiles').select('*').single()

  if (error) throw error

  return profileSchema.parse(data)
}

export async function updateProfile(
  userId: string,
  payload: ProfileUpdateSchema
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error

  return profileUpdateSchema.parse(data)
}
