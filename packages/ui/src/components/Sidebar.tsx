import clsx from 'clsx';
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  FileText,
  LayoutDashboard,
  ListTree,
  Shield,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../SidebarContext';

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Contratos', to: '/contracts', icon: FileText },
  { label: 'Novo contrato', to: '/contracts/new', icon: FilePlus2 },
  { label: 'Fornecedores', to: '/fornecedores', icon: Briefcase },
  { label: 'Servidores', to: '/servidores', icon: Users },
  { label: 'Unidades FSP', to: '/unidades-fsp', icon: Shield },
  { label: 'Serviços', to: '/servicos', icon: Wrench },
  { label: 'Listas suspensas', to: '/dominios', icon: ListTree },
];

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {mobileOpen && (
        <button type="button" className="app-sidebar-backdrop" aria-label="Fechar menu" onClick={closeMobile} />
      )}

      <aside
        className={clsx(
          'app-sidebar Seção-Sidebar',
          collapsed && 'is-collapsed',
          mobileOpen && 'is-mobile-open',
        )}
        aria-label="Navegação principal"
      >
        <div className="app-sidebar__brand">
          <div className="app-sidebar__logo">
            <img src="/logo-sesp-dest.png" alt="Diretoria de Gestão Estrutural — SESP" />
          </div>
          <div className="app-sidebar__brand-text">
            <small>DEST · SESP</small>
            <strong>Contratos</strong>
          </div>
        </div>

        <nav className="app-sidebar__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                title={item.label}
                onClick={closeMobile}
                className={({ isActive }) => clsx('app-sidebar__link', isActive && 'is-active')}
              >
                <Icon size={18} strokeWidth={2} aria-hidden />
                <span className="app-sidebar__label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="app-sidebar__footer">Hub de Inteligência Contratual · Lei 14.133/2021</div>
      </aside>

      {/* Irmão do aside (filho do shell) — acompanha a borda no collapse */}
      <button
        type="button"
        className="app-sidebar__edge-toggle"
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        title={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? <ChevronRight size={16} strokeWidth={2.5} /> : <ChevronLeft size={16} strokeWidth={2.5} />}
      </button>
    </>
  );
}
