'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { canManageContent } from '@/lib/roles';
import { makeSlug } from '@/lib/slug';
import { uploadImage, deleteImage } from '@/lib/storage';

const schema = z.object({
  name: z.string().trim().min(1, 'Nama produk wajib diisi.').max(255),
  category: z.string().trim().max(255).optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),
  contact_name: z.string().trim().max(255).optional().or(z.literal('')),
  contact_phone: z.string().trim().max(50).optional().or(z.literal('')),
  price: z.coerce.number().int().min(0).optional().or(z.nan()),
});

export type ProductFormState = { error?: string } | undefined;

async function requireManager() {
  const user = await getCurrentUser();
  if (!user || !canManageContent(user)) {
    throw new Error('Anda tidak punya akses untuk mengelola produk.');
  }
  return user;
}

function parseForm(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    description: formData.get('description'),
    contact_name: formData.get('contact_name'),
    contact_phone: formData.get('contact_phone'),
    price: formData.get('price') || undefined,
  });
  return parsed;
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const user = await requireManager();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' };
  }

  const groupId = user.isAdmin ? Number(formData.get('group_id')) : user.groupId;
  if (!groupId) {
    return { error: 'Pilih kelompok tani.' };
  }

  const { name, category, description, contact_name, contact_phone, price } = parsed.data;

  let image_path: string | undefined;
  const image = formData.get('image');
  if (image instanceof File && image.size > 0) {
    image_path = await uploadImage(image, 'products');
  }

  await prisma.products.create({
    data: {
      name,
      slug: makeSlug(name),
      category: category || null,
      description: description || null,
      contact_name: contact_name || null,
      contact_phone: contact_phone || null,
      price: Number.isFinite(price) ? price : null,
      image_path: image_path ?? null,
      group_id: BigInt(groupId),
    },
  });

  revalidatePath('/admin/produk');
  revalidatePath('/produk');
  redirect('/admin/produk');
}

export async function updateProductAction(
  slug: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const user = await requireManager();
  const product = await prisma.products.findUnique({ where: { slug } });
  if (!product) return { error: 'Produk tidak ditemukan.' };
  if (!user.isAdmin && Number(product.group_id) !== user.groupId) {
    return { error: 'Anda hanya bisa mengelola produk kelompok Anda sendiri.' };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' };
  }
  const { name, category, description, contact_name, contact_phone, price } = parsed.data;

  const data: Record<string, unknown> = {
    name,
    category: category || null,
    description: description || null,
    contact_name: contact_name || null,
    contact_phone: contact_phone || null,
    price: Number.isFinite(price) ? price : null,
  };

  if (user.isAdmin) {
    const groupId = Number(formData.get('group_id'));
    if (groupId) data.group_id = BigInt(groupId);
  }

  const image = formData.get('image');
  if (image instanceof File && image.size > 0) {
    await deleteImage(product.image_path);
    data.image_path = await uploadImage(image, 'products');
  }

  await prisma.products.update({ where: { slug }, data });

  revalidatePath('/admin/produk');
  revalidatePath('/produk');
  revalidatePath(`/produk/${slug}`);
  redirect('/admin/produk');
}

export async function deleteProductAction(slug: string): Promise<void> {
  const user = await requireManager();
  const product = await prisma.products.findUnique({ where: { slug } });
  if (!product) return;
  if (!user.isAdmin && Number(product.group_id) !== user.groupId) {
    throw new Error('Anda hanya bisa mengelola produk kelompok Anda sendiri.');
  }

  await deleteImage(product.image_path);
  await prisma.products.delete({ where: { slug } });

  revalidatePath('/admin/produk');
  revalidatePath('/produk');
}
