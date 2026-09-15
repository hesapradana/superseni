"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

import { markInAppNavigation } from "@/lib/navigation-history"

/** Records the first path change after load. Renders nothing. */
export function NavigationTracker() {
  const pathname = usePathname()
  const first = useRef(pathname)

  useEffect(() => {
    if (pathname !== first.current) markInAppNavigation()
  }, [pathname])

  return null
}
