import { PosterTile } from "@/components/posters/poster-tile"
import type { PosterWithDetails as Poster } from "@/data/types"

/** Same rhythm as the list: 8px between pictures, 12px from the screen edge. */
const GAP_REM = 0.5

/**
 * How far down the first screen reaches, in column widths, on the reference
 * phone (844px tall, 179px columns). Posters that start above it load at once;
 * the rest wait until they are scrolled near. Next 16 advises against
 * `preload` here: which poster ends up the largest on screen depends on the
 * phone.
 */
const FIRST_SCREEN = 844 / 179

function ratio(poster: Poster) {
  return poster.imageWidth / poster.imageHeight
}

/**
 * How far ahead the wall may reach for a poster that fits better, and how many
 * times one poster may be passed over before it must be placed. The second
 * bound is the one readers feel: no event appears more than three places away
 * from where the calendar puts it.
 */
const LOOKAHEAD = 2
const MAX_WAIT = 3

/**
 * How many partial walls are kept alive at each step. Measured in Node on
 * posters of mixed real-world shapes, ten seeds each (median):
 *
 *    15 posters   ~10ms   ~0.2 same-shape neighbours per wall
 *    40 posters   ~24ms   ~0.2
 *   100 posters   ~70ms   ~0.9, columns ~180px apart on a 390px phone
 *   300 posters  ~300ms   ~3
 *
 * This runs on every render of the Poster page, and cost grows faster than
 * the poster count. Past ~100 upcoming events it needs caching or a narrower
 * beam.
 */
const BEAM_WIDTH = 128

/** Two posters in different columns count as side by side when their spans
    overlap by at least this share of the shorter one. A sliver of overlap at
    a corner does not read as "next to" on screen. */
const SIDE_OVERLAP = 0.25

/** Rounded so file noise (1200×675 is 1.7778, not 16/9) still reads as 16:9. */
function shapeOf(poster: Poster) {
  return Math.round(ratio(poster) * 100)
}

type Placed = { shape: number; top: number; bottom: number; poster: Poster }
type Column = { placed: Placed[]; height: number }
type Waiting = { poster: Poster; waited: number }
type Wall = { columns: Column[]; queue: Waiting[]; conflicts: number }

/**
 * How many same-shape neighbours a poster would get at the foot of this
 * column: the one directly above it, and any in the other columns level with
 * it. Two squares stacked or side by side read as one block, and the wall
 * goes flat.
 */
function conflictsAt(columns: Column[], target: number, poster: Poster) {
  const shape = shapeOf(poster)
  const top = columns[target].height
  const bottom = top + 1 / ratio(poster)
  let count = 0

  if (columns[target].placed.at(-1)?.shape === shape) count++

  columns.forEach((column, index) => {
    if (index === target) return
    /* Newest first: once a poster ends above this one, all before it do too. */
    for (let k = column.placed.length - 1; k >= 0; k--) {
      const other = column.placed[k]
      if (other.bottom < top) break
      if (other.shape !== shape) continue
      const overlap = Math.min(bottom, other.bottom) - Math.max(top, other.top)
      const shorter = Math.min(bottom - top, other.bottom - other.top)
      if (overlap > shorter * SIDE_OVERLAP) count++
    }
  })

  return count
}

function withPlaced(columns: Column[], target: number, poster: Poster): Column[] {
  return columns.map((column, index) => {
    if (index !== target) return column
    const top = column.height
    const bottom = top + 1 / ratio(poster)
    return {
      placed: [...column.placed, { shape: shapeOf(poster), top, bottom, poster }],
      /* Heights in units of column width; the gap is small enough to count
         as a constant share of it. */
      height: bottom + GAP_REM / 10,
    }
  })
}

function imbalance(wall: Wall) {
  const heights = wall.columns.map((column) => column.height)
  return Math.max(...heights) - Math.min(...heights)
}

/** Two partial walls that have placed the same posters to the same heights
    will grow the same way from here; keeping both only crowds the beam. */
function signature(wall: Wall) {
  const window = wall.queue
    .slice(0, LOOKAHEAD + 1)
    .map((entry) => `${entry.poster.id}:${entry.waited}`)
  const heights = wall.columns.map((column) => column.height.toFixed(3))
  return `${window.join(",")}|${heights.join(",")}`
}

/**
 * Pinterest-style: two columns, every poster at its own shape — a square
 * upload shows square, a 4:5 shows 4:5, nothing is cropped.
 *
 * The rule on top: no poster shares its shape with the one above it or the
 * ones beside it. A greedy pass cannot hold that rule and keep the columns
 * level at the same time — refusing a column either stacks the other one
 * hundreds of pixels taller or, when the columns are forced level, breaks the
 * rule two or three times as often. So the wall is built as a beam search:
 * at every step each surviving partial wall tries placing each of the next few
 * posters in each column, and the best `BEAM_WIDTH` — fewest same-shape
 * neighbours, then most level — go on to the next step.
 *
 * Some data cannot be laid out cleanly at all: two columns holding n posters
 * can keep at most about n/2 of any one shape apart. The search then finds
 * the fewest clashes, not none.
 *
 * Every image carries its own width and height, so all of this runs on the
 * server and the browser receives finished columns.
 */
function toColumns(posters: Poster[], count: number) {
  let walls: Wall[] = [
    {
      columns: Array.from({ length: count }, () => ({ placed: [], height: 0 })),
      queue: posters.map((poster) => ({ poster, waited: 0 })),
      conflicts: 0,
    },
  ]

  for (let step = 0; step < posters.length; step++) {
    const next: Wall[] = []

    for (const wall of walls) {
      /* A poster that has waited its limit goes now, before anything else. */
      const reach =
        wall.queue[0].waited >= MAX_WAIT
          ? 1
          : Math.min(LOOKAHEAD + 1, wall.queue.length)

      for (let index = 0; index < reach; index++) {
        const { poster } = wall.queue[index]
        const queue = wall.queue
          .filter((_, position) => position !== index)
          .map((entry, position) =>
            position < index ? { ...entry, waited: entry.waited + 1 } : entry
          )

        for (let target = 0; target < count; target++) {
          next.push({
            columns: withPlaced(wall.columns, target, poster),
            queue,
            conflicts: wall.conflicts + conflictsAt(wall.columns, target, poster),
          })
        }
      }
    }

    next.sort((a, b) => a.conflicts - b.conflicts || imbalance(a) - imbalance(b))

    const seen = new Set<string>()
    walls = []
    for (const wall of next) {
      const key = signature(wall)
      if (seen.has(key)) continue
      seen.add(key)
      walls.push(wall)
      if (walls.length === BEAM_WIDTH) break
    }
  }

  return walls[0].columns.map((column) => column.placed)
}

export function PosterWall({ posters }: { posters: Poster[] }) {
  return (
    <div className="flex items-start gap-2 px-3">
      {toColumns(posters, 2).map((column, index) => (
        <div key={index} className="flex min-w-0 flex-1 flex-col gap-2">
          {column.map(({ poster, top }) => (
            <PosterTile
              key={poster.id}
              poster={poster}
              eager={top < FIRST_SCREEN}
              sizes="(max-width: 768px) 50vw, 24rem"
              style={{ width: "100%", aspectRatio: ratio(poster) }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
