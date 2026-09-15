import {
  createLoader,
  parseAsString,
  parseAsStringLiteral,
  type inferParserType,
} from "nuqs/server"

import { eventFilterSchema } from "@/data/schemas"
import type { EventFilter } from "@/data/types"

/**
 * Filters live in the URL, not in component state.
 *
 * Information here spreads by people forwarding links on WhatsApp, so a
 * filtered view has to survive being pasted into a chat. The same parser map is
 * used on the server (page prop) and on the client (`useQueryStates`), so the
 * two can never drift.
 *
 * Keys stay English like every other identifier; the values in them are ids and
 * ISO dates, never prose.
 */
/** The ways of looking at the same list. */
export const VIEW_MODES = ["map", "feed", "poster"] as const

export const eventSearchParams = {
  mode: parseAsStringLiteral(VIEW_MODES).withDefault("map"),
  district: parseAsString.withDefault(""),
  artForm: parseAsString.withDefault(""),
  eventType: parseAsString.withDefault(""),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  q: parseAsString.withDefault(""),
}

export type EventSearchParams = inferParserType<typeof eventSearchParams>

export const loadEventSearchParams = createLoader(eventSearchParams)

export const emptyEventSearchParams: EventSearchParams = {
  mode: "map",
  district: "",
  artForm: "",
  eventType: "",
  from: "",
  to: "",
  q: "",
}

/** `mode` is a view, not a filter — it must never reach the repository. */
function blankToUndefined(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

/**
 * URL values are untrusted. Anything that does not survive the filter schema is
 * dropped rather than handed to the repository.
 */
export function toEventFilter(values: EventSearchParams): EventFilter {
  const candidate = {
    from: blankToUndefined(values.from),
    to: blankToUndefined(values.to),
    districtId: blankToUndefined(values.district),
    artFormId: blankToUndefined(values.artForm),
    eventTypeId: blankToUndefined(values.eventType),
    query: blankToUndefined(values.q),
  }

  const parsed = eventFilterSchema.safeParse(candidate)
  return parsed.success ? parsed.data : {}
}

export function countActiveFilters(values: EventSearchParams): number {
  /* `mode` is a view, not a filter, so it never counts as one. */
  return Object.entries(values)
    .filter(([key]) => key !== "mode")
    .filter(([, value]) => value.trim().length > 0).length
}
