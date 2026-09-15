import { z } from "zod"

import { TEMANGGUNG_REGENCY_ID } from "@/data/constants"

import {
  artFormAliasSchema,
  artFormSchema,
  eventPerformerSchema,
  eventSchema,
  eventTypeSchema,
  groupAliasSchema,
  groupManagerSchema,
  groupSchema,
  performanceArtFormSchema,
  posterSchema,
  regionSchema,
  sourceSchema,
  userSchema,
} from "@/data/schemas"

import { mockArtFormAliases, mockArtForms } from "@/data/mock/art-forms"
import { mockEventTypes } from "@/data/mock/event-types"
import { mockEvents } from "@/data/mock/events"
import { mockGroupAliases, mockGroups } from "@/data/mock/groups"
import { mockEventPerformers, mockPerformanceArtForms } from "@/data/mock/performances"
import { mockPosters } from "@/data/mock/posters"
import { mockRegions } from "@/data/mock/regions"
import { mockSources } from "@/data/mock/sources"
import { mockGroupManagers, mockUsers } from "@/data/mock/users"

/**
 * Mock rows are parsed against the schemas at module load. A typo becomes a
 * loud startup error instead of a silent `undefined` somewhere in the UI.
 */
function parseAll<T extends z.ZodType>(
  label: string,
  schema: T,
  rows: readonly unknown[]
): z.infer<T>[] {
  const result = z.array(schema).safeParse(rows)
  if (!result.success) {
    throw new Error(
      `Mock data "${label}" does not match its schema:\n${z.prettifyError(result.error)}`
    )
  }
  return result.data
}

export const regions = parseAll("regions", regionSchema, mockRegions)
export const groups = parseAll("groups", groupSchema, mockGroups)
export const groupAliases = parseAll("groupAliases", groupAliasSchema, mockGroupAliases)
export const artForms = parseAll("artForms", artFormSchema, mockArtForms)
export const artFormAliases = parseAll("artFormAliases", artFormAliasSchema, mockArtFormAliases)
export const eventTypes = parseAll("eventTypes", eventTypeSchema, mockEventTypes)
export const events = parseAll("events", eventSchema, mockEvents)
export const eventPerformers = parseAll("eventPerformers", eventPerformerSchema, mockEventPerformers)
export const performanceArtForms = parseAll("performanceArtForms", performanceArtFormSchema, mockPerformanceArtForms)
export const sources = parseAll("sources", sourceSchema, mockSources)
export const users = parseAll("users", userSchema, mockUsers)
export const groupManagers = parseAll("groupManagers", groupManagerSchema, mockGroupManagers)
export const posters = parseAll("posters", posterSchema, mockPosters)

/* -------------------------------------------------------------------------- */
/* Referential integrity — the checks a database would do for us               */
/* -------------------------------------------------------------------------- */

const problems: string[] = []

function requireRef(
  label: string,
  value: string | null,
  known: ReadonlySet<string>,
  context: string
) {
  if (value !== null && !known.has(value)) {
    problems.push(`${label}: unknown id "${value}" (${context})`)
  }
}

const regionIds = new Set(regions.map((r) => r.id))
const groupIds = new Set(groups.map((g) => g.id))
const artFormIds = new Set(artForms.map((a) => a.id))
const eventTypeIds = new Set(eventTypes.map((t) => t.id))
const eventIds = new Set(events.map((e) => e.id))
const performerIds = new Set(eventPerformers.map((p) => p.id))
const userIds = new Set(users.map((u) => u.id))

/** Walks up to the root of the region tree. */
function rootOf(regionId: string): string {
  const byId = new Map(regions.map((r) => [r.id, r]))
  let current = byId.get(regionId)
  while (current?.parentId) {
    current = byId.get(current.parentId)
  }
  return current?.id ?? regionId
}

