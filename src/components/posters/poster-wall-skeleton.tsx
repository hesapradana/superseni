import { Skeleton } from "@/components/ui/skeleton"

/**
 * Posters come in every shape, so the placeholder does too — a wall of equal
 * blocks would promise a grid the real thing never delivers.
 */
const LEFT = ["aspect-[3/4]", "aspect-square", "aspect-[9/16]"]
const RIGHT = ["aspect-[16/9]", "aspect-[4/5]", "aspect-[3/4]"]

export function PosterWallSkeleton() {
  return (
    <div className="flex items-start gap-2 px-3">
      {[LEFT, RIGHT].map((column, index) => (
        <div key={index} className="flex min-w-0 flex-1 flex-col gap-2">
          {column.map((shape, shapeIndex) => (
            <Skeleton key={shapeIndex} className={`${shape} w-full rounded-lg`} />
          ))}
        </div>
      ))}
    </div>
  )
}
