"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { GlassButton } from "@/components/ui/glasscn/glass-button"
import { copy } from "@/lib/copy"

/**
 * One tap between light and dark. The icon shows where a tap takes you: a moon
 * in light, a sun in dark.
 *
 * The icons swap on the `.dark` class rather than on `resolvedTheme`, so the
 * server and the first client render agree and nothing flickers: the class is
 * already on <html> before React hydrates.
 *
 * The site still follows the device until the first tap. After that the
 * choice sticks — with two states there is no way back to "follow the device"
 * short of clearing site data.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <GlassButton
      /* Same pane as the Explore / Upload switch beside it. */
      glassVariant="liquid-refract"
      size="icon-lg"
      aria-label={copy.theme.toggle}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="size-14 rounded-full"
    >
      <MoonIcon className="size-5 dark:hidden" />
      <SunIcon className="hidden size-5 dark:block" />
    </GlassButton>
  )
}
