import { addDays, formatISO, subDays, subHours } from "date-fns"

/**
 * Posters as uploaded. Dates are relative to the day the mock loads, so the
 * Explore rules always have something on each side of every boundary:
 *
 * - dated, today or later           → on Explore
 * - dated, already past             → off Explore, still reachable by id
 * - undated, uploaded < 14 days ago → on Explore, below the dated ones
 * - undated, uploaded ≥ 14 days ago → off Explore
 * - removed                         → nowhere
 *
 * The mix of filled and empty fields is deliberate: most real uploads carry
 * nothing but the picture.
 *
 * Source URLs point at made-up accounts on real platforms, so the platform can
 * be read from the host. They are not real posts.
 *
 * Every image except the two under `sedyo-utomo-pontong/` is a placeholder
 * unrelated to the details written next to it — see `public/mock/SUMBER.txt`.
 */
const now = new Date()

/** `YYYY-MM-DD`, n days from today. */
function day(offset: number): string {
  return formatISO(addDays(now, offset), { representation: "date" })
}

function daysAgo(n: number): string {
  return subDays(now, n).toISOString()
}

function hoursAgo(n: number): string {
  return subHours(now, n).toISOString()
}

const ADMIN = "usr-admin"
const SEDYO_UTOMO = "usr-sedyo-utomo"

