import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

// Middleware ini cuma cek "sudah login atau belum" (lewat callback `authorized`
// di auth.config.ts) — aman dijalankan di Edge runtime karena tidak menyentuh
// Prisma/bcrypt sama sekali. Cek status verified & peran (admin/admin kelompok)
// dilakukan di layout /admin lewat getCurrentUser(), yang query database langsung.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/admin/:path*'],
};
