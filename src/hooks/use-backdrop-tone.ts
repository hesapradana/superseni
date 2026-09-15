"use client"

import { useEffect, useState, type RefObject } from "react"

export type BackdropTone = "dark" | "light"

/** Columns in the brightness grid kept per image. Small on purpose: one
    drawImage per image, then every lookup is arithmetic. */
const GRID_COLUMNS = 24

/** How much of the control is sampled: its middle, this share of its width
    and height. The edges are left out — that is mostly glass rim, and on a
    wide control like the Explore / Upload switch the ends sit over whatever is
    beside it. */
const SAMPLE_SHARE = 0.5

/** Average brightness below which the backdrop counts as dark. */
const DARK_BELOW = 0.5

type Grid = { columns: number; rows: number; values: Float32Array }

const grids = new WeakMap<HTMLImageElement, { src: string; grid: Grid | null }>()

/**
 * A coarse brightness map of an image, built once per file and cached.
 * Null when the image has not loaded yet, or when the browser refuses to let
 * the page read its pixels — which is what happens with an image from another
 * domain that does not allow it. The caller then falls back to the theme.
 */
function brightnessGrid(image: HTMLImageElement): Grid | null {
  if (!image.complete || image.naturalWidth === 0) return null
  const src = image.currentSrc || image.src
  const cached = grids.get(image)
  if (cached?.src === src) return cached.grid

  const columns = GRID_COLUMNS
  const rows = Math.max(1, Math.round((GRID_COLUMNS * image.naturalHeight) / image.naturalWidth))
  let grid: Grid | null = null
  try {
    const canvas = document.createElement("canvas")
    canvas.width = columns
    canvas.height = rows
    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (context) {
      context.drawImage(image, 0, 0, columns, rows)
      const pixels = context.getImageData(0, 0, columns, rows).data
      const values = new Float32Array(columns * rows)
      for (let cell = 0; cell < values.length; cell++) {
        const offset = cell * 4
        values[cell] =
          (0.2126 * pixels[offset]! + 0.7152 * pixels[offset + 1]! + 0.0722 * pixels[offset + 2]!) / 255
      }
      grid = { columns, rows, values }
    }
  } catch {
    grid = null
  }
  grids.set(image, { src, grid })
  return grid
}

/** Average brightness of the grid cells under a screen-space rectangle. The
    image boxes on this site always have the image's own ratio, so screen
    position maps straight onto the picture. */
function brightnessUnder(image: HTMLImageElement, grid: Grid, area: DOMRect): number {
  const box = image.getBoundingClientRect()
  const toColumn = (px: number) =>
    Math.min(grid.columns - 1, Math.max(0, Math.floor(((px - box.left) / box.width) * grid.columns)))
  const toRow = (py: number) =>
    Math.min(grid.rows - 1, Math.max(0, Math.floor(((py - box.top) / box.height) * grid.rows)))

  let total = 0
  let count = 0
  const insetX = (area.width * (1 - SAMPLE_SHARE)) / 2
  const insetY = (area.height * (1 - SAMPLE_SHARE)) / 2
  for (let row = toRow(area.top + insetY); row <= toRow(area.bottom - insetY); row++) {
    for (let column = toColumn(area.left + insetX); column <= toColumn(area.right - insetX); column++) {
      total += grid.values[row * grid.columns + column]!
      count++
    }
  }
  return total / count
}

/** Foreground classes for a tone. Both colours are fixed tokens, so a control
    over a dark poster stays white in light mode and one over a light poster
    stays ink in dark mode. Null: leave the theme's colour alone. */
export function toneTextClass(tone: BackdropTone | null): string | undefined {
  if (tone === "dark") return "text-on-photo"
  if (tone === "light") return "text-photo-ink"
  return undefined
}

/**
 * Whether the picture currently behind a glass control is dark or light, so
 * its content can switch to whichever colour reads. Null when there is no
 * picture behind it — the plain page — and the theme's colours apply.
 *
 * Re-checked on scroll, resize and whenever an image finishes loading, at
 * most once per frame.
 */
export function useBackdropTone(ref: RefObject<HTMLElement | null>): BackdropTone | null {
  const [tone, setTone] = useState<BackdropTone | null>(null)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const element = ref.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const image = document
        .elementsFromPoint(x, y)
        .find((node): node is HTMLImageElement => node instanceof HTMLImageElement)
      const grid = image ? brightnessGrid(image) : null
      if (!image || !grid) {
        setTone(null)
        return
      }
      setTone(brightnessUnder(image, grid, rect) < DARK_BELOW ? "dark" : "light")
    }

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure)
    }

    schedule()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    /* Image load events do not bubble, but they do pass through the document
       on the way down. */
    document.addEventListener("load", schedule, true)
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      document.removeEventListener("load", schedule, true)
    }
  }, [ref])

  return tone
}
