import type { Metadata } from "next"
import { UploadIcon } from "lucide-react"

import { BottomBar } from "@/components/layout/bottom-bar"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { copy } from "@/lib/copy"

export const metadata: Metadata = { title: `${copy.upload.title} · ${copy.site.name}` }

/**
 * A place for the tab to land while uploading is not built yet. Saying so
 * plainly beats a tab that does nothing, or one that looks like it works.
 */
export default function UploadPage() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center px-4 pt-[env(safe-area-inset-top)] pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UploadIcon />
          </EmptyMedia>
          <EmptyTitle>{copy.upload.title}</EmptyTitle>
          <EmptyDescription>{copy.upload.comingSoon}</EmptyDescription>
        </EmptyHeader>
      </Empty>

      <BottomBar />
    </div>
  )
}
