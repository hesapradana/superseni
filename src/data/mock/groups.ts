/**
 * Fictional groups. Names follow the naming habits actually seen in the area
 * so the UI is exercised with realistic string lengths.
 */
export const mockGroups = [
  { id: "grp-kridho-mudo", officialName: "Kridho Mudo", slug: "kridho-mudo", regionId: "ham-seganen", contact: "0812-0000-0001", meta: {} },
  { id: "grp-turonggo-seto", officialName: "Turonggo Seto Mudo", slug: "turonggo-seto-mudo", regionId: "ham-krajan-gesing", contact: null, meta: {} },
  { id: "grp-langen-turonggo", officialName: "Langen Turonggo Jati", slug: "langen-turonggo-jati", regionId: "ham-ngemplak", contact: "0813-0000-0002", meta: {} },
  { id: "grp-setyo-budoyo", officialName: "Setyo Budoyo", slug: "setyo-budoyo", regionId: "ham-tegalsari", contact: null, meta: {} },
  { id: "grp-mekar-budoyo", officialName: "Mekar Budoyo", slug: "mekar-budoyo", regionId: "ham-gondang", contact: null, meta: {} },
  { id: "grp-wahyu-manunggal", officialName: "Wahyu Turonggo Manunggal", slug: "wahyu-turonggo-manunggal", regionId: "ham-jetis", contact: null, meta: {} },
  { id: "grp-sekar-arum", officialName: "Sekar Arum Budoyo", slug: "sekar-arum-budoyo", regionId: "vil-menggoro", contact: null, meta: {} },
  { id: "grp-cahyo-mudo", officialName: "Cahyo Mudo Laras", slug: "cahyo-mudo-laras", regionId: "ham-sidorejo", contact: null, meta: {} },
  { id: "grp-ngesti-budoyo", officialName: "Ngesti Budoyo", slug: "ngesti-budoyo", regionId: "ham-lamuk", contact: null, meta: {} },
  { id: "grp-tri-tunggal", officialName: "Tri Tunggal Budoyo", slug: "tri-tunggal-budoyo", regionId: "vil-muntung", contact: null, meta: {} },
  { id: "grp-panji-kusumo", officialName: "Panji Kusumo", slug: "panji-kusumo", regionId: "vil-jampiroso", contact: null, meta: {} },
  { id: "grp-sedyo-utomo", officialName: "Sedyo Utomo Pontong", slug: "sedyo-utomo-pontong", regionId: "dis-gemawang", contact: null, meta: {} },
  /* Grup luar Temanggung — masuk sirkuit sebagai bintang tamu. */
  { id: "grp-krido-laras", officialName: "Krido Laras Samboyo", slug: "krido-laras-samboyo", regionId: "vil-pentur", contact: null, meta: {} },
  { id: "grp-tunas-mekar", officialName: "Tunas Mekar Grabag", slug: "tunas-mekar-grabag", regionId: "vil-banaran", contact: null, meta: {} },
  { id: "grp-sido-rukun", officialName: "Sido Rukun Kertek", slug: "sido-rukun-kertek", regionId: "vil-purwojati", contact: null, meta: {} },
] as const

export const mockGroupAliases = [
  /* Satu grup, tiga sebutan berbeda di lapangan. */
  { id: "gal-1", groupId: "grp-langen-turonggo", alias: "LTJ" },
  { id: "gal-2", groupId: "grp-langen-turonggo", alias: "Turonggo Jati" },
  { id: "gal-3", groupId: "grp-langen-turonggo", alias: "Jaranan Ngemplak" },

  { id: "gal-4", groupId: "grp-kridho-mudo", alias: "KM Seganen" },
  { id: "gal-5", groupId: "grp-kridho-mudo", alias: "Kridho Mudho" },

  { id: "gal-6", groupId: "grp-turonggo-seto", alias: "Turonggo Seto" },
  { id: "gal-7", groupId: "grp-turonggo-seto", alias: "TSM Gesing" },

  { id: "gal-8", groupId: "grp-krido-laras", alias: "Samboyo Boyolali" },
  { id: "gal-9", groupId: "grp-krido-laras", alias: "Krido Laras" },

  { id: "gal-10", groupId: "grp-wahyu-manunggal", alias: "Wahyu Manunggal" },
  { id: "gal-11", groupId: "grp-setyo-budoyo", alias: "SB Tegalsari" },
  { id: "gal-12", groupId: "grp-ngesti-budoyo", alias: "Ngesti Lamuk" },
] as const
