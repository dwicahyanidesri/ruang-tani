'use client';

import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { deleteGroupAction } from './actions';

export default function GroupRowActions({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Link href={`/admin/kelompok/${slug}/edit`} className="text-xs font-semibold text-brand-600">
        Edit
      </Link>
      <DeleteButton
        action={deleteGroupAction.bind(null, slug)}
        confirmTitle="Hapus kelompok ini?"
        confirmMessage={`"${name}" akan dihapus permanen.`}
      />
    </div>
  );
}
