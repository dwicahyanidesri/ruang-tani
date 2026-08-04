'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export type AccountFormState = { error?: string; success?: string } | undefined;

const schema = z
  .object({
    name: z.string().trim().min(1, 'Nama wajib diisi.').max(255),
    email: z.string().trim().email('Format email tidak valid.').max(255),
    password: z.string().min(6, 'Kata sandi minimal 6 karakter.').optional().or(z.literal('')),
    password_confirmation: z.string().optional().or(z.literal('')),
  })
  .refine((data) => !data.password || data.password === data.password_confirmation, {
    message: 'Konfirmasi kata sandi baru tidak cocok.',
    path: ['password_confirmation'],
  });

export async function updateAccountAction(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Sesi Anda berakhir, silakan login ulang.' };

  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password') || undefined,
    password_confirmation: formData.get('password_confirmation') || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' };

  const email = parsed.data.email.toLowerCase().trim();
  if (email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: 'Email ini sudah dipakai akun lain.' };
  }

  const data: Record<string, unknown> = { name: parsed.data.name, email };
  if (parsed.data.password) {
    data.password = await bcrypt.hash(parsed.data.password, 10);
  }

  await prisma.user.update({ where: { id: BigInt(user.id) }, data });

  revalidatePath('/admin');
  return { success: 'Profil berhasil diperbarui.' };
}
