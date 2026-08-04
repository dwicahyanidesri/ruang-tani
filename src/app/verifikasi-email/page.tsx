import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { Icon } from '@/components/Icon';
import { LogoutButton } from '@/components/LogoutButton';

export const metadata = { title: 'Menunggu Verifikasi | Ruang Tani' };

export default async function PendingApprovalPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.verified) {
    redirect('/admin');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 px-4 py-10 font-sans">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white shadow-soft">
            <Icon icon="sparkles" className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-ink-900">Menunggu Verifikasi</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Pendaftaran akun <span className="font-semibold text-ink-900">{user.email}</span>{' '}
            berhasil. Sekarang tinggal menunggu admin kelompok
            {user.group ? ` ${user.group.name}` : ''} atau admin utama meng-ACC akun Anda sebelum
            bisa masuk ke dashboard.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Coba hubungi admin kelompok Anda langsung supaya lebih cepat diverifikasi.
        </p>

        <div className="mt-6">
          <LogoutButton className="btn-secondary w-full" />
        </div>
      </div>
    </main>
  );
}
