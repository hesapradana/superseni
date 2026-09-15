import Link from "next/link"

import { SiteMark } from "@/components/layout/site-mark"
import { copy } from "@/lib/copy"

/**
 * The page's one heading. It names the view rather than the site — the site's
 * identity is the mark on the right, which is also the way home.
 *
 * Three stacked title blocks (site name, mode name, count) said the same thing
 * three times; this is all of them collapsed into one.
 */
export function SiteHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <header className="mx-auto flex w-full max-w-3xl items-start justify-between gap-4 px-4 pt-6 pb-2">
      <div className="min-w-0">
        <h1 className="font-heading text-3xl leading-tight font-light tracking-[-0.045em]">
          {title}
        </h1>
        {/* Inherits the page colour: muted ink on the feed, translucent white
            over the map photograph. */}
        <p className="mt-1 text-xs tracking-[0.14em] uppercase opacity-60">
          {subtitle}
        </p>
      </div>

      <Link href="/" aria-label={copy.site.name} className="shrink-0">
        <SiteMark />
      </Link>
    </header>
  )
}
