import { ImageOffIcon } from "lucide-react"
import { connection } from "next/server"

import { PosterWall } from "@/components/posters/poster-wall"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { listExplorePosters } from "@/data/repository"
import { copy } from "@/lib/copy"

/**
 * Every poster that belongs on Explore right now — which ones, and in what
 * order, is decided in the repository. No filter: the page has no controls to
 * show or clear one (see `HomePage`).
 */
export async function PosterSchedule() {
  /* "Upcoming" means upcoming today. Without this the page no longer reads the
     URL, so Next prerenders it at build time and the wall freezes on the
     build date — last week's events would stay up until the next deploy. */
  await connection()
  const posters = await listExplorePosters()

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
