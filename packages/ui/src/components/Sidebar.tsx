import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';
import { useSidebar } from '../SidebarContext';
import { Home, FileText, Plus } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Dashboard', to: '/', icon: Home },
  { label: 'Contratos', to: '/contracts', icon: FileText },
  { label: 'Novo contrato', to: '/contracts/new', icon: Plus },
];

export function Sidebar() {
  const { mode } = useTheme();
  const { collapsed, toggleCollapsed } = useSidebar();

  const containerBg = mode === 'light' ? 'bg-white shadow-md' : 'bg-[var(--surface)]';

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
        'flex h-full min-h-screen flex-col justify-between border-r border-[var(--border)] p-4 transition-[width] duration-200 ease-out overflow-hidden',
        containerBg,
        collapsed ? 'w-20' : 'w-72',
      )}
    >
      <div>
        <div className={clsx('mb-6 flex items-center gap-3 rounded-3xl p-3', collapsed ? 'justify-center bg-[var(--surface)]' : 'bg-[var(--surface)] shadow-sm')}>
          <div className={clsx('flex items-center justify-center rounded-2xl overflow-hidden bg-[var(--background)]', collapsed ? 'h-11 w-11' : 'h-12 w-12')}>
            <img src="/logo-sesp.png" alt="SESP" className="h-full w-full object-cover" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">SESP</p>
              <p className="text-base font-semibold text-[var(--text)]">Inteligência Contratual</p>
            </div>
          )}

          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={clsx(
              'ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--text)] transition hover:bg-[var(--surface)]',
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
                    ? 'bg-[var(--primary)] text-[var(--text-inverse)]'
                    : 'text-[var(--text)] hover:bg-[var(--surface)] hover:text-[var(--primary)]';
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

      <div className={clsx('rounded-2xl p-4 text-sm text-slate-600', collapsed ? 'hidden' : 'bg-[var(--surface)] shadow-sm')}>
        <p className="font-semibold text-[var(--text)]">Suporte SESP</p>
        <p className="mt-2 leading-5">Acompanhe prazos, aditivos e status contratuais em um só lugar.</p>
      </div>
    </aside>
  );
}
