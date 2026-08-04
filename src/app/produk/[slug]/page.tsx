import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { imageUrl } from '@/lib/storage';
import { waLink } from '@/lib/phone';
import { Icon, type IconName } from '@/components/Icon';
import PublicShell from '@/components/PublicShell';

export default async function ProductShowPage({ params }: { params: { slug: string } }) {
  const product = await prisma.products.findUnique({
    where: { slug: params.slug },
    include: { groups: true },
  });

  if (!product) notFound();

  const allOthers = await prisma.products.findMany({
    where: { id: { not: product.id } },
    include: { groups: true },
  });
  const related = allOthers.sort(() => Math.random() - 0.5).slice(0, 3);

  const url = imageUrl(product.image_path);
  const price = product.price !== null ? `Rp ${product.price.toLocaleString('id-ID')}` : null;
  const contactPhone = product.contact_phone || product.groups?.contact_phone || null;
  const whatsapp = waLink(
    contactPhone,
    `Halo, saya tertarik dengan produk ${product.name} di Ruang Tani.`
  );

  return (
    <PublicShell>
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/produk" className="text-xs font-semibold text-brand-600">
            &larr; Kembali ke Produk
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="-mx-4 flex h-64 items-center justify-center bg-gradient-to-br from-brand-100 to-emerald-50 sm:mx-0 sm:h-80 sm:rounded-3xl">
              {url ? (
                <img
                  src={url}
                  alt={product.name}
                  className="h-full w-full object-cover sm:rounded-3xl"
                />
              ) : (
                <Icon
                  icon={(product.icon as IconName) || 'basket'}
                  className="h-20 w-20 text-brand-400"
                />
              )}
            </div>
            <div>
              <h1 className="mt-3 text-3xl font-extrabold text-ink-900">{product.name}</h1>
              {product.groups && (
                <p className="mt-2 text-sm font-semibold text-brand-600">
                  Diproduksi oleh {product.groups.name}
                </p>
              )}
              {price && <p className="mt-4 text-2xl font-extrabold text-ink-900">{price}</p>}
              <p className="mt-5 text-sm leading-relaxed text-slate-600">{product.description}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                {whatsapp ? (
                  <a href={whatsapp} target="_blank" rel="noopener" className="btn-primary">
                    Chat WhatsApp{product.contact_name ? ` — ${product.contact_name}` : ''}
                  </a>
                ) : (
                  <Link href="/profil-kontak" className="btn-primary">
                    Pesan / Hubungi Kami
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="section-title">Produk Lainnya</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => {
              const itemUrl = imageUrl(item.image_path);
              return (
                <Link
                  key={String(item.id)}
                  href={`/produk/${item.slug}`}
                  className="card flex flex-col overflow-hidden"
                >
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-100 to-emerald-50 text-brand-500">
                    {itemUrl ? (
                      <img src={itemUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <Icon icon={(item.icon as IconName) || 'basket'} className="h-10 w-10" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-ink-900">{item.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-brand-600">{item.groups?.name}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </PublicShell>
  );
}
