/**
 * Who performs at which event, and what they bring.
 *
 * The art form is attached to the performance, not to the group: the same
 * group brings topeng ireng one night and warok the next.
 */
export const mockEventPerformers = [
  { id: "epf-1", eventId: "ev-merti-seganen-h1", groupId: "grp-kridho-mudo", role: "host", sortOrder: 1, rawArtForm: null },
  { id: "epf-2", eventId: "ev-merti-seganen-h1", groupId: "grp-mekar-budoyo", role: "supporting", sortOrder: 2, rawArtForm: null },
  { id: "epf-3", eventId: "ev-merti-seganen-h1", groupId: "grp-krido-laras", role: "guest_star", sortOrder: 3, rawArtForm: null },

  { id: "epf-4", eventId: "ev-merti-seganen-h2", groupId: "grp-kridho-mudo", role: "host", sortOrder: 1, rawArtForm: null },
  { id: "epf-5", eventId: "ev-merti-seganen-h2", groupId: "grp-panji-kusumo", role: "supporting", sortOrder: 2, rawArtForm: null },

  { id: "epf-6", eventId: "ev-merti-seganen-h3", groupId: "grp-panji-kusumo", role: "host", sortOrder: 1, rawArtForm: null },

  { id: "epf-7", eventId: "ev-pagelaran-gesing", groupId: "grp-turonggo-seto", role: "host", sortOrder: 1, rawArtForm: null },
  { id: "epf-8", eventId: "ev-pagelaran-gesing", groupId: "grp-langen-turonggo", role: "guest_star", sortOrder: 2, rawArtForm: null },

  { id: "epf-9", eventId: "ev-karnaval-parakan", groupId: "grp-langen-turonggo", role: "host", sortOrder: 1, rawArtForm: null },
  { id: "epf-10", eventId: "ev-karnaval-parakan", groupId: "grp-sekar-arum", role: "supporting", sortOrder: 2, rawArtForm: null },
  { id: "epf-11", eventId: "ev-karnaval-parakan", groupId: "grp-cahyo-mudo", role: "supporting", sortOrder: 3, rawArtForm: null },

  { id: "epf-12", eventId: "ev-hajatan-lamuk", groupId: "grp-ngesti-budoyo", role: "host", sortOrder: 1, rawArtForm: null },

  { id: "epf-13", eventId: "ev-hajatan-jampiroso", groupId: "grp-panji-kusumo", role: "host", sortOrder: 1, rawArtForm: null },
  { id: "epf-14", eventId: "ev-hajatan-jampiroso", groupId: "grp-tunas-mekar", role: "guest_star", sortOrder: 2, rawArtForm: null },

  { id: "epf-15", eventId: "ev-festival-traji", groupId: "grp-langen-turonggo", role: "host", sortOrder: 1, rawArtForm: null },
  { id: "epf-16", eventId: "ev-festival-traji", groupId: "grp-setyo-budoyo", role: "supporting", sortOrder: 2, rawArtForm: null },
  { id: "epf-17", eventId: "ev-festival-traji", groupId: "grp-sido-rukun", role: "guest_star", sortOrder: 3, rawArtForm: null },

  { id: "epf-18", eventId: "ev-jaranan-krajan-campursari", groupId: "grp-kridho-mudo", role: "host", sortOrder: 1, rawArtForm: null },

  /* Sebutan yang belum terdaftar — dicatat apa adanya, dipetakan nanti. */
  { id: "epf-19", eventId: "ev-pagelaran-danupayan", groupId: "grp-wahyu-manunggal", role: "host", sortOrder: 1, rawArtForm: "lengger campur jaranan" },
  { id: "epf-20", eventId: "ev-pagelaran-danupayan", groupId: "grp-tri-tunggal", role: "supporting", sortOrder: 2, rawArtForm: null },

  { id: "epf-21", eventId: "ev-jaranan-krajan-gesing", groupId: "grp-turonggo-seto", role: "host", sortOrder: 1, rawArtForm: null },

  { id: "epf-22", eventId: "ev-draft-sidorejo", groupId: "grp-cahyo-mudo", role: "host", sortOrder: 1, rawArtForm: "jaranan + gedruk, belum pasti" },

  { id: "epf-23", eventId: "ev-pagelaran-muntung", groupId: "grp-tri-tunggal", role: "host", sortOrder: 1, rawArtForm: null },
  { id: "epf-24", eventId: "ev-pagelaran-muntung", groupId: "grp-krido-laras", role: "guest_star", sortOrder: 2, rawArtForm: null },

  { id: "epf-25", eventId: "ev-rejected-kedungumpul", groupId: "grp-setyo-budoyo", role: "host", sortOrder: 1, rawArtForm: null },

  { id: "epf-26", eventId: "ev-merti-tegalsari", groupId: "grp-setyo-budoyo", role: "host", sortOrder: 1, rawArtForm: null },

  { id: "epf-27", eventId: "ev-festival-sindoro", groupId: "grp-kridho-mudo", role: "host", sortOrder: 1, rawArtForm: null },
  { id: "epf-28", eventId: "ev-festival-sindoro", groupId: "grp-turonggo-seto", role: "supporting", sortOrder: 2, rawArtForm: null },
  { id: "epf-29", eventId: "ev-festival-sindoro", groupId: "grp-tunas-mekar", role: "guest_star", sortOrder: 3, rawArtForm: null },
  { id: "epf-30", eventId: "ev-festival-sindoro", groupId: "grp-sido-rukun", role: "guest_star", sortOrder: 4, rawArtForm: null },

  { id: "epf-31", eventId: "ev-ketoprak-menggoro", groupId: "grp-sekar-arum", role: "host", sortOrder: 1, rawArtForm: null },
  { id: "epf-32", eventId: "ev-wayang-jampiroso", groupId: "grp-panji-kusumo", role: "host", sortOrder: 1, rawArtForm: null },

  { id: "epf-36", eventId: "ev-petik-kopi-gemawang", groupId: "grp-sedyo-utomo", role: "guest_star", sortOrder: 1, rawArtForm: null },

  { id: "epf-33", eventId: "ev-past-ngasinan", groupId: "grp-turonggo-seto", role: "host", sortOrder: 1, rawArtForm: null },
  { id: "epf-34", eventId: "ev-past-gondang", groupId: "grp-mekar-budoyo", role: "host", sortOrder: 1, rawArtForm: null },
  { id: "epf-35", eventId: "ev-past-gondang", groupId: "grp-langen-turonggo", role: "guest_star", sortOrder: 2, rawArtForm: null },
] as const

