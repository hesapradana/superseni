"use client"

import { XIcon } from "lucide-react"
import Image from "next/image"

import { GlassButton } from "@/components/ui/glasscn/glass-button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { copy } from "@/lib/copy"

/**
 * The whole poster, on its own, after a tap — Pinterest's second step.
 *
 * The trigger covers the cropped preview it sits on. The dialog mounts only
 * when opened, so the full-size file is not fetched until someone asks.
 *
 * The ground is `bg-photo-ink`, not `bg-foreground`: foreground turns light
 * in dark mode, and a poster should always sit on black.
 */
export function PosterLightbox({ src, alt }: { src: string; alt: string }) {
  return (
    <Dialog>
      <DialogTrigger
        aria-label={copy.poster.viewFull}
        className="absolute inset-0 cursor-zoom-in focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      />

      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 top-0 left-0 flex h-svh w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center rounded-none bg-photo-ink p-0 ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>

        <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" />

        <div className="absolute top-[calc(0.75rem+env(safe-area-inset-top))] right-3 z-10">
          <DialogClose
            render={
              <GlassButton
                glassVariant="liquid-refract"
                size="icon-lg"
                aria-label={copy.common.close}
                className="text-on-photo size-11 rounded-full"
              />
            }
          >
            <XIcon className="size-5" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
