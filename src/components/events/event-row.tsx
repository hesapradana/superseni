"use client"

import { useEffect, useRef } from "react"

/**
 * One horizontal run of tiles.
 *
 * A row wider than the screen rests centred rather than flush left, so it is
 * cut at both edges and can be dragged either way. The obvious way to write
 * that — a negative `margin-left` on the track — looks right and is a trap:
 * in a left-to-right document only overflow past the *right* edge becomes
 * scrollable, so everything pushed off to the left is unreachable. What is
 * cut there stays cut, however hard you swipe.
 *
 * Centring the scroll position instead puts the same pixels off-screen while
 * leaving both halves reachable. Half the overflow is exactly half a tile plus
 * half a gap, so the offset needs no constant of its own.
 */
export function EventRow({
  offset,
  gap,
  edge,
  children,
}: {
  offset: boolean
  gap: string
  edge: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !offset) return

    const centre = () => {
      element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2
    }

    centre()
    window.addEventListener("resize", centre)
    return () => window.removeEventListener("resize", centre)
  }, [offset])

  return (
    <div ref={ref} className="no-scrollbar overflow-x-auto">
      <div
        className="flex w-max"
        style={{ gap, paddingLeft: edge, paddingRight: edge }}
      >
        {children}
      </div>
    </div>
  )
}
