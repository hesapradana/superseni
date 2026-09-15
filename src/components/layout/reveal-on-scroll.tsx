"use client"

import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

/** How far the page must scroll before the hidden rail comes back. */
const REVEAL_AFTER_PX = 24

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true })
  return () => window.removeEventListener("scroll", onChange)
}

/**
 * A rail that stays out of the way until the page moves.
 *
 * Hidden at the top so the first screen belongs to the content; back as soon
 * as the viewer scrolls. `inert` while hidden, so an invisible button can be
 * neither tapped nor reached with the keyboard.
 */
export function RevealOnScroll({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  const revealed = useSyncExternalStore(
    subscribe,
    () => window.scrollY > REVEAL_AFTER_PX,
    () => false
  )

  return (
    <div
      inert={!revealed}
      className={cn(
        className,
        "transition-[opacity,translate] duration-300 ease-out",
        !revealed && "translate-y-4 opacity-0"
      )}
    >
      {children}
    </div>
  )
}
