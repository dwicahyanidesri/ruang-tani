'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const redirectTo = (formData.get('redirectTo') as string) || '/admin';

  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Email atau kata sandi yang Anda masukkan salah.';
        default:
          return 'Terjadi kesalahan. Coba lagi.';
      }
    }
    // NextAuth melempar redirect internal (NEXT_REDIRECT) kalau login berhasil —
    // itu harus dilempar ulang, bukan ditangkap sebagai error.
    throw error;
  }
}
