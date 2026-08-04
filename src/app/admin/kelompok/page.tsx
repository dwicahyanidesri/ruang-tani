import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import GroupRowActions from './GroupRowActions';

export const metadata = { title: 'Kelompok Tani | Admin Ruang Tani' };

export default async function AdminGroupsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!user.isAdmin) redirect('/admin');

  const groups = await prisma.groups.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { users: true, products: true, activities: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-ink-900">Kelompok Tani</h1>
        <Link href="/admin/kelompok/tambah" className="btn-primary text-sm">
          + Tambah Kelompok
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Anggota</th>
              <th className="px-5 py-3">Produk</th>
              <th className="px-5 py-3">Aktivitas</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {groups.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-slate-500">
                  Belum ada kelompok tani.
                </td>
              </tr>
            ) : (
              groups.map((group) => (
                <tr key={String(group.id)}>
                  <td className="px-5 py-3 font-semibold text-ink-900">{group.name}</td>
                  <td className="px-5 py-3 text-slate-500">{group._count.users}</td>
                  <td className="px-5 py-3 text-slate-500">{group._count.products}</td>
                  <td className="px-5 py-3 text-slate-500">{group._count.activities}</td>
                  <td className="px-5 py-3 text-right">
                    <GroupRowActions slug={group.slug} name={group.name} />
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
