import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { roleOf } from '@/lib/roles';
import AccountForm from './AccountForm';

export const metadata = { title: 'Profil Saya | Admin Ruang Tani' };

const roleLabel = {
  admin: 'Admin Utama',
  group_admin: 'Admin Kelompok',
  member: 'Anggota',
} as const;

export default async function AkunSayaPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const role = roleOf(user);

  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-soft sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-600 text-lg font-extrabold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="text-base font-bold text-ink-900">{user.name}</p>
          <p className="text-xs text-slate-500">{user.group?.name ?? roleLabel[role]}</p>
        </div>
      </div>

      <AccountForm name={user.name} email={user.email} />
    </div>
  );
}
