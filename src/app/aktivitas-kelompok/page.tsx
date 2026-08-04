import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { imageUrl } from '@/lib/storage';
import { Icon } from '@/components/Icon';
import PublicShell from '@/components/PublicShell';
import PageHeader from '@/components/PageHeader';
import CardCarousel from '@/components/CardCarousel';

export const metadata = { title: 'Aktivitas Kelompok' };

function formatDate(date: Date | null): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default async function ActivitiesPage() {
  const activities = await prisma.activities.findMany({
    orderBy: { activity_date: 'desc' },
    include: { groups: true },
  });

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Dokumentasi Kegiatan"
        title="Aktivitas Kelompok Tani"
        description="Rangkaian kegiatan pelatihan, panen, dan kolaborasi antar kelompok tani binaan Gapoktan Desa Tanjung Agung."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada aktivitas yang dipublikasikan.</p>
        ) : (
          <CardCarousel
            items={activities.map((activity) => {
              const url = imageUrl(activity.image_path);
              return (
                <Link
                  key={String(activity.id)}
                  href={`/aktivitas-kelompok/${activity.slug}`}
                  className="card flex flex-col overflow-hidden"
                >
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-100 to-emerald-50 text-brand-500">
                    {url ? (
                      <img src={url} alt={activity.title} className="h-full w-full object-cover" />
                    ) : (
                      <Icon icon="leaf" className="h-10 w-10" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {formatDate(activity.activity_date)}
                      {activity.groups ? ` · ${activity.groups.name}` : ''}
                    </p>
                    <h3 className="mt-2 text-base font-bold text-ink-900">{activity.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                      {(activity.excerpt ?? '').slice(0, 100)}
                    </p>
                    <span className="mt-4 text-xs font-semibold text-brand-600">
                      Baca selengkapnya &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          />
        )}
      </section>
    </PublicShell>
  );
}
