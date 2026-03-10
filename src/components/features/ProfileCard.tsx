import { Container } from '../ui-kit/container'
import { Button } from '../ui-kit/button'
import { Checkbox } from '../ui-kit/checkbox'
import { useState } from 'react'
import { Input } from '../ui-kit/input'
import { Select } from '../ui-kit/select'
import { ProfileUpdateSchemaType } from '@/lib/validation/profiles.schema'
import { Spinner } from '../ui-kit/spinner'

export const iconTypes = [
  'bulbasaur',
  'charmander',
  'squirtle',
  'pokeball'
] as const

export type IconType = (typeof iconTypes)[number]

export interface ProfileCardProps {
  id: string
  display_name?: string | null
  avatar_icon?: IconType
  handleUpdateProfile: (
    payload: ProfileUpdateSchemaType
  ) => Promise<void> | void
}

const iconOptions: Array<{ label: string; value: IconType }> = [
  { label: 'I am not sure', value: 'pokeball' },
  { label: 'Squirtle', value: 'squirtle' },
  { label: 'Charmender', value: 'charmander' },
  { label: 'Bulbasaur', value: 'bulbasaur' }
]

export default function ProfileCard({
  id,
  display_name,
  avatar_icon,
  handleUpdateProfile
}: ProfileCardProps) {
  const [updating, setUpdating] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [profileValue, setProfileValue] = useState<{
    display_name: string
    avatar_icon: IconType
  }>({
    display_name: display_name || '',
    avatar_icon: avatar_icon || 'pokeball'
  })

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await handleUpdateProfile(profileValue)
    } finally {
      setLoading(false)
      setUpdating(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-100 flex-col gap-10">
      <h1 className="text-cyan-500 underline">
        {updating ? 'Update your profile' : 'Your profile'}
      </h1>
      <div className="flex flex-col gap-4">
        {updating ? (
          <>
            <Input
              label="Your display name"
              value={profileValue.display_name}
              onChange={({ target }) =>
                setProfileValue((prev) => ({
                  ...prev,
                  display_name: target.value
                }))
              }
            />
            <Select
              label="Pick your starter"
              options={iconOptions}
              value={profileValue.avatar_icon}
              onChange={({ target }) => {
                setProfileValue((prev) => ({
                  ...prev,
                  avatar_icon: target.value as IconType
                }))
              }}
            />
          </>
        ) : (
          <>
            {display_name && <p className="nes-test">{display_name}</p>}
            <span>
              <i className={`nes-${avatar_icon}`}></i>
            </span>
          </>
        )}
      </div>

      <div className="flex w-full flex-col gap-4">
        {updating ? (
          <Button variant="primary" onClick={handleUpdate} disabled={loading}>
            {loading ? (
              <Spinner
                className="mx-auto flex size-6 shrink-0 items-center justify-center"
                variant="diamond"
              />
            ) : (
              'Save Profile'
            )}
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setUpdating(true)}>
            Update Profile
          </Button>
        )}
        <Button variant="warning">Sign Out</Button>
      </div>
    </div>
  )
}
