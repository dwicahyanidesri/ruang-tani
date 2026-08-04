'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateAccountAction, type AccountFormState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto disabled:opacity-60">
      {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
    </button>
  );
}

export default function AccountForm({ name, email }: { name: string; email: string }) {
  const [state, formAction] = useFormState<AccountFormState, FormData>(updateAccountAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Nama</label>
        <input type="text" name="name" defaultValue={name} required className="input-field" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Email</label>
        <input type="email" name="email" defaultValue={email} required className="input-field" />
      </div>

      <hr className="border-slate-100" />

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Password Baru</label>
        <input
          type="password"
          name="password"
          placeholder="Kosongkan jika tidak ingin ganti password"
          className="input-field"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
          Konfirmasi Password Baru
        </label>
        <input
          type="password"
          name="password_confirmation"
          placeholder="Ulangi password baru"
          className="input-field"
        />
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {state.success}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
