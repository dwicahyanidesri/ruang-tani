'use client';

import { useTransition } from 'react';
import { useConfirm } from '@/components/ConfirmProvider';

export default function DeleteButton({
  action,
  confirmTitle,
  confirmMessage,
  label = 'Hapus',
  className = 'text-xs font-semibold text-red-500',
}: {
  action: () => Promise<void>;
  confirmTitle: string;
  confirmMessage: string;
  label?: string;
  className?: string;
}) {
  const confirm = useConfirm();
  const [pending, startTransition] = useTransition();

  const handleClick = async () => {
    const ok = await confirm({
      title: confirmTitle,
      message: confirmMessage,
      confirmText: `Ya, ${label}`,
      variant: 'danger',
    });
    if (ok) {
      startTransition(async () => {
        try {
          await action();
        } catch (err) {
          alert(err instanceof Error ? err.message : 'Gagal menghapus data ini.');
        }
      });
    }
  };

  return (
    <button type="button" onClick={handleClick} disabled={pending} className={className}>
      {pending ? 'Memproses...' : label}
    </button>
  );
}
