import { ArrowUpRightIcon } from "lucide-react"
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
 * The single next thing, given the whole width. The map answers "where"; this
 * answers "and what is actually next", which is the question the site exists
 * for and the one a spread of pins cannot answer.
 */
export function FeaturedEvent({ event }: { event: EventWithDetails }) {
  const title = formatEventTitle(event, event.eventType, event.region)
  const image = formatEventImage(event, title)
  const location = formatLocation(event.region, event.visibility)

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "relative isolate mx-4 block aspect-[16/9] overflow-hidden rounded-2xl",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        !image && "glass-dark text-on-photo"
      )}
    >
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 42rem"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-photo-ink/25" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-photo-ink/90 via-photo-ink/45 to-transparent" />
        </>
      ) : null}

      <div
        className={cn(
          "relative flex h-full flex-col p-3.5",
          "text-on-photo"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="glass-dark text-on-photo rounded-full px-2.5 py-1 text-[11px] font-medium">
            {formatEventWhen(event)}
          </span>
          <span
            aria-hidden
            className="text-photo-ink flex size-8 shrink-0 items-center justify-center rounded-full bg-white"
          >
            <ArrowUpRightIcon className="size-4" />
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-0.5">
          <h3 className="font-heading line-clamp-2 text-xl leading-tight font-light tracking-[-0.035em]">
            {title}
          </h3>
          <p
            className={cn(
              "text-[11px] tracking-[0.14em] uppercase",
              "opacity-75"
            )}
          >
            {location ?? copy.event.locationHidden}
          </p>
        </div>
      </div>
    </Link>
  )
}
