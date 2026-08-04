import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageUsers } from '@/lib/roles';
import UserForm from '../../UserForm';
import { updateUserAction } from '../../actions';

export const metadata = { title: 'Edit Akun | Admin Ruang Tani' };

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const manager = await getCurrentUser();
  if (!manager || !canManageUsers(manager)) redirect('/admin');

  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const target = await prisma.user.findUnique({ where: { id: BigInt(id) } });
  if (!target) notFound();
  if (!manager.isAdmin && Number(target.group_id) !== manager.groupId) redirect('/admin/pengguna');

  const groups = manager.isAdmin
    ? (await prisma.groups.findMany({ orderBy: { name: 'asc' } })).map((g) => ({
        id: Number(g.id),
        name: g.name,
      }))
    : null;

  return (
    <div>
      <h1 className="text-lg font-bold text-ink-900">Edit Akun</h1>
      <div className="mt-6">
        <UserForm
          action={updateUserAction.bind(null, id)}
          user={{
            name: target.name,
            email: target.email,
            group_id: target.group_id !== null ? Number(target.group_id) : null,
            is_group_admin: target.is_group_admin,
          }}
          groups={groups}
          currentGroupName={manager.group?.name}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </div>
  );
}
