import Link from "next/link"

import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { copy } from "@/lib/copy"

export default function EventNotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{copy.event.notFoundTitle}</EmptyTitle>
          <EmptyDescription>{copy.event.notFoundDescription}</EmptyDescription>
        </EmptyHeader>
        <Link href="/" className="text-sm underline underline-offset-4">
          {copy.event.backToList}
        </Link>
      </Empty>
    </div>
  )
}
