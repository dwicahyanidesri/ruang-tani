# Ruang Tani (versi Next.js)

Proyek ini adalah **rewrite total** dari versi Laravel (folder `kios-gapoktan`) supaya bisa
di-hosting gratis di Vercel. Database Postgres yang dipakai **sama persis** dengan
versi Laravel (Neon) — jadi data akun, produk, aktivitas, dst tidak hilang/ganda.

## Status pengerjaan

- [x] Setup proyek (Next.js + TypeScript + Tailwind, warna & font sama seperti versi lama)
- [x] Sambungkan Prisma ke database Neon yang sudah ada
- [ ] Sistem login & 3 peran (admin utama, admin kelompok, anggota)
- [ ] Halaman publik (Beranda, Produk, Aktivitas, Profil & Kontak)
- [ ] Dashboard admin (kelola produk/aktivitas/kelompok/akun/verifikasi anggota)
- [ ] Upload foto ke Supabase Storage
- [ ] Modal konfirmasi & link WhatsApp
- [ ] Deploy ke Vercel

## Langkah selanjutnya (perlu dilakukan sebelum lanjut)

1. Copy `.env.local.example` jadi `.env.local`.
2. Isi `DATABASE_URL` dengan connection string Neon yang asli (dari dashboard Neon).
3. Isi `S3_SECRET_ACCESS_KEY` dengan secret access key Supabase yang asli.
4. Jalankan `npm install` di folder ini.
5. Jalankan `npx prisma db pull` — ini otomatis membaca struktur tabel asli dari
   database dan mengisi `prisma/schema.prisma` dengan benar (tidak perlu ditulis manual).
6. Kabari Claude kalau langkah 1-5 sudah selesai, supaya pengerjaan halaman &
   fitur bisa dilanjutkan berdasarkan struktur data yang akurat.
