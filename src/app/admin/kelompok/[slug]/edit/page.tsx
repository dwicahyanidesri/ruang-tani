import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import GroupForm from '../../GroupForm';
import { updateGroupAction } from '../../actions';

export const metadata = { title: 'Edit Kelompok | Admin Ruang Tani' };

export default async function EditGroupPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) redirect('/admin');

  const group = await prisma.groups.findUnique({ where: { slug: params.slug } });
  if (!group) notFound();

  return (
    <div>
      <h1 className="text-lg font-bold text-ink-900">Edit Kelompok Tani</h1>
      <div className="mt-6">
        <GroupForm
          action={updateGroupAction.bind(null, params.slug)}
          group={{
            name: group.name,
            description: group.description,
            contact_name: group.contact_name,
            contact_phone: group.contact_phone,
          }}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </div>
  );
}
