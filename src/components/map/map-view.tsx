import { DistrictMap } from "@/components/map/district-map"
import { listMapDistricts } from "@/data/repository"
import { toEventFilter, type EventSearchParams } from "@/lib/search-params"

/**
 * Map mode: where things are, and nothing else.
 *
 * The heading above already says how many are coming up, and the pins say
 * where. A featured card underneath was answering "and what is next", which is
 * the question the Feed exists for.
 */
export async function MapView({
  valuesPromise,
}: {
  valuesPromise: Promise<EventSearchParams>
}) {
  const values = await valuesPromise
  const districts = await listMapDistricts(toEventFilter(values))

  return (
    <div className="flex h-full items-center justify-center px-4">
      <DistrictMap districts={districts} />
    </div>
  )
}
