import { ImageOffIcon } from "lucide-react"
import { connection } from "next/server"

import { PosterWall } from "@/components/posters/poster-wall"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { listUpcomingEvents } from "@/data/repository"
import { copy } from "@/lib/copy"
import { formatEventImage, formatEventTitle } from "@/lib/presenters"

/**
 * Every upcoming event, narrowed to what can be shown as a picture. No filter:
 * the Poster page has no controls to show or clear one (see `HomePage`).
 *
 * The narrowing goes through `formatEventImage`, not a check on `imageUrl`, so
 * the privacy rule comes along for free: an event that is not public has no
 * image to show, and therefore no place on this wall.
 */
export async function PosterSchedule() {
  /* "Upcoming" means upcoming today. Without this the page no longer reads the
     URL, so Next prerenders it at build time and the wall freezes on the
     build date — last week's events would stay up until the next deploy. */
  await connection()
  const events = await listUpcomingEvents()

  const posters = events.flatMap((event) => {
    const title = formatEventTitle(event, event.eventType, event.region)
    const image = formatEventImage(event, title)
    return image ? [{ event, image }] : []
  })

  if (posters.length === 0) {
    return (
      <div className="px-4">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImageOffIcon />
            </EmptyMedia>
            <EmptyTitle>{copy.poster.emptyTitle}</EmptyTitle>
            <EmptyDescription>{copy.poster.emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return <PosterWall posters={posters} />
}
