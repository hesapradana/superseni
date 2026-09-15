"use client"

import { usePathname, useRouter } from "next/navigation"

import {
  GlassToggleGroup,
  GlassToggleGroupItem,
} from "@/components/ui/glasscn/glass-toggle-group"
import { copy } from "@/lib/copy"

const DESTINATIONS = [
  { value: "explore", href: "/", label: copy.nav.explore },
  { value: "upload", href: "/upload", label: copy.nav.upload },
] as const

/**
 * The app's two places. Same glasscn toggle group as the old Peta / Daftar /
 * Poster switch, so the puck still slides — but each tab is now a route, not
 * a view of one page, and the active one is read from the path.
 */
export function AppNav() {
  const pathname = usePathname()
  const router = useRouter()
  const current =
    DESTINATIONS.find((destination) => destination.href === pathname) ??
    DESTINATIONS[0]

  return (
    <GlassToggleGroup
      value={current.value}
      onValueChange={(next) => {
        const destination = DESTINATIONS.find((item) => item.value === next)
        if (destination) router.push(destination.href)
      }}
      aria-label={copy.nav.label}
      className="p-1"
    >
      {DESTINATIONS.map((destination) => (
        <GlassToggleGroupItem
          key={destination.value}
          value={destination.value}
          className="h-12 px-6 text-[15px]"
        >
          {destination.label}
        </GlassToggleGroupItem>
      ))}
    </GlassToggleGroup>
  )
}
