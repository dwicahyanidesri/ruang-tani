import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageContent } from '@/lib/roles';
import { imageUrl } from '@/lib/storage';
import ProductRowActions from './ProductRowActions';

export const metadata = { title: 'Produk | Admin Ruang Tani' };

export default async function AdminProductsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const where = user.isAdmin ? {} : { group_id: user.groupId !== null ? BigInt(user.groupId) : BigInt(-1) };
  const products = await prisma.products.findMany({
    where,
    orderBy: { updated_at: 'desc' },
    include: { groups: true },
  });

  const canManage = canManageContent(user);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-ink-900">Produk</h1>
        {canManage && (
          <Link href="/admin/produk/tambah" className="btn-primary text-sm">
            + Tambah Produk
          </Link>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Foto</th>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Kelompok</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Harga</th>
              {canManage && <th className="px-5 py-3 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="px-5 py-6 text-center text-slate-500">
                  Belum ada produk.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const url = imageUrl(product.image_path);
                return (
                  <tr key={String(product.id)}>
                    <td className="px-5 py-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-brand-50">
                        {url ? (
                          <img src={url} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs text-brand-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-ink-900">{product.name}</td>
                    <td className="px-5 py-3 text-slate-500">{product.groups?.name ?? '-'}</td>
                    <td className="px-5 py-3 text-slate-500">{product.category ?? '-'}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {product.price !== null ? `Rp ${product.price.toLocaleString('id-ID')}` : '-'}
                    </td>
                    {canManage && (
                      <td className="px-5 py-3 text-right">
                        <ProductRowActions slug={product.slug} name={product.name} />
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
