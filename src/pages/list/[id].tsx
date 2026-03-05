import { requireAuth } from '@/lib/supabase/requireAuth'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'

export default function ListDetail() {
  const { query } = useRouter()
  return <div>List Detail: {query.id}</div>
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const auth = await requireAuth(context)
  if ('redirect' in auth) return auth

  return { props: {} }
}
