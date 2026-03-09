import { useState } from 'react'
import { Button } from '../ui-kit/button'
import { Dialog } from '../ui-kit/dialog'
import { ListInsertSchemaType } from '@/lib/validation/lists.schema'
import { Input } from '../ui-kit/input'
import { insertList } from '@/lib/services/lists.services'
import { Balloon } from '../ui-kit/balloon'

interface AddListDialogProps {
  setSuccess: (success: boolean) => void
}

export default function AddListDialog({ setSuccess }: AddListDialogProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [titleValue, setTitleValue] = useState<string>('')
  const [error, setError] = useState<boolean>(false)

  const handleInsertList = async (payload: ListInsertSchemaType) => {
    setIsLoading(true)
    setSuccess(false)
    const insertedList = await insertList(payload)

    if (insertedList.success) {
      setSuccess(true)
      handleSuccessTimeout()
      setIsModalOpen(false)
      setTitleValue('')
    } else {
      setError(true)
      setSuccess(false)
    }
    setIsLoading(false)
  }

  const handleSuccessTimeout = () => {
    setTimeout(() => {
      setSuccess(false)
    }, 5000)
  }

  return (
    <section>
      <Button onClick={() => setIsModalOpen(!isModalOpen)}>
        <i className="hn hn-plus-solid" />
      </Button>
      <Dialog
        open={isModalOpen}
        confirmText="Add List"
        onCancel={() => {
          setTitleValue('')
          setError(false)
          setSuccess(false)
          setIsModalOpen(false)
        }}
        onConfirm={() => handleInsertList({ title: titleValue })}
        className="w-1/2"
        isLoading={isLoading}
      >
        {
          <div className="flex w-full flex-col gap-3">
            <h1 className="text-center text-xl">Add a new list</h1>

            <Input
              label="Title"
              disabled={isLoading}
              size="md"
              id="newItemTitle"
              type="text"
              placeholder="Add a title"
              value={titleValue}
              variant={error ? 'error' : 'default'}
              onChange={(e) => {
                setTitleValue(e.target.value)
                setError(false)
              }}
            />

            {error && (
              <Balloon showClippy direction="right" className="mx-auto">
                <p className="nes-text is-error text-xs">
                  You need to add a title for the new list.
                </p>
              </Balloon>
            )}
          </div>
        }
      </Dialog>
    </section>
  )
}
