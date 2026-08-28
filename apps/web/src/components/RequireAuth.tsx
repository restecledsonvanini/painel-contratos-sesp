import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, Page, Skeleton } from '@painel/ui';
import { useAuth } from '../providers/AuthProvider';
import { isAuthRequired } from './RequireRole';

/**
 * Shell autenticado. Com `VITE_AUTH_REQUIRED` desligado, deixa passar (bypass de
 * dev). Com a flag, exige token — senão manda para `/login`.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Page title="Autenticando">
        <Skeleton variant="card" lines={2} />
      </Page>
    );
  }

  if (!isAuthRequired()) {
    return <>{children}</>;
  }

  if (!user) {
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
