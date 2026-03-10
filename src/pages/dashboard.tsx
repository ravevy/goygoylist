import DashboardHeader from '@/components/features/DashboardHeader'
import SummaryCardList, {
  SummaryCardListRef
} from '@/components/features/SummaryCardList'
import { useRef } from 'react'

export default function Dashboard() {
  const summaryCardListRef = useRef<SummaryCardListRef | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader
        summaryCardListRef={
          summaryCardListRef as React.RefObject<SummaryCardListRef>
        }
      />
      <SummaryCardList ref={summaryCardListRef} />
    </div>
  )
}
