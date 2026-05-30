import { useState, useEffect } from 'react'
import { Button } from '../ui-kit/button'
import { Dialog } from '../ui-kit/dialog'
import { ListInsertSchemaType } from '@/lib/validation/lists.schema'
import { Input } from '../ui-kit/input'
import { insertList } from '@/lib/services/lists.services'
import { getProfiles } from '@/lib/services/profiles.services'
import { Balloon } from '../ui-kit/balloon'
import { SummaryCardListRef } from './SummaryCardList'
import { ProfileSchemaType } from '@/lib/validation/profiles.schema'
import { Select } from '../ui-kit/select'
import { Badge } from '../ui-kit/badge'
import { useAuth } from '@/context/authContext'

interface AddListDialogProps {
  setSuccess: (success: boolean) => void
  summaryCardListRef: React.RefObject<SummaryCardListRef>
}

export default function AddListDialog({
  setSuccess,
  summaryCardListRef
}: AddListDialogProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [titleValue, setTitleValue] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [allProfiles, setAllProfiles] = useState<ProfileSchemaType[]>([])
  const [selectedMembers, setSelectedMembers] = useState<ProfileSchemaType[]>(
    []
  )

  const { user } = useAuth()

  useEffect(() => {
    if (!isModalOpen || !user) return
    getProfiles(user.id).then((result) => {
      if (result.success) setAllProfiles(result.data)
    })
  }, [isModalOpen, user])

  const handleSelectMember = (userId: string) => {
    const profile = allProfiles.find((profile) => profile.id === userId)
    if (!profile || selectedMembers.some((member) => member.id === userId))
      return
    setSelectedMembers((prev) => [...prev, profile])
  }

  const handleRemoveMember = (profileId: string) => {
    setSelectedMembers((prev) =>
      prev.filter((profile) => profile.id !== profileId)
    )
  }

  const handleInsertList = async (payload: ListInsertSchemaType) => {
    setIsLoading(true)
    setSuccess(false)
    const memberIds = selectedMembers.map((member) => member.id)
    const userIds = user ? [...new Set([...memberIds, user.id])] : memberIds
    const insertedList = await insertList(payload, userIds)

    if (insertedList.success) {
      setSuccess(true)
      handleSuccessTimeout()
      handleClose()
      await summaryCardListRef.current?.refetch()
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

  const handleClose = () => {
    setTitleValue('')
    setError(false)
    setSuccess(false)
    setSelectedMembers([])
    setAllProfiles([])
    setIsModalOpen(false)
  }

  const availableProfiles = allProfiles.filter(
    (profile) => !selectedMembers.some((member) => member.id === profile.id)
  )

  return (
    <section>
      <Button onClick={() => setIsModalOpen(!isModalOpen)}>
        <i className="hn hn-plus-solid" />
      </Button>
      <Dialog
        open={isModalOpen}
        confirmText="Add List"
        onCancel={handleClose}
        onConfirm={() => handleInsertList({ title: titleValue })}
        className="md:w-1/2"
        isLoading={isLoading}
      >
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

          <div className="flex flex-col gap-3">
            <Select
              id="memberSelect"
              label="Users"
              placeholder={
                availableProfiles.length === 0
                  ? 'No available users'
                  : 'Select collaborators'
              }
              size="md"
              value=""
              disabled={isLoading || availableProfiles.length === 0}
              onChange={(e) => handleSelectMember(e.target.value)}
              options={availableProfiles.map((profile) => ({
                label: profile.display_name || 'Unknown',
                value: profile.id
              }))}
            />
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <Badge
                    key={member.id}
                    variant="primary"
                    label={member.display_name || 'Unknown'}
                    onRemove={() => handleRemoveMember(member.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </section>
  )
}
