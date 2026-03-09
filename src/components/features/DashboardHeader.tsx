import { useState } from 'react'
import AddListDialog from './AddListDialog'
import { Balloon } from '../ui-kit/balloon'
import { Container } from '../ui-kit/container'

export default function DashboardHeader() {
  const [success, setSuccess] = useState<boolean>()
  return (
    <div className="flex w-full flex-col items-center max-md:flex-wrap">
      <div className="flex w-full flex-row items-center justify-between">
        <h1>Lists</h1>
        <AddListDialog setSuccess={(success) => setSuccess(success)} />
      </div>
      {success && (
        <Container className="mt-4 ml-auto!" variants={['rounded']}>
          <p className="nes-text is-success text-xs">
            You added a new list, congratz! Go add some new items!
          </p>
        </Container>
      )}
    </div>
  )
}
