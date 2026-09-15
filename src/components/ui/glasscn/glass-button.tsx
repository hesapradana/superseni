"use client";

import { FrostGlassVariantProp, glassVariantStyles } from "@/lib/glass-variants";
import { cn } from "@/lib/utils";

import { Button } from "../button";
import { LiquidGlass } from "./liquid-glass";

type GlassButtonProps = React.ComponentProps<typeof Button> & FrostGlassVariantProp;

function GlassButton({ className, glassVariant = "liquid-refract", ...props }: GlassButtonProps) {
  if (glassVariant === "liquid-refract") {
    return (
      <LiquidGlass>
        <Button
          data-slot="glass-button"
          data-glass-variant={glassVariant}
          /* Local fix: `Button`'s default variant brings `hover:bg-primary/80`,
             and `bg-transparent` does not cancel a hover utility — so hovering
             filled the glass with solid ink. Hover now only tints it. */
          className={cn("text-foreground cursor-pointer bg-transparent border-0 shadow-none hover:bg-foreground/5", className)}
          {...props}
        />
      </LiquidGlass>
    );
  }

  return (
    <Button
      data-slot="glass-button"
      data-glass-variant={glassVariant}
      className={cn("text-foreground cursor-pointer", glassVariantStyles[glassVariant], className)}
      {...props}
    />
  );
}

export { GlassButton };
