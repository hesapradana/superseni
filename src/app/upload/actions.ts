"use server"

import { UPLOAD_MAX_BYTES, UPLOAD_MAX_EDGE_PX } from "@/data/constants"
import { posterUploadSchema } from "@/data/schemas"
import type { PosterUpload } from "@/data/types"

/** `form` holds a problem that belongs to no single field. */
export type UploadFieldErrors = Partial<
  Record<"image" | "sourceUrls" | "startTime" | "place" | "caption" | "form", string>
>

export type UploadResult =
  | { status: "invalid"; issues: { path: (string | number)[]; code: string }[]; image?: "missing" | "invalid" }
  | { status: "preview"; upload: PosterUpload; image: { width: number; height: number; bytes: number; type: string } }

const ACCEPTED_TYPES = new Set(["image/webp", "image/jpeg"])

/**
 * Receives an upload and checks it with the same schema the form uses. The
 * form's checks are a convenience; this is the one that counts, because a
 * request can reach an action without going through the form.
 *
 * Nothing is stored yet: there is no database. A valid upload comes back as a
 * preview. Before this saves anything it must also check who is uploading —
 * for now admins and group managers only, a manager only for their own group.
 */
export async function uploadPoster(formData: FormData): Promise<UploadResult> {
  const image = formData.get("image")
  const width = Number(formData.get("imageWidth"))
  const height = Number(formData.get("imageHeight"))

  let fields: unknown
  try {
    fields = JSON.parse(String(formData.get("fields") ?? ""))
  } catch {
    return { status: "invalid", issues: [{ path: [], code: "invalid_json" }] }
  }
  const parsed = posterUploadSchema.safeParse(fields)

  const imageProblem: "missing" | "invalid" | undefined = !(image instanceof File)
    ? "missing"
    : !ACCEPTED_TYPES.has(image.type) ||
        image.size === 0 ||
        image.size > UPLOAD_MAX_BYTES ||
        !Number.isInteger(width) ||
        !Number.isInteger(height) ||
        width < 1 ||
        height < 1 ||
        Math.max(width, height) > UPLOAD_MAX_EDGE_PX
      ? "invalid"
      : undefined

  if (!parsed.success || imageProblem) {
    return {
      status: "invalid",
      issues: parsed.success
        ? []
        : parsed.error.issues.map((issue) => ({
            path: issue.path.map((segment) => (typeof segment === "symbol" ? String(segment) : segment)),
            code: issue.code,
          })),
      image: imageProblem,
    }
  }

  const file = image as File
  return {
    status: "preview",
    upload: parsed.data,
    image: { width, height, bytes: file.size, type: file.type },
  }
}
