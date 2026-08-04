import { useCallback, useState } from 'react';

type PendingConfirm<T> = {
  payload: T;
  title: string;
  description?: string;
};

export function useConfirmDialog<T = string>() {
  const [pending, setPending] = useState<PendingConfirm<T> | null>(null);

  const ask = useCallback((payload: T, title: string, description?: string) => {
    setPending({ payload, title, description });
  }, []);

  const close = useCallback(() => setPending(null), []);

  return {
    open: Boolean(pending),
    pending,
    ask,
    close,
    onOpenChange: (open: boolean) => {
      if (!open) close();
    },
  };
}
