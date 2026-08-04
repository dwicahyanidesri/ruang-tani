'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageUsers } from '@/lib/roles';

async function requireManager() {
  const user = await getCurrentUser();
  if (!user || !canManageUsers(user)) {
    throw new Error('Anda tidak punya akses ke halaman ini.');
  }
  return user;
}

async function assertSameGroup(manager: Awaited<ReturnType<typeof requireManager>>, targetId: number) {
  const target = await prisma.user.findUnique({ where: { id: BigInt(targetId) } });
  if (!target) return null;
  if (!manager.isAdmin && Number(target.group_id) !== manager.groupId) {
    throw new Error('Anda hanya bisa mengelola akun di kelompok Anda sendiri.');
  }
  return target;
}

export async function approveUserAction(id: number): Promise<void> {
  const manager = await requireManager();
  const target = await assertSameGroup(manager, id);
  if (!target) return;

  await prisma.user.update({ where: { id: BigInt(id) }, data: { email_verified_at: new Date() } });
  revalidatePath('/admin/verifikasi');
  revalidatePath('/admin');
}

export async function rejectUserAction(id: number): Promise<void> {
  const manager = await requireManager();
  const target = await assertSameGroup(manager, id);
  if (!target) return;

  if (Number(target.id) === manager.id) {
    throw new Error('Anda tidak bisa menolak akun sendiri.');
  }

  await prisma.user.delete({ where: { id: BigInt(id) } });
  revalidatePath('/admin/verifikasi');
  revalidatePath('/admin');
}
