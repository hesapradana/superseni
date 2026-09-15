import { TEMANGGUNG_REGENCY_ID } from "@/data/constants"
import type {
  Event,
  EventPerformerWithDetails,
  EventType,
  EventWithDetails,
  PosterWithDetails,
  Region,
  RegionWithPath,
  Source,
  Visibility,
} from "@/data/types"
import {
  copy,
  performerRoleLabels,
  regionLevelLabels,
  sessionLabels,
  sourceTypeLabels,
} from "@/lib/copy"
import { formatDayLabel, formatFullDate, formatTimeAgo, hoursSince } from "@/lib/date"

/**
 * Raw rows in, display-ready values out.
 *
 * Two rules live here and nowhere else:
 *  - how an incomplete time is worded, so no invented clock is ever shown
 *  - what a `limited` or `private` event is allowed to reveal
 *
 * Scattering `if (visibility === ...)` across components is how a leak happens.
 */

/* -------------------------------------------------------------------------- */
/* Time                                                                        */
/* -------------------------------------------------------------------------- */

type TimeShape = Pick<Event, "session" | "startTime" | "timePrecision">

/**
 * `exact`       → "19:30"
 * `approximate` → "Malam (±19:30)"
 * `tentative`   → "Malam"
 *
 * When the source never said a clock time, none is shown. Ever.
 */
export function formatEventTime(event: TimeShape): string {
  const sessionLabel = event.session ? sessionLabels[event.session] : null

  if (event.timePrecision === "exact" && event.startTime) {
    return event.startTime
  }

  if (event.timePrecision === "approximate" && event.startTime) {
    const approx = `${copy.event.approximatePrefix}${event.startTime}`
    return sessionLabel ? `${sessionLabel} (${approx})` : approx
  }

  return sessionLabel ?? copy.event.timeUnknown
}

/**
 * "Hari ini · 20:00", "Besok · Malam", "Sab, 12 Sep · 20:00".
 *
 * The day used to come from the heading above each group. With one flat list
 * it has to travel on the tile, or tonight and next week look alike.
 */
export function formatEventWhen(
  event: Pick<Event, "date" | "session" | "startTime" | "timePrecision">
): string {
  return `${formatDayLabel(event.date)} · ${formatEventTime(event)}`
}

/* -------------------------------------------------------------------------- */
/* Location & privacy                                                          */
/* -------------------------------------------------------------------------- */

/** Outermost first (regency → hamlet), the region itself last. */
function chainOf(region: RegionWithPath): Region[] {
  const { ancestors, ...self } = region
  return [...ancestors, self]
}

function districtOf(region: RegionWithPath): Region | null {
  return chainOf(region).find((step) => step.level === "district") ?? null
}

/**
 * `public`  → "Dusun Seganen, Campursari, Ngadirejo"
 * `limited` → "Ngadirejo"
 * `private` → null, and nothing may be rendered in its place
 */
export function formatLocation(
  region: RegionWithPath,
  visibility: Visibility
): string | null {
  if (visibility === "private") return null

  if (visibility === "limited") {
    const district = districtOf(region)
    return district ? district.name : null
  }

  const parts = chainOf(region)
    .filter((step) => step.level !== "regency")
    .reverse()
    .map((step) =>
      step.level === "hamlet"
        ? `${regionLevelLabels.hamlet} ${step.name}`
        : step.name
    )

  return parts.length > 0 ? parts.join(", ") : region.name
}

/**
 * A map link only exists for a fully public event whose own region carries
 * coordinates. An ancestor's coordinates are deliberately not borrowed: a
 * district centroid would send someone to the wrong place with full confidence.
 */
export function formatMapsUrl(
  region: RegionWithPath,
  visibility: Visibility
): string | null {
  if (visibility !== "public") return null
  if (region.latitude === null || region.longitude === null) return null
  return `https://www.google.com/maps/search/?api=1&query=${region.latitude},${region.longitude}`
}

/**
 * A `limited` event is a private household that agreed to be listed, not to be
 * visited. The organiser is the household, so the name goes with the address.
 */
export function formatOrganizer(
  organizerName: string | null,
  visibility: Visibility
): string | null {
  if (visibility !== "public") return null
  return organizerName
}

export type EventImageView = {
  src: string
  alt: string
  width: number
  height: number
}

