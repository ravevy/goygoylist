import { Container } from '../ui-kit/container'
import { Button } from '../ui-kit/button'
import { Checkbox } from '../ui-kit/checkbox'

export interface SummaryCardProps {
  id: string
  title: string
  items: Array<{
    id: string
    title: string
    description?: string
    completed_at?: string
    handleChange: (checked: boolean) => void
  }>
}

export default function SummaryCard({ id, title, items }: SummaryCardProps) {
  return (
    <Container className="flex h-100 w-full flex-col outline-0 focus:outline-0!">
      <h1 className="underline">{title}</h1>
      <div className="flex flex-col overflow-hidden">
        {items.slice(0, 13).map((item) => (
          <Checkbox
            key={item.id}
            id={item.id}
            label={item.title}
            checked={Boolean(item.completed_at)}
            onChange={item.handleChange}
          />
        ))}
      </div>
      <Button className="ml-auto! w-fit scale-75" href={`/list/${id}`}>
        See more
      </Button>
    </Container>
  )
}
