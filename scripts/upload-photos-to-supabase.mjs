// Skrip sekali-pakai: upload foto lama (dari folder kios-gapoktan/storage/app/public)
// ke Supabase Storage, supaya path-nya (mis. "products/xxx.jpg") persis sama
// dengan yang tersimpan di kolom image_path pada database.
//
// Cara pakai (dari folder ruang-tani):
//   npm install @aws-sdk/client-s3 dotenv
//   node scripts/upload-photos-to-supabase.mjs

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config as loadEnv } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv({ path: join(__dirname, '..', '.env.local') });

const SOURCE_DIR = join(__dirname, '..', '..', 'kios-gapoktan', 'storage', 'app', 'public');
const FOLDERS = ['activities', 'products'];

const {
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_REGION,
  S3_BUCKET,
  S3_ENDPOINT,
} = process.env;

if (!S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_BUCKET || !S3_ENDPOINT) {
  console.error('Kredensial S3 belum lengkap di .env.local. Cek lagi ya.');
  process.exit(1);
}

if (!existsSync(SOURCE_DIR)) {
  console.error(`Folder sumber tidak ditemukan: ${SOURCE_DIR}`);
  process.exit(1);
}

const s3 = new S3Client({
  region: S3_REGION || 'auto',
  endpoint: S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

function contentTypeFor(filename) {
  if (filename.endsWith('.png')) return 'image/png';
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
  if (filename.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

let uploaded = 0;
let failed = 0;

for (const folder of FOLDERS) {
  const folderPath = join(SOURCE_DIR, folder);
  if (!existsSync(folderPath)) {
    console.log(`(lewati) folder tidak ada: ${folder}`);
    continue;
  }
  const files = readdirSync(folderPath).filter((f) => f !== '.gitkeep');
  for (const file of files) {
    const key = `${folder}/${file}`;
    const body = readFileSync(join(folderPath, file));
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
          Body: body,
          ContentType: contentTypeFor(file),
        })
      );
      console.log(`OK   ${key}`);
      uploaded++;
    } catch (err) {
      console.error(`GAGAL ${key}:`, err.message);
      failed++;
    }
  }
}

console.log(`\nSelesai. Berhasil: ${uploaded}, gagal: ${failed}`);
