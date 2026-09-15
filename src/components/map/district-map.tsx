import Image from "next/image"
import Link from "next/link"

import type { MapDistrict } from "@/data/types"
import { cn } from "@/lib/utils"
import { copy } from "@/lib/copy"
import { formatEventImage, formatEventTitle } from "@/lib/presenters"

/**
 * The spread of what is coming up, placed by real coordinates.
 *
 * Deliberately not a map of roads and boundaries: no tile provider, no API key,
 * no per-hamlet coordinates to record at input time. What it claims is only
 * what it can back up — where in the regency things are happening, relative to
 * each other. District names are drawn because a scatter of photographs without
 * them says nothing.
 */

/*
 * A frame a little wider than the regency, so no pin sits on the edge.
 * Widened when all twenty kecamatan were added: Tretep reaches west to 110.005,
 * Pringsurat east to 110.265 and Bejen north to -7.124, all of which fell
 * outside the old frame.
 */
const BOUNDS = { north: -7.1, south: -7.41, west: 109.98, east: 110.29 }

/** Percentages, because the pins are positioned in the flow, not inside an SVG. */
function project(latitude: number, longitude: number) {
  return {
    left: ((longitude - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * 100,
    top: ((BOUNDS.north - latitude) / (BOUNDS.north - BOUNDS.south)) * 100,
  }
}

export function DistrictMap({ districts }: { districts: MapDistrict[] }) {
  if (districts.length === 0) {
    return (
      <div className="mx-4 flex h-full items-center justify-center p-8 text-center">
        <p className="text-sm opacity-70">{copy.map.empty}</p>
      </div>
    )
  }

  /*
   * Just a coordinate space — the picture behind it belongs to the page, not
   * to this box. No border, no rounding, no clipping: the pins sit on the
   * landscape rather than inside a window onto it.
   */
  return (
    /*
       Sized to the space it is given, not to the screen's width.
       `max-h-full` is what stops it pushing the page taller than one screen —
       with the ratio alone, a tall map on a short phone made the whole page
       scroll the moment it replaced the placeholder.

       `overflow-hidden` matters even though nothing looks clipped: pins are
       centred on their coordinate, so a kecamatan near the western or eastern
       edge hangs half its width — and its label — outside the frame, which
       widens the document and makes the page scroll sideways.
    */
    <div className="relative mx-auto aspect-[100/103] max-h-full w-full overflow-hidden">
      <Grid />

      {districts.map((entry) => {
        const { latitude, longitude } = entry.district
        if (latitude === null || longitude === null) return null
        const at = project(latitude, longitude)

        return (
          <Pin
            key={entry.district.id}
            entry={entry}
            style={{ left: `${at.left}%`, top: `${at.top}%` }}
          />
        )
      })}
    </div>
  )
}

/** Faint reference lines, so the pins read as placed rather than scattered. */
function Grid() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 103"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full text-on-photo/10"
    >
      {[20, 40, 60, 80].map((x) => (
        <line key={`v${x}`} x1={x} y1={0} x2={x} y2={103} stroke="currentColor" strokeWidth={0.4} />
      ))}
      {[21, 42, 62, 83].map((y) => (
        <line key={`h${y}`} x1={0} y1={y} x2={100} y2={y} stroke="currentColor" strokeWidth={0.4} />
      ))}
    </svg>
  )
}

function Pin({
  entry,
  style,
}: {
  entry: MapDistrict
  style: React.CSSProperties
}) {
  /* A kecamatan with nothing on is still part of the regency: it gets a mark,
     not a pin, and nothing to tap. Silence is information too. */
  if (!entry.soonest) {
    return (
      <span
        style={style}
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
      >
        <span className="size-2 rounded-full bg-on-photo/40" />
        <span className="text-on-photo/45 text-[9px] whitespace-nowrap">
          {entry.district.name}
        </span>
      </span>
    )
  }

  const title = formatEventTitle(
    entry.soonest,
    entry.soonest.eventType,
    entry.soonest.region
  )
  const image = formatEventImage(entry.soonest, title)

  /*
   * Bigger where more is happening — the one thing a spread should encode.
   * Sized against a 390px phone: at 80px a pin took a fifth of the screen's
   * width, which is what made neighbouring districts collide.
   */
  const size = entry.count >= 4 ? "size-12" : entry.count >= 2 ? "size-11" : "size-10"

  return (
    <Link
      href={`/?mode=feed&district=${entry.district.id}`}
      style={style}
      aria-label={copy.map.pinLabel(entry.district.name, entry.count)}
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 focus-visible:outline-none"
    >
      <span
        className={cn(
          "relative overflow-hidden rounded-full ring-1 ring-on-photo/70 transition-transform",
          "group-focus-visible:ring-ring hover:scale-105",
          size
        )}
      >
        {image ? (
          <Image
            src={image.src}
            alt=""
            aria-hidden
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <span className="glass text-on-photo flex h-full w-full items-center justify-center text-xs font-medium">
            {entry.count}
          </span>
        )}
      </span>

      <span className="glass text-on-photo rounded-full px-1.5 py-0.5 text-[9px] font-medium whitespace-nowrap">
        {entry.district.name}
        <span className="opacity-70"> · {entry.count}</span>
      </span>
    </Link>
  )
}
