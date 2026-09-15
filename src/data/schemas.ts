import { z } from "zod"

import {
  DATA_STATUSES,
  EVENT_STATUSES,
  PERFORMER_ROLES,
  REGION_LEVELS,
  SESSIONS,
  SOURCE_TYPES,
  TIME_PRECISIONS,
  USER_ROLES,
  VISIBILITIES,
} from "@/data/enums"

/**
 * Single source of truth for every domain shape.
 *
 * Types are inferred from these schemas in `types.ts`. Never declare a domain
 * `interface` or `type` by hand: two declarations always drift apart.
 */

const id = z.string().min(1)
const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case")
const clockTime = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "expected HH:mm")
const timestamp = z.iso.datetime()
const meta = z.record(z.string(), z.unknown()).default({})

/* -------------------------------------------------------------------------- */
/* Enums                                                                       */
/* -------------------------------------------------------------------------- */

export const regionLevelSchema = z.enum(REGION_LEVELS)
export const sessionSchema = z.enum(SESSIONS)
export const timePrecisionSchema = z.enum(TIME_PRECISIONS)
export const visibilitySchema = z.enum(VISIBILITIES)
export const dataStatusSchema = z.enum(DATA_STATUSES)
export const eventStatusSchema = z.enum(EVENT_STATUSES)
export const performerRoleSchema = z.enum(PERFORMER_ROLES)
export const sourceTypeSchema = z.enum(SOURCE_TYPES)
export const userRoleSchema = z.enum(USER_ROLES)

/* -------------------------------------------------------------------------- */
/* Base entities — one schema per table                                        */
/* -------------------------------------------------------------------------- */

export const regionSchema = z.object({
  id,
  parentId: id.nullable(),
  name: z.string().min(1),
  level: regionLevelSchema,
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
})

export const groupSchema = z.object({
  id,
  officialName: z.string().min(1),
  slug,
  regionId: id,
  contact: z.string().nullable(),
  meta,
})

export const groupAliasSchema = z.object({
  id,
  groupId: id,
  alias: z.string().min(1),
})

export const artFormSchema = z.object({
  id,
  slug,
  name: z.string().min(1),
  parentId: id.nullable(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
})

export const artFormAliasSchema = z.object({
  id,
  artFormId: id,
  alias: z.string().min(1),
})

export const eventTypeSchema = z.object({
  id,
  slug,
  name: z.string().min(1),
  sortOrder: z.number().int(),
})

export const eventSchema = z.object({
  id,
  parentId: id.nullable(),
  slug,
  title: z.string().nullable(),
  date: z.iso.date(),
  session: sessionSchema.nullable(),
  startTime: clockTime.nullable(),
  timePrecision: timePrecisionSchema,
  eventTypeId: id,
  regionId: id,
  rawAddress: z.string().nullable(),
  organizerName: z.string().nullable(),
  /**
   * One image per event — the poster, or a photo of the group on the night.
   * A path under `public/` for now; a full URL once images are hosted
   * elsewhere. Not `z.url()`, because both forms have to pass.
   *
   * Promote this to a `media` table only when a second image per event is
   * genuinely needed, not in anticipation of one.
   */
  imageUrl: z.string().min(1).nullable(),
  imageAlt: z.string().nullable(),
  /**
   * Pixel size of the image. Posters here are portrait 9:16 and photos are
   * landscape 16:9, so nothing can lay one out at its own proportions without
   * knowing them — and a guessed ratio makes the page jump when the file
   * arrives. An upload pipeline reads these off the file anyway.
   */
  imageWidth: z.number().int().positive().nullable(),
  imageHeight: z.number().int().positive().nullable(),
  visibility: visibilitySchema,
  dataStatus: dataStatusSchema,
  eventStatus: eventStatusSchema,
  lastVerifiedAt: timestamp.nullable(),
  createdBy: id,
  createdAt: timestamp,
  updatedAt: timestamp,
  meta,
})

export const eventPerformerSchema = z.object({
  id,
  eventId: id,
  groupId: id,
  role: performerRoleSchema,
  sortOrder: z.number().int(),
  rawArtForm: z.string().nullable(),
})

export const performanceArtFormSchema = z.object({
  eventPerformerId: id,
  artFormId: id,
})

export const sourceSchema = z.object({
  id,
  eventId: id,
  type: sourceTypeSchema,
  url: z.url().nullable(),
  note: z.string().nullable(),
  recordedAt: timestamp,
})

export const userSchema = z.object({
  id,
  name: z.string().min(1),
  contact: z.string().nullable(),
  role: userRoleSchema,
  isActive: z.boolean(),
})

export const groupManagerSchema = z.object({
  userId: id,
  groupId: id,
})

/* -------------------------------------------------------------------------- */
/* Read models — the shapes the repository hands to pages                      */
/*                                                                             */
/* A real backend resolves these joins. Pages must never assemble them.        */
/* -------------------------------------------------------------------------- */

/** A region plus its ancestors, ordered outermost first (regency → hamlet). */
export const regionWithPathSchema = regionSchema.extend({
  ancestors: z.array(regionSchema),
})

export const groupWithDetailsSchema = groupSchema.extend({
  aliases: z.array(z.string()),
  region: regionWithPathSchema.nullable(),
})

export const eventPerformerWithDetailsSchema = eventPerformerSchema.extend({
  group: groupWithDetailsSchema,
  artForms: z.array(artFormSchema),
})

export const eventWithDetailsSchema = eventSchema.extend({
  eventType: eventTypeSchema,
  region: regionWithPathSchema,
  performers: z.array(eventPerformerWithDetailsSchema),
  sources: z.array(sourceSchema),
  /** Sibling dates when this event belongs to a multi-day run. */
  seriesDates: z.array(z.iso.date()),
})

/** A district that has something coming up, ready to be placed on the map. */
export const mapDistrictSchema = z.object({
  district: regionSchema,
  count: z.number().int().nonnegative(),
  /* Null where the kecamatan exists but has nothing coming up. */
  soonest: z.lazy(() => eventWithDetailsSchema).nullable(),
})

/* -------------------------------------------------------------------------- */
/* Query input                                                                 */
/* -------------------------------------------------------------------------- */

export const eventFilterSchema = z.object({
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
  districtId: id.optional(),
  artFormId: id.optional(),
  eventTypeId: id.optional(),
  groupId: id.optional(),
  query: z.string().optional(),
})

export const adminEventFilterSchema = eventFilterSchema.extend({
  dataStatus: dataStatusSchema.optional(),
})
