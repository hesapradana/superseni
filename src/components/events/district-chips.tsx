"use client"

import { GlassButton } from "@/components/ui/glasscn/glass-button"
import type { Region } from "@/data/types"
import { copy } from "@/lib/copy"
import { cn } from "@/lib/utils"

export type DistrictCount = { district: Region; count: number }

/**
 * The filter worth spending screen on.
 *
 * Where beats what here: people know which valleys they are willing to ride to
 * tonight, and the art forms blur together for anyone outside the scene. The
 * kind of performance is one line down, inside the filter.
 *
 * Each chip carries how many events it would return, and a chip that would
 * return none is dropped: offering a tap that leads to an empty list is worse
 * than not offering it.
 */
export function DistrictChips({
  counts,
  total,
  selectedId,
  onSelect,
  onPhoto = false,
}: {
  counts: DistrictCount[]
  total: number
  selectedId: string
  onSelect: (districtId: string) => void
  onPhoto?: boolean
}) {
  const available = counts.filter(
    (entry) => entry.count > 0 || entry.district.id === selectedId
  )

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="flex w-max gap-2 px-4 py-0.5">
        <Chip
          active={selectedId === ""}
          onPhoto={onPhoto}
          onClick={() => onSelect("")}
        >
          {copy.filters.all} ({total})
        </Chip>

        {available.map(({ district, count }) => (
          <Chip
            key={district.id}
            active={selectedId === district.id}
            onPhoto={onPhoto}
            onClick={() => onSelect(district.id)}
          >
            {district.name} ({count})
          </Chip>
        ))}
      </div>
    </div>
  )
}

function Chip({
  active,
  onPhoto,
  onClick,
  children,
}: {
  active: boolean
  onPhoto: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <GlassButton
      /* Same pane as the search button and the Map/Feed switch. */
      glassVariant="liquid-refract"
      size="sm"
      aria-pressed={active}
      onClick={onClick}
      /* Same 40px as the search button beside it, so the row reads as one
         continuous control rather than a big circle next to small pills. */
      className={cn(
        "h-10 rounded-full px-4 text-sm whitespace-nowrap",
        onPhoto && "text-on-photo",
        active && "font-medium",
        !active && "opacity-70"
      )}
    >
      {children}
    </GlassButton>
  )
}
