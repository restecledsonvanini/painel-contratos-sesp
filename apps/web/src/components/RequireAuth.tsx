import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, Page } from '@painel/ui';
import { useAuth } from '../providers/AuthProvider';
import { isAuthRequired } from './RequireRole';

/**
 * Shell autenticado. Com `VITE_AUTH_REQUIRED` desligado, deixa passar (bypass de
 * dev). Com a flag, exige token — senão manda para `/login`.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading && token) {
    return (
      <Page title="Autenticando">
        <Card variant="bordered" className="p-4 text-sm text-[var(--text-muted)]">
          Verificando sessão…
        </Card>
      </Page>
    );
  }

  if (!isAuthRequired()) {
    return <>{children}</>;
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
}