/** Used when a row predates the size columns; a wrong ratio only costs layout. */
const FALLBACK_IMAGE_SIZE = { width: 1200, height: 675 }

/**
 * An image is shown only for a fully public event.
 *
 * A hajatan poster normally prints the household name and the street address,
 * and a photo taken in someone's yard identifies the yard. Everything the
 * `limited` rule strips from the text would walk straight back in through the
 * picture, so the picture goes too.
 */
export function formatEventImage(
  event: Pick<
    Event,
    "imageUrl" | "imageAlt" | "imageWidth" | "imageHeight" | "visibility"
  >,
  fallbackAlt: string
): EventImageView | null {
  if (event.visibility !== "public") return null
  if (!event.imageUrl) return null

  return {
    src: event.imageUrl,
    alt: event.imageAlt ?? fallbackAlt,
    width: event.imageWidth ?? FALLBACK_IMAGE_SIZE.width,
    height: event.imageHeight ?? FALLBACK_IMAGE_SIZE.height,
  }
}

/* -------------------------------------------------------------------------- */
/* Freshness                                                                   */
/* -------------------------------------------------------------------------- */

export type FreshnessTone = "fresh" | "aging" | "stale" | "unknown"

export type FreshnessView = {
  label: string
  tone: FreshnessTone
  isStale: boolean
}

const AGING_AFTER_HOURS = 24
const STALE_AFTER_HOURS = 24 * 7

/** The site's whole claim is recency, so the age of a record is front matter. */
export function formatFreshness(lastVerifiedAt: string | null): FreshnessView {
  if (!lastVerifiedAt) {
    return { label: copy.freshness.never, tone: "unknown", isStale: true }
  }

  const hours = hoursSince(lastVerifiedAt)
  const tone: FreshnessTone =
    hours < AGING_AFTER_HOURS ? "fresh" : hours < STALE_AFTER_HOURS ? "aging" : "stale"

  return {
    label: copy.freshness.updated(formatTimeAgo(lastVerifiedAt)),
    tone,
    isStale: tone === "stale",
  }
}

/* -------------------------------------------------------------------------- */
/* Performers                                                                  */
/* -------------------------------------------------------------------------- */

export type PerformerView = {
  id: string
  name: string
  roleLabel: string
  isHost: boolean
  isGuestStar: boolean
  /** Joined art form names, or the raw text captured at input time. */
  artForms: string | null
  /** Set only when the group comes from outside Temanggung. */
  originLabel: string | null
  /** Art forms and origin as one line, ready to render. */
  detail: string | null
}

const ROLE_RANK: Record<EventPerformerWithDetails["role"], number> = {
  host: 0,
  supporting: 1,
  guest_star: 2,
}

const DETAIL_SEPARATOR = " · "

/**
 * Joins the parts of a one-line summary, skipping whatever is missing, so the
 * separator never dangles when a value is absent. The only place that
 * separator is written down.
 */
export function joinLine(parts: (string | null | undefined)[]): string | null {
  return joinDetails(parts.map((part) => part ?? null))
}

function joinDetails(parts: (string | null)[]): string | null {
  const kept = parts.filter((part): part is string => Boolean(part))
  return kept.length > 0 ? kept.join(DETAIL_SEPARATOR) : null
}

function originOf(performer: EventPerformerWithDetails): string | null {
  const region = performer.group.region
  if (!region) return null
  const root = region.ancestors[0] ?? region
  if (root.id === TEMANGGUNG_REGENCY_ID) return null
  return copy.event.guestFrom(root.name)
}

/** Host first, then the rest in recorded order. Guest stars stay flagged. */
export function formatPerformers(
  performers: EventPerformerWithDetails[]
): PerformerView[] {
  return [...performers]
    .sort((a, b) => ROLE_RANK[a.role] - ROLE_RANK[b.role] || a.sortOrder - b.sortOrder)
    .map((performer) => {
      const names = performer.artForms.map((form) => form.name)
      const artForms = names.length > 0 ? names.join(", ") : performer.rawArtForm
      const originLabel = originOf(performer)

      return {
        id: performer.id,
        name: performer.group.officialName,
        roleLabel: performerRoleLabels[performer.role],
        isHost: performer.role === "host",
        isGuestStar: performer.role === "guest_star",
        artForms,
        originLabel,
        detail: joinDetails([artForms, originLabel]),
      }
    })
}

