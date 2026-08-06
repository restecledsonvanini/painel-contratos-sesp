import React, { lazy, Suspense } from 'react';
import { Skeleton, Tabs } from '@painel/ui';
import { useTabParam } from '../lib/useTabParam';
import { useIsAdmin } from '../lib/access';

const UnidadesList = lazy(() => import('./UnidadesList'));
const DominiosPage = lazy(() => import('../features/dominios/pages/DominiosPage'));
const UsuariosPage = lazy(() => import('./UsuariosPage'));
const SegurancaPage = lazy(() => import('./SegurancaPage'));

const ALL_TABS = ['organizacao', 'listas', 'usuarios', 'seguranca'] as const;

export default function ConfiguracoesPage() {
  const isAdmin = useIsAdmin();
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
              <Suspense fallback={<Skeleton variant="table" lines={6} />}>
                <UsuariosPage />
              </Suspense>
            ),
          },
          {
            id: 'seguranca',
            label: 'Segurança',
            content: (
              <Suspense fallback={<Skeleton variant="table" lines={4} />}>
                <SegurancaPage />
              </Suspense>
            ),
          },
        ]
      : []),
  ];

  return <Tabs value={tab} onValueChange={setTab} items={items} />;
}
