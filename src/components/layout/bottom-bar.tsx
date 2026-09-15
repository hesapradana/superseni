import { ThemeToggle } from "@/components/layout/theme-toggle"
import { AppNav } from "@/components/layout/app-nav"

/**
 * Pinned to the bottom of the screen, not to the end of the page.
 *
 * `sticky` put it wherever the content happened to end, which on the map — a
 * page that fits in one screen — left it floating in the middle. `fixed` keeps
 * both controls in the same place whether the page scrolls or not.
 *
 * `pointer-events-none` on the rail keeps the gap between them clickable
 * through to whatever is underneath.
 */
export function BottomBar() {
  return (
    <div       /* 16px clear of the home indicator, not 16px from the screen edge. */
      className="pointer-events-none fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4">
      <div className="pointer-events-auto">
        <ThemeToggle />
      </div>
      <div className="pointer-events-auto">
        <AppNav />
      </div>
    </div>
  )
}
