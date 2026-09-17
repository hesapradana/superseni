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
    /* Lowercase on purpose — that is the name, not a styling choice. */
    name: "superseni",
    tagline: "Temukan seni di sekitarmu.",
  },

  dayHeading: {
    today: "Hari ini",
    tomorrow: "Besok",
    yesterday: "Kemarin",
  },

  poster: {
    emptyTitle: "Belum ada poster",
    emptyDescription: "Belum ada poster pentas yang akan datang.",
    untitled: "Poster pentas",
    altWithGroup: (group: string) => `Poster ${group}`,
    back: "Kembali",
    toExplore: "Ke Explore",
    uploadedAgo: (relative: string) => `Diunggah ${relative}`,
    viewOn: "Lihat di",
    viewOnTitle: "Lihat di",
    noSource: "Tanpa link sumber",
    share: "Bagikan poster",
    shareTo: "Bagikan ke",
    shareMore: "Lainnya",
    sms: "Pesan",
    moreOptions: "Opsi lain",
    copyLink: "Salin link",
    linkCopied: "Link poster disalin",
    download: "Unduh poster",
    viewFull: "Lihat poster penuh",
    groupLabel: "Paguyuban",
    dateLabel: "Tanggal pentas",
    placeLabel: "Tempat",
    uploadedLabel: "Waktu unggah",
    moreToExplore: "Lainnya untuk dijelajahi",
    notFoundTitle: "Poster tidak ditemukan",
    notFoundDescription: "Poster ini tidak ada atau sudah diturunkan.",
  },

  nav: {
    label: "Navigasi",
    explore: "Explore",
    upload: "Upload",
  },

  upload: {
    title: "Unggah poster",
    intro: "Cukup gambarnya. Detail lain boleh dikosongkan.",
    pickImage: "Pilih poster",
    pickImageHint: "JPG, PNG, atau WebP dari galeri",
    replaceImage: "Ganti poster",
    compressing: "Menyiapkan poster…",
    sizeSummary: (before: string, after: string, width: number, height: number) =>
      `${before} → ${after} · ${width}×${height}`,
    detailsHeading: "Detail",
    detailsHint: "Opsional. Semakin lengkap, semakin sering poster tampil di Explore.",
    sourceLabel: "Link sumber",
    sourceHint: "Tempel link postingan poster ini di TikTok, Instagram, atau Facebook.",
    sourcePlaceholder: "https://www.tiktok.com/@…",
    addSource: "Tambah link",
    removeSource: "Hapus link",
    groupLabel: "Paguyuban",
    groupPlaceholder: "Cari paguyuban",
    groupEmpty: "Paguyuban tidak ditemukan",
    dateLabel: "Tanggal pentas",
    today: "Hari ini",
    tomorrow: "Besok",
    thisSaturday: "Sabtu ini",
    thisSunday: "Minggu ini",
    clearDate: "Hapus tanggal",
    timeLabel: "Jam mulai",
    placeLabel: "Tempat",
    placePlaceholder: "Contoh: Lap. Kalicebong Lempong, Gemawang",
    captionLabel: "Keterangan",
    captionPlaceholder: "Contoh: Festival Petik Kopi Gemawang 2026",
    submit: "Unggah",
    submitting: "Mengunggah…",
    previewTitle: "Poster siap diunggah",
    previewNote:
      "Mode contoh: poster belum benar-benar tersimpan karena database belum tersambung.",
    uploadAnother: "Unggah poster lain",
    errors: {
      imageRequired: "Pilih gambar poster dulu.",
      imageTooLarge: "Berkasnya terlalu besar. Pilih gambar di bawah 25 MB.",
      imageUnreadable: "Gambar ini tidak bisa dibaca. Coba simpan ulang sebagai JPG atau PNG.",
      imageStillTooLarge: "Poster masih terlalu besar setelah diperkecil. Coba gambar lain.",
      sourceInvalid: "Link tidak valid. Contoh: https://www.instagram.com/p/…",
      sourceDuplicate: "Link yang sama dimasukkan dua kali.",
      sourceTooMany: "Paling banyak 10 link.",
      timeNeedsDate: "Isi tanggal pentas dulu sebelum jam.",
      tooLong: "Terlalu panjang.",
      generic: "Ada isian yang belum benar.",
      server: "Poster gagal dikirim. Coba lagi.",
    },
  },

  event: {
    untitled: "Pentas kesenian",
    titleFallback: (eventType: string, place: string) => `${eventType} di ${place}`,
    placeWithDistrict: (place: string, district: string) => `${place}, ${district}`,
    guestFrom: (origin: string) => `dari ${origin}`,
    timeUnknown: "Waktu belum pasti",
    approximatePrefix: "±",
  },

  freshness: {
    never: "Belum pernah diperiksa",
    updated: (relative: string) => `Diperbarui ${relative}`,
  },

  theme: {
    toggle: "Ganti tema terang atau gelap",
  },

  common: {
    close: "Tutup",
  },
} as const
