/**
 * Closed value sets owned by the system, not by the field.
 * Kept as readonly tuples so Zod can derive the schema and TypeScript can
 * derive the union from a single declaration.
 */

export const REGION_LEVELS = ["regency", "district", "village", "hamlet"] as const

export const SESSIONS = ["morning", "afternoon", "evening", "night"] as const

export const TIME_PRECISIONS = ["exact", "approximate", "tentative"] as const

export const VISIBILITIES = ["public", "limited", "private"] as const

export const DATA_STATUSES = ["draft", "verified", "rejected"] as const

export const EVENT_STATUSES = [
  "scheduled",
  "ongoing",
  "completed",
  "cancelled",
  "postponed",
] as const

export const PERFORMER_ROLES = ["host", "supporting", "guest_star"] as const

export const SOURCE_TYPES = [
  "tiktok",
  "instagram",
  "facebook",
  "whatsapp",
  "poster",
  "word_of_mouth",
  "official",
] as const

export const USER_ROLES = ["admin", "group_manager"] as const

/**
 * A poster is either up or taken down. There is no review state: posters are
 * not checked before they appear, only removed when someone reports them.
 */
export const POSTER_STATUSES = ["published", "removed"] as const
