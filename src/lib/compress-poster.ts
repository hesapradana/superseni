import {
  UPLOAD_MAX_BYTES,
  UPLOAD_MAX_EDGE_PX,
  UPLOAD_MAX_SOURCE_BYTES,
} from "@/data/constants"

export type CompressedPoster = {
  blob: Blob
  width: number
  height: number
  originalBytes: number
}

export type CompressError = "tooLarge" | "unreadable" | "stillTooLarge"

/**
 * Shrinks a poster in the browser before it is sent.
 *
 * A poster straight off WhatsApp or a phone camera is often 1–3 MB; drawn at
 * most 1600px on its long edge and re-encoded it lands around a few hundred
 * KB, which keeps storage cheap and uploads quick on a weak signal.
 *
 * WebP first. Safari cannot encode WebP from a canvas — it silently hands back
 * a PNG, bigger than the original — so any other result is retried as JPEG.
 * Quality steps down only when the file is still over the limit.
 */
export async function compressPoster(
  file: File
): Promise<{ ok: true; poster: CompressedPoster } | { ok: false; error: CompressError }> {
  if (file.size > UPLOAD_MAX_SOURCE_BYTES) return { ok: false, error: "tooLarge" }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  } catch {
    return { ok: false, error: "unreadable" }
  }

  const scale = Math.min(1, UPLOAD_MAX_EDGE_PX / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) {
    bitmap.close()
    return { ok: false, error: "unreadable" }
  }
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const encode = (type: string, quality: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))

  for (const quality of [0.82, 0.7, 0.6]) {
    let blob = await encode("image/webp", quality)
    if (!blob || blob.type !== "image/webp") blob = await encode("image/jpeg", quality)
    if (blob && blob.size <= UPLOAD_MAX_BYTES) {
      return { ok: true, poster: { blob, width, height, originalBytes: file.size } }
    }
  }
  return { ok: false, error: "stillTooLarge" }
}

/** "1,2 MB", "238 KB" */
export function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} MB`
  return `${Math.max(1, Math.round(bytes / 1000)).toLocaleString("id-ID")} KB`
}
