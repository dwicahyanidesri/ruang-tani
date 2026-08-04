'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Icon } from '@/components/Icon';
import { register } from './actions';

type Group = { id: number; name: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
      {pending ? 'Memproses...' : 'Daftar'}
    </button>
  );
}

export default function RegisterForm({ groups }: { groups: Group[] }) {
  const [state, formAction] = useFormState(register, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-slate-600">
          Nama Anda
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoFocus
          className="input-field"
          placeholder="Nama lengkap"
        />
      </div>

      <div>
        <label htmlFor="group_id" className="mb-1.5 block text-xs font-semibold text-slate-600">
          Kelompok Tani
        </label>
        <select id="group_id" name="group_id" required defaultValue="" className="input-field">
          <option value="" disabled>
            — Pilih kelompok tani Anda —
          </option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-[11px] text-slate-400">
          Kelompok belum ada di daftar? Minta admin utama menambahkannya dulu.
        </p>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-600">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="input-field"
          placeholder="nama@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-600">
          Kata Sandi
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            autoComplete="new-password"
            className="input-field pr-11"
            placeholder="Minimal 6 karakter"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
          >
            <Icon icon={showPassword ? 'eye-off' : 'eye'} className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="password_confirmation"
          className="mb-1.5 block text-xs font-semibold text-slate-600"
        >
          Ulangi Kata Sandi
        </label>
        <div className="relative">
          <input
            id="password_confirmation"
            name="password_confirmation"
            type={showConfirm ? 'text' : 'password'}
            required
            minLength={6}
            autoComplete="new-password"
            className="input-field pr-11"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
          >
            <Icon icon={showConfirm ? 'eye-off' : 'eye'} className="h-4 w-4" />
          </button>
        </div>
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
