import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageContent } from '@/lib/roles';
import { imageUrl } from '@/lib/storage';
import ActivityRowActions from './ActivityRowActions';

export const metadata = { title: 'Aktivitas Kelompok | Admin Ruang Tani' };

function formatDate(date: Date | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function AdminActivitiesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const where = user.isAdmin ? {} : { group_id: user.groupId !== null ? BigInt(user.groupId) : BigInt(-1) };
  const activities = await prisma.activities.findMany({
    where,
    orderBy: { activity_date: 'desc' },
    include: { groups: true },
  });

  const canManage = canManageContent(user);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-ink-900">Aktivitas Kelompok</h1>
        {canManage && (
          <Link href="/admin/aktivitas/tambah" className="btn-primary text-sm">
            + Tambah Aktivitas
          </Link>
        )}
      </div>

      <div className="mt-6 hidden overflow-x-auto rounded-2xl bg-white shadow-soft lg:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Foto</th>
              <th className="px-5 py-3">Judul</th>
              <th className="px-5 py-3">Kelompok</th>
              <th className="px-5 py-3">Tanggal</th>
              {canManage && <th className="px-5 py-3 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activities.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 5 : 4} className="px-5 py-6 text-center text-slate-500">
                  Belum ada aktivitas.
                </td>
              </tr>
            ) : (
              activities.map((activity) => {
                const url = imageUrl(activity.image_path);
                return (
                  <tr key={String(activity.id)}>
                    <td className="px-5 py-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-brand-50">
                        {url ? (
                          <img src={url} alt={activity.title} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs text-brand-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-ink-900">{activity.title}</td>
                    <td className="px-5 py-3 text-slate-500">{activity.groups?.name ?? '-'}</td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(activity.activity_date)}</td>
                    {canManage && (
                      <td className="px-5 py-3 text-right">
                        <ActivityRowActions slug={activity.slug} title={activity.title} />
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 divide-y divide-slate-100 rounded-2xl bg-white shadow-soft lg:hidden">
        {activities.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-slate-500">Belum ada aktivitas.</p>
        ) : (
          activities.map((activity) => (
            <div key={String(activity.id)} className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="font-bold text-ink-900">{activity.title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{formatDate(activity.activity_date)}</p>
              </div>
              {canManage && (
                <div className="shrink-0">
                  <ActivityRowActions slug={activity.slug} title={activity.title} stacked />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
