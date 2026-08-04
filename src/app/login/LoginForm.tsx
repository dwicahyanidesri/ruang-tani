'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Icon } from '@/components/Icon';
import { authenticate } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
      {pending ? 'Memproses...' : 'Masuk ke Dashboard'}
    </button>
  );
}

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [errorMessage, formAction] = useFormState(authenticate, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-600">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
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
            autoComplete="current-password"
            className="input-field pr-11"
            placeholder="••••••••"
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

      <label className="flex items-center gap-2 text-xs text-slate-500">
        <input
          type="checkbox"
          name="remember"
          className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        Ingat saya
      </label>

      {errorMessage && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{errorMessage}</p>
      )}

      <SubmitButton />
    </form>
  );
}
