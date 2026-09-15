import Image from "next/image"

import { copy } from "@/lib/copy"

/**
 * The site mark. Full colour on purpose — a logo is the one thing exempt from
 * the three-colour palette; forcing it into ink would make it someone else's
 * logo. Rendered on the transparent ground, no frame around it.
 */
export function SiteMark() {
  return (
    <Image
      src="/logo/universal.png"
      alt={copy.site.name}
      /* Rendered at 48px; the source is 1254px, so ask for the small variant
         rather than letting Next serve a 3840px one over a slow connection. */
      width={48}
      height={48}
      loading="eager"
      className="size-12 shrink-0 object-contain"
    />
  )
}
