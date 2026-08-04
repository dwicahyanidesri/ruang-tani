import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageContent } from '@/lib/roles';
import ProductForm from '../ProductForm';
import { createProductAction } from '../actions';

export const metadata = { title: 'Tambah Produk | Admin Ruang Tani' };

export default async function CreateProductPage() {
  const user = await getCurrentUser();
  if (!user || !canManageContent(user)) redirect('/admin/produk');

  const groups = user.isAdmin
    ? (await prisma.groups.findMany({ orderBy: { name: 'asc' } })).map((g) => ({
        id: Number(g.id),
        name: g.name,
      }))
    : null;

  return (
    <div>
      <h1 className="text-lg font-bold text-ink-900">Tambah Produk</h1>
      <div className="mt-6 max-w-2xl">
        <ProductForm
          action={createProductAction}
          groups={groups}
          currentGroupName={user.group?.name}
          submitLabel="Simpan Produk"
        />
      </div>
    </div>
  );
}
