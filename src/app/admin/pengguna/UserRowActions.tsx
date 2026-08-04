'use client';

import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { deleteUserAction } from './actions';

export default function UserRowActions({ id, name }: { id: number; name: string }) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Link href={`/admin/pengguna/${id}/edit`} className="text-xs font-semibold text-brand-600">
        Edit
      </Link>
      <DeleteButton
        action={deleteUserAction.bind(null, id)}
        confirmTitle="Hapus akun ini?"
        confirmMessage={`Akun "${name}" akan dihapus permanen.`}
      />
    </div>
  );
}
