/**
 * The social platforms the app knows by name, read from a link's host.
 *
 * A plain module on purpose: the server uses it to label links and the client
 * uses it to pick icons, and a client module would reach the server as a stub.
 */
export const PLATFORMS = {
  tiktok: { name: "TikTok", hosts: ["tiktok.com"] },
  instagram: { name: "Instagram", hosts: ["instagram.com"] },
  facebook: { name: "Facebook", hosts: ["facebook.com", "fb.com", "fb.watch"] },
  youtube: { name: "YouTube", hosts: ["youtube.com", "youtu.be"] },
  x: { name: "X", hosts: ["x.com", "twitter.com"] },
  threads: { name: "Threads", hosts: ["threads.net", "threads.com"] },
  whatsapp: { name: "WhatsApp", hosts: ["whatsapp.com", "wa.me"] },
  telegram: { name: "Telegram", hosts: ["t.me", "telegram.org"] },
} as const

export type PlatformKey = keyof typeof PLATFORMS

/** The platform a URL belongs to, or null for any other site. */
export function platformOf(url: URL): PlatformKey | null {
  const host = url.hostname.replace(/^(www\.|m\.|vm\.|vt\.)/, "")
  const match = (Object.keys(PLATFORMS) as PlatformKey[]).find((key) =>
    PLATFORMS[key].hosts.some((domain) => host === domain || host.endsWith(`.${domain}`))
  )
  return match ?? null
}
