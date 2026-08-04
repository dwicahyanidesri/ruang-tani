import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { imageUrl } from '@/lib/storage';
import { Icon, type IconName } from '@/components/Icon';
import PublicShell from '@/components/PublicShell';
import PageHeader from '@/components/PageHeader';
import CardCarousel from '@/components/CardCarousel';

export const metadata = { title: 'Produk' };

function formatPrice(price: number | null): string | null {
  if (price === null) return null;
  return `Rp ${price.toLocaleString('id-ID')}`;
}

export default async function ProductsPage() {
  const products = await prisma.products.findMany({
    orderBy: { updated_at: 'desc' },
    include: { groups: true },
  });

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Etalase Produk"
        title="Produk Ruang Tani"
        description="Seluruh produk olahan hasil karya kelompok tani binaan Gapoktan Desa Tanjung Agung."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada produk yang ditambahkan.</p>
        ) : (
          <CardCarousel
            items={products.map((product) => {
              const url = imageUrl(product.image_path);
              const price = formatPrice(product.price);
              return (
                <Link
                  key={String(product.id)}
                  href={`/produk/${product.slug}`}
                  className="card flex flex-col overflow-hidden"
                >
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-100 to-emerald-50 text-brand-500">
                    {url ? (
                      <img src={url} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <Icon icon={(product.icon as IconName) || 'basket'} className="h-10 w-10" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold text-ink-900">{product.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-brand-600">{product.groups?.name}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                      {(product.description ?? '').slice(0, 110)}
                    </p>
                    {price && <p className="mt-4 text-sm font-bold text-ink-900">{price}</p>}
                    <span className="mt-4 text-xs font-semibold text-brand-600">
                      Baca selengkapnya &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          />
        )}
      </section>
    </PublicShell>
  );
}
