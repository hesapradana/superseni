"use client"

import { XIcon } from "lucide-react"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer"
import { copy } from "@/lib/copy"

/**
 * The bottom sheet both poster drawers share: rounded top, swipe down or tap
 * × to close, a title beside the close button — Pinterest's "Bagikan ke"
 * layout. Built on shadcn's drawer, which is Base UI's, so the swipe and focus
 * handling come from the primitive.
 */
export function PosterDrawer({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className="mx-auto max-w-3xl rounded-t-3xl pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-4 px-4 pt-2 pb-4">
          <DrawerClose
            aria-label={copy.common.close}
            className="flex size-10 items-center justify-center rounded-full hover:bg-muted"
          >
            <XIcon className="size-6" />
          </DrawerClose>
          <DrawerTitle className="text-base font-semibold">{title}</DrawerTitle>
        </div>
        {children}
      </DrawerContent>
    </Drawer>
  )
}
