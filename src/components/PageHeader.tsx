export default function PageHeader({
  eyebrow = 'Ruang Tani',
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-slate-100 bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-50/80">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm text-brand-50/90">{description}</p>}
      </div>
    </section>
  );
}
