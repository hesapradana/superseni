import { MessageSquareTextIcon, GlobeIcon } from "lucide-react"
import {
  siFacebook,
  siInstagram,
  siTelegram,
  siThreads,
  siTiktok,
  siWhatsapp,
  siX,
  siYoutube,
  type SimpleIcon,
} from "simple-icons"

import type { PlatformKey } from "@/lib/platforms"
import type { ShareTargetKey } from "@/lib/presenters"
import { cn } from "@/lib/utils"

const BRAND: Record<PlatformKey, SimpleIcon> = {
  tiktok: siTiktok,
  instagram: siInstagram,
  facebook: siFacebook,
  youtube: siYoutube,
  x: siX,
  threads: siThreads,
  whatsapp: siWhatsapp,
  telegram: siTelegram,
}

/**
 * A platform's mark in its own colour on a circle, like Pinterest's share
 * sheet. Logos come from Simple Icons (CC0). Brands whose colour is black get
 * a hairline ring, so the circle does not vanish on a dark background.
 */
export function PlatformIcon({
  platform,
  className,
}: {
  platform: PlatformKey | ShareTargetKey | null
  className?: string
}) {
  const brand = platform && platform !== "sms" ? BRAND[platform] : null

  if (!brand) {
    const Fallback = platform === "sms" ? MessageSquareTextIcon : GlobeIcon
    return (
      <span className={cn("flex items-center justify-center rounded-full bg-muted text-foreground", className)}>
        <Fallback className="size-[45%]" aria-hidden />
      </span>
    )
  }

  const dark = brand.hex === "000000"
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full",
        dark && "ring-1 ring-border",
        className
      )}
      style={{ backgroundColor: `#${brand.hex}` }}
    >
      <svg viewBox="0 0 24 24" className="size-[48%] fill-white" aria-hidden>
        <path d={brand.path} />
      </svg>
    </span>
  )
}
