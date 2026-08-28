import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Input, Page, Skeleton } from '@painel/ui';
import { useAuth } from '../../../providers/AuthProvider';
import { getErrorMessage } from '../../../lib/http';

function safeReturnTo(from: unknown): string {
  if (typeof from !== 'string') return '/';
  if (!from.startsWith('/') || from.startsWith('//') || from.startsWith('/login')) return '/';
  return from;
}

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = safeReturnTo((location.state as { from?: string } | null)?.from);
  const isDev = import.meta.env.DEV;
  const [email, setEmail] = useState(isDev ? 'admin@sesp.pr.gov.br' : '');
  const [password, setPassword] = useState(isDev ? 'admin123' : '');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Skeleton variant="card" lines={3} className="w-full max-w-md" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Falha no login'));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Page title="Entrar" description="Sessão do painel (cookie HttpOnly).">
        <Card variant="bordered" className="mx-auto max-w-md space-y-4 p-6">
          <form className="space-y-3" onSubmit={onSubmit}>
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            {error && (
              <p className="text-sm text-red-700" role="alert" aria-live="assertive">
                {error}
              </p>
            )}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
          {isDev ? (
            <p className="text-xs text-[var(--text-muted)]">
              Demo (só em desenvolvimento): admin@… / admin123 · gestor@… / gestor123 ·
              analista@… / analista123 · visitante@sesp.pr.gov.br / visitante123
            </p>
          ) : null}
        </Card>
      </Page>
    </div>
  );
}
