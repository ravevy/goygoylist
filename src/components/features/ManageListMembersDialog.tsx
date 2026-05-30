import { useState, useEffect, useCallback } from 'react'
import { Dialog } from '../ui-kit/dialog'
import { Select } from '../ui-kit/select'
import { Badge } from '../ui-kit/badge'
import { getProfiles } from '@/lib/services/profiles.services'
import { ProfileSchemaType } from '@/lib/validation/profiles.schema'
import {
  updateListMembers,
  fetchListMembers
} from '@/lib/services/listMembers.services'
import { useAuth } from '@/context/authContext'

interface ManageListMembersDialogProps {
  listId: string
}

export default function ManageListMembersDialog({
  listId
}: ManageListMembersDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentMemberIds, setCurrentMemberIds] = useState<string[]>([])
  const [allProfiles, setAllProfiles] = useState<ProfileSchemaType[]>([])
  const [selectedMembers, setSelectedMembers] = useState<ProfileSchemaType[]>(
    []
  )
  const { user } = useAuth()

  const fetchMembers = useCallback(async () => {
    const result = await fetchListMembers(listId)

    if (result.success && result.data) {
      setCurrentMemberIds(result.data.user_ids || [])
    }
  }, [listId])

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    if (!isOpen || !user) return
    getProfiles(user.id).then((result) => {
      if (result.success) {
        setAllProfiles(result.data)
        const currentMembers = result.data.filter((profile) =>
          currentMemberIds.includes(profile.id)
        )
        setSelectedMembers(currentMembers)
      }
    })
  }, [isOpen, user])

  const handleSelectMember = (userId: string) => {
    const profile = allProfiles.find((profile) => profile.id === userId)
    if (!profile || selectedMembers.some((member) => member.id === userId))
      return
    setSelectedMembers((prev) => [...prev, profile])
  }

  const handleRemoveMember = (profileId: string) => {
    setSelectedMembers((prev) =>
      prev.filter((member) => member.id !== profileId)
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    const memberIds = selectedMembers.map((member) => member.id)
    const userIds = user ? [...new Set([...memberIds, user.id])] : memberIds
    const result = await updateListMembers(listId, userIds)

    if (result.success) {
      setIsOpen(false)
      fetchMembers()
    }
    setIsLoading(false)
  }

  const availableProfiles = allProfiles.filter(
    (profile) => !selectedMembers.some((member) => member.id === profile.id)
  )

  return (
    <>
      <button
        className="flex items-center justify-center p-1"
        onClick={() => setIsOpen(true)}
        title="Manage members"
      >
        <i className="hn hn-users" />
      </button>

      <Dialog
        open={isOpen}
        confirmText="Save"
        onCancel={() => setIsOpen(false)}
        onConfirm={handleSave}
        className="md:w-1/2"
        isLoading={isLoading}
      >
        <div className="flex w-full flex-col gap-3">
          <h1 className="text-center text-xl">Manage collaborators</h1>

          <div className="flex flex-col gap-2">
            <Select
              id="memberSelect"
              label="Users"
              placeholder={
                availableProfiles.length === 0
                  ? 'No available users'
                  : 'Select collaborators'
              }
              size="md"
              disabled={isLoading || availableProfiles.length === 0}
              value=""
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
    </>
  )
}
