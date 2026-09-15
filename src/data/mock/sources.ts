import { subDays, subHours } from "date-fns"

const now = new Date()
const hoursAgo = (n: number) => subHours(now, n).toISOString()
const daysAgo = (n: number) => subDays(now, n).toISOString()

/**
 * Two independent sources agreeing is what justifies raising `dataStatus`
 * to `verified`. Single-source rows are the ones most likely to be wrong.
 */
export const mockSources = [
  { id: "src-1", eventId: "ev-merti-seganen", type: "poster", url: null, note: "Poster panitia, difoto di pertigaan Campursari", recordedAt: daysAgo(21) },
  { id: "src-2", eventId: "ev-merti-seganen-h1", type: "tiktok", url: "https://www.tiktok.com/@contoh/video/1000000000000000001", note: null, recordedAt: hoursAgo(3) },
  { id: "src-3", eventId: "ev-merti-seganen-h1", type: "word_of_mouth", note: "Dikonfirmasi ketua panitia lewat tetangga", url: null, recordedAt: hoursAgo(3) },
  { id: "src-4", eventId: "ev-merti-seganen-h2", type: "poster", url: null, note: null, recordedAt: daysAgo(21) },
  { id: "src-5", eventId: "ev-merti-seganen-h3", type: "poster", url: null, note: null, recordedAt: daysAgo(21) },

  { id: "src-6", eventId: "ev-pagelaran-gesing", type: "instagram", url: "https://www.instagram.com/p/CONTOH0001/", note: null, recordedAt: hoursAgo(2) },
  { id: "src-7", eventId: "ev-pagelaran-gesing", type: "whatsapp", url: null, note: "Broadcast grup karang taruna", recordedAt: hoursAgo(2) },

  { id: "src-8", eventId: "ev-karnaval-parakan", type: "official", url: "https://contoh.temanggungkab.go.id/agenda/karnaval-wanutengah", note: "Pengumuman pemerintah desa", recordedAt: daysAgo(11) },

  { id: "src-9", eventId: "ev-hajatan-lamuk", type: "word_of_mouth", url: null, note: "Kabar dari kenalan di Legoksari", recordedAt: hoursAgo(9) },
  { id: "src-10", eventId: "ev-hajatan-jampiroso", type: "whatsapp", url: null, note: "Japri pengurus grup, minta tidak disebar", recordedAt: hoursAgo(30) },

  { id: "src-11", eventId: "ev-festival-traji", type: "facebook", url: "https://www.facebook.com/contoh/posts/1000000001", note: "Pengumuman pembatalan menyusul di kolom komentar", recordedAt: hoursAgo(5) },
  { id: "src-12", eventId: "ev-festival-traji", type: "instagram", url: "https://www.instagram.com/p/CONTOH0002/", note: null, recordedAt: daysAgo(18) },

  { id: "src-13", eventId: "ev-jaranan-krajan-campursari", type: "tiktok", url: "https://www.tiktok.com/@contoh/video/1000000000000000002", note: "Caption bahasa Jawa, tanggal ditafsirkan manual", recordedAt: hoursAgo(14) },
  { id: "src-14", eventId: "ev-pagelaran-danupayan", type: "poster", url: null, note: null, recordedAt: daysAgo(8) },
  { id: "src-15", eventId: "ev-jaranan-krajan-gesing", type: "tiktok", url: "https://www.tiktok.com/@contoh/video/1000000000000000003", note: null, recordedAt: hoursAgo(38) },
  { id: "src-16", eventId: "ev-draft-sidorejo", type: "word_of_mouth", url: null, note: "Belum dikonfirmasi siapa pun", recordedAt: hoursAgo(4) },
  { id: "src-17", eventId: "ev-pagelaran-muntung", type: "facebook", url: "https://www.facebook.com/contoh/posts/1000000002", note: "Diundur karena cuaca", recordedAt: hoursAgo(11) },
  { id: "src-18", eventId: "ev-rejected-kedungumpul", type: "tiktok", url: "https://www.tiktok.com/@contoh/video/1000000000000000004", note: "Ternyata video lama diunggah ulang", recordedAt: daysAgo(3) },
  { id: "src-19", eventId: "ev-merti-tegalsari", type: "poster", url: null, note: null, recordedAt: daysAgo(45) },
  { id: "src-20", eventId: "ev-festival-sindoro", type: "official", url: "https://contoh.temanggungkab.go.id/agenda/festival-lereng-sindoro", note: null, recordedAt: daysAgo(30) },
  { id: "src-21", eventId: "ev-festival-sindoro", type: "instagram", url: "https://www.instagram.com/p/CONTOH0003/", note: null, recordedAt: hoursAgo(48) },
  { id: "src-22", eventId: "ev-ketoprak-menggoro", type: "poster", url: null, note: null, recordedAt: daysAgo(20) },
  { id: "src-23", eventId: "ev-wayang-jampiroso", type: "poster", url: null, note: null, recordedAt: daysAgo(25) },
  { id: "src-24", eventId: "ev-past-ngasinan", type: "tiktok", url: "https://www.tiktok.com/@contoh/video/1000000000000000005", note: null, recordedAt: daysAgo(9) },
  { id: "src-26", eventId: "ev-petik-kopi-gemawang", type: "poster", url: null, note: "Poster dari Sedyo Utomo Pontong sendiri — grup mengabarkan dirinya tampil, bukan panitia mengumumkan susunan acara. Tanggal aslinya 18 Juli 2026", recordedAt: daysAgo(2) },
  { id: "src-25", eventId: "ev-past-gondang", type: "poster", url: null, note: null, recordedAt: daysAgo(28) },
]
