import DashboardHeader from '@/components/features/DashboardHeader'
import SummaryCardList from '@/components/features/SummaryCardList'

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader />
      <SummaryCardList />
    </div>
  )
}
