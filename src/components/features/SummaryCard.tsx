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
    <Container className="flex h-105 w-full flex-col outline-0 focus:outline-0!">
      <h1 className="mb-2 underline">{title}</h1>
      <div className="flex flex-col overflow-hidden">
        {items.length === 0 ? (
          <p className="text-xs">
            No list item has been added yet. Add a new one!
          </p>
        ) : (
          items
            .slice(0, 10)
            .map((item) => (
              <Checkbox
                key={item.id}
                id={item.id}
                label={item.title}
                checked={Boolean(item.completed_at)}
                onChange={item.handleChange}
              />
            ))
        )}
      </div>
      <Button
        size="sm"
        className="mt-auto! ml-auto! w-fit"
        href={`/list/${id}`}
      >
        See more
      </Button>
    </Container>
  )
}
