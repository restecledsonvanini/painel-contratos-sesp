import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import React from 'react';
import { useSidebar } from '../SidebarContext';
import { useTheme } from '../ThemeProvider';

export function Header({ trailing }: { trailing?: React.ReactNode }) {
  const { mobileOpen, toggleMobile } = useSidebar();
  const { mode, toggle } = useTheme();
  const isDark = mode === 'dark';

  return (
    <header className="app-header Seção-Header">
      <button
        type="button"
        className="app-header__menu-btn"
        onClick={toggleMobile}
        aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div className="app-header__titles">
        <small>Painel · SESP/PR</small>
        <strong>Hub de Inteligência Contratual</strong>
      </div>

      <label className="app-header__search">
        <Search size={16} aria-hidden />
        <input type="search" placeholder="Buscar contratos..." aria-label="Buscar contratos" />
      </label>

      {trailing}

      <button
        type="button"
        className="app-header__theme"
        onClick={toggle}
        aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        title={isDark ? 'Modo claro' : 'Modo escuro'}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  );
}
