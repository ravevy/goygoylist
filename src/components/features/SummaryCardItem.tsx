import { useEffect, useRef, useState } from 'react'
import { Checkbox } from '../ui-kit/checkbox'
import AutoGrowTextarea from '../ui-kit/textarea'
import { ListItemUpdateSchemaType } from '@/lib/validation/listItems.schema'
import { Spinner } from '../ui-kit/spinner'
import { cx } from 'class-variance-authority'

interface SummaryCardItemProps {
  id: string
  title: string
  description?: string | null
  completed_at?: string | null
  isUpdating: boolean
  toggleUpdate: () => void
  handleCheckboxChange: (checked: boolean) => void
  handleValueUpdate: (payload: ListItemUpdateSchemaType) => Promise<void> | void
  handleRemove: () => Promise<void> | void
}

export default function SummaryCardItem({
  id,
  title,
  description,
  completed_at,
  isUpdating,
  toggleUpdate,
  handleCheckboxChange,
  handleValueUpdate,
  handleRemove
}: SummaryCardItemProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [titleValue, setTitleValue] = useState(title)
  const [descValue, setDescValue] = useState(description)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isUpdating) {
      titleInputRef.current?.focus()
    }
  }, [isUpdating])

  const handleUpdateItem = async () => {
    setLoading(true)
    try {
      await handleValueUpdate({
        title: titleValue,
        description: descValue
      })
    } finally {
      toggleUpdate()
      setLoading(false)
    }
  }

  const handleRemoveItem = async () => {
    setLoading(true)
    try {
      await handleRemove()
    } finally {
      setLoading(false)
    }
  }

  return (
    <span className="flex w-full items-center justify-between">
      {isUpdating ? (
        <>
          <span
            className={cx(
              'mb-1.5 flex w-full flex-col items-center text-xs leading-5',
              { 'mb-2': !description }
            )}
          >
            <span className="flex w-full flex-nowrap">
              <Checkbox
                key={id}
                id={id}
                label={''}
                checked={Boolean(completed_at)}
                onChange={handleCheckboxChange}
                className="mb-0! align-top"
              />
              <input
                id="title"
                disabled={loading}
                ref={titleInputRef}
                className="w-full border-b-2 border-dashed text-xs! leading-5 italic outline-0"
                type="text"
                value={titleValue}
                onChange={({ target }) => {
                  setTitleValue(target.value)
                }}
                tabIndex={1}
              />
            </span>
            {description && (
              <span className="flex w-full flex-nowrap">
                <AutoGrowTextarea
                  id="description"
                  disabled={loading}
                  value={descValue as string}
                  setValue={(value) => setDescValue(value)}
                  className="w-full border-b-2 border-dashed border-[white] text-xs! leading-5! text-[#666666] italic outline-0"
                />
              </span>
            )}
          </span>
          {!loading ? (
            <button
              className="ms-5! flex h-fit items-center justify-center p-1"
              onClick={handleUpdateItem}
            >
              <i className="hn hn-save-solid" />
            </button>
          ) : (
            <Spinner
              className="ms-5! flex size-6 h-fit shrink-0 items-center justify-center p-1"
              variant="diamond"
            />
          )}
        </>
      ) : (
        <>
          <Checkbox
            key={id}
            id={id}
            label={title}
            description={description}
            checked={Boolean(completed_at)}
            onChange={handleCheckboxChange}
          />
          <div className="flex flex-row items-center">
            <button
              className="flex items-center justify-center p-1"
              onClick={toggleUpdate}
            >
              <i className="hn hn-pencil font-xl" />
            </button>
            {!loading ? (
              <button
                className="flex items-center justify-center p-1"
                onClick={handleRemoveItem}
              >
                <i className="hn hn-trash-alt" />
              </button>
            ) : (
              <Spinner
                className="flex size-6 h-fit shrink-0 items-center justify-center p-1"
                variant="diamond"
              />
            )}
          </div>
        </>
      )}
    </span>
  )
}
