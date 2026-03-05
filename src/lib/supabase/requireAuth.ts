import { GetServerSidePropsContext } from 'next'
import { createServerSupabase } from './server'

export async function requireAuth(context: GetServerSidePropsContext) {
  const supabase = createServerSupabase(context)

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return { session }
}
