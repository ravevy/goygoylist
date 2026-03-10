import ProfileCard, { IconType } from '@/components/features/ProfileCard'
import { Container } from '@/components/ui-kit/container'
import { Spinner } from '@/components/ui-kit/spinner'
import { getProfile, updateProfile } from '@/lib/services/profiles.services'
import {
  ProfileSchemaType,
  ProfileUpdateSchemaType
} from '@/lib/validation/profiles.schema'
import { useEffect, useState } from 'react'

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true)
  const [profile, setProfile] = useState<ProfileSchemaType | null>(null)

  const handleGetProfile = async () => {
    setLoading(true)
    const profile = await getProfile()
    if (profile.success) {
      setProfile(profile.data)
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (
    userId: string,
    payload: ProfileUpdateSchemaType
  ) => {
    const updatedProfile = await updateProfile(userId, payload)

    if (updatedProfile.success) {
      setProfile(updatedProfile.data)
    }
  }

  useEffect(() => {
    handleGetProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="size-8" variant="diamond" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex flex-col gap-4 text-center md:max-w-3/5 lg:max-w-1/2">
      <h1 className="my-4! text-center text-xl">Profile</h1>
      <Container>
        {profile && (
          <ProfileCard
            display_name={profile.display_name}
            avatar_icon={profile.avatar_icon as IconType}
            handleUpdateProfile={(payload) =>
              handleUpdateProfile(profile.id, payload)
            }
          />
        )}
      </Container>
    </div>
  )
}
