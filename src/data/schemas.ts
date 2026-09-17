import { z } from "zod"

import { UPLOAD_MAX_SOURCES } from "@/data/constants"

import {
  DATA_STATUSES,
  EVENT_STATUSES,
  PERFORMER_ROLES,
  POSTER_STATUSES,
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
/**
 * Short and random, never derived from content: a poster may carry no title
 * at all, and a URL built from one breaks the day the title is corrected.
 * Random rather than sequential, so ids reveal neither how many posters exist
 * nor where to find the next one.
 */
const posterId = z.string().regex(/^[0-9a-z]{10}$/, "poster id must be 10 characters of 0-9a-z")
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
export const posterStatusSchema = z.enum(POSTER_STATUSES)

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

/**
 * The app's unit: an uploaded image, like a pin on Pinterest.
 *
 * Only the image is required. Everything else is optional because people
 * upload fast, and most posters already carry their details in the picture.
 * Detail that is filled in helps a poster rank higher; it is never demanded.
 *
 * Duplicates are allowed. Five people uploading the same poster give five
 * rows, and nothing tries to detect or merge them — viewers judge a poster by
 * who uploaded it and where it came from.
 *
 * Deliberately separate from `events`: a poster does not have to belong to a
 * known event, and one event may be announced by several posters.
 */
export const posterSchema = z.object({
  id: posterId,
  imageUrl: z.string().min(1),
  imageAlt: z.string().nullable(),
  /** Read off the file at upload; the wall lays posters out at their own shape. */
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),
  /** Shown publicly as the uploader. Kept apart from `groupId`: who uploaded is
      not the same question as whose performance it is. */
  uploadedBy: id,
  /** Where the poster was posted — TikTok, Instagram, Facebook… — so viewers
      can check it. A group often posts the same poster on several platforms,
      so this is a list. Empty is fine: posters passed around on WhatsApp have
      no public link. The platform is read from each URL, not stored. */
  sourceUrls: z.array(z.url({ protocol: /^https?$/ })).max(UPLOAD_MAX_SOURCES),
  groupId: id.nullable(),
  /** When set, the poster leaves Explore once the day has passed. */
  performanceDate: z.iso.date().nullable(),
  startTime: clockTime.nullable(),
  /** Free text, as the uploader writes it. */
  place: z.string().min(1).max(160).nullable(),
  caption: z.string().min(1).max(300).nullable(),
  status: posterStatusSchema,
  createdAt: timestamp,
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

/**
 * What an uploader sends besides the image. Picked from `posterSchema`, so the
 * form, the server action and the stored row can never disagree on a rule.
 * The image itself is checked separately: it arrives as a file, not a field.
 */
export const posterUploadSchema = posterSchema
  .pick({
    sourceUrls: true,
    groupId: true,
    performanceDate: true,
    startTime: true,
    place: true,
    caption: true,
  })
  .refine((upload) => upload.startTime === null || upload.performanceDate !== null, {
    path: ["startTime"],
    message: "startTime needs performanceDate",
  })
  .refine((upload) => new Set(upload.sourceUrls).size === upload.sourceUrls.length, {
    path: ["sourceUrls"],
    message: "duplicate source url",
  })

/** What the public may see of an account: never its contact details. */
export const publicUserSchema = userSchema.pick({ id: true, name: true })

/** What the public may see of a group on a poster. */
export const posterGroupSchema = groupSchema.pick({ id: true, officialName: true, slug: true })

export const posterWithDetailsSchema = posterSchema.extend({
  uploader: publicUserSchema,
  group: posterGroupSchema.nullable(),
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
