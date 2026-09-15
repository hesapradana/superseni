"use client"

import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { GlassButton } from "@/components/ui/glasscn/glass-button"
import { copy } from "@/lib/copy"
import { hasInAppHistory } from "@/lib/navigation-history"

/**
 * Back to where the viewer came from, the way Pinterest does it.
 *
 * A link to "/" pushed a fresh Explore page and dropped the viewer at the top
 * of the wall. Going back through history instead lets Next reuse the page it
 * already rendered, scroll position included. With nothing in-app to go back
 * to — the poster was opened from a shared link — it goes to Explore.
 *
 * The same clear liquid pane and size as the theme toggle and the Explore /
 * Upload switch. Its arrow turns white or ink to suit the poster behind it —
 * something every glass button now does (see `GlassButton`).
 */
export function PosterBackButton() {
  const router = useRouter()

  return (
    <GlassButton
      glassVariant="liquid-refract"
      size="icon-lg"
      aria-label={copy.poster.back}
      onClick={() => (hasInAppHistory() ? router.back() : router.push("/"))}
      className="size-14 rounded-full"
    >
      <ArrowLeftIcon className="size-5" />
    </GlassButton>
  )
}
