import type {
  DataStatus,
  EventStatus,
  PerformerRole,
  RegionLevel,
  Session,
  SourceType,
  TimePrecision,
  Visibility,
} from "@/data/types"

/**
 * Every string a visitor can read lives here.
 *
 * Identifiers stay English, values stay Indonesian. The label maps are typed as
 * `Record<Enum, string>`, so adding a value to an enum breaks the build until a
 * translation exists — that is how raw enum values are kept off the screen.
 */

export const sessionLabels: Record<Session, string> = {
  morning: "Pagi",
  afternoon: "Siang",
  evening: "Sore",
  night: "Malam",
}

export const timePrecisionLabels: Record<TimePrecision, string> = {
  exact: "Jam pasti",
  approximate: "Perkiraan jam",
  tentative: "Belum pasti",
}

export const visibilityLabels: Record<Visibility, string> = {
  public: "Terbuka",
  limited: "Terbatas",
  private: "Tertutup",
}

export const dataStatusLabels: Record<DataStatus, string> = {
  draft: "Draf",
  verified: "Terverifikasi",
  rejected: "Ditolak",
}

export const eventStatusLabels: Record<EventStatus, string> = {
  scheduled: "Terjadwal",
  ongoing: "Sedang berlangsung",
  completed: "Selesai",
  cancelled: "Batal",
  postponed: "Diundur",
}

export const performerRoleLabels: Record<PerformerRole, string> = {
  host: "Tuan rumah",
  supporting: "Pengisi",
  guest_star: "Bintang tamu",
}

export const sourceTypeLabels: Record<SourceType, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  poster: "Poster",
  word_of_mouth: "Kabar langsung",
  official: "Sumber resmi",
}

export const regionLevelLabels: Record<RegionLevel, string> = {
  regency: "Kabupaten",
  district: "Kecamatan",
  village: "Desa",
  hamlet: "Dusun",
}

export const copy = {
  site: {
    name: "Jadwal Kesenian Temanggung",
    shortName: "Jadwal Kesenian",
    /* Header line. Short on purpose: it sits above the fold on a phone. */
    tagline: "Ada pentas apa, di mana, kapan.",
    /* Longer form, for <meta description> only. */
    description:
      "Jadwal pentas kesenian tradisional yang tampil di Kabupaten Temanggung. Ada pentas apa, di mana, kapan.",
  },

  home: {
    heading: "Pentas hari ini dan besok",
    resultCount: (count: number) => `${count} pentas`,
    emptyTitle: "Belum ada jadwal tercatat",
    emptyDescription:
      "Belum ada pentas yang tercatat untuk rentang ini. Bukan berarti tidak ada pentas — hanya belum masuk catatan.",
    emptyFilteredDescription:
      "Tidak ada pentas yang cocok dengan filter ini. Coba lebarkan rentang tanggal atau hapus sebagian filter.",
  },

  dayHeading: {
    today: "Hari ini",
    tomorrow: "Besok",
    yesterday: "Kemarin",
  },

  feed: {
    heading: "Daftar pentas",
  },

  map: {
    heading: "Peta kesenian",
    countLabel: (count: number) => `${count} pentas akan datang`,
    empty: "Belum ada pentas berkoordinat untuk ditampilkan di peta.",
    pinLabel: (district: string, count: number) =>
      `${district}, ${count} pentas — buka daftarnya`,
    modeMap: "Peta",
    modeFeed: "Daftar",
    modePoster: "Poster",
    modeLabel: "Cara melihat",
  },

  poster: {
    emptyTitle: "Belum ada poster",
    emptyDescription: "Belum ada poster pentas yang akan datang.",
  },

  nav: {
    label: "Navigasi",
    explore: "Explore",
    upload: "Upload",
  },

  upload: {
    title: "Unggah poster",
    comingSoon: "Fitur unggah poster sedang disiapkan.",
  },

  filters: {
    heading: "Saring jadwal",
    artFormHeading: "Pilih jenis kesenian",
    district: "Kecamatan",
    artForm: "Jenis kesenian",
    eventType: "Jenis acara",
    from: "Dari tanggal",
    to: "Sampai tanggal",
    query: "Cari nama grup",
    queryPlaceholder: "Cari nama grup",
    all: "Semua",
    reset: "Hapus filter",
    activeCount: (count: number) => `${count} filter aktif`,
    toggle: "Buka atau tutup filter",
  },

  event: {
    untitled: "Pentas kesenian",
    titleFallback: (eventType: string, place: string) => `${eventType} di ${place}`,
    placeWithDistrict: (place: string, district: string) => `${place}, ${district}`,
    guestFrom: (origin: string) => `dari ${origin}`,
    guestStarLead: "Bintang tamu:",
    timeUnknown: "Waktu belum pasti",
    approximatePrefix: "±",
    locationHidden: "Lokasi tidak dibuka",
    locationLimitedNote:
      "Hajatan pribadi. Lokasi hanya ditampilkan sampai kecamatan.",
    locationLabel: "Lokasi",
    organizerLabel: "Penyelenggara",
    performersLabel: "Penampil",
    sourcesLabel: "Sumber",
    artFormsLabel: "Jenis kesenian",
    seriesLabel: "Bagian dari rangkaian",
    /* The map button is icon-only, so this is what a screen reader announces. */
    openInMaps: "Buka di Google Maps",
    viewPoster: "Lihat poster ukuran penuh",
    poster: "Poster",
    viewDetail: "Lihat detail",
    noPerformers: "Penampil belum tercatat",
    noSources: "Sumber belum tercatat",
    backToList: "Kembali ke jadwal",
    notFoundTitle: "Acara tidak ditemukan",
    notFoundDescription:
      "Acara ini tidak ada, sudah dihapus dari tampilan, atau memang tidak dibuka untuk umum.",
  },

  freshness: {
    never: "Belum pernah diperiksa",
    updated: (relative: string) => `Diperbarui ${relative}`,
    staleWarning: "Sudah lama tidak diperiksa ulang",
  },

  status: {
    cancelledTitle: "Pentas ini dibatalkan",
    cancelledDescription: "Jangan berangkat sebelum ada kabar baru.",
    postponedTitle: "Pentas ini diundur",
    postponedDescription: "Tanggal pengganti belum tercatat.",
  },

  admin: {
    heading: "Panel pengelola",
    listHeading: "Semua acara",
    newEvent: "Catat acara baru",
    filterByDataStatus: "Status data",
    columnDate: "Tanggal",
    columnTitle: "Acara",
    columnRegion: "Lokasi",
    columnPerformers: "Penampil",
    columnDataStatus: "Status data",
    columnEventStatus: "Status acara",
    columnFreshness: "Diperiksa",
  },

  theme: {
    toggle: "Ganti tema terang atau gelap",
  },

  common: {
    loading: "Memuat…",
    close: "Tutup",
    dash: "—",
  },
} as const
