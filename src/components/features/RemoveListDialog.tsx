import { useState } from 'react'
import { Button } from '../ui-kit/button'
import { Dialog } from '../ui-kit/dialog'
import { ListInsertSchemaType } from '@/lib/validation/lists.schema'
import { insertList, removeList } from '@/lib/services/lists.services'
import { SummaryCardListRef } from './SummaryCardList'
import { useRouter } from 'next/router'

interface RemoveListDialogProps {
  listTitle: string
  listId: string
}

export default function RemoveListDialog({
  listTitle,
  listId
}: RemoveListDialogProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleRemoveList = async (listId: string) => {
    setIsLoading(true)
    const response = await removeList(listId)

    if (response.success) {
      router.push('/dashboard')
      setIsModalOpen(false)
    }
    setIsLoading(false)
  }

  return (
    <section>
      <button
        className="flex items-center justify-center p-1"
        onClick={() => setIsModalOpen(true)}
      >
        <i className="hn hn-trash-alt" />
      </button>
      <Dialog
        open={isModalOpen}
        confirmText="Remove List"
        onCancel={() => {
          setIsModalOpen(false)
        }}
        onConfirm={() => {
          handleRemoveList(listId)
        }}
        className="w-1/2"
        isLoading={isLoading}
      >
        <h1 className="text-center text-xl">
          Are you sure you want to delete{' '}
          <b className="font-extrabold underline">{listTitle}</b>?
        </h1>
      </Dialog>
    </section>
  )
}
