import { EventList } from "@/components/events/event-list"
import { EventListEmpty } from "@/components/events/event-list-empty"
import { listUpcomingEvents } from "@/data/repository"
import {
  countActiveFilters,
  toEventFilter,
  type EventSearchParams,
} from "@/lib/search-params"

/**
 * Kept separate from the page so the Suspense boundary sits here rather than in
 * a root `loading.tsx`. A root boundary would make every route below it — the
 * detail page included — start streaming before its data is checked, which
 * turns a `notFound()` into a soft 404.
 */
export async function EventSchedule({
  valuesPromise,
}: {
  valuesPromise: Promise<EventSearchParams>
}) {
  const values = await valuesPromise
  const events = await listUpcomingEvents(toEventFilter(values))

  if (events.length === 0) {
    return (
      /* The grid bleeds under the filter rail; the empty state must not. */
      <div className="px-4 pt-[calc(5.5rem+env(safe-area-inset-top))]">
        <EventListEmpty isFiltered={countActiveFilters(values) > 0} />
      </div>
    )
  }

  return <EventList events={events} />
}
