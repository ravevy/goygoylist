import { AuthError, PostgrestError } from '@supabase/supabase-js'
import { ZodError } from 'zod'

export type GetResults<T> =
  | { success: true; data: T }
  | { success: false; type: 'supabase'; error: PostgrestError }
  | { success: false; type: 'validation'; error: ZodError }

export type GetAuthResults<T> =
  | { success: true; data: T }
  | { success: false; type: 'supabase'; error: AuthError }
