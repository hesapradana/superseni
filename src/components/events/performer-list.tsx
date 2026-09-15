import { StarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { cn } from "cn"

import { copy } from "@/lib/copy"
import type { PerformerView } from "@/lib/presenters"

/**
 * Role is what decides whether someone travels, so it is never flattened into a
 * plain list of names.
 */
export function PerformerList({
  performers,
  inverse = false,
}: {
  performers: PerformerView[]
  inverse?: boolean
}) {
  if (performers.length === 0) {
    return (
      <p className={cn("text-sm", inverse ? "opacity-75" : "text-muted-foreground")}>
        {copy.event.noPerformers}
      </p>
    )
  }

  return (
    <ItemGroup>
      {performers.map((performer) => (
        <Item
          key={performer.id}
          variant="muted"
          size="sm"
          role="listitem"
          className={cn(inverse && "glass")}
        >
          <ItemContent>
            <ItemTitle>{performer.name}</ItemTitle>
            {performer.detail ? (
              <ItemDescription className={cn(inverse && "text-primary-foreground/75")}>
                {performer.detail}
              </ItemDescription>
            ) : null}
          </ItemContent>
          <ItemActions>
            <Badge
              variant={
                performer.isGuestStar ? "default" : inverse ? "ghost" : "outline"
              }
              className={cn(!performer.isGuestStar && inverse && "glass")}
            >
              {performer.isGuestStar ? <StarIcon data-icon="inline-start" /> : null}
              {performer.roleLabel}
            </Badge>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}
