import clsx from 'clsx';
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Settings,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSidebar } from '../SidebarContext';

type NavChild = {
  label: string;
  to: string;
  /** Papel mínimo para exibir o sub-item (ex.: usuarios = ADMIN). */
  minRole?: string;
};

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  minRole?: string;
  children?: NavChild[];
};

const navItems: NavItem[] = [
  {
    label: 'Painel',
    to: '/painel?tab=tatico',
    icon: LayoutDashboard,
    children: [
      { label: 'Tático', to: '/painel?tab=tatico' },
      { label: 'Estratégico', to: '/painel?tab=estrategico' },
      { label: 'Alertas', to: '/painel?tab=alertas' },
    ],
  },
  { label: 'Contratos', to: '/contracts', icon: FileText },
  {
    label: 'Cadastros',
    to: '/cadastros?tab=fornecedores',
    icon: Briefcase,
    children: [
      { label: 'Fornecedores', to: '/cadastros?tab=fornecedores' },
      { label: 'Servidores', to: '/cadastros?tab=servidores' },
      { label: 'Catálogo', to: '/cadastros?tab=catalogo' },
      { label: 'Dotações', to: '/cadastros?tab=dotacoes' },
    ],
  },
  {
    label: 'Utilitários',
    to: '/utilitarios?tab=importacao',
    icon: Wrench,
    minRole: 'COLABORADOR',
    children: [
      { label: 'Importação', to: '/utilitarios?tab=importacao' },
      { label: 'Exportação', to: '/utilitarios?tab=exportacao' },
    ],
  },
  {
    label: 'Configurações',
    to: '/configuracoes?tab=organizacao',
    icon: Settings,
    minRole: 'GESTOR',
    children: [
      { label: 'Estrutura', to: '/configuracoes?tab=organizacao' },
      { label: 'Listas suspensas', to: '/configuracoes?tab=listas' },
      { label: 'Usuários', to: '/configuracoes?tab=usuarios', minRole: 'ADMIN' },
      { label: 'Segurança', to: '/configuracoes?tab=seguranca', minRole: 'ADMIN' },
    ],
  },
];

function pathOf(to: string): string {
  return to.split('?')[0] ?? to;
}

function tabOf(to: string): string | null {
  const q = to.includes('?') ? to.slice(to.indexOf('?') + 1) : '';
  return new URLSearchParams(q).get('tab');
}

function linkIsActive(to: string, pathname: string, search: string): boolean {
  if (pathname !== pathOf(to)) return false;
  const wantTab = tabOf(to);
  if (!wantTab) return true;
  return new URLSearchParams(search).get('tab') === wantTab;
}

export type SidebarProps = {
  /** Gate de papel — app passa `hasMinRole`. Sem prop = tudo visível. */
  canSee?: (minRole?: string) => boolean;
};

export function Sidebar({ canSee }: SidebarProps) {
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile } = useSidebar();
  const location = useLocation();
  const visible = (min?: string) => (canSee ? canSee(min) : true);

  const items = navItems.filter((item) => visible(item.minRole));

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

        <nav id="navegacao-principal" className="app-sidebar__nav" aria-label="Navegação principal">
          {items.map((item) => {
            const Icon = item.icon;
            const sectionPath = pathOf(item.to);
            const sectionActive =
              location.pathname === sectionPath || location.pathname.startsWith(`${sectionPath}/`);
            const children = (item.children ?? []).filter((c) => visible(c.minRole));
            const showChildren = Boolean(sectionActive && children.length && !collapsed);

            return (
              <div key={sectionPath} className="app-sidebar__group">
                <NavLink
                  to={item.to}
                  end
                  title={item.label}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    clsx('app-sidebar__link', (isActive || sectionActive) && 'is-active')
                  }
                >
                  <Icon size={18} strokeWidth={2} aria-hidden />
                  <span className="app-sidebar__label">{item.label}</span>
                </NavLink>
                {showChildren && (
                  <div className="app-sidebar__children" role="group" aria-label={item.label}>
                    {children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        title={child.label}
                        onClick={closeMobile}
                        className={() =>
                          clsx(
                            'app-sidebar__link app-sidebar__link--child',
                            linkIsActive(child.to, location.pathname, location.search) && 'is-active',
                          )
                        }
                      >
                        <span className="app-sidebar__label">{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="app-sidebar__footer">Hub de Inteligência Contratual · Lei 14.133/2021</div>
      </aside>

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
