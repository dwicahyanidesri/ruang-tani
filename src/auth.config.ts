import type { NextAuthConfig } from 'next-auth';

// Bagian config yang "aman" dijalankan di Edge runtime (dipakai middleware.ts).
// JANGAN import Prisma/bcrypt di sini — taruh di auth.ts (Node runtime saja).
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');

      if (isAdminRoute) {
        return isLoggedIn;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
