"use client"

import { ImagePlusIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react"
import { useEffect, useMemo, useState, useTransition } from "react"

import { uploadPoster, type UploadFieldErrors, type UploadResult } from "@/app/upload/actions"
import { Button } from "@/components/ui/button"
import { Combobox, ComboboxEmpty, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { GlassButton } from "@/components/ui/glasscn/glass-button"
import { GlassComboboxContent, GlassComboboxInput } from "@/components/ui/glasscn/glass-combobox"
import { GlassInput } from "@/components/ui/glasscn/glass-input"
import { UPLOAD_MAX_SOURCES } from "@/data/constants"
import { posterUploadSchema } from "@/data/schemas"
import type { PosterUpload } from "@/data/types"
import { compressPoster, formatBytes, type CompressedPoster } from "@/lib/compress-poster"
import { copy } from "@/lib/copy"
import { formatFullDate, isoComingWeekday, isoDayFromToday } from "@/lib/date"
import { cn } from "@/lib/utils"

type GroupOption = { id: string; officialName: string }

const t = copy.upload

/** "tiktok.com/@x" is what people paste; the schema wants a full URL. */
function normaliseUrl(value: string): string {
  const trimmed = value.trim()
  if (trimmed === "") return ""
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/** One Indonesian message per field, whatever the schema's reason. */
function toFieldErrors(result: Extract<UploadResult, { status: "invalid" }>): UploadFieldErrors {
  const errors: UploadFieldErrors = {}
  if (result.image) errors.image = result.image === "missing" ? t.errors.imageRequired : t.errors.imageStillTooLarge
  for (const issue of result.issues) {
    const [field, index] = issue.path
    if (field === "sourceUrls") {
      errors.sourceUrls ??=
        index !== undefined
          ? t.errors.sourceInvalid
          : issue.code === "too_big"
            ? t.errors.sourceTooMany
            : t.errors.sourceDuplicate
    } else if (field === "startTime") {
      errors.startTime ??= t.errors.timeNeedsDate
    } else if (field === "place" || field === "caption") {
      errors[field] ??= t.errors.tooLong
    } else {
      errors.form ??= t.errors.generic
    }
  }
  return errors
}

/**
 * The upload form: the image is the only thing required, everything else is
 * optional and nudged, never demanded.
 *
 * The same schema checks the fields here and again in the server action; the
 * poster is shrunk in the browser first (see `compressPoster`).
 */
export function UploadForm({ groups }: { groups: GroupOption[] }) {
  const [poster, setPoster] = useState<CompressedPoster | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [sources, setSources] = useState<string[]>([""])
  const [groupName, setGroupName] = useState<string | null>(null)
  const [performanceDate, setPerformanceDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [place, setPlace] = useState("")
  const [caption, setCaption] = useState("")
  const [errors, setErrors] = useState<UploadFieldErrors>({})
  const [preview, setPreview] = useState<Extract<UploadResult, { status: "preview" }> | null>(null)
  const [submitting, startSubmit] = useTransition()

  const groupIdByName = useMemo(() => new Map(groups.map((group) => [group.officialName, group.id])), [groups])
  const groupNames = useMemo(() => groups.map((group) => group.officialName), [groups])

  const previewUrl = useMemo(() => (poster ? URL.createObjectURL(poster.blob) : null), [poster])
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    },
    [previewUrl]
  )

  async function pickImage(file: File | undefined) {
    if (!file) return
    setCompressing(true)
    setErrors((current) => ({ ...current, image: undefined }))
    const result = await compressPoster(file)
    setCompressing(false)
    if (result.ok) {
      setPoster(result.poster)
      return
    }
    setErrors((current) => ({
      ...current,
      image:
        result.error === "tooLarge"
          ? t.errors.imageTooLarge
          : result.error === "unreadable"
            ? t.errors.imageUnreadable
            : t.errors.imageStillTooLarge,
    }))
  }

  function collect(): PosterUpload {
    return {
      sourceUrls: sources.map(normaliseUrl).filter(Boolean),
      groupId: groupName ? (groupIdByName.get(groupName) ?? null) : null,
      performanceDate: performanceDate || null,
      startTime: performanceDate && startTime ? startTime : null,
      place: place.trim() || null,
      caption: caption.trim() || null,
    }
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const fields = collect()
    const local = posterUploadSchema.safeParse(fields)
    const localErrors = toFieldErrors({
      status: "invalid",
      image: poster ? undefined : "missing",
      issues: local.success
        ? []
        : local.error.issues.map((issue) => ({ path: issue.path as (string | number)[], code: issue.code })),
    })
    setErrors(localErrors)
    if (!poster || !local.success) return

    const formData = new FormData()
    formData.set("image", poster.blob, poster.blob.type === "image/webp" ? "poster.webp" : "poster.jpg")
    formData.set("imageWidth", String(poster.width))
    formData.set("imageHeight", String(poster.height))
    formData.set("fields", JSON.stringify(fields))

    startSubmit(async () => {
      try {
        const result = await uploadPoster(formData)
        if (result.status === "preview") setPreview(result)
        else setErrors(toFieldErrors(result))
      } catch {
        setErrors({ form: t.errors.server })
      }
    })
  }

  function reset() {
    setPoster(null)
    setSources([""])
    setGroupName(null)
    setPerformanceDate("")
    setStartTime("")
    setPlace("")
    setCaption("")
    setErrors({})
    setPreview(null)
  }

  if (preview && previewUrl && poster) {
    const group = groups.find((candidate) => candidate.id === preview.upload.groupId)
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-[16px] leading-[22.4px] font-bold">{t.previewTitle}</h2>
        <p className="rounded-xl bg-muted px-3 py-2 text-[14px] leading-5 text-muted-foreground">{t.previewNote}</p>
        {/* eslint-disable-next-line @next/next/no-img-element -- a local blob URL, nothing for next/image to optimise */}
        <img
          src={previewUrl}
          alt=""
          className="mx-auto max-h-[60svh] w-auto rounded-2xl"
          style={{ aspectRatio: poster.width / poster.height }}
        />
        <dl className="flex flex-col gap-2 text-[14px] leading-5">
          {group ? <PreviewRow label={t.groupLabel}>{group.officialName}</PreviewRow> : null}
          {preview.upload.performanceDate ? (
            <PreviewRow label={t.dateLabel}>
              {formatFullDate(preview.upload.performanceDate)}
              {preview.upload.startTime ? ` · ${preview.upload.startTime}` : ""}
            </PreviewRow>
          ) : null}
          {preview.upload.place ? <PreviewRow label={t.placeLabel}>{preview.upload.place}</PreviewRow> : null}
          {preview.upload.caption ? <PreviewRow label={t.captionLabel}>{preview.upload.caption}</PreviewRow> : null}
          {preview.upload.sourceUrls.map((url) => (
            <PreviewRow key={url} label={t.sourceLabel}>
              <span className="break-all">{url}</span>
            </PreviewRow>
          ))}
        </dl>
        <Button onClick={reset} className="h-12 rounded-full text-[15px] font-medium">
          {t.uploadAnother}
        </Button>
      </div>
    )
  }

  const dateChips = [
    { label: t.today, value: isoDayFromToday(0) },
    { label: t.tomorrow, value: isoDayFromToday(1) },
    { label: t.thisSaturday, value: isoComingWeekday(6) },
    { label: t.thisSunday, value: isoComingWeekday(0) },
  ]

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      {/* --- The poster: the only required part ---------------------------- */}
      <Field data-invalid={Boolean(errors.image)}>
        {previewUrl && poster ? (
          <div className="flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- a local blob URL, nothing for next/image to optimise */}
            <img
              src={previewUrl}
              alt=""
              className="mx-auto max-h-[60svh] w-auto rounded-2xl"
              style={{ aspectRatio: poster.width / poster.height }}
            />
            <div className="flex items-center justify-between gap-3 px-1">
              <span className="text-[12px] leading-[18px] text-muted-foreground">
                {t.sizeSummary(formatBytes(poster.originalBytes), formatBytes(poster.blob.size), poster.width, poster.height)}
              </span>
              <label className="cursor-pointer text-[14px] font-medium underline underline-offset-4">
                {t.replaceImage}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => pickImage(event.target.files?.[0])}
                />
              </label>
            </div>
          </div>
        ) : (
          <label
            className={cn(
              "flex h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-foreground/20 bg-muted/40 text-center",
              "focus-within:ring-3 focus-within:ring-ring/50",
              errors.image && "border-destructive/60"
            )}
          >
            {compressing ? (
              <>
                <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
                <span className="text-[14px] text-muted-foreground">{t.compressing}</span>
              </>
            ) : (
              <>
                <ImagePlusIcon className="size-8 text-muted-foreground" />
                <span className="text-[16px] font-bold">{t.pickImage}</span>
                <span className="text-[12px] leading-[18px] text-muted-foreground">{t.pickImageHint}</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={compressing}
              onChange={(event) => pickImage(event.target.files?.[0])}
            />
          </label>
        )}
        <FieldError>{errors.image}</FieldError>
      </Field>

      {/* --- Everything else is optional --------------------------------- */}
      <div className="flex flex-col gap-1 px-1">
        <h2 className="text-[16px] leading-[22.4px] font-bold">{t.detailsHeading}</h2>
        <p className="text-[14px] leading-5 text-muted-foreground">{t.detailsHint}</p>
      </div>

      <Field data-invalid={Boolean(errors.sourceUrls)}>
        <FieldLabel>{t.sourceLabel}</FieldLabel>
        <FieldDescription>{t.sourceHint}</FieldDescription>
        <div className="flex flex-col gap-2">
          {sources.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <GlassInput
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder={t.sourcePlaceholder}
                value={value}
                aria-invalid={Boolean(errors.sourceUrls)}
                onChange={(event) =>
                  setSources((current) => current.map((item, i) => (i === index ? event.target.value : item)))
                }
                className="h-11"
              />
              {sources.length > 1 ? (
                <GlassButton
                  type="button"
                  glassVariant="liquid-refract"
                  size="icon-lg"
                  aria-label={t.removeSource}
                  onClick={() => setSources((current) => current.filter((_, i) => i !== index))}
                  className="size-11 shrink-0 rounded-full"
                >
                  <XIcon className="size-4" />
                </GlassButton>
              ) : null}
            </div>
          ))}
        </div>
        {sources.length < UPLOAD_MAX_SOURCES ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setSources((current) => [...current, ""])}
            className="w-fit gap-1.5 px-1 text-[14px]"
          >
            <PlusIcon className="size-4" />
            {t.addSource}
          </Button>
        ) : null}
        <FieldError>{errors.sourceUrls}</FieldError>
      </Field>

      <Field>
        <FieldLabel>{t.groupLabel}</FieldLabel>
        {/* The base Combobox root, not `GlassCombobox`: the glasscn wrapper types
            its value as the whole item list, which cannot hold one choice. The
            glass input and popup still apply — their variant defaults to
            liquid glass without the wrapper's context. */}
        <Combobox items={groupNames} value={groupName} onValueChange={(value: string | null) => setGroupName(value)}>
          <GlassComboboxInput placeholder={t.groupPlaceholder} showClear className="h-11" />
          <GlassComboboxContent>
            <ComboboxEmpty>{t.groupEmpty}</ComboboxEmpty>
            <ComboboxList>
              {(name: string) => (
                <ComboboxItem key={name} value={name}>
                  {name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </GlassComboboxContent>
        </Combobox>
      </Field>

      <Field>
        <FieldLabel>{t.dateLabel}</FieldLabel>
        <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
          <div className="flex w-max gap-2 py-0.5">
            {dateChips.map((chip) => {
              const active = performanceDate === chip.value
              return (
                <GlassButton
                  key={chip.label}
                  type="button"
                  glassVariant="liquid-refract"
                  aria-pressed={active}
                  onClick={() => setPerformanceDate(active ? "" : chip.value)}
                  className={cn("h-10 rounded-full px-4 text-[14px] whitespace-nowrap", active ? "font-bold" : "opacity-70")}
                >
                  {chip.label}
                </GlassButton>
              )
            })}
          </div>
        </div>
        <GlassInput
          type="date"
          value={performanceDate}
          onChange={(event) => setPerformanceDate(event.target.value)}
          className="h-11"
        />
        {performanceDate ? (
          <div className="flex items-center justify-between gap-3 px-1 text-[14px] leading-5">
            <span>{formatFullDate(performanceDate)}</span>
            <button
              type="button"
              onClick={() => {
                setPerformanceDate("")
                setStartTime("")
              }}
              className="text-muted-foreground underline underline-offset-4"
            >
              {t.clearDate}
            </button>
          </div>
        ) : null}
      </Field>

      {performanceDate ? (
        <Field data-invalid={Boolean(errors.startTime)}>
          <FieldLabel>{t.timeLabel}</FieldLabel>
          <GlassInput type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} className="h-11" />
          <FieldError>{errors.startTime}</FieldError>
        </Field>
      ) : null}

      <Field data-invalid={Boolean(errors.place)}>
        <FieldLabel>{t.placeLabel}</FieldLabel>
        <GlassInput
          placeholder={t.placePlaceholder}
          maxLength={160}
          value={place}
          onChange={(event) => setPlace(event.target.value)}
          className="h-11"
        />
        <FieldError>{errors.place}</FieldError>
      </Field>

      <Field data-invalid={Boolean(errors.caption)}>
        <FieldLabel>{t.captionLabel}</FieldLabel>
        <GlassInput
          placeholder={t.captionPlaceholder}
          maxLength={300}
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          className="h-11"
        />
        <FieldError>{errors.caption}</FieldError>
      </Field>

      <FieldError>{errors.form}</FieldError>

      <Button
        type="submit"
        disabled={submitting || compressing}
        className="h-12 gap-2 rounded-full text-[15px] font-medium"
      >
        {submitting ? <Loader2Icon className="size-4 animate-spin" /> : null}
        {submitting ? t.submitting : t.submit}
      </Button>
    </form>
  )
}

function PreviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[12px] leading-[18px] text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
