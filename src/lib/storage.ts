import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const {
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_REGION,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_PUBLIC_URL,
} = process.env;

function client() {
  return new S3Client({
    region: S3_REGION || 'auto',
    endpoint: S3_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID!,
      secretAccessKey: S3_SECRET_ACCESS_KEY!,
    },
  });
}

function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot);
}

function contentTypeFor(filename: string): string {
  const ext = extensionOf(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

/**
 * Upload satu file gambar ke folder ("products" / "activities") di Supabase
 * Storage, lalu kembalikan path relatifnya (mis. "products/uuid.jpg") —
 * path inilah yang disimpan di kolom image_path, sama seperti versi Laravel.
 */
export async function uploadImage(file: File, folder: 'products' | 'activities'): Promise<string> {
  const key = `${folder}/${randomUUID()}${extensionOf(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await client().send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentTypeFor(file.name),
    })
  );

  return key;
}

export async function deleteImage(path: string | null | undefined): Promise<void> {
  if (!path) return;
  try {
    await client().send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: path }));
  } catch {
    // Kalau gagal hapus foto lama, biarkan saja — bukan error fatal.
  }
}

export function imageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${S3_PUBLIC_URL}/${path}`;
}
