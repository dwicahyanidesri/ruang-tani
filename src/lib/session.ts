import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { SessionUser } from '@/lib/roles';

/**
 * Ambil data user yang sedang login, SELALU langsung dari database (bukan dari
 * token JWT) — supaya status verified/peran selalu akurat di setiap request,
 * persis seperti $request->user() di Laravel.
 */
export async function getCurrentUser(): Promise<
  (SessionUser & { group: { id: number; name: string; slug: string } | null }) | null
> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: BigInt(session.user.id) },
    include: { groups: true },
  });

  if (!user) return null;

  return {
    id: Number(user.id),
    name: user.name,
    email: user.email,
    groupId: user.group_id !== null ? Number(user.group_id) : null,
    isAdmin: user.is_admin,
    isGroupAdmin: user.is_group_admin,
    verified: user.email_verified_at !== null,
    group: user.groups
      ? { id: Number(user.groups.id), name: user.groups.name, slug: user.groups.slug }
      : null,
  };
}
