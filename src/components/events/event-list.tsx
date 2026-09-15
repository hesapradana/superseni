import { EventCard } from "@/components/events/event-card"
import { EventRow } from "@/components/events/event-row"
import type { EventWithDetails } from "@/data/types"

/**
 * The discover wall:
 *
 *      [][]
 *    [][][]
 *      [][]
 *    [][][]
 *
 * Every tile is the same size. A row of two fits the width exactly; a row of
 * three holds the same tiles and rests half-scrolled, so its first and last are
 * cut by the screen edges. The offset is what makes the wall read as a wall
 * instead of a table — no column line runs down the page.
 *
 * `--tile` is measured in `cqw` against the grid itself, not in `%`: the rows
 * are `w-max`, and a percentage inside an intrinsically sized parent resolves
 * to nothing at all.
 */
const GAP = "0.5rem"
const EDGE = "0.75rem"

/** Two tiles, one gap and the two edge margins fill one screen. */
const TILE = `calc((100cqw - ${GAP} - ${EDGE} * 2) / 2)`

const ROW_SIZES = [2, 3] as const

/**
 * Rows that start on the first screen of the reference phone (844px tall,
 * rows 239px + 8px): their pictures load at once, the rest when scrolled near.
 */
const FIRST_SCREEN_ROWS = Math.ceil(844 / (239 + 8))

function toRows(events: EventWithDetails[]) {
  const rows: { events: EventWithDetails[]; size: number }[] = []
  let index = 0

  while (index < events.length) {
    const size = ROW_SIZES[rows.length % ROW_SIZES.length]
    rows.push({ events: events.slice(index, index + size), size })
    index += size
  }

  return rows
}

export function EventList({ events }: { events: EventWithDetails[] }) {
  return (
    <div
      className="@container flex flex-col"
      style={{ "--tile": TILE, gap: GAP } as React.CSSProperties}
    >
      {toRows(events).map((row, rowIndex) => (
        <EventRow key={rowIndex} gap={GAP} edge={EDGE} offset={row.size === 3}>
          {row.events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              eager={rowIndex < FIRST_SCREEN_ROWS}
            />
          ))}
        </EventRow>
      ))}
    </div>
  )
}
