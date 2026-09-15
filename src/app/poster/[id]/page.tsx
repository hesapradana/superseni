import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { BottomBar } from "@/components/layout/bottom-bar"
import { PosterActions } from "@/components/posters/poster-actions"
import { PosterBackButton } from "@/components/posters/poster-back-button"
import { PosterLightbox } from "@/components/posters/poster-lightbox"
import { PosterSourceDrawer } from "@/components/posters/poster-source-drawer"
import { PosterWall } from "@/components/posters/poster-wall"
import { PosterWallSkeleton } from "@/components/posters/poster-wall-skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getPosterById, listRelatedPosters } from "@/data/repository"
import { copy } from "@/lib/copy"
import {
  formatInitials,
  formatPosterAlt,
  formatPosterDate,
  formatPosterFileName,
  formatPosterSources,
  formatPosterTitle,
  formatPosterUploadedAgo,
} from "@/lib/presenters"

export async function generateMetadata({
  params,
}: PageProps<"/poster/[id]">): Promise<Metadata> {
  const { id } = await params
  const poster = await getPosterById(id)
  if (!poster) return { title: copy.poster.notFoundTitle }

  return { title: `${formatPosterTitle(poster)} · ${copy.site.name}` }
}

/**
 * How much of the first screen the poster may take: everything but the room
 * the action row needs. However tall the poster, share and "Lihat di" stay on
 * the first screen — Pinterest's rule. The uploader and caption are not
 * reserved: they may start just below the fold, which is what lets a 9:16
 * poster run the full width of the action row on an iPhone 12 Pro. The bottom
 * bar is not counted either; on this page it stays hidden until the viewer
 * scrolls.
 *
 * A poster taller than that is never cropped and never reshaped: it keeps its
 * own ratio and gets narrower instead, centred. That only happens on short
 * screens — a 9:16 poster on an iPhone SE, say. Tap it to see it larger.
 *
 * 4.25rem is the top gap, the action row and its gap, and 8px above the home
 * indicator.
 *
 * `lvh`, the viewport with the browser's bars retracted — not `svh`. In-app
 * browsers (WhatsApp, Instagram) report `svh` as the current height, which
 * grows as the bars slide away, so the poster visibly grew while scrolling.
 * `lvh` is fixed at the larger size from the first paint: the poster starts
 * big and stays that size. The trade is that with the bars still showing, the
 * action row can sit under them until the first scroll.
 */
const PREVIEW_MAX_HEIGHT =
  "calc(100lvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 4.25rem)"

/**
 * A poster laid out like a Pinterest pin on a phone:
 *
 *   poster, cropped to fit, back button floating on it; tap for the whole
 *   poster
 *   actions ·························· source link
 *   uploader
 *   caption, then what is known: group, date, place
 *   more posters, as the same wall
 *
 * The page never ends in a dead end — it runs straight into more posters,
 * which is the loop Pinterest is built on.
 *
 * Every field except the uploader is optional, so every line below the
 * uploader appears only when it was filled in.
 */
export default async function PosterPage({ params }: PageProps<"/poster/[id]">) {
  const { id } = await params
  const poster = await getPosterById(id)
  if (!poster) notFound()

  const ratio = poster.imageWidth / poster.imageHeight
  const title = formatPosterTitle(poster)
  const date = formatPosterDate(poster)
  const sources = formatPosterSources(poster)

  return (
    <div className="mx-auto w-full max-w-3xl pt-[calc(0.5rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))]">
      {/* Floating, not part of the poster: pinned to the top-left of the
          screen like the bottom bar is to the bottom, so it stays in reach
          however far down the page has scrolled. The rail is click-through;
          only the button takes taps. */}
      <div className="pointer-events-none fixed inset-x-0 top-[calc(0.75rem+env(safe-area-inset-top))] z-30 mx-auto w-full max-w-3xl px-3">
        <div className="pointer-events-auto w-fit">
          <PosterBackButton />
        </div>
      </div>

      <article className="px-2">
        {/* The box is always the poster's own shape. Its width is the full
            column, or whatever width keeps it under the height limit —
            whichever is smaller — so a tall poster shrinks instead of being
            cut. `object-cover` below then has nothing to cut. */}
        <figure
          className="relative mx-auto overflow-hidden rounded-2xl bg-muted"
          style={{
            aspectRatio: ratio,
            width: `min(100%, calc(${PREVIEW_MAX_HEIGHT} * ${ratio}))`,
          }}
        >
          <Image
            src={poster.imageUrl}
            alt={formatPosterAlt(poster)}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
          <PosterLightbox src={poster.imageUrl} alt={formatPosterAlt(poster)} />
        </figure>

        <div className="mt-2 flex items-center justify-between gap-3">
          <PosterActions
            title={title}
            imageUrl={poster.imageUrl}
            fileName={formatPosterFileName(poster)}
          />

          {/* The one prominent action, where Pinterest puts "Simpan": the
              places a viewer can check whether the poster is real. */}
          {sources.length > 0 ? (
            <PosterSourceDrawer sources={sources} />
          ) : (
            <span className="text-sm text-muted-foreground">{copy.poster.noSource}</span>
          )}
        </div>

        {/* Pinterest's creator line: a small avatar and the name alone —
            12px bold on an 18px line — so a long name never gets cut by what
            sits beside it. When it was uploaded goes in the list below. */}
        <div className="mt-5 flex min-w-0 items-center gap-2 px-1">
          <Avatar size="sm">
            <AvatarFallback className="text-[10px] font-bold">{formatInitials(poster.uploader.name)}</AvatarFallback>
          </Avatar>
          <span className="truncate text-[12px] leading-[18px] font-bold">{poster.uploader.name}</span>
        </div>

        {/* Pinterest's pin title: 16px bold on a 22.4px line. The typeface
            stays Google Sans, the one face this site uses. */}
        {poster.caption ? (
          <h1 className="mt-3 line-clamp-2 px-1 text-[16px] leading-[22.4px] font-bold">
            {poster.caption}
          </h1>
        ) : null}

        {/* A step below the title: 14px regular. */}
        <dl className="mt-3 flex flex-col gap-2 px-1 text-[14px] leading-5">
            {poster.group ? (
              <Detail icon={UsersIcon} label={copy.poster.groupLabel}>
                {poster.group.officialName}
              </Detail>
            ) : null}
            {date ? (
              <Detail icon={CalendarIcon} label={copy.poster.dateLabel}>
                {date}
              </Detail>
            ) : null}
            {poster.place ? (
              <Detail icon={MapPinIcon} label={copy.poster.placeLabel}>
                {poster.place}
              </Detail>
            ) : null}
            <Detail icon={ClockIcon} label={copy.poster.uploadedLabel}>
              {formatPosterUploadedAgo(poster)}
            </Detail>
          </dl>
      </article>

      <section className="mt-5">
        <h2 className="mb-4 text-center text-base font-semibold">{copy.poster.moreToExplore}</h2>
        <Suspense fallback={<PosterWallSkeleton />}>
          <RelatedPosters posterId={poster.id} />
        </Suspense>
      </section>

      <BottomBar hideUntilScroll />
    </div>
  )
}

async function RelatedPosters({ posterId }: { posterId: string }) {
  const posters = await listRelatedPosters(posterId)
  if (posters.length === 0) return null
  return <PosterWall posters={posters} onFirstScreen={false} />
}

/** Icon for the eye, label for the screen reader. */
function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2">
      <dt className="shrink-0 pt-0.5">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
        <span className="sr-only">{label}</span>
      </dt>
      <dd>{children}</dd>
    </div>
  )
}
