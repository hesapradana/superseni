import type { z } from "zod"

import type * as s from "@/data/schemas"

/**
 * Every domain type is inferred. Nothing here is hand-written.
 */

export type RegionLevel = z.infer<typeof s.regionLevelSchema>
export type Session = z.infer<typeof s.sessionSchema>
export type TimePrecision = z.infer<typeof s.timePrecisionSchema>
export type Visibility = z.infer<typeof s.visibilitySchema>
export type DataStatus = z.infer<typeof s.dataStatusSchema>
export type EventStatus = z.infer<typeof s.eventStatusSchema>
export type PerformerRole = z.infer<typeof s.performerRoleSchema>
export type SourceType = z.infer<typeof s.sourceTypeSchema>
export type UserRole = z.infer<typeof s.userRoleSchema>
export type PosterStatus = z.infer<typeof s.posterStatusSchema>

export type Region = z.infer<typeof s.regionSchema>
export type Group = z.infer<typeof s.groupSchema>
export type GroupAlias = z.infer<typeof s.groupAliasSchema>
export type ArtForm = z.infer<typeof s.artFormSchema>
export type ArtFormAlias = z.infer<typeof s.artFormAliasSchema>
export type EventType = z.infer<typeof s.eventTypeSchema>
export type Event = z.infer<typeof s.eventSchema>
export type EventPerformer = z.infer<typeof s.eventPerformerSchema>
export type PerformanceArtForm = z.infer<typeof s.performanceArtFormSchema>
export type Source = z.infer<typeof s.sourceSchema>
export type User = z.infer<typeof s.userSchema>
export type GroupManager = z.infer<typeof s.groupManagerSchema>
export type Poster = z.infer<typeof s.posterSchema>

export type RegionWithPath = z.infer<typeof s.regionWithPathSchema>
export type GroupWithDetails = z.infer<typeof s.groupWithDetailsSchema>
export type EventPerformerWithDetails = z.infer<
  typeof s.eventPerformerWithDetailsSchema
>
export type EventWithDetails = z.infer<typeof s.eventWithDetailsSchema>
export type MapDistrict = z.infer<typeof s.mapDistrictSchema>
export type PublicUser = z.infer<typeof s.publicUserSchema>
export type PosterGroup = z.infer<typeof s.posterGroupSchema>
export type PosterWithDetails = z.infer<typeof s.posterWithDetailsSchema>

export type EventFilter = z.infer<typeof s.eventFilterSchema>
export type AdminEventFilter = z.infer<typeof s.adminEventFilterSchema>
