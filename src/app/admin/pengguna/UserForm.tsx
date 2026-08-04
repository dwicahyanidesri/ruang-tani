'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { UserFormState } from './actions';

type Group = { id: number; name: string };

type UserData = {
  name: string;
  email: string;
  group_id: number | null;
  is_group_admin: boolean;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Menyimpan...' : label}
    </button>
  );
}

export default function UserForm({
  action,
  user,
  groups,
  currentGroupName,
  submitLabel,
}: {
  action: (state: UserFormState, formData: FormData) => Promise<UserFormState>;
  user?: UserData;
  groups: Group[] | null;
  currentGroupName?: string | null;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, undefined);
  const isEdit = !!user;

  return (
    <form action={formAction} className="max-w-xl space-y-5 rounded-2xl bg-white p-6 shadow-soft sm:p-8">
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nama</label>
        <input type="text" name="name" defaultValue={user?.name} required className="input-field" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
          Email (dipakai untuk login)
        </label>
        <input type="email" name="email" defaultValue={user?.email} required className="input-field" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
          {isEdit ? 'Kata Sandi Baru (kosongkan jika tidak diubah)' : 'Kata Sandi'}
        </label>
        <input type="password" name="password" required={!isEdit} className="input-field" />
      </div>

      {groups !== null ? (
        <>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Kelompok Tani</label>
            <select name="group_id" defaultValue={user?.group_id ?? ''} className="input-field">
              <option value="">— Tidak terikat kelompok —</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <input
              type="checkbox"
              name="is_group_admin"
              defaultChecked={user?.is_group_admin ?? false}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Jadikan admin kelompok (bisa kelola produk, aktivitas &amp; anggota di kelompoknya
            sendiri)
          </label>
        </>
      ) : (
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          Akun ini otomatis masuk ke kelompok{' '}
          <strong className="text-ink-900">{currentGroupName}</strong> sebagai anggota biasa (cuma
          bisa lihat, tidak bisa kelola produk/aktivitas). Untuk menjadikan seseorang admin
          kelompok, hubungi admin utama.
        </div>
      )}

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
      )}

      <SubmitButton label={submitLabel} />
    </form>
  );
}
