import { prisma } from '@/lib/prisma';
import { toWhatsapp } from '@/lib/phone';
import { Icon } from '@/components/Icon';
import PublicShell from '@/components/PublicShell';
import PageHeader from '@/components/PageHeader';

export const metadata = { title: 'Profil & Kontak' };

export default async function ProfileContactPage() {
  let profile = await prisma.profiles.findFirst();
  if (!profile) {
    profile = await prisma.profiles.create({ data: {} });
  }

  const whatsapp = toWhatsapp(profile.whatsapp);

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Tentang Kami"
        title="Profil & Kontak"
        description="Mengenal lebih dekat Ruang Tani Desa Tanjung Agung, visi misi, serta cara menghubungi kami."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="card p-8">
              <h2 className="text-xl font-bold text-ink-900">Tentang Ruang Tani</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{profile.about}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon icon="sparkles" className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-ink-900">Visi</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{profile.vision}</p>
              </div>
              <div className="card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon icon="leaf" className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-ink-900">Misi</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{profile.mission}</p>
              </div>
            </div>
            {profile.map_embed_url && (
              <div className="overflow-hidden rounded-3xl shadow-soft">
                <iframe
                  src={profile.map_embed_url}
                  className="h-80 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          <div className="card h-fit p-8">
            <h2 className="text-lg font-bold text-ink-900">Hubungi Kami</h2>
            <ul className="mt-6 space-y-5 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <Icon icon="basket" className="mt-0.5 h-5 w-5 flex-none text-brand-600" />
                <span>{profile.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon icon="sparkles" className="mt-0.5 h-5 w-5 flex-none text-brand-600" />
                <span>{profile.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon icon="gift" className="mt-0.5 h-5 w-5 flex-none text-brand-600" />
                <span>{profile.email}</span>
              </li>
            </ul>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener"
                className="btn-primary mt-8 w-full"
              >
                Chat via WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
