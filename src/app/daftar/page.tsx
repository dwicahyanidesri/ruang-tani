import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Icon } from '@/components/Icon';
import RegisterForm from './RegisterForm';

export const metadata = { title: 'Daftar | Ruang Tani' };

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/admin');
  }

  const groups = await prisma.groups.findMany({ orderBy: { name: 'asc' } });
  const groupsForForm = groups.map((g) => ({ id: Number(g.id), name: g.name }));

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 px-4 py-10 font-sans">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white shadow-soft">
            <Icon icon="leaf" className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-ink-900">Daftar Akun Kelompok</h1>
          <p className="mt-1 text-sm text-slate-500">
            Buat akun untuk kelompok tani Anda di Ruang Tani.
          </p>
        </div>

        {groupsForForm.length === 0 ? (
          <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Belum ada kelompok tani yang terdaftar. Hubungi admin utama Ruang Tani untuk
            menambahkan kelompok Anda terlebih dahulu sebelum bisa mendaftar.
          </div>
        ) : (
          <RegisterForm groups={groupsForForm} />
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-brand-600">
            Masuk di sini
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
