import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { BottomBar } from "@/components/layout/bottom-bar"
import { GlassButton } from "@/components/ui/glasscn/glass-button"
import { getPosterById } from "@/data/repository"
import { copy } from "@/lib/copy"
import {
  formatPosterAlt,
  formatPosterDate,
  formatPosterSource,
  formatPosterTitle,
  formatPosterUploadedAgo,
} from "@/lib/presenters"

export async function generateMetadata({
  params,
}: PageProps<"/poster/[id]">): Promise<Metadata> {
  const { id } = await params
  const poster = await getPosterById(id)
  if (!poster) return { title: copy.poster.notFoundTitle }

  return { title: `${formatPosterTitle(poster)} · ${copy.site.shortName}` }
}

/**
 * A poster and what is known about where it came from.
 *
 * Deliberately plain for now: the Pinterest-style layout is the next step and
 * gets designed on its own. What is settled is the content — the poster whole,
 * then the provenance a viewer needs to judge it: who uploaded it, where it
 * was posted, and when.
 *
 * Every field but the uploader is optional, so every row is too.
 */
export default async function PosterPage({ params }: PageProps<"/poster/[id]">) {
  const { id } = await params
  const poster = await getPosterById(id)
  if (!poster) notFound()

  const date = formatPosterDate(poster)
  const source = formatPosterSource(poster)

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <figure className="relative overflow-hidden rounded-lg bg-muted">
        <Image
          src={poster.imageUrl}
          alt={formatPosterAlt(poster)}
          width={poster.imageWidth}
          height={poster.imageHeight}
          sizes="(max-width: 768px) 100vw, 768px"
          loading="eager"
          fetchPriority="high"
          className="h-auto w-full"
        />

        <div className="absolute top-3 left-3">
          <GlassButton
            glassVariant="liquid-refract"
            size="icon-lg"
            nativeButton={false}
            aria-label={copy.poster.back}
            className="size-11 rounded-full"
            render={<Link href="/" />}
          >
            <ArrowLeftIcon className="size-5" />
          </GlassButton>
        </div>
      </figure>

      <dl className="mt-5 flex flex-col gap-4 px-1">
        <Row label={copy.poster.uploadedByLabel}>
          {poster.uploader.name}
          <span className="block text-sm text-muted-foreground">
            {formatPosterUploadedAgo(poster)}
          </span>
        </Row>

        <Row label={copy.poster.sourceLabel}>
          {source ? (
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline underline-offset-4"
            >
              {copy.poster.openSource(source.platform)}
              <ArrowUpRightIcon className="size-4" />
            </a>
          ) : (
            <span className="text-muted-foreground">{copy.poster.noSource}</span>
          )}
        </Row>

        {poster.group ? <Row label={copy.poster.groupLabel}>{poster.group.officialName}</Row> : null}
        {date ? <Row label={copy.poster.dateLabel}>{date}</Row> : null}
        {poster.place ? <Row label={copy.poster.placeLabel}>{poster.place}</Row> : null}
        {poster.caption ? <Row label={copy.poster.captionLabel}>{poster.caption}</Row> : null}
      </dl>

      <BottomBar />
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-base">{children}</dd>
    </div>
  )
}
