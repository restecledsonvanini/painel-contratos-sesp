import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorageState } from './hooks/useLocalStorageState';

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (next: boolean) => void;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useLocalStorageState('sidebar-collapsed', false);

  const value = {
    collapsed,
    setCollapsed,
    toggleCollapsed: () => setCollapsed((prev) => !prev),
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}
