import Link from "next/link"

import { cn } from "cn"
import { GLASS_SURFACE } from "@/lib/glass"

/**
 * The wide pill action: label centred, a solid disc carrying the icon pinned to
 * the right edge. Used for "Lihat detail" on a card and for the map link on the
 * detail page, so the shape is defined once here.
 *
 * `stretched` grows the hit area to the nearest positioned ancestor, which is
 * how a whole card becomes clickable while only one link exists in the markup.
 */
export function ActionPill({
  href,
  label,
  icon,
  tone = "muted",
  external = false,
  stretched = false,
  className,
}: {
  href: string
  label: string
  icon: React.ReactNode
  tone?: "glass" | "muted"
  external?: boolean
  stretched?: boolean
  className?: string
}) {
  const content = (
    <>
      <span className="flex-1 text-center">{label}</span>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          tone === "glass"
            ? "bg-card text-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {icon}
      </span>
    </>
  )

  const shape = cn(
    "flex h-12 w-full items-center rounded-full pr-1.5 pl-5 text-sm font-medium transition-colors",
    tone === "glass"
      ? `${GLASS_SURFACE} hover:bg-card/25`
      : "bg-muted text-foreground hover:bg-accent",
    stretched && "after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none",
    className
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={shape}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={shape}>
      {content}
    </Link>
  )
}
