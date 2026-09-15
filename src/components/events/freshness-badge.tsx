import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import type { FreshnessView } from "@/lib/presenters"

/**
 * Recency is the whole point of the site, so a record that has not been checked
 * in a week has to read differently from one checked this morning. With no
 * colour to spend, a stale record is promoted to a badge instead of tinted.
 *
 * `inverse` is for the floating layer over a photo, where the ordinary muted
 * grey would disappear into the image.
 */
export function FreshnessNote({
  freshness,
  inverse = false,
  className,
}: {
  freshness: FreshnessView
  inverse?: boolean
  className?: string
}) {
  if (freshness.isStale) {
    return (
      <Badge variant={inverse ? "outline" : "default"} className={className}>
        {freshness.label}
      </Badge>
    )
  }

  return (
    <p
      className={cn(
        "text-xs",
        inverse ? "text-primary-foreground/75" : "text-muted-foreground",
        className
      )}
    >
      {freshness.label}
    </p>
  )
}
