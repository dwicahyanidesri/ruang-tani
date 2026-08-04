'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export type ProfileFormState = { error?: string } | undefined;

export async function updateSiteProfileAction(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    return { error: 'Halaman ini hanya untuk admin utama.' };
  }

  const field = (name: string) => (formData.get(name) as string)?.trim() || null;

  let profile = await prisma.profiles.findFirst();
  const data = {
    about: field('about'),
    vision: field('vision'),
    mission: field('mission'),
    address: field('address'),
    phone: field('phone'),
    whatsapp: field('whatsapp'),
    email: field('email'),
    facebook_url: field('facebook_url'),
    instagram_url: field('instagram_url'),
    youtube_url: field('youtube_url'),
    map_embed_url: field('map_embed_url'),
  };

  if (profile) {
    await prisma.profiles.update({ where: { id: profile.id }, data });
  } else {
    await prisma.profiles.create({ data });
  }

  revalidatePath('/admin/profil');
  revalidatePath('/');
  revalidatePath('/profil-kontak');
  redirect('/admin/profil');
}