export const mockPosters = [
  /* --- The real posters --------------------------------------------------- */

  /* Announced by the group itself, with everything filled in. The real date
     is 18 July 2026; shifted to tomorrow so it stays upcoming. */
  {
    id: "k7x2m9qa4b",
    imageUrl: "/mock/sedyo-utomo-pontong/1.png", imageAlt: "Poster Festival Petik Kopi Gemawang 2026", imageWidth: 720, imageHeight: 1280,
    uploadedBy: SEDYO_UTOMO, sourceUrls: ["https://www.tiktok.com/@contoh.sedyoutomo/video/7000000000000000001", "https://www.instagram.com/p/CONTOHkopi01/", "https://www.facebook.com/contoh.sedyoutomo/posts/1000000000000002"],
    groupId: "grp-sedyo-utomo", performanceDate: day(1), startTime: "16:00",
    place: "Lap. Kalicebong Lempong, Kemiriombo, Gemawang", caption: "Festival Petik Kopi Gemawang 2026",
    status: "published", createdAt: daysAgo(2),
  },
  /* The same poster again, passed on through a WhatsApp status and uploaded
     with nothing but the picture. A duplicate on purpose: it stays. */
  {
    id: "p3n8w1zc6e",
    imageUrl: "/mock/sedyo-utomo-pontong/1.png", imageAlt: null, imageWidth: 720, imageHeight: 1280,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: null, performanceDate: null, startTime: null,
    place: null, caption: null,
    status: "published", createdAt: hoursAgo(20),
  },
  /* No event name on the poster at all — only group, place and date. The real
     date is 21 May 2026; shifted six days ahead. */
  {
    id: "r5t0y4ub9h",
    imageUrl: "/mock/sedyo-utomo-pontong/2.png", imageAlt: null, imageWidth: 1131, imageHeight: 1600,
    uploadedBy: SEDYO_UTOMO, sourceUrls: ["https://www.instagram.com/p/CONTOHsedyo01/"],
    groupId: "grp-sedyo-utomo", performanceDate: day(6), startTime: null,
    place: "Kauman, Kemiriombo, Gemawang", caption: null,
    status: "published", createdAt: daysAgo(1),
  },

  /* --- Dated, upcoming ---------------------------------------------------- */

  {
    id: "a1m4s8d2f6",
    imageUrl: "/mock/merti-seganen.jpg", imageAlt: "Poster Merti Dusun Seganen", imageWidth: 1200, imageHeight: 675,
    uploadedBy: ADMIN, sourceUrls: ["https://www.facebook.com/contoh.kridhomudo/posts/1000000000000001"],
    groupId: "grp-kridho-mudo", performanceDate: day(0), startTime: "20:00",
    place: "Dusun Seganen", caption: "Merti Dusun Seganen",
    status: "published", createdAt: daysAgo(4),
  },
  {
    id: "b7g3h9j1k5",
    imageUrl: "/mock/pagelaran-gesing.jpg", imageAlt: null, imageWidth: 1200, imageHeight: 675,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: "grp-turonggo-seto", performanceDate: day(0), startTime: "20:30",
    place: null, caption: null,
    status: "published", createdAt: daysAgo(5),
  },
  {
    id: "c2l6z0x4v8",
    imageUrl: "/mock/karnaval-budaya-wanutengah-2x3.jpg", imageAlt: "Karnaval Budaya Wanutengah", imageWidth: 800, imageHeight: 1200,
    uploadedBy: ADMIN, sourceUrls: ["https://www.instagram.com/p/CONTOHkarnaval1/", "https://www.tiktok.com/@contoh.langenturonggo/video/7000000000000000003"],
    groupId: "grp-langen-turonggo", performanceDate: day(0), startTime: "08:00",
    place: "Wanutengah, Parakan", caption: "Karnaval Budaya Wanutengah",
    status: "published", createdAt: daysAgo(6),
  },
  {
    id: "d9b5n1m7q3",
    imageUrl: "/mock/festival-traji.jpg", imageAlt: "Poster Festival Lereng Traji", imageWidth: 1200, imageHeight: 675,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: "grp-langen-turonggo", performanceDate: day(1), startTime: "16:00",
    place: "Traji, Parakan", caption: "Festival Lereng Traji",
    status: "published", createdAt: daysAgo(3),
  },
  {
    id: "e4c8r2t6y0",
    imageUrl: "/mock/danupayan.jpg", imageAlt: null, imageWidth: 1200, imageHeight: 675,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: "grp-wahyu-manunggal", performanceDate: day(1), startTime: "19:00",
    place: "Danupayan, Bulu", caption: "Pentas Tutup Tahun Danupayan",
    status: "published", createdAt: daysAgo(2),
  },
  {
    id: "f0d3u7i1o5",
    imageUrl: "/mock/merti-dusun-seganen-hari-3.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: "grp-panji-kusumo", performanceDate: day(2), startTime: "21:00",
    place: null, caption: null,
    status: "published", createdAt: daysAgo(3),
  },
  {
    id: "g6e9p3a7s1",
    imageUrl: "/mock/jaranan-krajan-gesing.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200,
    uploadedBy: ADMIN, sourceUrls: ["https://www.tiktok.com/@contoh.turonggoseto/video/7000000000000000002"],
    groupId: "grp-turonggo-seto", performanceDate: day(2), startTime: "20:00",
    place: "Krajan, Gesing", caption: null,
    status: "published", createdAt: daysAgo(1),
  },
  {
    id: "h1f5d9g3h7",
    imageUrl: "/mock/pagelaran-muntung-candiroto-1x1.jpg", imageAlt: null, imageWidth: 1080, imageHeight: 1080,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: "grp-tri-tunggal", performanceDate: day(3), startTime: "20:00",
    place: "Muntung, Candiroto", caption: "Pagelaran Muntung",
    status: "published", createdAt: daysAgo(4),
  },
  /* Date only, nothing else. */
  {
    id: "i8g2j6k0l4",
    imageUrl: "/mock/pentas-sidorejo-jumo.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: null, performanceDate: day(4), startTime: null,
    place: null, caption: null,
    status: "published", createdAt: daysAgo(2),
  },
  {
    id: "j3h7z1x5c9",
    imageUrl: "/mock/merti-dusun-tegalsari-4x5.jpg", imageAlt: null, imageWidth: 1080, imageHeight: 1350,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: "grp-setyo-budoyo", performanceDate: day(6), startTime: "20:00",
    place: "Tegalsari", caption: "Merti Dusun Tegalsari",
    status: "published", createdAt: daysAgo(5),
  },
  {
    id: "k0i4v8b2n6",
    imageUrl: "/mock/festival-sindoro.jpg", imageAlt: "Poster Festival Lereng Sindoro", imageWidth: 1200, imageHeight: 675,
    uploadedBy: ADMIN, sourceUrls: ["https://www.instagram.com/p/CONTOHsindoro1/"],
    groupId: "grp-kridho-mudo", performanceDate: day(9), startTime: "14:00",
    place: null, caption: "Festival Lereng Sindoro",
    status: "published", createdAt: daysAgo(6),
  },
  {
    id: "l5j9m3q7w1",
    imageUrl: "/mock/ketoprak-menggoro.jpg", imageAlt: null, imageWidth: 1200, imageHeight: 675,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: "grp-sekar-arum", performanceDate: day(12), startTime: "21:00",
    place: "Menggoro, Tembarak", caption: "Ketoprak Menggoro",
    status: "published", createdAt: daysAgo(3),
  },
  {
    id: "m2k6e0r4t8",
    imageUrl: "/mock/wayang-jampiroso.jpg", imageAlt: null, imageWidth: 1200, imageHeight: 675,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: "grp-panji-kusumo", performanceDate: day(14), startTime: "21:00",
    place: "Jampiroso", caption: "Wayang Kulit Bersih Desa Jampiroso",
    status: "published", createdAt: daysAgo(2),
  },

  /* --- Undated, still within the window ----------------------------------- */

  {
    id: "n7l1y5u9i3",
    imageUrl: "/mock/jaranan-krajan-campursari-1x1.jpg", imageAlt: null, imageWidth: 1080, imageHeight: 1080,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: null, performanceDate: null, startTime: null,
    place: null, caption: null,
    status: "published", createdAt: daysAgo(3),
  },
  /* One day inside the 14-day window. */
  {
    id: "o4m8o2p6a0",
    imageUrl: "/mock/pentas-menggoro-tembarak.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: null, performanceDate: null, startTime: null,
    place: null, caption: null,
    status: "published", createdAt: daysAgo(13),
  },

  /* --- Off Explore -------------------------------------------------------- */

  /* Dated, already past. Reachable by id; gone from the wall. */
  {
    id: "p9n3s7d1f5",
    imageUrl: "/mock/pentas-ngasinan-kandangan.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: "grp-turonggo-seto", performanceDate: day(-2), startTime: "20:00",
    place: "Ngasinan, Kandangan", caption: null,
    status: "published", createdAt: daysAgo(9),
  },
  /* Undated, one day past the window. */
  {
    id: "q6o0g4h8j2",
    imageUrl: "/mock/pentas-kedungumpul.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: null, performanceDate: null, startTime: null,
    place: null, caption: null,
    status: "published", createdAt: daysAgo(15),
  },
  {
    id: "r3p7k1l5z9",
    imageUrl: "/mock/merti-dusun-gondang.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: "grp-mekar-budoyo", performanceDate: null, startTime: null,
    place: "Gondang", caption: "Merti Dusun Gondang",
    status: "published", createdAt: daysAgo(20),
  },
  /* Taken down after a report: a family event with a home address on it.
     Must never appear anywhere public — the file name exists only here. */
  {
    id: "s0q4x8c2v6",
    imageUrl: "/mock/hajatan-tertutup.jpg", imageAlt: null, imageWidth: 1200, imageHeight: 675,
    uploadedBy: ADMIN, sourceUrls: [],
    groupId: "grp-ngesti-budoyo", performanceDate: day(0), startTime: null,
    place: null, caption: null,
    status: "removed", createdAt: daysAgo(1),
  },
] as const
