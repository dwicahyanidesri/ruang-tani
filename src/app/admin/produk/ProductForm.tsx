'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { ProductFormState } from './actions';

const categories = [
  'Tepung',
  'Camilan',
  'Olahan',
  'Hasil Panen',
  'Sayuran',
  'Buah-buahan',
  'Minuman',
  'Kerajinan',
  'Lainnya',
];

type Group = { id: number; name: string };

type Product = {
  name: string;
  category: string | null;
  description: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  price: number | null;
  group_id: number | null;
  image_path: string | null;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Menyimpan...' : label}
    </button>
  );
}

export default function ProductForm({
  action,
  product,
  groups,
  currentGroupName,
  imageUrl,
  submitLabel,
}: {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  product?: Product;
  groups: Group[] | null;
  currentGroupName?: string | null;
  imageUrl?: string | null;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="space-y-5 rounded-2xl bg-white p-6 shadow-soft sm:p-8">
      {groups ? (
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Kelompok Tani</label>
          <select name="group_id" required defaultValue={product?.group_id ?? ''} className="input-field">
            <option value="" disabled>
              — Pilih kelompok —
            </option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="rounded-xl bg-brand-50 px-4 py-3 text-xs font-semibold text-brand-700">
          Produk ini akan otomatis tercatat sebagai milik kelompok Anda: {currentGroupName ?? '-'}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nama Produk</label>
        <input type="text" name="name" defaultValue={product?.name} required className="input-field" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Kategori</label>
        <select name="category" defaultValue={product?.category ?? ''} className="input-field">
          <option value="">— Pilih kategori —</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Harga (Rp)</label>
        <input type="number" name="price" defaultValue={product?.price ?? ''} className="input-field" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Deskripsi</label>
        <textarea name="description" rows={4} defaultValue={product?.description ?? ''} className="input-field" />
      </div>

      <div className="rounded-xl border border-slate-100 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          Kontak untuk Produk Ini (opsional)
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nama Kontak</label>
            <input
              type="text"
              name="contact_name"
              defaultValue={product?.contact_name ?? ''}
              placeholder="Misal: Bu Siti"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nomor WhatsApp</label>
            <input
              type="text"
              name="contact_phone"
              defaultValue={product?.contact_phone ?? ''}
              placeholder="08xxxxxxxxxx"
              className="input-field"
            />
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Kalau dikosongkan, tombol WhatsApp di halaman produk akan pakai nomor kontak umum
          kelompok / profil kios.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Foto Produk</label>
        <input type="file" name="image" accept="image/*" className="input-field" />
        {imageUrl && <img src={imageUrl} className="mt-3 h-24 w-24 rounded-xl object-cover" />}
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
      )}

      <SubmitButton label={submitLabel} />
    </form>
  );
}
