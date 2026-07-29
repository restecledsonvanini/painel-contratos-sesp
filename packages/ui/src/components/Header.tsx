import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Menu } from 'lucide-react';
import { useSidebar } from '../SidebarContext';

export function Header() {
  const { toggleCollapsed } = useSidebar();

  return (
    <header className="flex flex-col gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleCollapsed}
          aria-label="Toggle sidebar"
          className="-ml-1 rounded p-2 text-[var(--text)] hover:bg-[var(--primary-light)] sm:hidden"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Painel</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--text)]">Hub de Inteligência Contratual</h1>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="hidden items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 sm:flex">
          <span className="text-sm text-slate-500">Buscar contratos</span>
          <input
            type="search"
            placeholder="Pesquisar..."
            className="w-52 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
