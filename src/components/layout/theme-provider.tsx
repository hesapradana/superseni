"use client"

import { ThemeProvider as NextThemes } from "next-themes"

/**
 * Puts the `.dark` class on <html>, which is what every `dark:` utility in the
 * glasscn components keys off. `defaultTheme="system"` follows the device until
 * someone chooses otherwise.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemes>
  )
}
