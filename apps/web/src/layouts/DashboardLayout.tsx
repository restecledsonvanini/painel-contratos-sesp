import React from 'react';
import { Header, Sidebar, useSidebar } from '@painel/ui';

function ShellFrame({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className={`app-shell Página-Shell${collapsed ? ' is-rail-collapsed' : ''}`}>
      <Sidebar />
      <div className="app-content">
        <Header />
        <main className="app-main Seção-Main">{children}</main>
      </div>
    </div>
  );
}

/** Shell: [ sidebar ] | [ header + main ] */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ShellFrame>{children}</ShellFrame>;
}
