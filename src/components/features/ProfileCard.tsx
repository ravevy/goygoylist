import { useState } from 'react'
import { Button } from '../ui-kit/button'
import { Input } from '../ui-kit/input'
import { Select } from '../ui-kit/select'
import { Spinner } from '../ui-kit/spinner'
import {
  iconTypes,
  ProfileUpdateSchemaType
} from '@/lib/validation/profiles.schema'
import { changePassword } from '@/lib/services/profiles.services'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/router'

type Mode = 'view' | 'editProfile' | 'changePassword'

export type IconType = (typeof iconTypes)[number]

type ProfileData = {
  display_name: string
  avatar_icon: IconType
}

type PasswordFormData = {
  next: string
  confirm: string
}

const iconOptions = iconTypes.map((icon) => ({
  label: icon.charAt(0).toUpperCase() + icon.slice(1),
  value: icon
}))

interface ProfileCardProps {
  display_name?: string | null
  avatar_icon?: IconType
  handleUpdateProfile: (
    payload: ProfileUpdateSchemaType
  ) => Promise<void> | void
}

export default function ProfileCard({
  display_name,
  avatar_icon,
  handleUpdateProfile
}: ProfileCardProps) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('view')
  const [loading, setLoading] = useState(false)

  const [profile, setProfile] = useState<ProfileData>({
    display_name: display_name || '',
    avatar_icon: avatar_icon || 'pokeball'
  })

  const openEditProfile = () => setMode('editProfile')
  const openChangePassword = () => setMode('changePassword')
  const returnToView = () => setMode('view')

  const updateProfile = async () => {
    setLoading(true)
    try {
      await handleUpdateProfile(profile)
      returnToView()
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) return alert(error.message)
    router.push('/dashboard')
  }

  const titleMap: Record<Mode, string> = {
    view: 'Your profile',
    editProfile: 'Update your profile',
    changePassword: 'Change your password'
  }

  return (
    <div className="mx-auto flex max-w-100 flex-col gap-8">
      <h1 className="text-cyan-500 underline">{titleMap[mode]}</h1>

      {mode === 'view' && (
        <ProfileView
          display_name={profile.display_name}
          avatar_icon={profile.avatar_icon}
        />
      )}

      {mode === 'editProfile' && (
        <ProfileEdit profile={profile} setProfile={setProfile} />
      )}

      {mode === 'changePassword' && <PasswordForm onCancel={returnToView} />}

      <div className="flex flex-col gap-4">
        {mode === 'editProfile' && (
          <Button onClick={updateProfile} disabled={loading}>
            {loading ? <Spinner className="mx-auto size-6" /> : 'Save Profile'}
          </Button>
        )}

        {mode === 'view' && (
          <>
            <Button onClick={openEditProfile}>Update Profile</Button>
            <Button variant="warning" onClick={openChangePassword}>
              Change Password
            </Button>
            <Button variant="primary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

function ProfileView({ display_name, avatar_icon }: ProfileData) {
  return (
    <div className="flex flex-col gap-4">
      {display_name && <p>{display_name}</p>}
      <span>
        <i className={`nes-${avatar_icon}`}></i>
      </span>
    </div>
  )
}

function ProfileEdit({
  profile,
  setProfile
}: {
  profile: ProfileData
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>
}) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Your display name"
        value={profile.display_name}
        onChange={(e) =>
          setProfile((p) => ({ ...p, display_name: e.target.value }))
        }
      />

      <Select
        label="Pick your starter"
        options={iconOptions}
        value={profile.avatar_icon}
        onChange={(e) =>
          setProfile((p) => ({ ...p, avatar_icon: e.target.value as IconType }))
        }
      />

      <span>
        <i className={`nes-${profile.avatar_icon}`}></i>
      </span>
    </div>
  )
}

function PasswordForm({ onCancel }: { onCancel: () => void }) {
  const [form, setForm] = useState<PasswordFormData>({ next: '', confirm: '' })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleChangePassword = async () => {
    setError(null)

    if (!form.next || !form.confirm) {
      return setError('Password fields cannot be empty')
    }

    if (form.next !== form.confirm) {
      return setError('Passwords do not match')
    }

    if (form.next.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    setLoading(true)

    try {
      const result = await changePassword(form.next)
      if (!result.success)
        return setError(result.error.message || 'Error updating password')
      setForm({ next: '', confirm: '' })
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="New password"
        type="password"
        value={form.next}
        onChange={(e) => setForm((form) => ({ ...form, next: e.target.value }))}
      />

      <Input
        label="Confirm new password"
        type="password"
        value={form.confirm}
        onChange={(e) =>
          setForm((form) => ({ ...form, confirm: e.target.value }))
        }
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-2">
        <Button
          onClick={() => {
            handleChangePassword()
          }}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <Spinner className="mx-auto size-6" variant="diamond" />
          ) : (
            'Save Password'
          )}
        </Button>

        <Button variant="warning" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  )
}
