import { Skeleton } from "@/components/ui/skeleton"

export function PageHeaderSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-start justify-between gap-4 px-4 pt-6 pb-2">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="size-12 shrink-0 rounded-full" />
    </div>
  )
}

export function EventFiltersSkeleton() {
  return (
    <div className="flex items-center gap-2 px-4">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <Skeleton className="h-10 flex-1 rounded-full" />
    </div>
  )
}

/**
 * The same grid as `EventList`, down to the tile size and the half-tile offset,
 * so the layout does not jump when the real thing arrives.
 *
 * Each row needs its own scroll container. Without one the tiles push the
 * document wider than the screen and the whole page scrolls sideways.
 */
export function EventListSkeleton() {
  return (
    <div
      className="@container flex flex-col gap-2"
      style={
        { "--tile": "calc((100cqw - 0.5rem - 0.75rem * 2) / 2)" } as React.CSSProperties
      }
    >
      <SkeletonRow count={2} />
      <SkeletonRow count={3} />
      <SkeletonRow count={2} />
    </div>
  )
}

function SkeletonRow({ count }: { count: number }) {
  const offset = count === 3

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div
        className={
          offset
            ? "-ml-[calc((var(--tile)+0.5rem)/2)] flex w-max gap-2 px-3"
            : "flex w-max gap-2 px-3"
        }
      >
        {Array.from({ length: count }, (_, index) => (
          <Skeleton
            key={index}
            className="aspect-[3/4] w-[var(--tile)] shrink-0 rounded-lg"
          />
        ))}
      </div>
    </div>
  )
}
