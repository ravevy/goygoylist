import { getListsWithItems } from '@/lib/services/lists.services'
import { ListsWithItemsSchemaType } from '@/lib/validation/lists.schema'
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import SummaryCard from './SummaryCard'
import { Spinner } from '../ui-kit/spinner'
import { Button } from '../ui-kit/button'
import { updateListItem } from '@/lib/services/listItems.services'

export interface SummaryCardListRef {
  refetch: () => Promise<void>
}

const SummaryCardList = forwardRef<SummaryCardListRef>((props, ref) => {
  const [loading, setLoading] = useState(true)
  const [lists, setLists] = useState<ListsWithItemsSchemaType>([])
  const [error, setError] = useState<string | null>(null)

  const fetchLists = async () => {
    setLoading(true)
    setError(null)

    const result = await getListsWithItems()

    if (result.success) {
      setLists(result.data)
    } else {
      setError(
        'There is an error fetching lists. Connect to your administrator to fix the issue.'
      )
    }

    setLoading(false)
  }

  const handleUpdateListItem = async (itemId: string, checked: boolean) => {
    const completedState = checked ? new Date().toISOString() : null
    const updatedItem = await updateListItem(itemId, {
      completed_at: completedState
    })

    if (updatedItem.success) {
      setLists(
        lists.map((list) => ({
          ...list,
          items: list.items.map((item) =>
            item.id === updatedItem.data.id
              ? { ...item, completed_at: completedState }
              : item
          )
        }))
      )
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      refetch: fetchLists
    }),
    [fetchLists]
  )

  useEffect(() => {
    fetchLists()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="size-8" variant="diamond" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="md:max-w-1/2">
          <div className="mb-4 text-red-500">{error}</div>
          <Button variant="primary" onClick={fetchLists}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!lists || lists.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">
          No lists found. Create your first list to get started!
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {lists.map((list) => (
        <SummaryCard
          key={list.id}
          id={list.id}
          items={list.items.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description || undefined,
            completed_at: item.completed_at || undefined,
            handleChange: (checked) => handleUpdateListItem(item.id, checked)
          }))}
          title={list.title}
        />
      ))}
    </div>
  )
})

SummaryCardList.displayName = 'SummaryCardList'

export default SummaryCardList
