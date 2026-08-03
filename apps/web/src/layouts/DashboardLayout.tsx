import React from 'react';
import { Header, Sidebar } from '@painel/ui';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#f3f3f3] text-[var(--text)]">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 bg-[#f3f3f3] p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
