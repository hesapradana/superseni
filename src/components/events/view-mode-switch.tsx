"use client"

import { useQueryStates } from "nuqs"

import {
  GlassToggleGroup,
  GlassToggleGroupItem,
} from "@/components/ui/glasscn/glass-toggle-group"
import { copy } from "@/lib/copy"
import { VIEW_MODES, eventSearchParams } from "@/lib/search-params"

const LABELS: Record<(typeof VIEW_MODES)[number], string> = {
  map: copy.map.modeMap,
  feed: copy.map.modeFeed,
  poster: copy.map.modePoster,
}

/**
 * Tabs, not two buttons: one rounded puck slides between them, so only the
 * active one carries a shape. glasscn's toggle group does that animation and
 * the radio-group semantics that come with it.
 *
 * The mode lives in the URL like every other bit of state, so a shared link
 * carries the view it was shared from.
 */
export function ViewModeSwitch() {
  const [{ mode }, setFilters] = useQueryStates(eventSearchParams, { shallow: false })

  return (
    <GlassToggleGroup
      value={mode}
      onValueChange={(next) => setFilters({ mode: next as (typeof VIEW_MODES)[number] })}
      aria-label={copy.map.modeLabel}
      /* `h-14` lands on LiquidGlass's inline-block wrapper, which does not
         hand it down, so the height has to come from the items themselves. */
      className="p-1"
    >
      {VIEW_MODES.map((value) => (
        <GlassToggleGroupItem key={value} value={value} className="h-12 px-5 text-[15px]">
          {LABELS[value]}
        </GlassToggleGroupItem>
      ))}
    </GlassToggleGroup>
  )
}
