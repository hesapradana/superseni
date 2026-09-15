import { AlertCircleIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import type { EventWithDetails } from "@/data/types"
import { copy } from "@/lib/copy"
import type { EventImageView } from "@/lib/presenters"
import { cn } from "@/lib/utils"

export type Poster = { event: EventWithDetails; image: EventImageView }

/**
 * Just the poster. No chip, no title: a poster already says what, where and
 * when, in the group's own hand, and anything laid over it would cover exactly
 * that.
 *
 * The box is sized by the wall to the poster's own ratio, so `object-cover`
 * here never actually cuts anything — it only absorbs sub-pixel rounding.
 *
 * The one exception to "nothing on top" is cancellation. A poster keeps
 * announcing its date after the event is called off, so a cancelled one is
 * blurred and plated — the only case where the wall must contradict the
 * picture.
 */
export function PosterTile({
  poster,
  sizes,
  style,
  eager,
}: {
  poster: Poster
  sizes: string
  style: React.CSSProperties
  /** On the first screen: load now rather than when scrolled near. */
  eager: boolean
}) {
  const { event, image } = poster
  const isCancelled = event.eventStatus === "cancelled"

  return (
    <Link
      href={`/events/${event.slug}`}
      style={style}
      className={cn(
        "@container relative isolate block min-w-0 overflow-hidden rounded-lg bg-muted",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        className={cn("object-cover", isCancelled && "scale-105 blur-[3px]")}
      />

      {isCancelled ? (
        /* One line always: a landscape poster at half the screen is barely
           100px tall, and a plate that wraps there reads as a broken label.
           On the narrowest tiles (a 320px phone gives 144px) the icon goes
           and the type steps down, so the words still fit. */
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-photo-ink/30 p-2">
          <span className="glass-dark text-on-photo flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap @max-[160px]:px-2 @max-[160px]:text-[10px]">
            <AlertCircleIcon className="size-3.5 shrink-0 @max-[160px]:hidden" />
            {copy.status.cancelledTitle}
          </span>
        </div>
      ) : null}
    </Link>
  )
}
