"use client"

import { CheckIcon, LinkIcon, MoreHorizontalIcon, Share2Icon } from "lucide-react"
import { useState } from "react"

import { PlatformIcon } from "@/components/posters/platform-icon"
import { PosterDrawer } from "@/components/posters/poster-drawer"
import { Separator } from "@/components/ui/separator"
import { GlassButton } from "@/components/ui/glasscn/glass-button"
import { copy } from "@/lib/copy"
import { formatShareTargets } from "@/lib/presenters"

/**
 * "Bagikan ke": a row of platforms, then copy-link and the device's own share
 * sheet for everything else (Instagram and TikTok only take shares from their
 * apps, so they are reachable only through that sheet).
 */
export function PosterShareDrawer({ title }: { title: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  /* Read when the drawer opens, never during server render. */
  const [pageUrl, setPageUrl] = useState("")
  const [canUseDeviceShare, setCanUseDeviceShare] = useState(false)

  function openDrawer() {
    setPageUrl(window.location.href)
    setCanUseDeviceShare(typeof navigator.share === "function")
    setCopied(false)
    setOpen(true)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(pageUrl)
    setCopied(true)
  }

  async function deviceShare() {
    try {
      await navigator.share({ title, url: pageUrl })
      setOpen(false)
    } catch {
      /* Closing the device sheet rejects too; the drawer stays open. */
    }
  }

  return (
    <>
      <GlassButton
        glassVariant="liquid-refract"
        size="icon-lg"
        aria-label={copy.poster.share}
        onClick={openDrawer}
        className="size-11 rounded-full"
      >
        <Share2Icon className="size-5" />
      </GlassButton>

      <PosterDrawer open={open} onOpenChange={setOpen} title={copy.poster.shareTo}>
        <div className="no-scrollbar overflow-x-auto">
          <ul className="flex w-max gap-4 px-4 pb-5">
            {formatShareTargets(pageUrl, title).map((target) => (
              <li key={target.key}>
                <a
                  href={target.href}
                  target={target.key === "sms" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex w-16 flex-col items-center gap-2 rounded-xl text-center text-xs focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <PlatformIcon platform={target.key} className="size-14" />
                  {target.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="mx-4 w-auto" />

        <div className="flex flex-col px-2 pt-2">
          <button
            type="button"
            onClick={copyLink}
            className="flex items-center gap-4 rounded-xl px-2 py-2.5 text-left text-sm hover:bg-muted"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-muted">
              {copied ? <CheckIcon className="size-5" /> : <LinkIcon className="size-5" />}
            </span>
            {copied ? copy.poster.linkCopied : copy.poster.copyLink}
          </button>

          {canUseDeviceShare ? (
            <button
              type="button"
              onClick={deviceShare}
              className="flex items-center gap-4 rounded-xl px-2 py-2.5 text-left text-sm hover:bg-muted"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                <MoreHorizontalIcon className="size-5" />
              </span>
              {copy.poster.shareMore}
            </button>
          ) : null}
        </div>

        <span aria-live="polite" className="sr-only">
          {copied ? copy.poster.linkCopied : ""}
        </span>
      </PosterDrawer>
    </>
  )
}
