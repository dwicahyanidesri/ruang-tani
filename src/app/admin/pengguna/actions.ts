'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageUsers } from '@/lib/roles';

export type UserFormState = { error?: string } | undefined;

async function requireManager() {
  const user = await getCurrentUser();
  if (!user || !canManageUsers(user)) {
    throw new Error('Anda tidak punya akses ke halaman ini.');
  }
  return user;
}

const createSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi.').max(255),
  email: z.string().trim().email('Format email tidak valid.').max(255),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter.'),
});

export async function createUserAction(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const manager = await requireManager();

  const parsed = createSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' };

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: 'Email ini sudah terdaftar.' };

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  let groupId: number | null;
  let isGroupAdmin: boolean;

  if (manager.isAdmin) {
    const raw = formData.get('group_id');
    groupId = raw ? Number(raw) : null;
    isGroupAdmin = formData.get('is_group_admin') === 'on';
  } else {
    groupId = manager.groupId;
    isGroupAdmin = false;
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      password: hashedPassword,
      group_id: groupId !== null ? BigInt(groupId) : null,
      is_admin: false,
      is_group_admin: isGroupAdmin,
      email_verified_at: new Date(),
    },
  });

  revalidatePath('/admin/pengguna');
  redirect('/admin/pengguna');
}

const updateSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi.').max(255),
  email: z.string().trim().email('Format email tidak valid.').max(255),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter.').optional().or(z.literal('')),
});

export async function updateUserAction(
  id: number,
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const manager = await requireManager();
  const target = await prisma.user.findUnique({ where: { id: BigInt(id) } });
  if (!target) return { error: 'Akun tidak ditemukan.' };
  if (!manager.isAdmin && Number(target.group_id) !== manager.groupId) {
    return { error: 'Anda hanya bisa mengelola akun di kelompok Anda sendiri.' };
  }

  const parsed = updateSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password') || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' };

  const email = parsed.data.email.toLowerCase().trim();
  if (email !== target.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: 'Email ini sudah dipakai akun lain.' };
  }

  const data: Record<string, unknown> = { name: parsed.data.name, email };

  if (parsed.data.password) {
    data.password = await bcrypt.hash(parsed.data.password, 10);
  }

  if (manager.isAdmin) {
    const raw = formData.get('group_id');
    data.group_id = raw ? BigInt(Number(raw)) : null;
    data.is_group_admin = formData.get('is_group_admin') === 'on';
  }

  await prisma.user.update({ where: { id: BigInt(id) }, data });

  revalidatePath('/admin/pengguna');
  redirect('/admin/pengguna');
}

export async function deleteUserAction(id: number): Promise<void> {
  const manager = await requireManager();
  const target = await prisma.user.findUnique({ where: { id: BigInt(id) } });
  if (!target) return;

  if (!manager.isAdmin && Number(target.group_id) !== manager.groupId) {
    throw new Error('Anda hanya bisa mengelola akun di kelompok Anda sendiri.');
  }
  if (Number(target.id) === manager.id) {
    throw new Error('Anda tidak bisa menghapus akun sendiri.');
  }
  if (target.is_admin) {
    throw new Error('Akun admin utama satu-satunya tidak bisa dihapus.');
  }
  if (!manager.isAdmin && target.is_group_admin) {
    throw new Error('Admin kelompok hanya bisa menghapus akun anggota biasa.');
  }

  await prisma.user.delete({ where: { id: BigInt(id) } });
  revalidatePath('/admin/pengguna');
}
