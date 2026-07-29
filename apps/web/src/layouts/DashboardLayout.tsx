import React from 'react';
import { Header, Sidebar } from '@painel/ui';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
