'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageContent } from '@/lib/roles';
import { makeSlug } from '@/lib/slug';
import { uploadImage, deleteImage } from '@/lib/storage';

const schema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi.').max(255),
  excerpt: z.string().trim().max(500).optional().or(z.literal('')),
  body: z.string().trim().optional().or(z.literal('')),
  contact_name: z.string().trim().max(255).optional().or(z.literal('')),
  contact_phone: z.string().trim().max(50).optional().or(z.literal('')),
  activity_date: z.string().trim().optional().or(z.literal('')),
});

export type ActivityFormState = { error?: string } | undefined;

async function requireManager() {
  const user = await getCurrentUser();
  if (!user || !canManageContent(user)) {
    throw new Error('Anda tidak punya akses untuk mengelola aktivitas.');
  }
  return user;
}

function parseForm(formData: FormData) {
  return schema.safeParse({
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    body: formData.get('body'),
    contact_name: formData.get('contact_name'),
    contact_phone: formData.get('contact_phone'),
    activity_date: formData.get('activity_date'),
  });
}

export async function createActivityAction(
  _prevState: ActivityFormState,
  formData: FormData
): Promise<ActivityFormState> {
  const user = await requireManager();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const groupId = user.isAdmin ? Number(formData.get('group_id')) : user.groupId;
  if (!groupId) return { error: 'Pilih kelompok tani.' };

  const { title, excerpt, body, contact_name, contact_phone, activity_date } = parsed.data;

  let image_path: string | undefined;
  const image = formData.get('image');
  if (image instanceof File && image.size > 0) {
    image_path = await uploadImage(image, 'activities');
  }

  await prisma.activities.create({
    data: {
      title,
      slug: makeSlug(title),
      excerpt: excerpt || null,
      body: body || null,
      contact_name: contact_name || null,
      contact_phone: contact_phone || null,
      activity_date: activity_date ? new Date(activity_date) : null,
      image_path: image_path ?? null,
      group_id: BigInt(groupId),
    },
  });

  revalidatePath('/admin/aktivitas');
  revalidatePath('/aktivitas-kelompok');
  redirect('/admin/aktivitas');
}

export async function updateActivityAction(
  slug: string,
  _prevState: ActivityFormState,
  formData: FormData
): Promise<ActivityFormState> {
  const user = await requireManager();
  const activity = await prisma.activities.findUnique({ where: { slug } });
  if (!activity) return { error: 'Aktivitas tidak ditemukan.' };
  if (!user.isAdmin && Number(activity.group_id) !== user.groupId) {
    return { error: 'Anda hanya bisa mengelola aktivitas kelompok Anda sendiri.' };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' };
  }
  const { title, excerpt, body, contact_name, contact_phone, activity_date } = parsed.data;

  const data: Record<string, unknown> = {
    title,
    excerpt: excerpt || null,
    body: body || null,
    contact_name: contact_name || null,
    contact_phone: contact_phone || null,
    activity_date: activity_date ? new Date(activity_date) : null,
  };

  if (user.isAdmin) {
    const groupId = Number(formData.get('group_id'));
    if (groupId) data.group_id = BigInt(groupId);
  }

  const image = formData.get('image');
  if (image instanceof File && image.size > 0) {
    await deleteImage(activity.image_path);
    data.image_path = await uploadImage(image, 'activities');
  }

  await prisma.activities.update({ where: { slug }, data });

  revalidatePath('/admin/aktivitas');
  revalidatePath('/aktivitas-kelompok');
  revalidatePath(`/aktivitas-kelompok/${slug}`);
  redirect('/admin/aktivitas');
}

export async function deleteActivityAction(slug: string): Promise<void> {
  const user = await requireManager();
  const activity = await prisma.activities.findUnique({ where: { slug } });
  if (!activity) return;
  if (!user.isAdmin && Number(activity.group_id) !== user.groupId) {
    throw new Error('Anda hanya bisa mengelola aktivitas kelompok Anda sendiri.');
  }

  await deleteImage(activity.image_path);
  await prisma.activities.delete({ where: { slug } });

  revalidatePath('/admin/aktivitas');
  revalidatePath('/aktivitas-kelompok');
}
