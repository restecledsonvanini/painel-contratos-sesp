import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Card, Input, Page } from '@painel/ui';
import { useAuth } from '../providers/AuthProvider';
import { getErrorMessage } from '../lib/http';

export default function LoginPage() {
  const { login, token, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sesp.pr.gov.br');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!isLoading && token) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Falha no login'));
    } finally {
      setPending(false);
    }
  }

  return (
    <Page title="Entrar" description="Autenticação JWT do painel (demo local).">
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
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
        <p className="text-xs text-[var(--text-muted)]">
          Demo: admin@sesp.pr.gov.br / admin123 · gestor@… / gestor123 · leitor@… / leitor123
        </p>
      </Card>
    </Page>
  );
}
