import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageUsers } from '@/lib/roles';
import UserRowActions from './UserRowActions';

export const metadata = { title: 'Akun Pengguna | Admin Ruang Tani' };

function roleLabel(u: { is_admin: boolean; is_group_admin: boolean }) {
  if (u.is_admin) return 'Admin Utama';
  if (u.is_group_admin) return 'Admin Kelompok';
  return 'Anggota';
}

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!canManageUsers(user)) redirect('/admin');

  const where = user.isAdmin ? {} : { group_id: user.groupId !== null ? BigInt(user.groupId) : BigInt(-1) };
  const users = await prisma.user.findMany({
    where,
    orderBy: { name: 'asc' },
    include: { groups: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-ink-900">Akun Pengguna</h1>
        <Link href="/admin/pengguna/tambah" className="btn-primary text-sm">
          + Tambah Akun
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Kelompok</th>
              <th className="px-5 py-3">Peran</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-slate-500">
                  Belum ada akun.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={String(u.id)}>
                  <td className="px-5 py-3 font-semibold text-ink-900">{u.name}</td>
                  <td className="px-5 py-3 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3 text-slate-500">{u.groups?.name ?? '-'}</td>
                  <td className="px-5 py-3 text-slate-500">{roleLabel(u)}</td>
                  <td className="px-5 py-3">
                    {u.email_verified_at ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                        Menunggu
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <UserRowActions id={Number(u.id)} name={u.name} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
