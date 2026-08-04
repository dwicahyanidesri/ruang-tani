'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type ConfirmOptions = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
};

type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

// Pengganti komponen <x-confirm-modal /> + event `open-confirm` (Alpine.js) di
// versi Laravel. Pakai lewat hook useConfirm(): `if (await confirm({...})) { ... }`
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm() harus dipakai di dalam <ConfirmProvider>');
  return ctx;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    open: boolean;
    options: ConfirmOptions;
    resolve: ((value: boolean) => void) | null;
  }>({ open: false, options: {}, resolve: null });

  const confirm = useCallback<ConfirmFn>((options = {}) => {
    return new Promise<boolean>((resolve) => {
      setState({ open: true, options, resolve });
    });
  }, []);

  const finish = (result: boolean) => {
    state.resolve?.(result);
    setState((s) => ({ ...s, open: false, resolve: null }));
  };

  const variant = state.options.variant ?? 'default';

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {state.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => finish(false)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m0 3.75h.007M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
              <h2 className="mt-4 text-base font-bold text-ink-900">
                {state.options.title ?? 'Konfirmasi'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {state.options.message ?? 'Apakah Anda yakin?'}
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => finish(false)}
                className="btn-secondary flex-1 !py-2.5 text-xs"
              >
                {state.options.cancelText ?? 'Batal'}
              </button>
              <button
                type="button"
                onClick={() => finish(true)}
                className={`btn-primary flex-1 !py-2.5 text-xs ${
                  variant === 'danger' ? '!bg-red-500 hover:!bg-red-600' : ''
                }`}
              >
                {state.options.confirmText ?? 'Ya, Lanjutkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
