// Logika peran, meniru App\Models\User versi Laravel.
//
// - Admin utama (isAdmin): akses penuh ke semua kelompok. Cuma boleh 1 akun.
// - Admin kelompok (isGroupAdmin): kelola produk/aktivitas/anggota kelompoknya sendiri.
// - Anggota kelompok (isGroupMember): cuma bisa lihat, tidak bisa kelola apa pun.

export type Role = 'admin' | 'group_admin' | 'member';

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  groupId: number | null;
  isAdmin: boolean;
  isGroupAdmin: boolean;
  verified: boolean;
};

export function roleOf(user: Pick<SessionUser, 'isAdmin' | 'isGroupAdmin'>): Role {
  if (user.isAdmin) return 'admin';
  if (user.isGroupAdmin) return 'group_admin';
  return 'member';
}

export function canManageContent(user: Pick<SessionUser, 'isAdmin' | 'isGroupAdmin'>): boolean {
  return user.isAdmin || user.isGroupAdmin;
}

export function canManageUsers(user: Pick<SessionUser, 'isAdmin' | 'isGroupAdmin'>): boolean {
  return user.isAdmin || user.isGroupAdmin;
}
