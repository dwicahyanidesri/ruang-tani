import Link from 'next/link';
import { Icon } from '@/components/Icon';

type SiteProfile = {
  about: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
} | null;

export default function Footer({ profile }: { profile: SiteProfile }) {
  const about =
    profile?.about ??
    'Etalase produk olahan hasil pertanian Gabungan Kelompok Tani Desa Tanjung Agung, Kecamatan Teluk Pandan, Kabupaten Pesawaran, Lampung.';
  const aboutShort = about.length > 220 ? `${about.slice(0, 220)}…` : about;

  return (
    <footer className="mt-16 border-t border-slate-100 bg-ink-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white">
              <Icon icon="leaf" className="h-4 w-4" />
            </span>
            <span className="text-lg font-extrabold text-white">Ruang Tani</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">{aboutShort}</p>
          <div className="mt-5 flex gap-3">
            {profile?.facebook_url && (
              <a
                href={profile.facebook_url}
                target="_blank"
                rel="noopener"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-brand-600"
              >
                f
              </a>
            )}
            {profile?.instagram_url && (
              <a
                href={profile.instagram_url}
                target="_blank"
                rel="noopener"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-brand-600"
              >
                ig
              </a>
            )}
            {profile?.youtube_url && (
              <a
                href={profile.youtube_url}
                target="_blank"
                rel="noopener"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-brand-600"
              >
                yt
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Tautan</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li>
              <Link href="/produk" className="hover:text-brand-400">
                Produk
              </Link>
            </li>
            <li>
              <Link href="/aktivitas-kelompok" className="hover:text-brand-400">
                Aktivitas Kelompok
              </Link>
            </li>
            <li>
              <Link href="/profil-kontak" className="hover:text-brand-400">
                Profil &amp; Kontak
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Kontak</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li>{profile?.address ?? 'Ds. Tanjung Agung, Kec. Teluk Pandan, Kab. Pesawaran, Lampung'}</li>
            <li>{profile?.phone ?? '-'}</li>
            <li>{profile?.email ?? '-'}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Ruang Tani &mdash; Gapoktan Desa Tanjung Agung. Seluruh hak
        cipta dilindungi.
      </div>
    </footer>
  );
}