/* -------------------------------------------------------------------------- */
/* Title                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Many records genuinely have no title — a poster just says the village and the
 * date. Build something honest rather than showing an empty heading.
 */
/**
 * Hamlet names repeat across districts — there is a "Krajan" in Gesing and
 * another in Campursari — so a generated title carries the district with it.
 * A title gets shared on its own; it has to stand up without the card around it.
 */
function titlePlace(visibility: Visibility, region: RegionWithPath): string | null {
  if (visibility === "private") return null

  const district = districtOf(region)
  if (visibility === "limited") return district?.name ?? null
  if (!district || district.id === region.id) return district?.name ?? region.name

  return copy.event.placeWithDistrict(region.name, district.name)
}

export function formatEventTitle(
  event: Pick<Event, "title" | "visibility">,
  eventType: EventType,
  region: RegionWithPath
): string {
  if (event.title) return event.title

  const place = titlePlace(event.visibility, region)

  return place
    ? copy.event.titleFallback(eventType.name, place)
    : copy.event.untitled
}

/* -------------------------------------------------------------------------- */
/* Grouping                                                                    */
/* -------------------------------------------------------------------------- */

export type EventDayGroup = {
  date: string
  events: EventWithDetails[]
}

/**
 * The list is read one day at a time, so the day is the grouping unit even
 * though the rows arrive flat. Input order is preserved inside each day.
 */
export function groupEventsByDate(events: EventWithDetails[]): EventDayGroup[] {
  const groups: EventDayGroup[] = []

  for (const event of events) {
    const last = groups.at(-1)
    if (last && last.date === event.date) {
      last.events.push(event)
    } else {
      groups.push({ date: event.date, events: [event] })
    }
  }

  return groups
}

/* -------------------------------------------------------------------------- */
/* Sources                                                                     */
/* -------------------------------------------------------------------------- */

export type SourceView = {
  id: string
  label: string
  detail: string | null
}

/** Newest first is already the repository's order; only wording happens here. */
export function formatSources(sources: Source[]): SourceView[] {
  return sources.map((source) => ({
    id: source.id,
    label: sourceTypeLabels[source.type],
    detail: joinDetails([formatTimeAgo(source.recordedAt), source.note]),
  }))
}

/* -------------------------------------------------------------------------- */
/* Posters                                                                     */
/* -------------------------------------------------------------------------- */

/** A name for the poster when one is needed in words: the tab title, a link. */
export function formatPosterTitle(poster: PosterWithDetails): string {
  return poster.caption ?? poster.group?.officialName ?? copy.poster.untitled
}

export function formatPosterAlt(poster: PosterWithDetails): string {
  if (poster.imageAlt) return poster.imageAlt
  if (poster.caption) return poster.caption
  if (poster.group) return copy.poster.altWithGroup(poster.group.officialName)
  return copy.poster.untitled
}

/** "Rabu, 16 September 2026 · 16:00", or null when no date was given. */
export function formatPosterDate(poster: PosterWithDetails): string | null {
  if (!poster.performanceDate) return null
  return joinLine([formatFullDate(poster.performanceDate), poster.startTime])
}

export function formatPosterUploadedAgo(poster: PosterWithDetails): string {
  return copy.poster.uploadedAgo(formatTimeAgo(poster.createdAt))
}

const PLATFORM_BY_HOST: Record<string, string> = {
  "tiktok.com": "TikTok",
  "instagram.com": "Instagram",
  "facebook.com": "Facebook",
  "fb.com": "Facebook",
  "youtube.com": "YouTube",
  "youtu.be": "YouTube",
  "x.com": "X",
  "twitter.com": "X",
}

export type PosterSourceView = { href: string; platform: string }

/**
 * The platform is read from the link rather than stored, so it can never
 * disagree with where the link actually goes. Unknown sites show their host.
 */
export function formatPosterSource(poster: PosterWithDetails): PosterSourceView | null {
  if (!poster.sourceUrl) return null
  const host = new URL(poster.sourceUrl).hostname.replace(/^(www\.|m\.)/, "")
  const known = Object.entries(PLATFORM_BY_HOST).find(
    ([domain]) => host === domain || host.endsWith(`.${domain}`)
  )
  return { href: poster.sourceUrl, platform: known?.[1] ?? host }
}

