'use client';

import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { deleteProductAction } from './actions';

export default function ProductRowActions({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Link href={`/admin/produk/${slug}/edit`} className="text-xs font-semibold text-brand-600">
        Edit
      </Link>
      <DeleteButton
        action={deleteProductAction.bind(null, slug)}
        confirmTitle="Hapus produk ini?"
        confirmMessage={`"${name}" akan dihapus permanen beserta fotonya.`}
      />
    </div>
  );
}
