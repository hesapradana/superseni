import { formatISO } from "date-fns"

import { EXPLORE_UNDATED_DAYS, TEMANGGUNG_REGENCY_ID } from "@/data/constants"
import * as db from "@/data/mock"
import type {
  AdminEventFilter,
  ArtForm,
  Event,
  EventFilter,
  EventPerformerWithDetails,
  EventType,
  EventWithDetails,
  GroupWithDetails,
  Region,
  RegionLevel,
  MapDistrict,
  Poster,
  PosterWithDetails,
  RegionWithPath,
} from "@/data/types"

/**
 * The only module that knows where data comes from.
 *
 * Every function is `async` even though the mock is synchronous: when this is
 * swapped for a real API, the signatures must not change. Nothing outside this
 * file may import `@/data/mock`.
 */

/** Artificial latency so loading states are actually exercised. */
const MIN_LATENCY_MS = 200
const MAX_LATENCY_MS = 400

function latency(): Promise<void> {
  const ms = MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* -------------------------------------------------------------------------- */
/* Indexes                                                                     */
/* -------------------------------------------------------------------------- */

const regionById = new Map(db.regions.map((r) => [r.id, r]))
const groupById = new Map(db.groups.map((g) => [g.id, g]))
const artFormById = new Map(db.artForms.map((a) => [a.id, a]))
const eventTypeById = new Map(db.eventTypes.map((t) => [t.id, t]))

const aliasesByGroupId = new Map<string, string[]>()
for (const alias of db.groupAliases) {
  const list = aliasesByGroupId.get(alias.groupId) ?? []
  list.push(alias.alias)
  aliasesByGroupId.set(alias.groupId, list)
}

const artFormIdsByPerformerId = new Map<string, string[]>()
for (const link of db.performanceArtForms) {
  const list = artFormIdsByPerformerId.get(link.eventPerformerId) ?? []
  list.push(link.artFormId)
  artFormIdsByPerformerId.set(link.eventPerformerId, list)
}

const performersByEventId = new Map<string, typeof db.eventPerformers>()
for (const performer of db.eventPerformers) {
  const list = performersByEventId.get(performer.eventId) ?? []
  list.push(performer)
  performersByEventId.set(performer.eventId, list)
}

const sourcesByEventId = new Map<string, typeof db.sources>()
for (const source of db.sources) {
  const list = sourcesByEventId.get(source.eventId) ?? []
  list.push(source)
  sourcesByEventId.set(source.eventId, list)
}

const childDatesByParentId = new Map<string, string[]>()
for (const event of db.events) {
  if (!event.parentId) continue
  const list = childDatesByParentId.get(event.parentId) ?? []
  list.push(event.date)
  childDatesByParentId.set(event.parentId, list)
}

/**
 * Rows that only exist to group a multi-day run. They carry no schedule of
 * their own, so they never appear in a day listing.
 */
const umbrellaEventIds = new Set(childDatesByParentId.keys())

/* -------------------------------------------------------------------------- */
/* Join helpers                                                                */
/* -------------------------------------------------------------------------- */

function resolveRegion(regionId: string): RegionWithPath {
  const region = regionById.get(regionId)
  if (!region) {
    throw new Error(`Region "${regionId}" not found`)
  }
  const ancestors: Region[] = []
  let cursor = region.parentId ? regionById.get(region.parentId) : undefined
  while (cursor) {
    ancestors.unshift(cursor)
    cursor = cursor.parentId ? regionById.get(cursor.parentId) : undefined
  }
  return { ...region, ancestors }
}

function resolveGroup(groupId: string): GroupWithDetails {
  const group = groupById.get(groupId)
  if (!group) {
    throw new Error(`Group "${groupId}" not found`)
  }
  return {
    ...group,
    aliases: aliasesByGroupId.get(group.id) ?? [],
    region: regionById.has(group.regionId) ? resolveRegion(group.regionId) : null,
  }
}

function resolvePerformers(eventId: string): EventPerformerWithDetails[] {
  const performers = performersByEventId.get(eventId) ?? []
  return [...performers]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((performer) => ({
      ...performer,
      group: resolveGroup(performer.groupId),
      artForms: (artFormIdsByPerformerId.get(performer.id) ?? [])
        .map((id) => artFormById.get(id))
        .filter((form): form is ArtForm => form !== undefined),
    }))
}

function seriesDatesFor(event: Event): string[] {
  const seriesId = event.parentId ?? event.id
  const dates = childDatesByParentId.get(seriesId)
  if (!dates) return []
  return [...dates].sort()
}

function resolveEvent(event: Event): EventWithDetails {
  const eventType = eventTypeById.get(event.eventTypeId)
  if (!eventType) {
    throw new Error(`Event type "${event.eventTypeId}" not found`)
  }
  return {
    ...event,
    eventType,
    region: resolveRegion(event.regionId),
    performers: resolvePerformers(event.id),
    sources: [...(sourcesByEventId.get(event.id) ?? [])].sort((a, b) =>
      b.recordedAt.localeCompare(a.recordedAt)
    ),
    seriesDates: seriesDatesFor(event),
  }
}

/* -------------------------------------------------------------------------- */
/* Filtering & ordering                                                        */
/* -------------------------------------------------------------------------- */

const SESSION_ORDER: Record<string, number> = {
  morning: 0,
  afternoon: 1,
  evening: 2,
  night: 3,
}

function today(): string {
  return formatISO(new Date(), { representation: "date" })
}

function regionPathIds(regionId: string): string[] {
  const ids: string[] = []
  let cursor = regionById.get(regionId)
  while (cursor) {
    ids.push(cursor.id)
    cursor = cursor.parentId ? regionById.get(cursor.parentId) : undefined
  }
  return ids
}

function normalize(value: string): string {
  return value.toLowerCase().trim()
}

function groupMatchesQuery(groupId: string, query: string): boolean {
  const group = groupById.get(groupId)
  if (!group) return false
  const haystack = [group.officialName, ...(aliasesByGroupId.get(groupId) ?? [])]
  return haystack.some((name) => normalize(name).includes(query))
}

function matchesFilter(event: Event, filter: EventFilter): boolean {
  if (filter.from && event.date < filter.from) return false
  if (filter.to && event.date > filter.to) return false
  if (filter.eventTypeId && event.eventTypeId !== filter.eventTypeId) return false
  if (filter.districtId && !regionPathIds(event.regionId).includes(filter.districtId)) {
    return false
  }

  const performers = performersByEventId.get(event.id) ?? []

  if (filter.groupId && !performers.some((p) => p.groupId === filter.groupId)) {
    return false
  }
  if (
    filter.artFormId &&
    !performers.some((p) =>
      (artFormIdsByPerformerId.get(p.id) ?? []).includes(filter.artFormId as string)
    )
  ) {
    return false
  }

  const query = filter.query ? normalize(filter.query) : ""
  if (query && !performers.some((p) => groupMatchesQuery(p.groupId, query))) {
    return false
  }

  return true
}

function compareEvents(a: Event, b: Event): number {
  if (a.date !== b.date) return a.date.localeCompare(b.date)
  const sessionA = a.session ? SESSION_ORDER[a.session] : 99
  const sessionB = b.session ? SESSION_ORDER[b.session] : 99
  if (sessionA !== sessionB) return sessionA - sessionB
  const timeA = a.startTime ?? "99:99"
  const timeB = b.startTime ?? "99:99"
  if (timeA !== timeB) return timeA.localeCompare(timeB)
  return a.slug.localeCompare(b.slug)
}

/**
 * What the public site is allowed to see at all. Applied before any user
 * filter so a crafted URL cannot widen it.
 */
function isPubliclyListable(event: Event): boolean {
  if (umbrellaEventIds.has(event.id)) return false
  if (event.visibility === "private") return false
  if (event.dataStatus !== "verified") return false
  return true
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Everything still to come, nearest first.
 *
 * No upper bound by default: the feed shows one flat list and each tile carries
 * its own day, so a range is something the filter asks for rather than
 * something the page assumes.
 */
export async function listUpcomingEvents(
  filter: EventFilter = {}
): Promise<EventWithDetails[]> {
  await latency()
  const from = filter.from ?? today()
  const effective: EventFilter = { ...filter, from }

  return db.events
    .filter(isPubliclyListable)
    .filter((event) => matchesFilter(event, effective))
    .sort(compareEvents)
    .map(resolveEvent)
}

export async function getEventBySlug(slug: string): Promise<EventWithDetails | null> {
  await latency()
  const event = db.events.find((candidate) => candidate.slug === slug)
  if (!event || !isPubliclyListable(event)) return null
  return resolveEvent(event)
}

export async function listRegions(level?: RegionLevel): Promise<Region[]> {
  await latency()
  return db.regions
    .filter((region) => (level ? region.level === level : true))
    .sort((a, b) => a.name.localeCompare(b.name, "id"))
}

/** Districts of Temanggung only — the filter never offers other regencies. */
export async function listDistricts(): Promise<Region[]> {
  await latency()
  return db.regions
    .filter((region) => region.level === "district" && region.parentId === TEMANGGUNG_REGENCY_ID)
    .sort((a, b) => a.name.localeCompare(b.name, "id"))
}

export async function listGroups(): Promise<GroupWithDetails[]> {
  await latency()
  return db.groups
    .map((group) => resolveGroup(group.id))
    .sort((a, b) => a.officialName.localeCompare(b.officialName, "id"))
}

/** How many events the current filter would show. Used by the page heading. */
export async function countUpcomingEvents(filter: EventFilter = {}): Promise<number> {
  await latency()
  const from = filter.from ?? today()
  const effective: EventFilter = { ...filter, from }

  return db.events
    .filter(isPubliclyListable)
    .filter((event) => matchesFilter(event, effective)).length
}

/**
 * Districts of Temanggung with how many events in the window fall in each.
 *
 * The chips show these counts, and a chip that would return nothing is worth
 * hiding rather than letting someone tap into an empty list.
 */
export async function listDistrictCounts(
  filter: EventFilter = {}
): Promise<{ district: Region; count: number }[]> {
  await latency()
  const from = filter.from ?? today()

  /* Count against everything except the district filter itself, or selecting
     one chip would drop every other chip to zero. */
  const scope: EventFilter = { ...filter, districtId: undefined, from }
  const visible = db.events
    .filter(isPubliclyListable)
    .filter((event) => matchesFilter(event, scope))

  const counts = new Map<string, number>()
  for (const event of visible) {
    const districtId = regionPathIds(event.regionId).find(
      (id) => regionById.get(id)?.level === "district"
    )
    if (!districtId) continue
    counts.set(districtId, (counts.get(districtId) ?? 0) + 1)
  }

  return db.regions
    .filter((r) => r.level === "district" && r.parentId === TEMANGGUNG_REGENCY_ID)
    .sort((a, b) => a.name.localeCompare(b.name, "id"))
    .map((district) => ({ district, count: counts.get(district.id) ?? 0 }))
}

/**
 * One entry per district that has something coming up, with a representative
 * event for the pin's picture and link.
 *
 * Districts without coordinates are dropped: an unplaceable pin has nowhere
 * honest to sit. Events the public rules hide never reach here at all, so a
 * hajatan can never be pinned.
 */
export async function listMapDistricts(
  filter: EventFilter = {}
): Promise<MapDistrict[]> {
  await latency()
  const from = filter.from ?? today()
  const effective: EventFilter = { ...filter, from }

  const byDistrict = new Map<string, Event[]>()
  for (const event of db.events) {
    if (!isPubliclyListable(event)) continue
    if (!matchesFilter(event, effective)) continue

    const districtId = regionPathIds(event.regionId).find(
      (id) => regionById.get(id)?.level === "district"
    )
    if (!districtId) continue

    const list = byDistrict.get(districtId) ?? []
    list.push(event)
    byDistrict.set(districtId, list)
  }

  /*
   * Every kecamatan of Temanggung is returned, not only the ones with events.
   * A map of the regency that shows half of it is a worse map — the quiet
   * districts are information too.
   */
  return db.regions
    .filter((r) => r.level === "district" && r.parentId === TEMANGGUNG_REGENCY_ID)
    .filter((r) => r.latitude !== null && r.longitude !== null)
    .map((district) => {
      const events = byDistrict.get(district.id) ?? []
      const sorted = [...events].sort(compareEvents)

      return {
        district,
        count: sorted.length,
        soonest: sorted[0] ? resolveEvent(sorted[0]) : null,
      }
    })
    .sort((a, b) => a.district.name.localeCompare(b.district.name, "id"))
}

export async function listArtForms(): Promise<ArtForm[]> {
  await latency()
  return db.artForms
    .filter((form) => form.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function listEventTypes(): Promise<EventType[]> {
  await latency()
  return [...db.eventTypes].sort((a, b) => a.sortOrder - b.sortOrder)
}

/** Matches the official name and every recorded alias. */
export async function searchGroups(query: string): Promise<GroupWithDetails[]> {
  await latency()
  const needle = normalize(query)
  if (!needle) return []
  return db.groups
    .filter((group) => groupMatchesQuery(group.id, needle))
    .map((group) => resolveGroup(group.id))
    .sort((a, b) => a.officialName.localeCompare(b.officialName, "id"))
}

/**
 * Admin listing: everything, including drafts, private events and past dates.
 * No default date window — the admin needs the whole record.
 */
export async function listAdminEvents(
  filter: AdminEventFilter = {}
): Promise<EventWithDetails[]> {
  await latency()
  return db.events
    .filter((event) => (filter.dataStatus ? event.dataStatus === filter.dataStatus : true))
    .filter((event) => matchesFilter(event, filter))
    .sort((a, b) => -compareEvents(a, b))
    .map(resolveEvent)
}

/* -------------------------------------------------------------------------- */
/* Posters                                                                     */
/* -------------------------------------------------------------------------- */

function resolvePoster(poster: Poster): PosterWithDetails {
  const uploader = db.users.find((user) => user.id === poster.uploadedBy)
  if (!uploader) throw new Error(`Poster ${poster.id} has no uploader`)
  const group = poster.groupId ? groupById.get(poster.groupId) : undefined

  return {
    ...poster,
    uploader: { id: uploader.id, name: uploader.name },
    group: group ? { id: group.id, officialName: group.officialName, slug: group.slug } : null,
  }
}

/**
 * Whether a published poster belongs on Explore right now. A dated poster
 * stays through its performance day; an undated one for
 * `EXPLORE_UNDATED_DAYS` after upload. Neither is deleted when it leaves.
 */
function isOnExplore(poster: Poster, now: Date): boolean {
  if (poster.status !== "published") return false
  if (poster.performanceDate !== null) return poster.performanceDate >= today()
  const cutoff = now.getTime() - EXPLORE_UNDATED_DAYS * 24 * 60 * 60 * 1000
  return new Date(poster.createdAt).getTime() > cutoff
}

/**
 * Dated posters first, soonest first; a set start time before none, and a
 * source link — something a viewer can check — before none. Undated posters
 * follow, newest upload first.
 */
function compareExplore(a: Poster, b: Poster): number {
  if (a.performanceDate && b.performanceDate) {
    if (a.performanceDate !== b.performanceDate) {
      return a.performanceDate.localeCompare(b.performanceDate)
    }
    if (a.startTime !== b.startTime) {
      if (a.startTime === null) return 1
      if (b.startTime === null) return -1
      return a.startTime.localeCompare(b.startTime)
    }
    return Number(b.sourceUrls.length > 0) - Number(a.sourceUrls.length > 0)
  }
  if (a.performanceDate) return -1
  if (b.performanceDate) return 1
  return b.createdAt.localeCompare(a.createdAt)
}

export async function listExplorePosters(): Promise<PosterWithDetails[]> {
  await latency()
  const now = new Date()
  return db.posters
    .filter((poster) => isOnExplore(poster, now))
    .sort(compareExplore)
    .map(resolvePoster)
}

/**
 * Any published poster, on Explore or not: a link shared last month must keep
 * working. A removed poster is gone.
 */
export async function getPosterById(id: string): Promise<PosterWithDetails | null> {
  await latency()
  const poster = db.posters.find((candidate) => candidate.id === id)
  if (!poster || poster.status !== "published") return null
  return resolvePoster(poster)
}

/**
 * What to show under a poster: the rest of Explore, the same group's posters
 * first. Pinterest ranks this by similarity; with no image analysis here, the
 * group is the one honest signal of "related".
 */
export async function listRelatedPosters(posterId: string): Promise<PosterWithDetails[]> {
  await latency()
  const current = db.posters.find((poster) => poster.id === posterId)
  const now = new Date()
  const others = db.posters
    .filter((poster) => poster.id !== posterId && isOnExplore(poster, now))
    .sort(compareExplore)
  const sameGroup = (poster: Poster) =>
    current?.groupId != null && poster.groupId === current.groupId
  return [...others.filter(sameGroup), ...others.filter((poster) => !sameGroup(poster))].map(
    resolvePoster
  )
}

