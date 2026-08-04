import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { roleOf } from '@/lib/roles';
import { prisma } from '@/lib/prisma';
import AdminShell from './AdminShell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Belum di-ACC admin — tidak boleh masuk area admin sama sekali.
  if (!user.verified) {
    redirect('/verifikasi-email');
  }

  const role = roleOf(user);

  let pendingCount = 0;
  if (role === 'admin') {
    pendingCount = await prisma.user.count({ where: { email_verified_at: null } });
  } else if (role === 'group_admin' && user.groupId !== null) {
    pendingCount = await prisma.user.count({
      where: { email_verified_at: null, group_id: BigInt(user.groupId) },
    });
  }

  return (
    <AdminShell
      user={{ name: user.name, email: user.email }}
      role={role}
      groupName={user.group?.name ?? null}
      pendingCount={pendingCount}
    >
      {children}
    </AdminShell>
  );
}
