'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { makeSlug } from '@/lib/slug';

const schema = z.object({
  name: z.string().trim().min(1, 'Nama kelompok wajib diisi.').max(255),
  description: z.string().trim().optional().or(z.literal('')),
  contact_name: z.string().trim().max(255).optional().or(z.literal('')),
  contact_phone: z.string().trim().max(50).optional().or(z.literal('')),
});

export type GroupFormState = { error?: string } | undefined;

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    throw new Error('Halaman ini hanya untuk admin utama.');
  }
  return user;
}

export async function createGroupAction(
  _prevState: GroupFormState,
  formData: FormData
): Promise<GroupFormState> {
  await requireAdmin();
  const parsed = schema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    contact_name: formData.get('contact_name'),
    contact_phone: formData.get('contact_phone'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' };

  const { name, description, contact_name, contact_phone } = parsed.data;

  await prisma.groups.create({
    data: {
      name,
      slug: makeSlug(name),
      description: description || null,
      contact_name: contact_name || null,
      contact_phone: contact_phone || null,
    },
  });

  revalidatePath('/admin/kelompok');
  redirect('/admin/kelompok');
}

export async function updateGroupAction(
  slug: string,
  _prevState: GroupFormState,
  formData: FormData
): Promise<GroupFormState> {
  await requireAdmin();
  const parsed = schema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    contact_name: formData.get('contact_name'),
    contact_phone: formData.get('contact_phone'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' };

  const { name, description, contact_name, contact_phone } = parsed.data;

  await prisma.groups.update({
    where: { slug },
    data: {
      name,
      description: description || null,
      contact_name: contact_name || null,
      contact_phone: contact_phone || null,
    },
  });

  revalidatePath('/admin/kelompok');
  redirect('/admin/kelompok');
}

export async function deleteGroupAction(slug: string): Promise<void> {
  await requireAdmin();
  const group = await prisma.groups.findUnique({
    where: { slug },
    include: { _count: { select: { users: true, products: true, activities: true } } },
  });
  if (!group) return;

  if (group._count.users > 0 || group._count.products > 0 || group._count.activities > 0) {
    throw new Error('Kelompok tidak bisa dihapus karena masih punya akun/produk/aktivitas terkait.');
  }

  await prisma.groups.delete({ where: { slug } });
  revalidatePath('/admin/kelompok');
}
