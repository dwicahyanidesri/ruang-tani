import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { imageUrl } from '@/lib/storage';
import { waLink } from '@/lib/phone';
import { Icon } from '@/components/Icon';
import PublicShell from '@/components/PublicShell';

function formatDate(date: Date | null): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default async function ActivityShowPage({ params }: { params: { slug: string } }) {
  const activity = await prisma.activities.findUnique({
    where: { slug: params.slug },
    include: { groups: true },
  });

  if (!activity) notFound();

  const recentActivities = await prisma.activities.findMany({
    where: { id: { not: activity.id } },
    orderBy: { activity_date: 'desc' },
    take: 6,
  });

  const url = imageUrl(activity.image_path);
  const contactPhone = activity.contact_phone || activity.groups?.contact_phone || null;
  const whatsapp = waLink(
    contactPhone,
    `Halo, saya ingin tahu lebih lanjut tentang ${activity.title}.`
  );

  return (
    <PublicShell>
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/aktivitas-kelompok" className="text-xs font-semibold text-brand-600">
            &larr; Kembali ke Aktivitas Kelompok
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-3">
            <div className="min-w-0 lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {formatDate(activity.activity_date)}
                {activity.groups ? ` · ${activity.groups.name}` : ''}
              </p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
                {activity.title}
              </h1>

              <div className="-mx-4 mt-8 flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-100 to-emerald-50 text-brand-400 sm:mx-0 sm:h-[420px] sm:rounded-3xl">
                {url ? (
                  <img src={url} alt={activity.title} className="h-full w-full object-cover" />
                ) : (
                  <Icon icon="leaf" className="h-16 w-16" />
                )}
              </div>

              <div className="prose prose-slate mt-8 max-w-none whitespace-pre-line text-base leading-loose text-slate-700">
                {activity.body}
              </div>

              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener" className="btn-primary mt-10">
                  Chat WhatsApp{activity.contact_name ? ` — ${activity.contact_name}` : ''}
                </a>
              )}
            </div>

            <aside className="min-w-0 lg:col-span-1">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft lg:sticky lg:top-24">
                <h2 className="text-sm font-bold uppercase tracking-wide text-ink-900">
                  Aktivitas Terbaru
                </h2>
                <div className="mt-4 space-y-4">
                  {recentActivities.length === 0 ? (
                    <p className="text-sm text-slate-500">Belum ada aktivitas lain.</p>
                  ) : (
                    recentActivities.map((item) => {
                      const itemUrl = imageUrl(item.image_path);
                      return (
                        <Link
                          key={String(item.id)}
                          href={`/aktivitas-kelompok/${item.slug}`}
                          className="flex gap-3 rounded-xl p-2 transition hover:bg-brand-50"
                        >
                          <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-100 to-emerald-50 text-brand-400">
                            {itemUrl ? (
                              <img src={itemUrl} alt={item.title} className="h-full w-full object-cover" />
                            ) : (
                              <Icon icon="leaf" className="h-6 w-6" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                              {formatDate(item.activity_date)}
                            </p>
                            <p className="truncate text-sm font-bold text-ink-900">{item.title}</p>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
