import React from 'react';
import { useTheme } from '../ThemeProvider';

export function ThemeToggle() {
  const { mode, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:bg-[var(--primary-light)] hover:text-[var(--text)]"
    >
      {mode === 'light' ? 'Modo escuro' : 'Modo claro'}
    </button>
  );
}
