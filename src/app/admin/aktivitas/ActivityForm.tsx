'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { ActivityFormState } from './actions';

type Group = { id: number; name: string };

type Activity = {
  title: string;
  excerpt: string | null;
  body: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  activity_date: Date | null;
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

function toDateInputValue(date: Date | null): string {
  if (!date) return '';
  return new Date(date).toISOString().slice(0, 10);
}

export default function ActivityForm({
  action,
  activity,
  groups,
  currentGroupName,
  imageUrl,
  submitLabel,
}: {
  action: (state: ActivityFormState, formData: FormData) => Promise<ActivityFormState>;
  activity?: Activity;
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
          <select name="group_id" required defaultValue={activity?.group_id ?? ''} className="input-field">
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
          Aktivitas ini akan otomatis tercatat sebagai milik kelompok Anda: {currentGroupName ?? '-'}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Judul</label>
        <input type="text" name="title" defaultValue={activity?.title} required className="input-field" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Tanggal Kegiatan</label>
        <input
          type="date"
          name="activity_date"
          defaultValue={toDateInputValue(activity?.activity_date ?? null)}
          className="input-field w-56"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Ringkasan Singkat</label>
        <textarea name="excerpt" rows={2} defaultValue={activity?.excerpt ?? ''} className="input-field" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Isi Lengkap</label>
        <textarea name="body" rows={6} defaultValue={activity?.body ?? ''} className="input-field" />
      </div>

      <div className="rounded-xl border border-slate-100 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          Kontak untuk Aktivitas Ini (opsional)
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nama Kontak</label>
            <input
              type="text"
              name="contact_name"
              defaultValue={activity?.contact_name ?? ''}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nomor WhatsApp</label>
            <input
              type="text"
              name="contact_phone"
              defaultValue={activity?.contact_phone ?? ''}
              placeholder="08xxxxxxxxxx"
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Foto</label>
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