for (const region of regions) {
  requireRef("regions.parentId", region.parentId, regionIds, region.id)
}
for (const group of groups) {
  requireRef("groups.regionId", group.regionId, regionIds, group.id)
}
for (const alias of groupAliases) {
  requireRef("groupAliases.groupId", alias.groupId, groupIds, alias.id)
}
for (const alias of artFormAliases) {
  requireRef("artFormAliases.artFormId", alias.artFormId, artFormIds, alias.id)
}
for (const event of events) {
  requireRef("events.parentId", event.parentId, eventIds, event.id)
  requireRef("events.eventTypeId", event.eventTypeId, eventTypeIds, event.id)
  requireRef("events.regionId", event.regionId, regionIds, event.id)
  requireRef("events.createdBy", event.createdBy, userIds, event.id)
  if (regionIds.has(event.regionId) && rootOf(event.regionId) !== TEMANGGUNG_REGENCY_ID) {
    problems.push(`events.regionId: "${event.id}" is not inside Temanggung`)
  }
}
for (const performer of eventPerformers) {
  requireRef("eventPerformers.eventId", performer.eventId, eventIds, performer.id)
  requireRef("eventPerformers.groupId", performer.groupId, groupIds, performer.id)
}
for (const link of performanceArtForms) {
  requireRef("performanceArtForms.eventPerformerId", link.eventPerformerId, performerIds, link.artFormId)
  requireRef("performanceArtForms.artFormId", link.artFormId, artFormIds, link.eventPerformerId)
}
for (const source of sources) {
  requireRef("sources.eventId", source.eventId, eventIds, source.id)
}
for (const manager of groupManagers) {
  requireRef("groupManagers.userId", manager.userId, userIds, manager.groupId)
  requireRef("groupManagers.groupId", manager.groupId, groupIds, manager.userId)
}

const userById = new Map(users.map((u) => [u.id, u]))
const managedGroupIds = new Map<string, Set<string>>()
for (const manager of groupManagers) {
  const set = managedGroupIds.get(manager.userId) ?? new Set<string>()
  set.add(manager.groupId)
  managedGroupIds.set(manager.userId, set)
}

for (const poster of posters) {
  requireRef("posters.uploadedBy", poster.uploadedBy, userIds, poster.id)
  requireRef("posters.groupId", poster.groupId, groupIds, poster.id)
  if (new Set(poster.sourceUrls).size !== poster.sourceUrls.length) {
    problems.push(`posters.sourceUrls: "${poster.id}" lists the same link twice`)
  }
  if (poster.startTime !== null && poster.performanceDate === null) {
    problems.push(`posters.startTime: "${poster.id}" has a time but no date`)
  }

  /* The temporary upload rule: admins upload for anyone, a manager only for
     their own group. Remove this block when uploads open to everyone. */
  const uploader = userById.get(poster.uploadedBy)
  if (uploader && !uploader.isActive) {
    problems.push(`posters.uploadedBy: "${poster.id}" was uploaded by inactive user "${uploader.id}"`)
  }
  if (uploader?.role === "group_manager") {
    const own = managedGroupIds.get(uploader.id) ?? new Set<string>()
    if (poster.groupId === null || !own.has(poster.groupId)) {
      problems.push(`posters.groupId: "${poster.id}" — manager "${uploader.id}" may only upload for their own group`)
    }
  }
}

function requireUnique(label: string, values: readonly string[]) {
  const seen = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) problems.push(`${label}: duplicate "${value}"`)
    seen.add(value)
  }
}

requireUnique("events.slug", events.map((e) => e.slug))
requireUnique("groups.slug", groups.map((g) => g.slug))
requireUnique("artForms.slug", artForms.map((a) => a.slug))
requireUnique("eventTypes.slug", eventTypes.map((t) => t.slug))
requireUnique("posters.id", posters.map((p) => p.id))

if (problems.length > 0) {
  throw new Error(`Mock data integrity check failed:\n- ${problems.join("\n- ")}`)
}
