import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/router'
import { requireAuth } from '@/lib/supabase/requireAuth'
import { GetServerSidePropsContext } from 'next'

type List = {
  id: string
  title: string
  created_at: string
  created_by: string
}

export default function Dashboard() {
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Error fetching lists:', error.message)
      } else {
        setLists(data || [])
      }
      setLoading(false)
    }

    fetchLists()
  }, [])

  const handleListClick = (id: string) => {
    router.push(`/list/${id}`)
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Your Lists</h1>

      {loading ? (
        <p>Loading lists...</p>
      ) : lists.length === 0 ? (
        <p>No lists yet. Add one!</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <div
              key={list.id}
              onClick={() => handleListClick(list.id)}
              className="cursor-pointer rounded border p-4 shadow transition hover:bg-gray-100"
            >
              <h2 className="text-lg font-semibold">{list.title}</h2>
              <p className="text-sm text-gray-500">
                Created at: {new Date(list.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const auth = await requireAuth(context)
  if ('redirect' in auth) return auth

  return { props: {} }
}
