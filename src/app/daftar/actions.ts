'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Nama wajib diisi.').max(255),
    group_id: z.coerce.number({ invalid_type_error: 'Pilih kelompok tani.' }).int(),
    email: z.string().trim().email('Format email tidak valid.').max(255),
    password: z.string().min(6, 'Kata sandi minimal 6 karakter.'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Konfirmasi kata sandi tidak cocok.',
    path: ['password_confirmation'],
  });

export type RegisterState = { error?: string } | undefined;

export async function register(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    group_id: formData.get('group_id'),
    email: formData.get('email'),
    password: formData.get('password'),
    password_confirmation: formData.get('password_confirmation'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const { name, group_id, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return { error: 'Email ini sudah terdaftar.' };
  }

  const group = await prisma.groups.findUnique({ where: { id: BigInt(group_id) } });
  if (!group) {
    return { error: 'Kelompok tani tidak ditemukan.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      group_id: BigInt(group_id),
      is_admin: false,
      is_group_admin: false,
    },
  });

  try {
    await signIn('credentials', {
      email: normalizedEmail,
      password,
      redirectTo: '/verifikasi-email',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Akun berhasil dibuat, tapi login otomatis gagal. Silakan masuk manual.' };
    }
    throw error;
  }
}
