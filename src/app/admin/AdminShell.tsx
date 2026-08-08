'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { signOutAction } from '@/lib/actions';
import { useConfirm } from '@/components/ConfirmProvider';

type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  badge?: number;
};

export default function AdminShell({
  user,
  role,
  pendingCount,
  children,
}: {
  user: { name: string; email: string };
  role: 'admin' | 'group_admin' | 'member';
  groupName: string | null;
  pendingCount: number;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const confirm = useConfirm();

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Keluar dari akun?',
      message: 'Anda perlu login lagi untuk mengakses dashboard admin.',
      confirmText: 'Ya, Keluar',
    });
    if (ok) await signOutAction();
  };

  const baseNav: NavItem[] = [
    { href: '/admin', label: 'Ringkasan', icon: 'sparkles' },
    { href: '/admin/produk', label: 'Produk', icon: 'basket' },
    { href: '/admin/aktivitas', label: 'Aktivitas Kelompok', icon: 'leaf' },
  ];

  const adminOnlyNav: NavItem[] = [
    { href: '/admin/kelompok', label: 'Kelompok Tani', icon: 'sparkles' },
    { href: '/admin/pengguna', label: 'Akun Pengguna', icon: 'basket' },
    { href: '/admin/verifikasi', label: 'Verifikasi Anggota', icon: 'gift', badge: pendingCount },
    { href: '/admin/profil', label: 'Profil & Kontak', icon: 'cake' },
  ];

  const groupAdminOnlyNav: NavItem[] = [
    { href: '/admin/pengguna', label: 'Akun Pengguna', icon: 'basket' },
    { href: '/admin/verifikasi', label: 'Verifikasi Anggota', icon: 'gift', badge: pendingCount },
  ];

  const scopedNav = role === 'admin' ? adminOnlyNav : role === 'group_admin' ? groupAdminOnlyNav : [];
  const scopedNavTitle = role === 'admin' ? 'Khusus Admin Utama' : 'Khusus Admin Kelompok';

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  const titleNav: NavItem[] = [
    ...baseNav,
    ...adminOnlyNav,
    ...groupAdminOnlyNav,
    { href: '/admin/akun-saya', label: 'Akun Saya', icon: 'sparkles' },
  ];

  const pageTitle = (() => {
    if (pathname === '/admin') return 'Ringkasan';
    const match = titleNav
      .filter((item) => item.href !== '/admin' && pathname.startsWith(item.href))
      .sort((a, b) => b.href.length - a.href.length)[0];
    return match?.label ?? 'Ringkasan';
  })();

  const navLinkClass = (href: string) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
      isActive(href) ? 'bg-brand-600 text-white' : 'hover:bg-white/5'
    }`;

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-100 font-sans text-slate-700">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-ink-900 text-slate-300 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white">
            <Icon icon="leaf" className="h-4 w-4" />
          </span>
          <span className="text-sm font-extrabold text-white">Ruang Tani</span>
        </div>

        <nav className="mt-4 space-y-1 px-4 text-sm font-semibold">
          {baseNav.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
              <Icon icon={item.icon} className="h-4 w-4" /> {item.label}
            </Link>
          ))}

          {scopedNav.length > 0 && (
            <>
              <p className="px-4 pb-1 pt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {scopedNavTitle}
              </p>
              {scopedNav.map((item) => (
                <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                  <Icon icon={item.icon} className="h-4 w-4" /> {item.label}
                  {!!item.badge && (
                    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </>
          )}

          <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition hover:bg-white/5">
            <Icon icon="wheat" className="h-4 w-4" /> Lihat Website
          </Link>
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-white/5"
          >
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>

          <h1 className="text-lg font-bold text-ink-900">{pageTitle}</h1>

          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-600 text-xs font-extrabold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden text-xs font-semibold text-slate-500 sm:block">
                {user.name}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="hidden h-4 w-4 text-slate-400 sm:block"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-100 bg-white py-2 shadow-soft">
                  <p className="px-4 py-1.5 text-xs font-semibold text-slate-400">{user.email}</p>
                  <Link
                    href="/admin/akun-saya"
                    className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                  >
                    Edit Profil Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
                  >
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
