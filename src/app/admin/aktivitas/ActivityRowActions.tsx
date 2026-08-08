'use client';

import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { deleteActivityAction } from './actions';

export default function ActivityRowActions({
  slug,
  title,
  stacked = false,
}: {
  slug: string;
  title: string;
  stacked?: boolean;
}) {
  return (
    <div className={stacked ? 'flex flex-col items-end gap-2' : 'flex items-center justify-end gap-3'}>
      <Link href={`/admin/aktivitas/${slug}/edit`} className="text-xs font-semibold text-brand-600">
        Edit
      </Link>
      <DeleteButton
        action={deleteActivityAction.bind(null, slug)}
        confirmTitle="Hapus aktivitas ini?"
        confirmMessage={`"${title}" akan dihapus permanen beserta fotonya.`}
      />
    </div>
  );
}
