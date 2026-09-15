import Image from "next/image"
import Link from "next/link"

import type { PosterWithDetails } from "@/data/types"
import { formatPosterAlt } from "@/lib/presenters"
import { cn } from "@/lib/utils"

/**
 * Just the poster. No chip, no title: a poster already says what, where and
 * when, in the group's own hand, and anything laid over it would cover exactly
 * that.
 *
 * The box is sized by the wall to the poster's own ratio, so `object-cover`
 * here never actually cuts anything — it only absorbs sub-pixel rounding.
 *
 * There is no "cancelled" plate any more: a poster carries no status of its
 * own. Viewers judge it by who uploaded it and where it came from.
 */
export function PosterTile({
  poster,
  sizes,
  style,
  eager,
}: {
  poster: PosterWithDetails
  sizes: string
  style: React.CSSProperties
  /** On the first screen: load now rather than when scrolled near. */
  eager: boolean
}) {
  return (
    <Link
      href={`/poster/${poster.id}`}
      style={style}
      className={cn(
        "relative isolate block min-w-0 overflow-hidden rounded-lg bg-muted",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      )}
    >
      <Image
        src={poster.imageUrl}
        alt={formatPosterAlt(poster)}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        className="object-cover"
      />
    </Link>
  )
}
