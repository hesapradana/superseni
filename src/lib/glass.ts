/**
 * The glass treatment for controls that float over a photo.
 *
 * Lives in a plain module on purpose. Exporting it from a `"use client"` file
 * and importing it into a server component does not hand over the string — the
 * bundler replaces it with a client-reference stub, and the stub's source text
 * ends up in the `class` attribute. Nothing warns about it.
 *
 * The surface colour itself is the `glass` utility in `globals.css`; only the
 * shape and the ink-on-photo colour are decided here.
 */

/** Text and icons over the glass are always white. */
export const GLASS_SURFACE = "glass text-primary-foreground"

/**
 * Round 40px action. Pair it with `variant="ghost"`: `glass` is a custom
 * utility, so tailwind-merge does not see it as a background and will not
 * strip a variant's own `bg-*` — the default variant keeps its ink and the
 * disc comes out solid black.
 */
export const GLASS_DISC = `size-10 ${GLASS_SURFACE} hover:bg-card/25`

/** Where the page ground is the painted light background. */
export const PAGE_BACKGROUND = "/background/light-1.jpeg"

/** Round 40px action on a light ground. Pair with `variant="ghost"` too. */
export const GLASS_DISC_LIGHT = "size-12 glass-light text-foreground hover:bg-card/80"
