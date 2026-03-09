import { getListWithItems } from '@/lib/services/lists.services'
import { ListWithItemsSchemaType } from '@/lib/validation/lists.schema'
import { useEffect, useState } from 'react'
import { Spinner } from '../ui-kit/spinner'
import { Button } from '../ui-kit/button'
import {
  insertListItem,
  removeListItem,
  updateListItem
} from '@/lib/services/listItems.services'
import { Checkbox } from '../ui-kit/checkbox'
import { Input } from '../ui-kit/input'
import {
  ListItemInsertSchemaType,
  ListItemUpdateSchemaType
} from '@/lib/validation/listItems.schema'
import { Container } from '../ui-kit/container'
import SummaryCardItem from './DetailedListItem'
import { Balloon } from '../ui-kit/balloon'

interface DetailedListProps {
  id: string
}

export default function DetailedList({ id }: DetailedListProps) {
  const [updatingKey, setUpdatingKey] = useState<null | string>(null)
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<ListWithItemsSchemaType>()
  const [error, setError] = useState<string | null>(null)
  const [titleError, setTitleError] = useState(false)
  const [newItem, setNewItem] = useState<ListItemInsertSchemaType>({
    title: '',
    description: null
  })

  const fetchList = async () => {
    setLoading(true)
    setError(null)

    const result = await getListWithItems(id)

    if (result.success) {
      setList(result.data)
    } else {
      setError(
        'There is an error fetching lists. Connect to your administrator to fix the issue.'
      )
    }

    setLoading(false)
  }

  const toggleUpdate = (key: string) => {
    if (updatingKey === key) {
      setUpdatingKey(null)
      return
    }
    setUpdatingKey(key)
  }

  const handleCheckListItem = async (itemId: string, checked: boolean) => {
    const completedState = checked ? new Date().toISOString() : null
    const checkedItem = await updateListItem(itemId, {
      completed_at: completedState
    })

    if (checkedItem.success && list) {
      setList({
        ...list,
        items: list.items.map((item) =>
          item.id === checkedItem.data.id
            ? { ...item, completed_at: completedState }
            : item
        )
      })
    }
  }

  const handleUpdateListItem = async (
    itemId: string,
    payload: ListItemUpdateSchemaType
  ) => {
    const updatedItem = await updateListItem(itemId, payload)

    if (updatedItem.success && list) {
      setList({
        ...list,
        items: list.items.map((item) =>
          item.id === updatedItem.data.id
            ? {
                ...item,
                title: updatedItem.data.title ?? item.title,
                description: updatedItem.data.description
              }
            : item
        )
      })
    }
  }

  const handleInsertListItem = async (payload: ListItemInsertSchemaType) => {
    if (list?.id) {
      const insertedListItem = await insertListItem(list.id, payload)

      if (insertedListItem.success) {
        setList({
          ...list,
          items: [
            ...(list?.items || []),
            insertedListItem.data as (typeof list.items)[number]
          ]
        })
        setNewItem({
          title: '',
          description: null
        })
      } else {
        setTitleError(true)
      }
    }
  }

  const handleRemoveListItem = async (itemId: string) => {
    if (list) {
      const response = await removeListItem(itemId)

      if (response.success) {
        const listItems = [...list.items]
        const removedItem = listItems.findIndex((i) => i.id === itemId)
        listItems.splice(removedItem, 1)
        setList({
          ...list,
          items: listItems
        })
      }
    }
  }

  useEffect(() => {
    fetchList()
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
          <Button variant="primary" onClick={fetchList}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex flex-col gap-4 md:max-w-3/5 lg:max-w-1/2">
      <h1 className="mb-4 text-center text-xl">{list?.title}</h1>
      <Container className="flex flex-col">
        {list?.items.length === 0 ? (
          <p className="text-center text-sm">
            No list item has been added yet. Add a new one!
          </p>
        ) : (
          list?.items.map((item) => (
            <SummaryCardItem
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              completed_at={item.completed_at}
              isUpdating={item.id === updatingKey}
              toggleUpdate={() => toggleUpdate(item.id)}
              handleCheckboxChange={(checked) =>
                handleCheckListItem(item.id, checked)
              }
              handleValueUpdate={(payload) =>
                handleUpdateListItem(item.id, payload)
              }
              handleRemove={() => handleRemoveListItem(item.id)}
            />
          ))
        )}
      </Container>
      <Container
        title="Add new item"
        className="mt-4 [&>.title]:bg-(--body-bg)! [&>.title]:text-sm!"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleInsertListItem(newItem)
          }}
          className="flex w-full flex-col gap-3"
        >
          <Input
            label="Title"
            size="xs"
            id="newItemTitle"
            type="text"
            placeholder="Add a title"
            value={newItem.title}
            variant={titleError ? 'error' : 'default'}
            onChange={(e) => {
              setNewItem({ ...newItem, title: e.target.value })
              setTitleError(false)
            }}
          />
          <Input
            label="Description"
            size="xs"
            id="newItemDescription"
            type="text"
            placeholder="Add a description (optional)"
            value={newItem.description ?? ''}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
          />
          <Button type="submit" variant="primary" size="sm" className="w-fit">
            Submit
          </Button>
          {titleError && (
            <Balloon showClippy direction="right">
              <p className="is-error text-xs">
                You need to add a title for your list item.
              </p>
            </Balloon>
          )}
        </form>
      </Container>
    </div>
  )
}
