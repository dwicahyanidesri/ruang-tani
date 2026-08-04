'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { GroupFormState } from './actions';

type Group = {
  name: string;
  description: string | null;
  contact_name: string | null;
  contact_phone: string | null;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Menyimpan...' : label}
    </button>
  );
}

export default function GroupForm({
  action,
  group,
  submitLabel,
}: {
  action: (state: GroupFormState, formData: FormData) => Promise<GroupFormState>;
  group?: Group;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-soft sm:p-8">
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nama Kelompok</label>
        <input
          type="text"
          name="name"
          defaultValue={group?.name}
          required
          placeholder="Misal: Kelompok Tani Hurip"
          className="input-field"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Deskripsi Singkat</label>
        <textarea name="description" rows={3} defaultValue={group?.description ?? ''} className="input-field" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nama Kontak Utama</label>
          <input
            type="text"
            name="contact_name"
            defaultValue={group?.contact_name ?? ''}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
            Nomor WhatsApp Umum Kelompok
          </label>
          <input
            type="text"
            name="contact_phone"
            defaultValue={group?.contact_phone ?? ''}
            placeholder="08xxxxxxxxxx"
            className="input-field"
          />
        </div>
      </div>
      <p className="text-[11px] text-slate-400">
        Nomor ini jadi cadangan tombol WhatsApp kalau produk/aktivitas kelompok tidak diisi nomor
        kontak masing-masing.
      </p>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
      )}

      <SubmitButton label={submitLabel} />
    </form>
  );
}
