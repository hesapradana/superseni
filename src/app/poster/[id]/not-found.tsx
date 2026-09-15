import Link from "next/link"

import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { copy } from "@/lib/copy"

export default function PosterNotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{copy.poster.notFoundTitle}</EmptyTitle>
          <EmptyDescription>{copy.poster.notFoundDescription}</EmptyDescription>
        </EmptyHeader>
        <Link href="/" className="text-sm underline underline-offset-4">
          {copy.poster.toExplore}
        </Link>
      </Empty>
    </div>
  )
}
