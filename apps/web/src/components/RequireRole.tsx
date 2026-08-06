import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Card, Page } from '@painel/ui';
import { useAuth } from '../providers/AuthProvider';

/** Espelha `AUTH_REQUIRED` da API via Vite. Sem flag = bypass (dev). */
export function isAuthRequired() {
  const v = import.meta.env.VITE_AUTH_REQUIRED;
  return v === '1' || v === 'true';
}

type RequireRoleProps = {
  min?: string;
  children: React.ReactNode;
};

/**
 * Guarda de rota. Com `VITE_AUTH_REQUIRED` desligado e sem token, permite
 * (mesmo bypass da API). Com auth obrigatória, exige login e papel mínimo.
 */
export function RequireRole({ min, children }: RequireRoleProps) {
  const { token, hasMinRole, isLoading } = useAuth();
  const location = useLocation();
  const required = isAuthRequired();

  if (isLoading && token) {
    return (
      <Page title="Autenticando">
        <Card variant="bordered" className="p-4 text-sm text-[var(--text-muted)]">
          Verificando sessão…
        </Card>
      </Page>
    );
  }

  if (!required && !token) {
    return <>{children}</>;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (min && !hasMinRole(min)) {
    return (
      <Page title="Acesso negado" description="Seu papel não permite esta área.">
        <Card variant="bordered" className="space-y-3 p-4 text-sm">
          <p>É necessário o papel mínimo <strong>{min}</strong>.</p>
          <Link className="text-[var(--primary)] underline" to="/painel">
            Voltar ao painel
          </Link>
        </Card>
      </Page>
    );
  }

  return <>{children}</>;
}
