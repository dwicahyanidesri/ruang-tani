import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { imageUrl } from '@/lib/storage';
import { Icon, type IconName } from '@/components/Icon';
import PublicShell from '@/components/PublicShell';

const heroFeatures = [
  'Gratis Diakses Siapa Saja',
  'Etalase Produk Tiap Kelompok Tani',
  'Dokumentasi Kegiatan Lengkap',
  'Kelola Konten Mandiri per Kelompok',
  'Terhubung Langsung via WhatsApp',
  'Tampilan Ramah di HP',
];

export default async function HomePage() {
  const [featuredProducts, latestActivities, productCount, activityCount, groupCount] =
    await Promise.all([
      prisma.products.findMany({ orderBy: { updated_at: 'desc' }, take: 3, include: { groups: true } }),
      prisma.activities.findMany({ orderBy: { activity_date: 'desc' }, take: 3 }),
      prisma.products.count(),
      prisma.activities.count(),
      prisma.groups.count(),
    ]);

  return (
    <PublicShell>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <h1
            className="font-extrabold leading-tight tracking-tight text-white"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            Ruang <span className="text-emerald-100">Tani</span>
            <br />
            Tanjung Agung
          </h1>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/produk" className="btn-primary !bg-white !text-brand-700 hover:!bg-brand-50">
              Lihat Semua Produk
            </Link>
            <Link
              href="/profil-kontak"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Hubungi Kami
            </Link>
          </div>

          <div
            className="mt-10 overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <div className="hero-marquee-track pointer-events-none flex w-max items-center gap-3">
              {[...heroFeatures, ...heroFeatures].map((feature, i) => (
                <span
                  key={i}
                  className="flex flex-shrink-0 items-center gap-3 text-[0.85rem] font-extrabold text-white"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
                >
                  {feature}
                  <span style={{ opacity: 0.55 }}>&bull;</span>
                </span>
              ))}
            </div>
          </div>

          <style>{`
            .hero-marquee-track { animation: hero-marquee-scroll 24s linear infinite; }
            @keyframes hero-marquee-scroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
          `}</style>

          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/20 pt-6">
            <div>
              <p className="text-2xl font-extrabold text-white">{productCount}+</p>
              <p className="text-xs font-medium text-brand-50/80">Produk Unggulan</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">{groupCount}</p>
              <p className="text-xs font-medium text-brand-50/80">Kelompok Binaan</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">{activityCount}+</p>
              <p className="text-xs font-medium text-brand-50/80">Aktivitas Kelompok</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Tentang Kami</p>
              <h2 className="section-title mt-2">Mengenal Desa Tanjung Agung</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Desa Tanjung Agung berada di Kecamatan Teluk Pandan, Kabupaten Pesawaran, Provinsi
                Lampung. Sebagian besar warganya berprofesi sebagai petani, dengan hasil bumi mulai
                dari singkong, pisang, kacang, hingga aneka olahan rumahan yang diproduksi oleh
                kelompok-kelompok tani di desa ini.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Ruang Tani hadir sebagai etalase digital bagi Gabungan Kelompok Tani (Gapoktan) Desa
                Tanjung Agung, tempat setiap kelompok tani bisa memamerkan produk olahan dan
                dokumentasi kegiatan mereka, sekaligus memudahkan warga maupun pembeli dari luar desa
                untuk mengenal dan menghubungi langsung kelompok tani binaan.
              </p>
              <Link href="/profil-kontak" className="btn-secondary mt-6">
                Selengkapnya Tentang Kami &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-brand-50 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft">
                  <Icon icon="basket" className="h-5 w-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-ink-900">Etalase Produk</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Setiap kelompok tani punya ruang sendiri untuk memajang hasil olahan mereka.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft">
                  <Icon icon="leaf" className="h-5 w-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-ink-900">Dokumentasi Kegiatan</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Rekam jejak pelatihan, panen, dan kolaborasi antar kelompok tani.
                </p>
              </div>
              <div className="rounded-2xl bg-brand-50 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft">
                  <Icon icon="sparkles" className="h-5 w-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-ink-900">Kelola Mandiri</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Tiap kelompok tani punya akun sendiri untuk mengelola kontennya masing-masing.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft">
                  <Icon icon="gift" className="h-5 w-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-ink-900">Terhubung Langsung</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Pembeli bisa langsung chat WhatsApp kelompok tani tanpa perantara.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Produk Unggulan</p>
            <h2 className="section-title mt-2">Hasil Karya Kelompok Tani Kami</h2>
          </div>
          <Link href="/produk" className="btn-secondary">
            Lihat Semua &rarr;
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => {
            const url = imageUrl(product.image_path);
            return (
              <Link
                key={String(product.id)}
                href={`/produk/${product.slug}`}
                className="card flex flex-col overflow-hidden"
              >
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-100 to-emerald-50 text-brand-500">
                  {url ? (
                    <img src={url} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <Icon icon={(product.icon as IconName) || 'basket'} className="h-10 w-10" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-ink-900">{product.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-brand-600">{product.groups?.name}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {(product.description ?? '').slice(0, 100)}
                  </p>
                  <span className="mt-4 text-xs font-semibold text-brand-600">
                    Baca selengkapnya &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <p className="text-sm font-bold uppercase tracking-wider text-brand-600">
                Aktivitas Kelompok
              </p>
              <h2 className="section-title mt-2">Kabar Terbaru dari Kelompok Tani</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Dokumentasi kegiatan pelatihan, panen, dan kolaborasi antar kelompok tani binaan
                Gapoktan Desa Tanjung Agung.
              </p>
              <Link href="/aktivitas-kelompok" className="btn-primary mt-6">
                Semua Aktivitas
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
              {latestActivities.length === 0 ? (
                <p className="text-sm text-slate-500">Belum ada aktivitas yang dipublikasikan.</p>
              ) : (
                latestActivities.map((activity) => {
                  const url = imageUrl(activity.image_path);
                  return (
                    <Link
                      key={String(activity.id)}
                      href={`/aktivitas-kelompok/${activity.slug}`}
                      className="card flex flex-col overflow-hidden"
                    >
                      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand-100 to-emerald-50 text-brand-500">
                        {url ? (
                          <img src={url} alt={activity.title} className="h-full w-full object-cover" />
                        ) : (
                          <Icon icon="leaf" className="h-10 w-10" />
                        )}
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          {activity.activity_date
                            ? new Date(activity.activity_date).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })
                            : ''}
                        </p>
                        <h3 className="mt-2 text-sm font-bold text-ink-900">{activity.title}</h3>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-ink-900 px-8 py-14 text-center sm:px-16">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Tertarik Bermitra atau Memesan Produk Kami?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
            Hubungi Ruang Tani Desa Tanjung Agung untuk informasi produk, kerja sama, maupun kunjungan
            kelompok tani.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/profil-kontak" className="btn-primary">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
