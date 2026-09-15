import { AlertCircleIcon, ClockIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { EventStatus } from "@/data/types"
import { copy } from "@/lib/copy"

/**
 * Only the two states that would make someone travel for nothing get a banner.
 * `completed` and `ongoing` are conveyed by position in the list instead.
 *
 * Cancelled uses the solid ink variant rather than a red one: the palette has
 * three colours and none of them is a warning colour, so the emphasis has to
 * come from inversion.
 *
 * `inverse` flips that again for the floating layer over a photo, where the
 * scrim is already ink and a solid ink banner would disappear into it.
 */
export function EventStatusBanner({
  status,
  inverse = false,
}: {
  status: EventStatus
  inverse?: boolean
}) {
  if (status === "cancelled") {
    return (
      <Alert variant={inverse ? "emphasis-inverse" : "emphasis"}>
        <AlertCircleIcon />
        <AlertTitle>{copy.status.cancelledTitle}</AlertTitle>
        <AlertDescription>{copy.status.cancelledDescription}</AlertDescription>
      </Alert>
    )
  }

  if (status === "postponed") {
    return (
      <Alert variant={inverse ? "emphasis-inverse" : "default"}>
        <ClockIcon />
        <AlertTitle>{copy.status.postponedTitle}</AlertTitle>
        <AlertDescription>{copy.status.postponedDescription}</AlertDescription>
      </Alert>
    )
  }

  return null
}
