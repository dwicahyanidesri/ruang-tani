import type { ReactNode } from 'react';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default async function PublicShell({ children }: { children: ReactNode }) {
  const [session, profile] = await Promise.all([auth(), prisma.profiles.findFirst()]);

  return (
    <div className="overflow-x-hidden bg-slate-50 text-slate-700">
      <Nav isLoggedIn={!!session?.user} />
      <main>{children}</main>
      <Footer profile={profile} />
    </div>
  );
}
