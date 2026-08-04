import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageContent } from '@/lib/roles';
import ActivityForm from '../ActivityForm';
import { createActivityAction } from '../actions';

export const metadata = { title: 'Tambah Aktivitas | Admin Ruang Tani' };

export default async function CreateActivityPage() {
  const user = await getCurrentUser();
  if (!user || !canManageContent(user)) redirect('/admin/aktivitas');

  const groups = user.isAdmin
    ? (await prisma.groups.findMany({ orderBy: { name: 'asc' } })).map((g) => ({
        id: Number(g.id),
        name: g.name,
      }))
    : null;

  return (
    <div>
      <h1 className="text-lg font-bold text-ink-900">Tambah Aktivitas</h1>
      <div className="mt-6 max-w-2xl">
        <ActivityForm
          action={createActivityAction}
          groups={groups}
          currentGroupName={user.group?.name}
          submitLabel="Simpan Aktivitas"
        />
      </div>
    </div>
  );
}