export const mockPerformanceArtForms = [
  { eventPerformerId: "epf-1", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-2", artFormId: "art-topeng-ireng" },
  { eventPerformerId: "epf-3", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-3", artFormId: "art-buto-gedruk" },
  { eventPerformerId: "epf-4", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-5", artFormId: "art-kebo-giro" },
  { eventPerformerId: "epf-6", artFormId: "art-wayang" },
  { eventPerformerId: "epf-7", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-8", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-8", artFormId: "art-warok" },
  { eventPerformerId: "epf-9", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-10", artFormId: "art-topeng-ireng" },
  { eventPerformerId: "epf-11", artFormId: "art-buto-gedruk" },
  { eventPerformerId: "epf-12", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-13", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-14", artFormId: "art-topeng-ireng" },
  { eventPerformerId: "epf-15", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-16", artFormId: "art-warok" },
  { eventPerformerId: "epf-17", artFormId: "art-buto-gedruk" },
  { eventPerformerId: "epf-18", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-20", artFormId: "art-kebo-giro" },
  { eventPerformerId: "epf-21", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-23", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-24", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-25", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-26", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-26", artFormId: "art-topeng-ireng" },
  { eventPerformerId: "epf-27", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-28", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-29", artFormId: "art-topeng-ireng" },
  { eventPerformerId: "epf-30", artFormId: "art-buto-gedruk" },
  { eventPerformerId: "epf-31", artFormId: "art-ketoprak" },
  { eventPerformerId: "epf-32", artFormId: "art-wayang" },
  { eventPerformerId: "epf-36", artFormId: "art-warok" },
  { eventPerformerId: "epf-33", artFormId: "art-jaran-kepang" },
  { eventPerformerId: "epf-34", artFormId: "art-topeng-ireng" },
  { eventPerformerId: "epf-35", artFormId: "art-jaran-kepang" },
] as const
