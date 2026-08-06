import React, { lazy, Suspense } from 'react';
import { Tabs, Skeleton } from '@painel/ui';
import { useTabParam } from '../lib/useTabParam';

const FornecedoresList = lazy(() => import('./FornecedoresList'));
const ServidoresList = lazy(() => import('./ServidoresList'));
const CatalogoList = lazy(() => import('./CatalogoList'));
const DotacoesList = lazy(() => import('./DotacoesList'));

const TABS = ['fornecedores', 'servidores', 'catalogo', 'dotacoes'] as const;

export default function CadastrosPage() {
  const [tab, setTab] = useTabParam(TABS, 'fornecedores');

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      items={[
        {
          id: 'fornecedores',
          label: 'Fornecedores',
          content: (
            <Suspense fallback={<Skeleton variant="table" lines={6} />}>
              <FornecedoresList />
            </Suspense>
          ),
        },
        {
          id: 'servidores',
          label: 'Servidores',
          content: (
            <Suspense fallback={<Skeleton variant="table" lines={6} />}>
              <ServidoresList />
            </Suspense>
          ),
        },
        {
          id: 'catalogo',
          label: 'Catálogo',
          content: (
            <Suspense fallback={<Skeleton variant="table" lines={6} />}>
              <CatalogoList />
            </Suspense>
          ),
        },
        {
          id: 'dotacoes',
          label: 'Dotações',
          content: (
            <Suspense fallback={<Skeleton variant="table" lines={6} />}>
              <DotacoesList />
            </Suspense>
          ),
        },
      ]}
    />
  );
}
