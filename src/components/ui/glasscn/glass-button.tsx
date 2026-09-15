"use client";

import { useCallback, useRef } from "react";

import { toneTextClass, useBackdropTone } from "@/hooks/use-backdrop-tone";
import { FrostGlassVariantProp, glassVariantStyles } from "@/lib/glass-variants";
import { cn } from "@/lib/utils";

import { Button } from "../button";
import { LiquidGlass } from "./liquid-glass";

type GlassButtonProps = React.ComponentProps<typeof Button> & FrostGlassVariantProp;

/*
 * Local changes to the glasscn original — re-installing from the registry
 * undoes both:
 *
 * 1. Hover. `Button`'s default variant brings `hover:bg-primary/80`, and
 *    `bg-transparent` does not cancel a hover utility — so hovering filled the
 *    glass with solid ink. Hover now only tints it.
 *
 * 2. Adaptive foreground. The original sets `text-foreground`, which follows
 *    the theme, not what is behind the glass — so over a dark poster in light
 *    mode the icon vanished. Every glass button now reads the picture behind
 *    it (`useBackdropTone`) and turns white over dark pictures, ink over light
 *    ones, and keeps the theme colour over the plain page. The tone class goes
 *    last so it wins over a colour passed in `className`.
 */
function GlassButton({ className, glassVariant = "liquid-refract", ref, ...props }: GlassButtonProps) {
  const ownRef = useRef<HTMLElement | null>(null);
  const tone = useBackdropTone(ownRef);

  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      ownRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.RefObject<HTMLButtonElement | null>).current = node;
    },
    [ref],
  );

  if (glassVariant === "liquid-refract") {
    return (
      <LiquidGlass>
        <Button
          ref={setRef}
          data-slot="glass-button"
          data-glass-variant={glassVariant}
          className={cn(
            "text-foreground cursor-pointer bg-transparent border-0 shadow-none hover:bg-foreground/5 transition-colors",
            className,
            toneTextClass(tone),
          )}
          {...props}
        />
      </LiquidGlass>
    );
  }

  return (
    <Button
      ref={setRef}
      data-slot="glass-button"
      data-glass-variant={glassVariant}
      className={cn("text-foreground cursor-pointer", glassVariantStyles[glassVariant], className, toneTextClass(tone))}
      {...props}
    />
  );
}

export { GlassButton };
