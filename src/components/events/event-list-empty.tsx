import { CalendarOffIcon } from "lucide-react"

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { copy } from "@/lib/copy"

/**
 * An empty schedule is a normal state here, not an error. It says the record is
 * empty — not that nothing is happening.
 */
export function EventListEmpty({ isFiltered }: { isFiltered: boolean }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarOffIcon />
        </EmptyMedia>
        <EmptyTitle>{copy.home.emptyTitle}</EmptyTitle>
        <EmptyDescription>
          {isFiltered ? copy.home.emptyFilteredDescription : copy.home.emptyDescription}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
