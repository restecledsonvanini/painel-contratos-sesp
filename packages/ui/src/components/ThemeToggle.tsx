import { Moon, Sun } from 'lucide-react';
import React from 'react';
import { useTheme } from '../ThemeProvider';

export function ThemeToggle() {
  const { mode, toggle } = useTheme();
  const isDark = mode === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
    >
      {isDark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
    </button>
  );
}
