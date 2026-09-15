import { AppNav } from "@/components/layout/app-nav"
import { RevealOnScroll } from "@/components/layout/reveal-on-scroll"
import { ThemeToggle } from "@/components/layout/theme-toggle"

/* 16px clear of the home indicator, not 16px from the screen edge. */
const RAIL =
  "pointer-events-none fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4"

/**
 * Pinned to the bottom of the screen, not to the end of the page.
 *
 * `sticky` put it wherever the content happened to end, which on the map — a
 * page that fits in one screen — left it floating in the middle. `fixed` keeps
 * both controls in the same place whether the page scrolls or not.
 *
 * `pointer-events-none` on the rail keeps the gap between them clickable
 * through to whatever is underneath.
 *
 * `hideUntilScroll` is for pages whose first screen is one big picture — a
 * poster's page — where the bar would otherwise take the room the picture
 * needs. It comes back as soon as the page scrolls.
 */
export function BottomBar({ hideUntilScroll = false }: { hideUntilScroll?: boolean }) {
  const controls = (
    <>
      <div className="pointer-events-auto">
        <ThemeToggle />
      </div>
      <div className="pointer-events-auto">
        <AppNav />
      </div>
    </>
  )

  return hideUntilScroll ? (
    <RevealOnScroll className={RAIL}>{controls}</RevealOnScroll>
  ) : (
    <div className={RAIL}>{controls}</div>
  )
}
