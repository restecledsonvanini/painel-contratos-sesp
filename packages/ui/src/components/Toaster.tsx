import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            'rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow)]',
          title: 'text-[var(--font-size-sm)] font-semibold text-[var(--text)]',
          description: 'text-[var(--font-size-xs)] text-[var(--text-muted)]',
          success: 'border-[color-mix(in_srgb,var(--success)_40%,var(--border))]',
          error: 'border-[color-mix(in_srgb,var(--danger)_40%,var(--border))]',
          info: 'border-[color-mix(in_srgb,var(--primary)_40%,var(--border))]',
        },
      }}
    />
  );
}
