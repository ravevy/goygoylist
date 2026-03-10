import { supabase } from '../supabase/client'
import { GetAuthResults, GetResults } from '@/types/shared.types'

import {
  ProfileSchemaType,
  profileSchema,
  ProfileUpdateSchemaType,
  profileUpdateSchema
} from '../validation/profiles.schema'

export async function getProfile(): Promise<GetResults<ProfileSchemaType>> {
  const { data, error } = await supabase.from('profiles').select('*').single()

  if (error) {
    return {
      success: false,
      type: 'supabase',
      error
    }
  }

  const parsed = profileSchema.safeParse(data)

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

export async function updateProfile(
  userId: string,
  payload: ProfileUpdateSchemaType
): Promise<GetResults<ProfileSchemaType>> {
  const validatedPayload = profileUpdateSchema.safeParse(payload)

  if (!validatedPayload.success) {
    return {
      success: false,
      type: 'validation',
      error: validatedPayload.error
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(validatedPayload.data)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    return {
      success: false,
      type: 'supabase',
      error
    }
  }

  const parsed = profileSchema.safeParse(data)

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

export async function changePassword(
  newPassword: string
): Promise<GetAuthResults<null>> {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  console.log(data)

  if (error) {
    return {
      success: false,
      type: 'supabase',
      error
    }
  }

  return {
    success: true,
    data: null
  }
}
