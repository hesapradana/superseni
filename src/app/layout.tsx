import type { Metadata, Viewport } from "next"
import { Google_Sans } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { ThemeProvider } from "@/components/layout/theme-provider"

import { copy } from "@/lib/copy"

import "./globals.css"

/**
 * One typeface for the whole site. `--font-sans` is the variable `globals.css`
 * reads, and `--font-mono` is pointed at the same family there, so nothing can
 * fall back to a second face.
 */
const googleSans = Google_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
})

/*
 * `viewportFit: "cover"` is what makes `env(safe-area-inset-*)` report real
 * numbers. Without it iOS returns zero, and anything pinned to the bottom of
 * the screen ends up under the home indicator.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: copy.site.name,
  description: copy.site.description,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* `suppressHydrationWarning` is required by next-themes: it writes the
       theme class on <html> before React hydrates. */
    <html
      lang="id"
      suppressHydrationWarning
      className={`${googleSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <NuqsAdapter>
            <main className="flex-1">{children}</main>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  )
}
