import { SiteHeader } from "@/components/layout/site-header"
import { countUpcomingEvents } from "@/data/repository"
import { copy } from "@/lib/copy"
import { toEventFilter, type EventSearchParams } from "@/lib/search-params"

/** The heading names the current view and counts what is in it. */
export async function PageHeader({
  valuesPromise,
}: {
  valuesPromise: Promise<EventSearchParams>
}) {
  const values = await valuesPromise
  const count = await countUpcomingEvents(toEventFilter(values))

  return (
    <SiteHeader
      title={values.mode === "map" ? copy.map.heading : copy.feed.heading}
      subtitle={copy.map.countLabel(count)}
    />
  )
}
