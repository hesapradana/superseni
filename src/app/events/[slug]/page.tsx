import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  MaximizeIcon,
  MoreVerticalIcon,
} from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ActionPill } from "@/components/events/action-pill"
import { EventStatusBanner } from "@/components/events/event-status-banner"
import { PerformerList } from "@/components/events/performer-list"
import { PosterViewer } from "@/components/events/poster-viewer"
import { Button } from "@/components/ui/button"
import { getEventBySlug } from "@/data/repository"
import { copy } from "@/lib/copy"
import { GLASS_DISC_LIGHT, PAGE_BACKGROUND } from "@/lib/glass"
import { formatFullDate, formatShortDate } from "@/lib/date"
import {
  formatEventImage,
  formatEventTime,
  formatEventTitle,
  formatFreshness,
  formatLocation,
  formatMapsUrl,
  formatOrganizer,
  formatPerformers,
  formatSources,
} from "@/lib/presenters"

export async function generateMetadata({
  params,
}: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: copy.event.notFoundTitle }

  return {
    title: `${formatEventTitle(event, event.eventType, event.region)} · ${copy.site.shortName}`,
  }
}

export default async function EventDetailPage({
  params,
}: PageProps<"/events/[slug]">) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const title = formatEventTitle(event, event.eventType, event.region)
  const location = formatLocation(event.region, event.visibility)
  const mapsUrl = formatMapsUrl(event.region, event.visibility)
  const performers = formatPerformers(event.performers)
  const freshness = formatFreshness(event.lastVerifiedAt)
  const sources = formatSources(event.sources)
  const organizer = formatOrganizer(event.organizerName, event.visibility)
  const image = formatEventImage(event, title)

  if (!image) return <PlainDetail {...{ event, title, location, mapsUrl, performers, freshness, sources, organizer }} />

  return (
    /*
     * The painted ground is the page; the poster is one more piece of floating
     * content on it, not the backdrop. Everything stays in ink on light — the
     * dark treatment belonged to the version where the poster WAS the page.
     */
    <article className="relative isolate min-h-dvh">
      <div className="fixed inset-0 -z-10">
        <Image
          src={PAGE_BACKGROUND}
          alt=""
          aria-hidden
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover"
        />
        {/* A veil, so type keeps its contrast wherever the painting is busiest. */}
        <div className="absolute inset-0 bg-card/45" />
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-12">
        <header className="flex items-center justify-between gap-3">
          <BackButton className={GLASS_DISC_LIGHT} />
          <PosterViewer
            src={image.src}
            alt={image.alt}
            render={
              <Button
                variant="ghost"
                aria-label={copy.event.viewPoster}
                className="h-12 gap-3 bg-primary px-6 text-sm font-semibold tracking-[-0.02em] text-primary-foreground hover:bg-primary/90"
              >
                {copy.event.poster}
                <MaximizeIcon />
              </Button>
            }
          />
        </header>

        <section className="mt-10">
          <h1 className="line-clamp-3 text-[2.75rem] leading-[0.95] font-light tracking-[-0.055em] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-lg font-light tracking-[-0.02em] text-muted-foreground">
            {location ?? copy.event.locationHidden}
          </p>
        </section>

        {/* The poster floats here, whole and uncropped, like any other card. */}
        <figure className="relative mt-8 overflow-hidden rounded-2xl">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            /* Either this or the painting behind can be the largest thing on
               screen, depending on the phone, so Next 16 advises against
               `preload`. Both load at once; the poster — what people came
               for — is fetched first. */
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full"
          />
          <figcaption className="glass absolute bottom-4 left-4 rounded-full px-4 py-2 text-[17px] font-light text-primary-foreground">
            {formatFullDate(event.date)}
            <span className="opacity-75"> · {formatEventTime(event)}</span>
          </figcaption>
        </figure>

        <div className="mt-6">
          <EventStatusBanner status={event.eventStatus} />
        </div>

        <section className="mt-7 flex items-center">
          <p className="text-sm tracking-wide text-muted-foreground">
            <span className="text-foreground">{event.eventType.name}</span>
            <span className="mx-1">|</span>
            <span>{freshness.label}</span>
          </p>
          <MoreVerticalIcon
            className="ml-auto size-4 text-muted-foreground"
            aria-hidden
          />
        </section>

        <div className="glass-light mt-5 rounded-2xl p-4">
          <PerformerList performers={performers} />
        </div>

        <dl className="glass-light mt-4 flex flex-col gap-5 rounded-2xl p-4">
          {event.visibility === "limited" ? (
            <DetailRow label={copy.event.locationLabel}>
              {copy.event.locationLimitedNote}
            </DetailRow>
          ) : null}

          {organizer ? (
            <DetailRow label={copy.event.organizerLabel}>{organizer}</DetailRow>
          ) : null}

          {event.seriesDates.length > 1 ? (
            <DetailRow label={copy.event.seriesLabel}>
              {event.seriesDates.map((date) => formatShortDate(date)).join(" · ")}
            </DetailRow>
          ) : null}

          <DetailRow label={copy.event.sourcesLabel}>
            {sources.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {sources.map((source) => (
                  <li key={source.id}>
                    {source.label}
                    {source.detail ? (
                      <span className="text-muted-foreground"> · {source.detail}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground">{copy.event.noSources}</span>
            )}
          </DetailRow>
        </dl>

        {mapsUrl ? (
          <ActionPill
            href={mapsUrl}
            label={copy.event.openInMaps}
            icon={<ArrowUpRightIcon className="size-4" />}
            external
            className="mt-6"
          />
        ) : null}
      </div>
    </article>
  )
}

/** Uppercase label, value beneath — the reference's own caption treatment. */
function DetailRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-[17px] leading-[1.4] font-light tracking-[-0.02em]">
        {children}
      </dd>
    </div>
  )
}

function BackButton({ className }: { className?: string }) {
  return (
    <Button
      /* Ghost so the caller's className owns the background; see `GLASS_DISC`. */
      variant="ghost"
      size="icon"
      nativeButton={false}
      aria-label={copy.event.backToList}
      className={className}
      render={<Link href="/" />}
    >
      <ArrowLeftIcon />
    </Button>
  )
}

/* -------------------------------------------------------------------------- */

/** Events with no poster keep the light layout; there is nothing to float on. */
function PlainDetail({
  event,
  title,
  location,
  mapsUrl,
  performers,
  freshness,
  sources,
  organizer,
}: {
  event: NonNullable<Awaited<ReturnType<typeof getEventBySlug>>>
  title: string
  location: string | null
  mapsUrl: string | null
  performers: ReturnType<typeof formatPerformers>
  freshness: ReturnType<typeof formatFreshness>
  sources: ReturnType<typeof formatSources>
  organizer: string | null
}) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-5 pb-12">
      <BackButton className="size-10 w-fit bg-card text-foreground hover:bg-muted" />

      <header className="flex flex-col gap-1">
        <h1 className="font-heading line-clamp-3 text-2xl leading-tight font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {location ?? copy.event.locationHidden}
        </p>
      </header>

      <p className="text-sm">
        {formatFullDate(event.date)}
        <span className="text-muted-foreground"> · {formatEventTime(event)}</span>
      </p>

      <EventStatusBanner status={event.eventStatus} />

      <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
        {event.eventType.name}
        {" | "}
        {freshness.label}
      </p>

      <section className="rounded-xl bg-card p-4">
        <h2 className="font-heading mb-3 text-sm font-medium tracking-tight">
          {copy.event.performersLabel}
        </h2>
        <PerformerList performers={performers} />
      </section>

      <section className="rounded-xl bg-card p-4">
        <dl className="flex flex-col gap-3">
          {event.visibility === "limited" ? (
            <PlainRow label={copy.event.locationLabel}>
              {copy.event.locationLimitedNote}
            </PlainRow>
          ) : null}
          {organizer ? (
            <PlainRow label={copy.event.organizerLabel}>{organizer}</PlainRow>
          ) : null}
          {event.seriesDates.length > 1 ? (
            <PlainRow label={copy.event.seriesLabel}>
              {event.seriesDates.map((date) => formatShortDate(date)).join(" · ")}
            </PlainRow>
          ) : null}
          <PlainRow label={copy.event.sourcesLabel}>
            {sources.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {sources.map((source) => (
                  <li key={source.id}>
                    {source.label}
                    {source.detail ? (
                      <span className="text-muted-foreground"> · {source.detail}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground">{copy.event.noSources}</span>
            )}
          </PlainRow>
        </dl>

        {mapsUrl ? (
          <ActionPill
            href={mapsUrl}
            label={copy.event.openInMaps}
            icon={<ArrowUpRightIcon className="size-4" />}
            external
            className="mt-4"
          />
        ) : null}
      </section>
    </article>
  )
}

function PlainRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}
