import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import ProfileForm from './ProfileForm';

export const metadata = { title: 'Profil & Kontak | Admin Ruang Tani' };

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) redirect('/admin');

  let profile = await prisma.profiles.findFirst();
  if (!profile) {
    profile = await prisma.profiles.create({ data: {} });
  }

  return (
    <div>
      <h1 className="text-lg font-bold text-ink-900">Profil &amp; Kontak Situs</h1>
      <div className="mt-6">
        <ProfileForm
          profile={{
            about: profile.about,
            vision: profile.vision,
            mission: profile.mission,
            address: profile.address,
            phone: profile.phone,
            whatsapp: profile.whatsapp,
            email: profile.email,
            facebook_url: profile.facebook_url,
            instagram_url: profile.instagram_url,
            youtube_url: profile.youtube_url,
            map_embed_url: profile.map_embed_url,
          }}
        />
      </div>
    </div>
  );
}
