/**
 * Region tree. Fictional hamlet names, plausible for Temanggung.
 *
 * Note the two distinct hamlets both named "Krajan" under different districts:
 * the tree is what keeps them apart, not the name.
 */
export const mockRegions = [
  /* --- Kabupaten Temanggung ------------------------------------------------ */
  { id: "reg-temanggung", parentId: null, name: "Temanggung", level: "regency", latitude: -7.3167, longitude: 110.1750 },

  { id: "dis-ngadirejo", parentId: "reg-temanggung", name: "Ngadirejo", level: "district", latitude: -7.2408, longitude: 110.0672 },
  { id: "vil-campursari", parentId: "dis-ngadirejo", name: "Campursari", level: "village", latitude: -7.2361, longitude: 110.0598 },
  { id: "ham-seganen", parentId: "vil-campursari", name: "Seganen", level: "hamlet", latitude: -7.2339, longitude: 110.0571 },
  { id: "ham-krajan-campursari", parentId: "vil-campursari", name: "Krajan", level: "hamlet", latitude: -7.2377, longitude: 110.0615 },
  { id: "vil-gejagan", parentId: "dis-ngadirejo", name: "Gejagan", level: "village", latitude: null, longitude: null },
  { id: "ham-gondang", parentId: "vil-gejagan", name: "Gondang", level: "hamlet", latitude: null, longitude: null },

  { id: "dis-kandangan", parentId: "reg-temanggung", name: "Kandangan", level: "district", latitude: -7.2189, longitude: 110.1533 },
  { id: "vil-gesing", parentId: "dis-kandangan", name: "Gesing", level: "village", latitude: -7.2094, longitude: 110.1441 },
  { id: "ham-krajan-gesing", parentId: "vil-gesing", name: "Krajan", level: "hamlet", latitude: -7.2081, longitude: 110.1428 },
  { id: "ham-ngasinan", parentId: "vil-gesing", name: "Ngasinan", level: "hamlet", latitude: null, longitude: null },
  { id: "vil-kedungumpul", parentId: "dis-kandangan", name: "Kedungumpul", level: "village", latitude: null, longitude: null },
  { id: "ham-tegalsari", parentId: "vil-kedungumpul", name: "Tegalsari", level: "hamlet", latitude: -7.2255, longitude: 110.1702 },

  { id: "dis-parakan", parentId: "reg-temanggung", name: "Parakan", level: "district", latitude: -7.2833, longitude: 110.0833 },
  { id: "vil-traji", parentId: "dis-parakan", name: "Traji", level: "village", latitude: -7.2748, longitude: 110.0901 },
  { id: "ham-ngemplak", parentId: "vil-traji", name: "Ngemplak", level: "hamlet", latitude: -7.2731, longitude: 110.0887 },
  { id: "vil-wanutengah", parentId: "dis-parakan", name: "Wanutengah", level: "village", latitude: null, longitude: null },

  { id: "dis-bulu", parentId: "reg-temanggung", name: "Bulu", level: "district", latitude: -7.3311, longitude: 110.1015 },
  { id: "vil-danupayan", parentId: "dis-bulu", name: "Danupayan", level: "village", latitude: -7.3402, longitude: 110.1124 },
  { id: "ham-jetis", parentId: "vil-danupayan", name: "Jetis", level: "hamlet", latitude: null, longitude: null },

  { id: "dis-temanggung-kota", parentId: "reg-temanggung", name: "Temanggung", level: "district", latitude: -7.3155, longitude: 110.1748 },
  { id: "vil-jampiroso", parentId: "dis-temanggung-kota", name: "Jampiroso", level: "village", latitude: -7.3131, longitude: 110.1789 },

  { id: "dis-jumo", parentId: "reg-temanggung", name: "Jumo", level: "district", latitude: -7.2247, longitude: 110.1119 },
  { id: "vil-gedongsari", parentId: "dis-jumo", name: "Gedongsari", level: "village", latitude: null, longitude: null },
  { id: "ham-sidorejo", parentId: "vil-gedongsari", name: "Sidorejo", level: "hamlet", latitude: null, longitude: null },

  { id: "dis-tlogomulyo", parentId: "reg-temanggung", name: "Tlogomulyo", level: "district", latitude: -7.3489, longitude: 110.1966 },
  { id: "vil-legoksari", parentId: "dis-tlogomulyo", name: "Legoksari", level: "village", latitude: -7.3571, longitude: 110.2042 },
  { id: "ham-lamuk", parentId: "vil-legoksari", name: "Lamuk", level: "hamlet", latitude: null, longitude: null },

  { id: "dis-candiroto", parentId: "reg-temanggung", name: "Candiroto", level: "district", latitude: -7.1806, longitude: 110.0489 },
  { id: "vil-muntung", parentId: "dis-candiroto", name: "Muntung", level: "village", latitude: null, longitude: null },

  { id: "dis-gemawang", parentId: "reg-temanggung", name: "Gemawang", level: "district", latitude: -7.1719, longitude: 110.1394 },
  { id: "vil-kemiriombo", parentId: "dis-gemawang", name: "Kemiriombo", level: "village", latitude: null, longitude: null },
  { id: "ham-lempong", parentId: "vil-kemiriombo", name: "Lempong", level: "hamlet", latitude: null, longitude: null },

  { id: "dis-tembarak", parentId: "reg-temanggung", name: "Tembarak", level: "district", latitude: -7.3556, longitude: 110.1592 },
  { id: "vil-menggoro", parentId: "dis-tembarak", name: "Menggoro", level: "village", latitude: null, longitude: null },


  /*
   * The remaining kecamatan, added so all twenty of Temanggung's are present
   * even where nothing is scheduled yet.
   *
   * COORDINATES ARE APPROXIMATE — placed from general knowledge of where each
   * kecamatan sits, not measured. Good enough for a spread that only claims
   * relative position; check them against BPS or a map before they are used
   * for anything that sends a person somewhere.
   */
  { id: "dis-bansari", parentId: "reg-temanggung", name: "Bansari", level: "district", latitude: -7.2569, longitude: 110.0483 },
  { id: "dis-bejen", parentId: "reg-temanggung", name: "Bejen", level: "district", latitude: -7.1236, longitude: 110.0947 },
  { id: "dis-kaloran", parentId: "reg-temanggung", name: "Kaloran", level: "district", latitude: -7.2622, longitude: 110.2278 },
  { id: "dis-kedu", parentId: "reg-temanggung", name: "Kedu", level: "district", latitude: -7.2833, longitude: 110.1361 },
  { id: "dis-kledung", parentId: "reg-temanggung", name: "Kledung", level: "district", latitude: -7.3061, longitude: 110.0489 },
  { id: "dis-kranggan", parentId: "reg-temanggung", name: "Kranggan", level: "district", latitude: -7.3086, longitude: 110.2264 },
  { id: "dis-pringsurat", parentId: "reg-temanggung", name: "Pringsurat", level: "district", latitude: -7.3556, longitude: 110.2650 },
  { id: "dis-selopampang", parentId: "reg-temanggung", name: "Selopampang", level: "district", latitude: -7.3819, longitude: 110.1594 },
  { id: "dis-tretep", parentId: "reg-temanggung", name: "Tretep", level: "district", latitude: -7.1264, longitude: 110.0053 },
  { id: "dis-wonoboyo", parentId: "reg-temanggung", name: "Wonoboyo", level: "district", latitude: -7.1483, longitude: 110.0403 },

  /* --- Kabupaten lain, hanya sebagai asal grup ----------------------------- */
  { id: "reg-boyolali", parentId: null, name: "Boyolali", level: "regency", latitude: null, longitude: null },
  { id: "dis-simo", parentId: "reg-boyolali", name: "Simo", level: "district", latitude: null, longitude: null },
  { id: "vil-pentur", parentId: "dis-simo", name: "Pentur", level: "village", latitude: null, longitude: null },

  { id: "reg-magelang", parentId: null, name: "Magelang", level: "regency", latitude: null, longitude: null },
  { id: "dis-grabag", parentId: "reg-magelang", name: "Grabag", level: "district", latitude: null, longitude: null },
  { id: "vil-banaran", parentId: "dis-grabag", name: "Banaran", level: "village", latitude: null, longitude: null },

  { id: "reg-wonosobo", parentId: null, name: "Wonosobo", level: "regency", latitude: null, longitude: null },
  { id: "dis-kertek", parentId: "reg-wonosobo", name: "Kertek", level: "district", latitude: null, longitude: null },
  { id: "vil-purwojati", parentId: "dis-kertek", name: "Purwojati", level: "village", latitude: null, longitude: null },
] as const
