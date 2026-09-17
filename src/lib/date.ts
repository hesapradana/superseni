import {
  addDays,
  differenceInCalendarDays,
  format,
  formatDistanceToNowStrict,
  formatISO,
  parseISO,
} from "date-fns"
import { id } from "date-fns/locale"

import { copy } from "@/lib/copy"

/**
 * The only module that talks to date-fns directly. The Indonesian locale is
 * bound here once so no caller can forget it.
 */

/** `YYYY-MM-DD` for today, in the runtime's local time. */
export function todayIso(): string {
  return formatISO(new Date(), { representation: "date" })
}

/** `YYYY-MM-DD`, n days from today. */
export function isoDayFromToday(offset: number): string {
  return formatISO(addDays(new Date(), offset), { representation: "date" })
}

/** "Sabtu, 12 September 2026" */
export function formatFullDate(isoDate: string): string {
  return format(parseISO(isoDate), "EEEE, d MMMM yyyy", { locale: id })
}

/** "12 Sep 2026" — for tables and tight spaces. */
export function formatShortDate(isoDate: string): string {
  return format(parseISO(isoDate), "d MMM yyyy", { locale: id })
}

/**
 * "Hari ini" / "Besok" / "Kemarin", falling back to the full date.
 * Relative wording only reaches one day out: beyond that it stops helping.
 */
export function formatDayHeading(isoDate: string): string {
  const offset = differenceInCalendarDays(parseISO(isoDate), new Date())
  if (offset === 0) return copy.dayHeading.today
  if (offset === 1) return copy.dayHeading.tomorrow
  if (offset === -1) return copy.dayHeading.yesterday
  return formatFullDate(isoDate)
}

/** "Hari ini" / "Besok" / "Sab, 12 Sep" — short enough for a chip. */
export function formatDayLabel(isoDate: string): string {
  const offset = differenceInCalendarDays(parseISO(isoDate), new Date())
  if (offset === 0) return copy.dayHeading.today
  if (offset === 1) return copy.dayHeading.tomorrow
  return format(parseISO(isoDate), "EEE, d MMM", { locale: id })
}

/** True when the heading above is a word rather than a date. */
export function isRelativeDay(isoDate: string): boolean {
  const offset = differenceInCalendarDays(parseISO(isoDate), new Date())
  return offset === -1 || offset === 0 || offset === 1
}

/** "2 jam yang lalu", "3 hari yang lalu" */
export function formatTimeAgo(isoTimestamp: string): string {
  return formatDistanceToNowStrict(parseISO(isoTimestamp), {
    addSuffix: true,
    locale: id,
  })
}

/** Whole hours since the given timestamp. */
export function hoursSince(isoTimestamp: string): number {
  const elapsed = Date.now() - parseISO(isoTimestamp).getTime()
  return Math.floor(elapsed / 3_600_000)
}

/**
 * `YYYY-MM-DD` of the coming occurrence of a weekday (0 = Sunday), today
 * included — "Sabtu ini" on a Saturday is today.
 */
export function isoComingWeekday(weekday: number): string {
  const today = new Date()
  const offset = (weekday - today.getDay() + 7) % 7
  return formatISO(addDays(today, offset), { representation: "date" })
}

