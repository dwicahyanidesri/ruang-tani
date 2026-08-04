import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageContent } from '@/lib/roles';
import { imageUrl } from '@/lib/storage';
import ActivityForm from '../../ActivityForm';
import { updateActivityAction } from '../../actions';

export const metadata = { title: 'Edit Aktivitas | Admin Ruang Tani' };

export default async function EditActivityPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user || !canManageContent(user)) redirect('/admin/aktivitas');

  const activity = await prisma.activities.findUnique({ where: { slug: params.slug } });
  if (!activity) notFound();
  if (!user.isAdmin && Number(activity.group_id) !== user.groupId) redirect('/admin/aktivitas');

  const groups = user.isAdmin
    ? (await prisma.groups.findMany({ orderBy: { name: 'asc' } })).map((g) => ({
        id: Number(g.id),
        name: g.name,
      }))
    : null;

  return (
    <div>
      <h1 className="text-lg font-bold text-ink-900">Edit Aktivitas</h1>
      <div className="mt-6 max-w-2xl">
        <ActivityForm
          action={updateActivityAction.bind(null, params.slug)}
          activity={{
            title: activity.title,
            excerpt: activity.excerpt,
            body: activity.body,
            contact_name: activity.contact_name,
            contact_phone: activity.contact_phone,
            activity_date: activity.activity_date,
            group_id: activity.group_id !== null ? Number(activity.group_id) : null,
            image_path: activity.image_path,
          }}
          groups={groups}
          currentGroupName={user.group?.name}
          imageUrl={imageUrl(activity.image_path)}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </div>
  );
}
