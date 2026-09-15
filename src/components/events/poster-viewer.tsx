"use client"

import { XIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { copy } from "@/lib/copy"
import { GLASS_DISC } from "@/lib/glass"

/**
 * Opens the poster at full size.
 *
 * The caller supplies the visible trigger through `render`, because where it
 * belongs depends on the page — a labelled pill in the top bar here, something
 * else elsewhere.
 *
 * The dialog only mounts when opened, so the full-resolution file is not
 * downloaded until someone asks for it — this runs on phone data.
 */
export function PosterViewer({
  src,
  alt,
  render,
}: {
  src: string
  alt: string
  render: React.ReactElement
}) {
  return (
    <Dialog>
      <DialogTrigger render={render} />

      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 top-0 left-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center rounded-none bg-foreground p-0 sm:max-w-none"
      >
        {/* The dialog needs a name; the poster's own alt text is that name. */}
        <DialogTitle className="sr-only">{alt}</DialogTitle>

        <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" />

        <DialogClose
          aria-label={copy.common.close}
          render={
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-4 right-4 z-10 ${GLASS_DISC}`}
            />
          }
        >
          <XIcon />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
