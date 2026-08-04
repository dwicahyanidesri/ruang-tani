import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageUsers } from '@/lib/roles';
import VerifyRowActions from './VerifyRowActions';

export const metadata = { title: 'Verifikasi Anggota | Admin Ruang Tani' };

function formatDate(date: Date | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function VerifikasiAnggotaPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!canManageUsers(user)) redirect('/admin');

  const where = user.isAdmin
    ? { email_verified_at: null }
    : { email_verified_at: null, group_id: user.groupId !== null ? BigInt(user.groupId) : BigInt(-1) };

  const pendingUsers = await prisma.user.findMany({
    where,
    orderBy: { created_at: 'asc' },
    include: { groups: true },
  });

  return (
    <div>
      <p className="text-sm text-slate-500">
        {user.isAdmin
          ? 'ACC pendaftaran akun baru dari semua kelompok tani.'
          : `ACC pendaftaran akun baru dari kelompok ${user.group?.name ?? '-'}.`}
      </p>

      <div className="mt-6 rounded-2xl bg-white shadow-soft">
        <div className="divide-y divide-slate-100 sm:hidden">
          {pendingUsers.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-500">
              Tidak ada pendaftaran yang menunggu verifikasi.
            </p>
          ) : (
            pendingUsers.map((u) => (
              <div key={String(u.id)} className="p-4">
                <p className="font-semibold text-ink-900">{u.name}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{u.email}</p>
                <p className="mt-1 text-xs text-slate-500">{u.groups?.name ?? '-'}</p>
                <p className="mt-1 text-[11px] text-slate-400">Daftar {formatDate(u.created_at)}</p>
                <VerifyRowActions id={Number(u.id)} name={u.name} layout="stacked" />
              </div>
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Kelompok</th>
                <th className="px-5 py-3">Daftar</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-slate-500">
                    Tidak ada pendaftaran yang menunggu verifikasi.
                  </td>
                </tr>
              ) : (
                pendingUsers.map((u) => (
                  <tr key={String(u.id)}>
                    <td className="px-5 py-3 font-semibold text-ink-900">{u.name}</td>
                    <td className="px-5 py-3 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3 text-slate-500">{u.groups?.name ?? '-'}</td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(u.created_at)}</td>
                    <td className="px-5 py-3 text-right">
                      <VerifyRowActions id={Number(u.id)} name={u.name} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
