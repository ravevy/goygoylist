import { requireAuth } from '@/lib/supabase/requireAuth'
import { GetServerSidePropsContext } from 'next'

export default function Profile() {
  return <div>Profile</div>
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const auth = await requireAuth(context)
  if ('redirect' in auth) return auth

  return { props: {} }
}
