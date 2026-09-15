export const mockUsers = [
  { id: "usr-admin", name: "Pengelola", contact: null, role: "admin", isActive: true },
  { id: "usr-kridho-mudo", name: "Sekretaris Kridho Mudo", contact: "0812-0000-0001", role: "group_manager", isActive: false },
] as const

/** Prepared, not used in the MVP. Kept so `createdBy` never needs backfilling. */
export const mockGroupManagers = [
  { userId: "usr-kridho-mudo", groupId: "grp-kridho-mudo" },
] as const
