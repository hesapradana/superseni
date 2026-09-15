import { AlertCircleIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import type { EventWithDetails } from "@/data/types"
import { cn } from "@/lib/utils"
import { copy } from "@/lib/copy"
import {
  formatEventImage,
  formatEventTitle,
  formatEventWhen,
  formatLocation,
} from "@/lib/presenters"

/**
 * A tile in the feed: picture, the time on a glass chip, and two lines of type.
 * Nothing else — the performers, the sources and the freshness stamp all live
 * on the detail page. A card that answers every question is a card nobody scans.
 *
 * Most events will never have a poster, so the no-image case is a first-class
 * layout rather than a gap: the tile becomes the glass pane itself.
 */
export function EventCard({
  event,
  eager = false,
  className,
}: {
  event: EventWithDetails
  /** On the first screen: load now rather than when scrolled near. */
  eager?: boolean
  className?: string
}) {
  const title = formatEventTitle(event, event.eventType, event.region)
  const image = formatEventImage(event, title)
  const when = formatEventWhen(event)
  const location = formatLocation(event.region, event.visibility)
  const isCancelled = event.eventStatus === "cancelled"

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "@container group relative isolate block shrink-0 overflow-hidden rounded-lg",
        /* One size everywhere: the row decides how many fit, never the tile. */
        "aspect-[3/4] w-[var(--tile)]",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        !image && "glass-dark text-on-photo",
        className
      )}
    >
      {image ? (
        <>
          <div className={cn("absolute inset-0", isCancelled && "scale-105 blur-[3px]")}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 50vw, 20rem"
              loading={eager ? "eager" : "lazy"}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-photo-ink/25" />
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-photo-ink/90 via-photo-ink/45 to-transparent" />
          </div>
        </>
      ) : null}

      <div
        className={cn(
          "text-on-photo relative flex h-full flex-col p-3",
          isCancelled && image && "blur-[2px]"
        )}
      >
        <span className="glass-dark text-on-photo w-fit rounded-full px-2.5 py-1 text-[10px] font-medium whitespace-nowrap tabular-nums">
          {when}
        </span>

        <div className="mt-auto flex flex-col gap-0.5">
          <h3 className="font-heading line-clamp-2 text-[14px] leading-tight font-medium tracking-[-0.02em]">
            {title}
          </h3>
          <p
            className={cn(
              "line-clamp-1 text-[9px] tracking-[0.12em] uppercase",
              "opacity-70"
            )}
          >
            {location ?? copy.event.locationHidden}
          </p>
        </div>
      </div>

      {isCancelled ? (
        /* Same plate as the Poster wall, and one line always. The old 12px
           plate needed 159px and wrapped even on a 179px tile; a plate that
           wraps reads as a broken label. On the narrowest tiles (a 320px phone
           gives 144px) the icon goes and the type steps down. */
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-2">
          <span className="glass-dark text-on-photo flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap @max-[160px]:px-2 @max-[160px]:text-[10px]">
            <AlertCircleIcon className="size-3.5 shrink-0 @max-[160px]:hidden" />
            {copy.status.cancelledTitle}
          </span>
        </div>
      ) : null}
    </Link>
  )
}
