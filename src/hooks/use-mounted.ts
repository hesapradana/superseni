"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/**
 * False during the server render and the first client render, true afterwards.
 *
 * Written with `useSyncExternalStore` rather than the usual
 * `useState` + `useEffect(() => setMounted(true))`: React's own lint rule
 * rejects setting state from an effect, and this is the pattern it points to.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
