import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { Icon } from '@/components/Icon';

export const metadata = { title: 'Ringkasan | Admin Ruang Tani' };

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isAdmin = user.isAdmin;
  const groupFilter = isAdmin
    ? {}
    : { group_id: user.groupId !== null ? BigInt(user.groupId) : BigInt(-1) };

  const [productCount, activityCount, groupCount, latestProducts] = await Promise.all([
    prisma.products.count({ where: groupFilter }),
    prisma.activities.count({ where: groupFilter }),
    isAdmin ? prisma.groups.count() : Promise.resolve(null),
    prisma.products.findMany({
      where: groupFilter,
      orderBy: { created_at: 'desc' },
      take: 5,
      include: { groups: true },
    }),
  ]);

  return (
    <div>
      {!isAdmin && (
        <div className="mb-6 rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">
          Anda login sebagai kelompok: {user.group?.name ?? '-'}. Anda hanya bisa mengelola produk
          &amp; aktivitas kelompok ini.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon icon="basket" className="h-5 w-5" />
          </span>
          <p className="mt-4 text-2xl font-extrabold text-ink-900">{productCount}</p>
          <p className="text-xs font-semibold text-slate-500">Total Produk</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon icon="leaf" className="h-5 w-5" />
          </span>
          <p className="mt-4 text-2xl font-extrabold text-ink-900">{activityCount}</p>
          <p className="text-xs font-semibold text-slate-500">Aktivitas Kelompok</p>
        </div>
      </div>

      {groupCount !== null && (
        <div className="mt-5 rounded-2xl bg-white p-6 shadow-soft">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon icon="sparkles" className="h-5 w-5" />
          </span>
          <p className="mt-4 text-2xl font-extrabold text-ink-900">{groupCount}</p>
          <p className="text-xs font-semibold text-slate-500">Kelompok Tani Terdaftar</p>
          <Link href="/admin/kelompok" className="mt-3 inline-block text-xs font-semibold text-brand-600">
            Kelola Kelompok &rarr;
          </Link>
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="text-sm font-bold text-ink-900">Produk Terbaru</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {latestProducts.length === 0 ? (
            <p className="py-4 text-sm text-slate-500">Belum ada produk.</p>
          ) : (
            latestProducts.map((product) => (
              <div key={String(product.id)} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.groups?.name}</p>
                </div>
                <Link
                  href={`/admin/produk/${product.id}/edit`}
                  className="text-xs font-semibold text-brand-600"
                >
                  Edit &rarr;
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
