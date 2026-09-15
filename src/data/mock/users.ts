export const mockUsers = [
  { id: "usr-admin", name: "Pengelola", contact: null, role: "admin", isActive: true },
  { id: "usr-kridho-mudo", name: "Sekretaris Kridho Mudo", contact: "0812-0000-0001", role: "group_manager", isActive: false },
  { id: "usr-sedyo-utomo", name: "Pengurus Sedyo Utomo", contact: "0812-0000-0002", role: "group_manager", isActive: true },
] as const

/**
 * Which groups a manager may upload for. For now only admins and managers
 * upload, and a manager only for their own group (see the integrity checks in
 * `index.ts`). Temporary: the aim is open uploads by anyone.
 */
export const mockGroupManagers = [
  { userId: "usr-kridho-mudo", groupId: "grp-kridho-mudo" },
  { userId: "usr-sedyo-utomo", groupId: "grp-sedyo-utomo" },
] as const
