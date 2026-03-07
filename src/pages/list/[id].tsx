import DetailedList from '@/components/features/DetailedList'
import { Spinner } from '@/components/ui-kit/spinner'
import { useRouter } from 'next/router'

export default function ListDetail() {
  const router = useRouter()
  const { id } = router.query

  if (!router.isReady || !id) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="size-8" variant="diamond" />
      </div>
    )
  }

  return (
    <div>
      <DetailedList id={id as string} />
    </div>
  )
}
