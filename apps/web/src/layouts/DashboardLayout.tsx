import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Sidebar, useSidebar } from '@painel/ui';
import { useAuth } from '../providers/AuthProvider';

function AuthTrailing() {
  const { user, token, logout } = useAuth();
  if (!token || !user) {
    return (
      <Link to="/login" className="text-sm font-semibold text-[var(--primary)] px-2">
        Entrar
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-2 px-2 text-sm">
      <span className="hidden sm:inline text-[var(--text-muted)]">
        {user.nome || user.email} · {user.role}
      </span>
      <button type="button" className="font-semibold text-[var(--primary)]" onClick={logout}>
        Sair
      </button>
    </div>
  );
}

function ShellFrame({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className={`app-shell Página-Shell${collapsed ? ' is-rail-collapsed' : ''}`}>
      <Sidebar />
      <div className="app-content">
        <Header trailing={<AuthTrailing />} />
        <main className="app-main Seção-Main">{children}</main>
      </div>
    </div>
  );
}

/** Shell: [ sidebar ] | [ header + main ] */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ShellFrame>{children}</ShellFrame>;
}
