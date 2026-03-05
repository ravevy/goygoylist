import { requireAuth } from '@/lib/requireAuth'
import { useRouter } from 'next/router'

export default function ListDetail() {
  const { query } = useRouter()
  return <div>List Detail: {query.id}</div>
}

export const getServerSideProps = async () => {
  const auth = await requireAuth()
  if ('redirect' in auth) return auth
}
