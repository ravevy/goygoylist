import { useState } from 'react'
import { Button } from '../ui-kit/button'

export default function DashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <div className="flex w-full items-center justify-between">
      <h1>Lists</h1>
      <Button onClick={() => setIsModalOpen(!isModalOpen)}>
        <i className="hn hn-plus-solid" />
      </Button>
    </div>
  )
}
