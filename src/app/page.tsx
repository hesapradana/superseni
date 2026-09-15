import { Suspense } from "react"

import { BottomBar } from "@/components/layout/bottom-bar"
import { PosterSchedule } from "@/components/posters/poster-schedule"
import { PosterWallSkeleton } from "@/components/posters/poster-wall-skeleton"

/**
 * Explore: the poster wall and nothing else — no search, no chips, no fade at
 * the top. A poster already says what, where and when.
 *
 * The map and the list are switched off, not deleted: their components are
 * still in the tree, just no longer routed to. Old links that carry
 * `?mode=map` or `?mode=feed` land here and see the wall.
 *
 * 12px above the first poster, the same as its sides, plus the notch.
 */
export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col pt-[calc(0.75rem+env(safe-area-inset-top))]">
      <Suspense fallback={<PosterWallSkeleton />}>
        <PosterSchedule />
      </Suspense>

      <BottomBar />
    </div>
  )
}
