import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageContent } from '@/lib/roles';
import { imageUrl } from '@/lib/storage';
import ProductForm from '../../ProductForm';
import { updateProductAction } from '../../actions';

export const metadata = { title: 'Edit Produk | Admin Ruang Tani' };

export default async function EditProductPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user || !canManageContent(user)) redirect('/admin/produk');

  const product = await prisma.products.findUnique({ where: { slug: params.slug } });
  if (!product) notFound();
  if (!user.isAdmin && Number(product.group_id) !== user.groupId) redirect('/admin/produk');

  const groups = user.isAdmin
    ? (await prisma.groups.findMany({ orderBy: { name: 'asc' } })).map((g) => ({
        id: Number(g.id),
        name: g.name,
      }))
    : null;

  return (
    <div>
      <h1 className="text-lg font-bold text-ink-900">Edit Produk</h1>
      <div className="mt-6 max-w-2xl">
        <ProductForm
          action={updateProductAction.bind(null, params.slug)}
          product={{
            name: product.name,
            category: product.category,
            description: product.description,
            contact_name: product.contact_name,
            contact_phone: product.contact_phone,
            price: product.price,
            group_id: product.group_id !== null ? Number(product.group_id) : null,
            image_path: product.image_path,
          }}
          groups={groups}
          currentGroupName={user.group?.name}
          imageUrl={imageUrl(product.image_path)}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </div>
  );
}
