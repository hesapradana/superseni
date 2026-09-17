import type { Metadata } from "next"

import { BottomBar } from "@/components/layout/bottom-bar"
import { UploadForm } from "@/components/upload/upload-form"
import { listGroups } from "@/data/repository"
import { copy } from "@/lib/copy"

export const metadata: Metadata = { title: `${copy.upload.title} · ${copy.site.name}` }

/**
 * Upload. Works end to end except for the last step: with no database yet, a
 * valid upload is checked on the server and shown back as a preview instead
 * of being stored. There is no sign-in either — before anything is saved, the
 * action must check who is uploading.
 */
export default async function UploadPage() {
  const groups = (await listGroups()).map((group) => ({ id: group.id, officialName: group.officialName }))

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(7rem+env(safe-area-inset-bottom))]">
      <header className="mb-5 flex flex-col gap-1 px-1">
        <h1 className="text-[22px] leading-7 font-bold">{copy.upload.title}</h1>
        <p className="text-[14px] leading-5 text-muted-foreground">{copy.upload.intro}</p>
      </header>

      <UploadForm groups={groups} />

      <BottomBar />
    </div>
  )
}
