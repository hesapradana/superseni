"use client"

import { DownloadIcon, MoreHorizontalIcon } from "lucide-react"

import { PosterShareDrawer } from "@/components/posters/poster-share-drawer"
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GlassButton } from "@/components/ui/glasscn/glass-button"
import { GlassDropdownMenuContent } from "@/components/ui/glasscn/glass-dropdown-menu"
import { copy } from "@/lib/copy"

/**
 * Pinterest's action row, with what exists today: share, and a "…" menu for
 * the rest. Like, comment and save need viewer accounts, which do not exist
 * yet, so they are left out rather than drawn as buttons that do nothing.
 */
export function PosterActions({
  title,
  imageUrl,
  fileName,
}: {
  title: string
  imageUrl: string
  fileName: string
}) {
  /* Works for files served by this site. Once posters are hosted on another
     domain the browser ignores `download` and opens the image instead. */
  function download() {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = fileName
    link.click()
  }

  return (
    <div className="flex items-center gap-2">
      <PosterShareDrawer title={title} />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <GlassButton
              glassVariant="liquid-refract"
              size="icon-lg"
              aria-label={copy.poster.moreOptions}
              className="size-11 rounded-full"
            />
          }
        >
          <MoreHorizontalIcon className="size-5" />
        </DropdownMenuTrigger>
        <GlassDropdownMenuContent side="top" align="start" className="w-44">
          <DropdownMenuItem onClick={download}>
            <DownloadIcon />
            {copy.poster.download}
          </DropdownMenuItem>
        </GlassDropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
