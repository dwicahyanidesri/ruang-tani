import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageUsers } from '@/lib/roles';
import UserForm from '../UserForm';
import { createUserAction } from '../actions';

export const metadata = { title: 'Tambah Akun | Admin Ruang Tani' };

export default async function CreateUserPage() {
  const user = await getCurrentUser();
  if (!user || !canManageUsers(user)) redirect('/admin');

  const groups = user.isAdmin
    ? (await prisma.groups.findMany({ orderBy: { name: 'asc' } })).map((g) => ({
        id: Number(g.id),
        name: g.name,
      }))
    : null;

  return (
    <div>
      <h1 className="text-lg font-bold text-ink-900">Tambah Akun</h1>
      <div className="mt-6">
        <UserForm
          action={createUserAction}
          groups={groups}
          currentGroupName={user.group?.name}
          submitLabel="Simpan Akun"
        />
      </div>
    </div>
  );
}
