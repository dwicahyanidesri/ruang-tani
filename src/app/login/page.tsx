import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Icon } from '@/components/Icon';
import LoginForm from './LoginForm';

export const metadata = { title: 'Masuk | Ruang Tani' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const session = await auth();
  if (session?.user) {
    redirect('/admin');
  }

  const redirectTo = searchParams.redirect || '/admin';

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 px-4 font-sans">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white shadow-soft">
            <Icon icon="leaf" className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-ink-900">Masuk</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola konten kelompok Anda di Ruang Tani Desa Tanjung Agung.
          </p>
        </div>

        <LoginForm redirectTo={redirectTo} />

        <p className="mt-6 text-center text-xs text-slate-500">
          Belum punya akun?{' '}
          <Link href="/daftar" className="font-semibold text-brand-600">
            Daftar di sini
          </Link>
        </p>
        <Link
          href="/"
          className="mt-3 block text-center text-xs font-semibold text-slate-400 hover:text-brand-600"
        >
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
