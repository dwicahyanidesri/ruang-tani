'use client';

import { useTransition } from 'react';
import { useConfirm } from '@/components/ConfirmProvider';
import { approveUserAction, rejectUserAction } from './actions';

export default function VerifyRowActions({
  id,
  name,
  layout = 'inline',
}: {
  id: number;
  name: string;
  layout?: 'inline' | 'stacked';
}) {
  const confirm = useConfirm();
  const [pending, startTransition] = useTransition();

  const run = async (action: () => Promise<void>, ok: boolean) => {
    if (!ok) return;
    startTransition(async () => {
      try {
        await action();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Gagal memproses permintaan.');
      }
    });
  };

  const handleApprove = async () => {
    const ok = await confirm({
      title: 'Setujui akun ini?',
      message: 'Akun ini akan langsung bisa login ke dashboard setelah disetujui.',
      confirmText: 'Ya, Setujui',
    });
    run(() => approveUserAction(id), ok);
  };

  const handleReject = async () => {
    const ok = await confirm({
      title: 'Tolak pendaftaran ini?',
      message: 'Data pendaftaran akan dihapus permanen dan orang ini harus daftar ulang kalau mau bergabung lagi.',
      confirmText: 'Ya, Tolak',
      variant: 'danger',
    });
    run(() => rejectUserAction(id), ok);
  };

  if (layout === 'stacked') {
    return (
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleApprove}
          disabled={pending}
          className="btn-primary w-full !py-2 text-xs disabled:opacity-60"
        >
          Setujui
        </button>
        <button
          onClick={handleReject}
          disabled={pending}
          className="btn-secondary w-full !py-2 text-xs !text-red-500 disabled:opacity-60"
        >
          Tolak
        </button>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button onClick={handleApprove} disabled={pending} className="text-xs font-semibold text-brand-600">
        Setujui
      </button>
      <button onClick={handleReject} disabled={pending} className="text-xs font-semibold text-red-500">
        Tolak
      </button>
    </span>
  );
}
