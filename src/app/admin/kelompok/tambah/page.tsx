import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import GroupForm from '../GroupForm';
import { createGroupAction } from '../actions';

export const metadata = { title: 'Tambah Kelompok | Admin Ruang Tani' };

export default async function CreateGroupPage() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) redirect('/admin');

  return (
    <div>
      <h1 className="text-lg font-bold text-ink-900">Tambah Kelompok Tani</h1>
      <div className="mt-6">
        <GroupForm action={createGroupAction} submitLabel="Simpan Kelompok" />
      </div>
    </div>
  );
}
