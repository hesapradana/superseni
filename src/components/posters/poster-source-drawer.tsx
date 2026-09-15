"use client"

import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react"
import { useState } from "react"

import { PlatformIcon } from "@/components/posters/platform-icon"
import { PosterDrawer } from "@/components/posters/poster-drawer"
import { Button } from "@/components/ui/button"
import { copy } from "@/lib/copy"
import type { PosterSourceView } from "@/lib/presenters"

/**
 * "Lihat di": every place the poster was posted, so a viewer can check it on
 * whichever platform they use. Each row opens the post in a new tab.
 */
export function PosterSourceDrawer({ sources }: { sources: PosterSourceView[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="h-11 gap-1.5 rounded-full px-5 text-sm font-medium"
      >
        {copy.poster.viewOn}
        <ChevronDownIcon className="size-4" />
      </Button>

      <PosterDrawer open={open} onOpenChange={setOpen} title={copy.poster.viewOnTitle}>
        <ul className="flex flex-col px-2">
          {sources.map((source) => (
            <li key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 rounded-xl px-2 py-2.5 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <PlatformIcon platform={source.platform} className="size-12 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{source.name}</span>
                  <span className="block truncate text-sm text-muted-foreground">{source.detail}</span>
                </span>
                <ArrowUpRightIcon className="size-5 shrink-0 text-muted-foreground" />
              </a>
            </li>
          ))}
        </ul>
      </PosterDrawer>
    </>
  )
}
