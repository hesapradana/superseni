"use client"

import { SearchIcon, XIcon } from "lucide-react"
import { debounce, useQueryStates } from "nuqs"

import { DistrictChips, type DistrictCount } from "@/components/events/district-chips"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { GlassButton } from "@/components/ui/glasscn/glass-button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { ArtForm, EventType } from "@/data/types"
import { copy } from "@/lib/copy"
import { cn } from "@/lib/utils"
import { countActiveFilters, eventSearchParams } from "@/lib/search-params"

const SEARCH_DEBOUNCE_MS = 400

/**
 * The only client component on this page.
 *
 * State lives in the URL so a filtered view survives being pasted into a chat —
 * which is how anything spreads around here. `shallow: false` sends each change
 * back to the server, where the filtering actually happens.
 *
 * One round button opens everything else; the district chips stay out in the
 * open beside it, because where beats what — people know which valleys they
 * will ride to tonight, and the art forms blur together for anyone outside
 * the scene.
 */
export function EventFilters({
  districtCounts,
  artForms,
  eventTypes,
  total,
}: {
  districtCounts: DistrictCount[]
  artForms: ArtForm[]
  eventTypes: EventType[]
  total: number
}) {
  const [filters, setFilters] = useQueryStates(eventSearchParams, { shallow: false })
  const activeCount = countActiveFilters(filters)
  const panelCount = activeCount - (filters.district ? 1 : 0)

  return (
    <div className="flex items-center gap-2 pl-4">
      <Popover>
        <div className="relative shrink-0">
          <PopoverTrigger
            render={
              <GlassButton
                /* Same pane as the chips beside it and the switch below:
                   `liquid-refract` is what wraps a control in LiquidGlass. */
                glassVariant="liquid-refract"
                size="icon"
                aria-label={copy.filters.toggle}
                /* 40px around a 20px glyph. At 48 the ring of empty space was
                   wider than the icon itself, and it towered over the 32px
                   chips it shares the row with. */
                className={cn(
                  "size-10 rounded-full",
                  filters.mode === "map" && "text-on-photo"
                )}
              />
            }
          >
            <SearchIcon className="size-5" />
          </PopoverTrigger>

          {panelCount > 0 ? (
            <span
              aria-hidden
              className="pointer-events-none absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[0.7rem] font-medium text-primary-foreground"
            >
              {panelCount}
            </span>
          ) : null}
        </div>

        <PopoverContent
          align="start"
          sideOffset={10}
          className="w-[min(22rem,calc(100vw-2rem))] gap-4 p-4"
        >
          <PopoverHeader>
            <PopoverTitle>{copy.filters.heading}</PopoverTitle>
          </PopoverHeader>

          <Field>
            <FieldLabel htmlFor="filter-query">{copy.filters.query}</FieldLabel>
            <Input
              id="filter-query"
              type="search"
              inputMode="search"
              placeholder={copy.filters.queryPlaceholder}
              value={filters.q}
              onChange={(event) =>
                setFilters(
                  { q: event.target.value },
                  { limitUrlUpdates: debounce(SEARCH_DEBOUNCE_MS) }
                )
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="filter-art-form">{copy.filters.artForm}</FieldLabel>
            <NativeSelect
              id="filter-art-form"
              className="w-full"
              value={filters.artForm}
              onChange={(event) => setFilters({ artForm: event.target.value })}
            >
              <NativeSelectOption value="">{copy.filters.all}</NativeSelectOption>
              {artForms.map((artForm) => (
                <NativeSelectOption key={artForm.id} value={artForm.id}>
                  {artForm.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>

          <Field>
            <FieldLabel htmlFor="filter-event-type">{copy.filters.eventType}</FieldLabel>
            <NativeSelect
              id="filter-event-type"
              className="w-full"
              value={filters.eventType}
              onChange={(event) => setFilters({ eventType: event.target.value })}
            >
              <NativeSelectOption value="">{copy.filters.all}</NativeSelectOption>
              {eventTypes.map((eventType) => (
                <NativeSelectOption key={eventType.id} value={eventType.id}>
                  {eventType.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="filter-from">{copy.filters.from}</FieldLabel>
              <Input
                id="filter-from"
                type="date"
                value={filters.from}
                onChange={(event) => setFilters({ from: event.target.value })}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="filter-to">{copy.filters.to}</FieldLabel>
              <Input
                id="filter-to"
                type="date"
                value={filters.to}
                onChange={(event) => setFilters({ to: event.target.value })}
              />
            </Field>
          </div>

          {activeCount > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              className="w-fit"
              onClick={() => setFilters(null)}
            >
              <XIcon />
              {copy.filters.reset}
            </Button>
          ) : null}
        </PopoverContent>
      </Popover>

      {/* Chips run off the right edge; the row scrolls, the button does not. */}
      <div className="-mr-4 min-w-0 flex-1">
        <DistrictChips
          onPhoto={filters.mode === "map"}
          counts={districtCounts}
          total={total}
          selectedId={filters.district}
          onSelect={(districtId) => setFilters({ district: districtId })}
        />
      </div>
    </div>
  )
}
