import { requireAuth } from '@/lib/requireAuth'

export default function Dashboard() {
  return <div>Dashboard</div>
}

export const getServerSideProps = async () => {
  const auth = await requireAuth()
  if ('redirect' in auth) return auth
}
