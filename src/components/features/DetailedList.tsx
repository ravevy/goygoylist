import { getListWithItems, updateList } from '@/lib/services/lists.services'
import {
  ListUpdateSchemaType,
  ListWithItemsSchemaType
} from '@/lib/validation/lists.schema'
import { useCallback, useEffect, useState } from 'react'
import { Spinner } from '../ui-kit/spinner'
import { Button } from '../ui-kit/button'
import {
  insertListItem,
  removeListItem,
  updateListItem
} from '@/lib/services/listItems.services'
import { Input } from '../ui-kit/input'
import {
  ListItemInsertSchemaType,
  ListItemUpdateSchemaType
} from '@/lib/validation/listItems.schema'
import { Container } from '../ui-kit/container'
import SummaryCardItem from './DetailedListItem'
import { Balloon } from '../ui-kit/balloon'
import RemoveListDialog from './RemoveListDialog'

interface DetailedListProps {
  id: string
}

export default function DetailedList({ id }: DetailedListProps) {
  const [updatingKey, setUpdatingKey] = useState<null | string>(null)
  const [loadingPage, setLoadingPage] = useState(true)
  const [list, setList] = useState<ListWithItemsSchemaType>()
  const [error, setError] = useState<string | null>(null)
  const [titleError, setTitleError] = useState(false)
  const [updating, setUpdating] = useState<boolean>(false)
  const [loadingTitle, setLoadingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(list?.title ?? '')
  const [newItem, setNewItem] = useState<ListItemInsertSchemaType>({
    title: '',
    description: null
  })

  const fetchList = useCallback(async () => {
    setLoadingPage(true)
    setError(null)

    const result = await getListWithItems(id)

    if (result.success) {
      setList(result.data)
      setTitleValue(result.data.title)
    } else {
      setError(
        'There is an error fetching lists. Connect to your administrator to fix the issue.'
      )
    }

    setLoadingPage(false)
  }, [id])

  const toggleUpdate = (key: string) => {
    if (updatingKey === key) {
      setUpdatingKey(null)
      return
    }
    setUpdatingKey(key)
  }

  const handleCheckListItem = async (itemId: string, checked: boolean) => {
    if (list) {
      const completedState = checked ? new Date().toISOString() : null
      const checkedItem = await updateListItem(itemId, {
        completed_at: completedState
      })

      if (checkedItem.success) {
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
  }

  const handleUpdateListItem = async (
    itemId: string,
    payload: ListItemUpdateSchemaType
  ) => {
    if (list) {
      const updatedItem = await updateListItem(itemId, payload)

      if (updatedItem.success) {
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
  }

  const handleInsertListItem = async (payload: ListItemInsertSchemaType) => {
    if (list) {
      const insertedListItem = await insertListItem(id, payload)

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

  const handleUpdateList = async (
    listId: string,
    payload: ListUpdateSchemaType
  ) => {
    if (list) {
      setLoadingTitle(true)
      const updatedItem = await updateList(listId, payload)

      if (updatedItem.success) {
        setList({
          ...list,
          title: updatedItem.data.title
        })
        setUpdating(false)
        setTitleValue(updatedItem.data.title)
      }
      setLoadingTitle(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [fetchList])

  if (loadingPage) {
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
      {updating ? (
        <div className="mt-4 mb-4 flex items-center justify-center gap-4">
          <input
            id="title"
            disabled={loadingTitle}
            className="w-full border-b-2 border-dashed text-center text-xl! leading-5 italic outline-0"
            type="text"
            value={titleValue}
            onChange={({ target }) => {
              setTitleValue(target.value)
            }}
          />
          {!loadingTitle ? (
            <button
              className="flex h-fit items-center justify-center p-1"
              onClick={() => {
                handleUpdateList(id, { title: titleValue })
              }}
            >
              <i className="hn hn-save-solid" />
            </button>
          ) : (
            <Spinner
              className="flex size-6 h-fit shrink-0 items-center justify-center p-1"
              variant="diamond"
            />
          )}
        </div>
      ) : (
        <div className="mt-4 mb-4 flex items-center justify-center gap-4">
          <h1 className="mb-0! text-center text-xl">{list?.title}</h1>
          <button
            className="flex items-center justify-center p-1"
            onClick={() => setUpdating(true)}
          >
            <i className="hn hn-pencil font-xl" />
          </button>
          {list?.title && (
            <RemoveListDialog listTitle={list.title} listId={id} />
          )}
        </div>
      )}
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
              created_by={item.created_by}
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
