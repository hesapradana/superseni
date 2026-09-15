import { EventFilters } from "@/components/events/event-filters"
import {
  listArtForms,
  listDistrictCounts,
  listEventTypes,
} from "@/data/repository"
import { toEventFilter, type EventSearchParams } from "@/lib/search-params"

/** Server half of the filter bar: fetches the option lists the client needs. */
export async function EventFiltersLoader({
  valuesPromise,
}: {
  valuesPromise: Promise<EventSearchParams>
}) {
  const values = await valuesPromise
  const filter = toEventFilter(values)

  const [districtCounts, artForms, eventTypes] = await Promise.all([
    listDistrictCounts(filter),
    listArtForms(),
    listEventTypes(),
  ])

  const total = districtCounts.reduce((sum, entry) => sum + entry.count, 0)

  return (
    <EventFilters
      districtCounts={districtCounts}
      artForms={artForms}
      eventTypes={eventTypes}
      total={total}
    />
  )
}
