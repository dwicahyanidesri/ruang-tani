'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { useConfirm } from '@/components/ConfirmProvider';
import { signOutAction } from '@/lib/actions';

const links = [
  { href: '/', label: 'Beranda' },
  { href: '/produk', label: 'Produk' },
  { href: '/aktivitas-kelompok', label: 'Aktivitas Kelompok' },
  { href: '/profil-kontak', label: 'Profil & Kontak' },
];

export default function Nav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [mobileNav, setMobileNav] = useState(false);
  const pathname = usePathname();
  const confirm = useConfirm();

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Keluar dari akun?',
      message: 'Anda perlu login lagi untuk mengakses dashboard admin.',
      confirmText: 'Ya, Keluar',
    });
    if (ok) await signOutAction();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white shadow-soft">
            <Icon icon="leaf" className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold text-ink-900">Ruang Tani</span>
            <span className="block text-[11px] font-medium uppercase tracking-wider text-brand-600">
              Desa Tanjung Agung
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-brand-700 ${isActive(link.href) ? 'text-brand-700' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <>
              <Link href="/admin" className="btn-secondary !px-4 !py-2 text-xs">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-primary !px-4 !py-2 text-xs">
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link href="/daftar" className="btn-secondary !px-4 !py-2 text-xs">
                Daftar
              </Link>
              <Link href="/login" className="btn-primary !px-5 !py-2.5 text-xs">
                Masuk
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileNav((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        </button>
      </div>

      {mobileNav && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-sm font-semibold text-slate-600">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileNav(false)}>
                {link.label}
              </Link>
            ))}
            <hr className="my-1 border-slate-100" />
            {isLoggedIn ? (
              <>
                <Link href="/admin">Dashboard Admin</Link>
                <button onClick={handleLogout} className="text-left text-red-600">
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link href="/daftar">Daftar</Link>
                <Link href="/login" className="text-brand-700">
                  Masuk
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
