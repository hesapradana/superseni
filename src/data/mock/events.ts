import { addDays, formatISO, subDays, subHours } from "date-fns"

/**
 * Dates are generated relative to the day the mock is loaded, so the
 * "hari ini + besok" default view always has something in it during
 * development. Everything else — precision, status, visibility — is fixed.
 */
const now = new Date()

/** `YYYY-MM-DD`, n days from today. */
function day(offset: number): string {
  return formatISO(addDays(now, offset), { representation: "date" })
}

function hoursAgo(n: number): string {
  return subHours(now, n).toISOString()
}

function daysAgo(n: number): string {
  return subDays(now, n).toISOString()
}

const BY = "usr-admin"

export const mockEvents = [
  /* --- Merti dusun 3 hari: satu induk, tiga baris harian ------------------- */
  {
    id: "ev-merti-seganen", parentId: null, slug: "merti-dusun-seganen",
    title: "Merti Dusun Seganen", date: day(0), session: null, startTime: null,
    timePrecision: "tentative", eventTypeId: "etp-merti-dusun", regionId: "ham-seganen",
    rawAddress: "Lapangan Dusun Seganen, Campursari, Ngadirejo",
    organizerName: "Panitia Merti Dusun Seganen",
    imageUrl: "/mock/merti-seganen.jpg", imageAlt: "Poster Merti Dusun Seganen", imageWidth: 1200, imageHeight: 675, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(20),
    createdBy: BY, createdAt: daysAgo(21), updatedAt: hoursAgo(20), meta: {},
  },
  {
    id: "ev-merti-seganen-h1", parentId: "ev-merti-seganen", slug: "merti-dusun-seganen-hari-1",
    title: "Merti Dusun Seganen — Hari 1", date: day(0), session: "evening", startTime: "20:00",
    timePrecision: "exact", eventTypeId: "etp-merti-dusun", regionId: "ham-seganen",
    rawAddress: "Lapangan Dusun Seganen, Campursari, Ngadirejo",
    organizerName: "Panitia Merti Dusun Seganen",
    imageUrl: "/mock/merti-seganen.jpg", imageAlt: "Poster Merti Dusun Seganen", imageWidth: 1200, imageHeight: 675, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(3),
    createdBy: BY, createdAt: daysAgo(21), updatedAt: hoursAgo(3), meta: {},
  },
  {
    id: "ev-merti-seganen-h2", parentId: "ev-merti-seganen", slug: "merti-dusun-seganen-hari-2",
    title: "Merti Dusun Seganen — Hari 2", date: day(1), session: "afternoon", startTime: "13:00",
    timePrecision: "exact", eventTypeId: "etp-merti-dusun", regionId: "ham-seganen",
    rawAddress: "Lapangan Dusun Seganen, Campursari, Ngadirejo",
    organizerName: "Panitia Merti Dusun Seganen",
    imageUrl: "/mock/merti-seganen.jpg", imageAlt: "Poster Merti Dusun Seganen", imageWidth: 1200, imageHeight: 675, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(3),
    createdBy: BY, createdAt: daysAgo(21), updatedAt: hoursAgo(3), meta: {},
  },
  {
    id: "ev-merti-seganen-h3", parentId: "ev-merti-seganen", slug: "merti-dusun-seganen-hari-3",
    title: "Merti Dusun Seganen — Hari 3", date: day(2), session: "night", startTime: "21:00",
    timePrecision: "approximate", eventTypeId: "etp-merti-dusun", regionId: "ham-seganen",
    rawAddress: "Lapangan Dusun Seganen, Campursari, Ngadirejo",
    organizerName: "Panitia Merti Dusun Seganen",
    imageUrl: "/mock/merti-dusun-seganen-hari-3.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(3),
    createdBy: BY, createdAt: daysAgo(21), updatedAt: hoursAgo(3), meta: {},
  },

  /* --- Hari ini ------------------------------------------------------------ */
  {
    id: "ev-pagelaran-gesing", parentId: null, slug: "pagelaran-jaranan-gesing",
    title: null, date: day(0), session: "night", startTime: "20:30",
    timePrecision: "exact", eventTypeId: "etp-pagelaran", regionId: "ham-krajan-gesing",
    rawAddress: "Halaman Balai Dusun Krajan, Gesing, Kandangan",
    organizerName: "Karang Taruna Gesing",
    imageUrl: "/mock/pagelaran-gesing.jpg", imageAlt: null, imageWidth: 1200, imageHeight: 675, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(2),
    createdBy: BY, createdAt: daysAgo(4), updatedAt: hoursAgo(2), meta: {},
  },
  {
    id: "ev-karnaval-parakan", parentId: null, slug: "karnaval-budaya-wanutengah",
    title: "Karnaval Budaya Wanutengah", date: day(0), session: "morning", startTime: "08:00",
    timePrecision: "exact", eventTypeId: "etp-karnaval", regionId: "vil-wanutengah",
    rawAddress: "Start dari Balai Desa Wanutengah, Parakan",
    organizerName: "Pemerintah Desa Wanutengah",
    imageUrl: "/mock/karnaval-budaya-wanutengah-2x3.jpg", imageAlt: "Karnaval Budaya Wanutengah tahun lalu", imageWidth: 800, imageHeight: 1200, visibility: "public",
    dataStatus: "verified", eventStatus: "ongoing", lastVerifiedAt: hoursAgo(6),
    createdBy: BY, createdAt: daysAgo(11), updatedAt: hoursAgo(6), meta: {},
  },
  {
    id: "ev-hajatan-lamuk", parentId: null, slug: "hajatan-lamuk-tlogomulyo",
    title: null, date: day(0), session: "afternoon", startTime: null,
    timePrecision: "tentative", eventTypeId: "etp-hajatan", regionId: "ham-lamuk",
    rawAddress: "Rumah Bp. Slamet, Dusun Lamuk, Legoksari, Tlogomulyo",
    organizerName: "Keluarga Bp. Slamet",
    imageUrl: "/mock/hajatan-tertutup.jpg", imageAlt: "Poster hajatan", imageWidth: 1200, imageHeight: 675, visibility: "limited",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(9),
    createdBy: BY, createdAt: daysAgo(3), updatedAt: hoursAgo(9), meta: {},
  },
  {
    id: "ev-hajatan-jampiroso", parentId: null, slug: "hajatan-jampiroso",
    title: null, date: day(0), session: "evening", startTime: "16:00",
    timePrecision: "approximate", eventTypeId: "etp-hajatan", regionId: "vil-jampiroso",
    rawAddress: "Kediaman keluarga, Jampiroso, Temanggung",
    organizerName: "Keluarga Ibu Rahayu",
    imageUrl: "/mock/hajatan-tertutup.jpg", imageAlt: "Poster hajatan", imageWidth: 1200, imageHeight: 675, visibility: "private",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(30),
    createdBy: BY, createdAt: daysAgo(6), updatedAt: hoursAgo(30), meta: {},
  },

  /* --- Besok --------------------------------------------------------------- */
  {
    id: "ev-festival-traji", parentId: null, slug: "festival-lereng-traji",
    title: "Festival Lereng Traji", date: day(1), session: "evening", startTime: "16:00",
    timePrecision: "approximate", eventTypeId: "etp-festival", regionId: "ham-ngemplak",
    rawAddress: "Lapangan Ngemplak, Traji, Parakan",
    organizerName: "Panitia Festival Lereng Traji",
    imageUrl: "/mock/festival-traji.jpg", imageAlt: "Poster Festival Lereng Traji", imageWidth: 1200, imageHeight: 675, visibility: "public",
    dataStatus: "verified", eventStatus: "cancelled", lastVerifiedAt: hoursAgo(5),
    createdBy: BY, createdAt: daysAgo(18), updatedAt: hoursAgo(5), meta: {},
  },
  {
    id: "ev-jaranan-krajan-campursari", parentId: null, slug: "jaranan-krajan-campursari",
    title: null, date: day(1), session: "night", startTime: null,
    timePrecision: "tentative", eventTypeId: "etp-pagelaran", regionId: "ham-krajan-campursari",
    rawAddress: "Dusun Krajan, Campursari, Ngadirejo",
    organizerName: null,
    imageUrl: "/mock/jaranan-krajan-campursari-1x1.jpg", imageAlt: null, imageWidth: 1080, imageHeight: 1080, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(14),
    createdBy: BY, createdAt: daysAgo(2), updatedAt: hoursAgo(14), meta: {},
  },
  {
    id: "ev-pagelaran-danupayan", parentId: null, slug: "pagelaran-danupayan-bulu",
    title: "Pentas Tutup Tahun Danupayan", date: day(1), session: "evening", startTime: "19:00",
    timePrecision: "exact", eventTypeId: "etp-pagelaran", regionId: "ham-jetis",
    rawAddress: "Lapangan Jetis, Danupayan, Bulu",
    organizerName: "Karang Taruna Danupayan",
    imageUrl: "/mock/danupayan.jpg", imageAlt: null, imageWidth: 1200, imageHeight: 675, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(26),
    createdBy: BY, createdAt: daysAgo(8), updatedAt: hoursAgo(26), meta: {},
  },

  /* --- Lusa dan seterusnya -------------------------------------------------- */
  {
    id: "ev-jaranan-krajan-gesing", parentId: null, slug: "jaranan-krajan-gesing",
    title: null, date: day(2), session: "night", startTime: "20:00",
    timePrecision: "approximate", eventTypeId: "etp-pagelaran", regionId: "ham-krajan-gesing",
    rawAddress: "Dusun Krajan, Gesing, Kandangan",
    organizerName: null,
    imageUrl: "/mock/jaranan-krajan-gesing.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(38),
    createdBy: BY, createdAt: daysAgo(5), updatedAt: hoursAgo(38), meta: {},
  },
  {
    id: "ev-draft-sidorejo", parentId: null, slug: "pentas-sidorejo-jumo",
    title: "Pentas Sidorejo", date: day(2), session: "afternoon", startTime: null,
    timePrecision: "tentative", eventTypeId: "etp-pagelaran", regionId: "ham-sidorejo",
    rawAddress: "Belum jelas, katanya di lapangan dusun",
    organizerName: null,
    imageUrl: "/mock/pentas-sidorejo-jumo.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200, visibility: "public",
    dataStatus: "draft", eventStatus: "scheduled", lastVerifiedAt: null,
    createdBy: BY, createdAt: hoursAgo(4), updatedAt: hoursAgo(4), meta: {},
  },
  {
    id: "ev-pagelaran-muntung", parentId: null, slug: "pagelaran-muntung-candiroto",
    title: "Pagelaran Muntung", date: day(3), session: "night", startTime: "20:00",
    timePrecision: "exact", eventTypeId: "etp-pagelaran", regionId: "vil-muntung",
    rawAddress: "Lapangan Desa Muntung, Candiroto",
    organizerName: "Panitia Bersih Desa Muntung",
    imageUrl: "/mock/pagelaran-muntung-candiroto-1x1.jpg", imageAlt: null, imageWidth: 1080, imageHeight: 1080, visibility: "public",
    dataStatus: "verified", eventStatus: "postponed", lastVerifiedAt: hoursAgo(11),
    createdBy: BY, createdAt: daysAgo(14), updatedAt: hoursAgo(11), meta: {},
  },
  {
    id: "ev-rejected-kedungumpul", parentId: null, slug: "pentas-kedungumpul",
    title: "Pentas Kedungumpul", date: day(3), session: "night", startTime: null,
    timePrecision: "tentative", eventTypeId: "etp-lainnya", regionId: "ham-tegalsari",
    rawAddress: "Tegalsari, Kedungumpul, Kandangan",
    organizerName: null,
    imageUrl: "/mock/pentas-kedungumpul.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200, visibility: "public",
    dataStatus: "rejected", eventStatus: "scheduled", lastVerifiedAt: daysAgo(2),
    createdBy: BY, createdAt: daysAgo(3), updatedAt: daysAgo(2), meta: {},
  },
  {
    id: "ev-draft-menggoro", parentId: null, slug: "pentas-menggoro-tembarak",
    title: null, date: day(4), session: null, startTime: null,
    timePrecision: "tentative", eventTypeId: "etp-lainnya", regionId: "vil-menggoro",
    rawAddress: "Menggoro, Tembarak — detail menyusul",
    organizerName: null,
    imageUrl: "/mock/pentas-menggoro-tembarak.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200, visibility: "public",
    dataStatus: "draft", eventStatus: "scheduled", lastVerifiedAt: null,
    createdBy: BY, createdAt: hoursAgo(30), updatedAt: hoursAgo(30), meta: {},
  },
  {
    id: "ev-merti-tegalsari", parentId: null, slug: "merti-dusun-tegalsari",
    title: "Merti Dusun Tegalsari", date: day(6), session: "night", startTime: "20:00",
    timePrecision: "exact", eventTypeId: "etp-merti-dusun", regionId: "ham-tegalsari",
    rawAddress: "Lapangan Tegalsari, Kedungumpul, Kandangan",
    organizerName: "Panitia Merti Dusun Tegalsari",
    imageUrl: "/mock/merti-dusun-tegalsari-4x5.jpg", imageAlt: null, imageWidth: 1080, imageHeight: 1350, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: daysAgo(41),
    createdBy: BY, createdAt: daysAgo(45), updatedAt: daysAgo(41), meta: {},
  },
  {
    id: "ev-festival-sindoro", parentId: null, slug: "festival-lereng-sindoro",
    title: "Festival Lereng Sindoro", date: day(9), session: "afternoon", startTime: "14:00",
    timePrecision: "exact", eventTypeId: "etp-festival", regionId: "vil-campursari",
    rawAddress: "Lapangan Campursari, Ngadirejo",
    organizerName: "Disbudpar Kabupaten Temanggung",
    imageUrl: "/mock/festival-sindoro.jpg", imageAlt: "Poster Festival Lereng Sindoro", imageWidth: 1200, imageHeight: 675, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(48),
    createdBy: BY, createdAt: daysAgo(30), updatedAt: hoursAgo(48), meta: {},
  },
  {
    id: "ev-ketoprak-menggoro", parentId: null, slug: "ketoprak-menggoro",
    title: "Ketoprak Menggoro", date: day(12), session: "night", startTime: "21:00",
    timePrecision: "exact", eventTypeId: "etp-pagelaran", regionId: "vil-menggoro",
    rawAddress: "Balai Desa Menggoro, Tembarak",
    organizerName: "Paguyuban Seni Menggoro",
    imageUrl: "/mock/ketoprak-menggoro.jpg", imageAlt: null, imageWidth: 1200, imageHeight: 675, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(70),
    createdBy: BY, createdAt: daysAgo(20), updatedAt: hoursAgo(70), meta: {},
  },
  {
    id: "ev-wayang-jampiroso", parentId: null, slug: "wayang-kulit-jampiroso",
    title: "Wayang Kulit Bersih Desa Jampiroso", date: day(14), session: "night", startTime: "21:00",
    timePrecision: "exact", eventTypeId: "etp-merti-dusun", regionId: "vil-jampiroso",
    rawAddress: "Halaman Balai Kelurahan Jampiroso, Temanggung",
    organizerName: "Panitia Bersih Desa Jampiroso",
    imageUrl: "/mock/wayang-jampiroso.jpg", imageAlt: null, imageWidth: 1200, imageHeight: 675, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(52),
    createdBy: BY, createdAt: daysAgo(25), updatedAt: hoursAgo(52), meta: {},
  },

  /*
   * Dari poster asli di public/mock/sedyo-utomo-pontong/1.png.
   *
   * Posternya dari grupnya sendiri: Sedyo Utomo Pontong mengabarkan bahwa
   * dirinya tampil di festival itu. Jadi baris ini tahu SATU penampil, bukan
   * susunan acara festivalnya. Hampir pasti ada penampil lain yang belum
   * tercatat, dan itu keadaan normal — bukan data yang kurang lengkap.
   *
   * Tanggalnya digeser ke besok; aslinya 18 Juli 2026.
   */
  {
    id: "ev-petik-kopi-gemawang", parentId: null, slug: "festival-petik-kopi-gemawang",
    title: "Festival Petik Kopi Gemawang 2026", date: day(1), session: "evening", startTime: "16:00",
    timePrecision: "exact", eventTypeId: "etp-festival", regionId: "ham-lempong",
    rawAddress: "Lap. Kalicebong Lempong, Kemiriombo, Gemawang",
    organizerName: null,
    imageUrl: "/mock/sedyo-utomo-pontong/1.png", imageAlt: "Poster Festival Petik Kopi Gemawang 2026", imageWidth: 720, imageHeight: 1280, visibility: "public",
    dataStatus: "verified", eventStatus: "scheduled", lastVerifiedAt: hoursAgo(8),
    createdBy: BY, createdAt: daysAgo(2), updatedAt: hoursAgo(8), meta: {},
  },

  /* --- Sudah lewat, tidak dihapus ------------------------------------------ */
  {
    id: "ev-past-ngasinan", parentId: null, slug: "pentas-ngasinan-kandangan",
    title: null, date: day(-2), session: "night", startTime: "20:00",
    timePrecision: "exact", eventTypeId: "etp-pagelaran", regionId: "ham-ngasinan",
    rawAddress: "Dusun Ngasinan, Gesing, Kandangan",
    organizerName: null,
    imageUrl: "/mock/pentas-ngasinan-kandangan.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200, visibility: "public",
    dataStatus: "verified", eventStatus: "completed", lastVerifiedAt: daysAgo(2),
    createdBy: BY, createdAt: daysAgo(9), updatedAt: daysAgo(2), meta: {},
  },
  {
    id: "ev-past-gondang", parentId: null, slug: "merti-dusun-gondang",
    title: "Merti Dusun Gondang", date: day(-6), session: "afternoon", startTime: "13:30",
    timePrecision: "exact", eventTypeId: "etp-merti-dusun", regionId: "ham-gondang",
    rawAddress: "Lapangan Gondang, Gejagan, Ngadirejo",
    organizerName: "Panitia Merti Dusun Gondang",
    imageUrl: "/mock/merti-dusun-gondang.jpg", imageAlt: null, imageWidth: 900, imageHeight: 1200, visibility: "public",
    dataStatus: "verified", eventStatus: "completed", lastVerifiedAt: daysAgo(6),
    createdBy: BY, createdAt: daysAgo(28), updatedAt: daysAgo(6), meta: {},
  },
]
