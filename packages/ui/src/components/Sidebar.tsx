import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';
import { useSidebar } from '../SidebarContext';
import clsx from 'clsx';

const IconBase = ({ children, size = 16, className = '' }: { children: React.ReactNode; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {children}
  </svg>
);

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-3v-6H7.5v6h-3A1.5 1.5 0 0 1 3 19.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M7 3h7l4 4v14H7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </IconBase>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </IconBase>
  );
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5V9H3V7.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 9v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9V7.5a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M17 21v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}
  const navItems = [
    { label: 'Dashboard', to: '/', icon: HomeIcon },
    { label: 'Contratos', to: '/contracts', icon: FileTextIcon },
    { label: 'Novo contrato', to: '/contracts/new', icon: PlusIcon },
    { label: 'Empresas', to: '/empresas', icon: BriefcaseIcon },
    { label: 'Fornecedores', to: '/fornecedores', icon: UsersIcon },
    { label: 'Entidades', to: '/entidades-gestoras', icon: UsersIcon },
    { label: 'Serviços', to: '/servicos', icon: FileTextIcon },
  ];

export function Sidebar() {
  const { mode } = useTheme();
  const { collapsed, toggleCollapsed } = useSidebar();

  const containerBg = mode === 'light' ? 'bg-[#4C5B8B] text-white shadow-xl' : 'bg-[#37455f] text-white shadow-xl';

  const ChevronLeftIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const ChevronRightIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <aside
      className={clsx(
        'flex min-h-[calc(100vh-0px)] flex-col justify-between border-r border-white/10 p-4 transition-all duration-200 ease-out overflow-hidden flex-shrink-0',
        containerBg,
        // fixed width on desktop, compact width when collapsed; avoid full-width on desktop
        collapsed ? 'w-20' : 'w-[280px]',
        'max-h-screen',
      )}
    >
      <div>
        <div className={clsx('mb-6 flex items-center gap-3 rounded-3xl bg-white/10 p-3 backdrop-blur', collapsed ? 'justify-center' : 'shadow-sm')}>
          <div className={clsx('flex items-center justify-center rounded-2xl overflow-hidden bg-white/90', collapsed ? 'h-11 w-11' : 'h-12 w-12')}>
            <img src="/logo-sesp.png" alt="SESP" className="h-full w-full object-cover" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/70">SESP</p>
              <p className="text-sm font-semibold text-white">Inteligência Contratual</p>
            </div>
          )}

          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={clsx(
              'ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20',
              collapsed && 'ml-0',
            )}
          >
            {collapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => {
                  const base = collapsed
                    ? 'flex items-center justify-center w-full rounded-full px-0 py-3'
                    : 'flex items-center gap-3 w-full rounded-2xl px-3 py-2';
                  const active = isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/85 hover:bg-white/10 hover:text-white';
                  return clsx(base, active, 'transition-colors');
                }}
              >
                <span className={clsx('flex-shrink-0 flex items-center justify-center', collapsed ? 'h-6 w-6' : 'h-5 w-5')}>
                  <Icon size={collapsed ? 18 : 16} className="text-current" />
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className={clsx('rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white/85', collapsed ? 'hidden' : 'shadow-sm')}>
        <p className="font-semibold text-white">Suporte SESP</p>
        <p className="mt-2 leading-5">Acompanhe prazos, aditivos e status contratuais em um só lugar.</p>
      </div>
    </aside>
  );
}
