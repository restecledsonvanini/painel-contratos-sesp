import React, { lazy, Suspense } from 'react';
import { Card, Page, Skeleton, Tabs } from '@painel/ui';
import { useTabParam } from '../lib/useTabParam';
import { useAuth } from '../providers/AuthProvider';

const UnidadesList = lazy(() => import('./UnidadesList'));
const DominiosPage = lazy(() => import('../features/dominios/pages/DominiosPage'));

const ALL_TABS = ['organizacao', 'listas', 'usuarios', 'seguranca'] as const;

function EmBreve({ title, description }: { title: string; description: string }) {
  return (
    <Page title={title} description={description}>
      <Card variant="bordered" className="p-4 text-sm text-[var(--text-muted)]">
        Disponível na Fase 6 (auth: papéis, domínio de e-mail e gestão de usuários).
      </Card>
    </Page>
  );
}

export default function ConfiguracoesPage() {
  const { hasMinRole, token } = useAuth();
  const isAdmin = !token || hasMinRole('ADMIN');
  const [tabRaw, setTab] = useTabParam(ALL_TABS, 'organizacao');
  const tab =
    !isAdmin && (tabRaw === 'usuarios' || tabRaw === 'seguranca') ? 'organizacao' : tabRaw;

  const items = [
    {
      id: 'organizacao',
      label: 'Estrutura',
      content: (
        <Suspense fallback={<Skeleton variant="table" lines={8} />}>
          <UnidadesList />
        </Suspense>
      ),
    },
    {
      id: 'listas',
      label: 'Listas suspensas',
      content: (
        <Suspense fallback={<Skeleton variant="table" lines={6} />}>
          <DominiosPage />
        </Suspense>
      ),
    },
    ...(isAdmin
      ? [
          {
            id: 'usuarios',
            label: 'Usuários',
            content: (
              <EmBreve title="Usuários" description="Cadastro e papéis de acesso (ADMIN)." />
            ),
          },
          {
            id: 'seguranca',
            label: 'Segurança',
            content: (
              <EmBreve
                title="Segurança"
                description="Domínios de e-mail permitidos no login."
              />
            ),
          },
        ]
      : []),
  ];

  return <Tabs value={tab} onValueChange={setTab} items={items} />;
}
