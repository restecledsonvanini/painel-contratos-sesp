import React, { lazy, Suspense } from 'react';
import { Tabs, Skeleton } from '@painel/ui';
import { useTabParam } from '../lib/useTabParam';

const Dashboard = lazy(() => import('./Dashboard'));
const DashboardEstrategico = lazy(() => import('./DashboardEstrategico'));
const AlertasList = lazy(() => import('./AlertasList'));

const TABS = ['tatico', 'estrategico', 'alertas'] as const;

export default function PainelPage() {
  const [tab, setTab] = useTabParam(TABS, 'tatico');

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      items={[
        {
          id: 'tatico',
          label: 'Tático',
          content: (
            <Suspense fallback={<Skeleton variant="card" lines={6} />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          id: 'estrategico',
          label: 'Estratégico',
          content: (
            <Suspense fallback={<Skeleton variant="card" lines={6} />}>
              <DashboardEstrategico />
            </Suspense>
          ),
        },
        {
          id: 'alertas',
          label: 'Alertas',
          content: (
            <Suspense fallback={<Skeleton variant="card" lines={6} />}>
              <AlertasList />
            </Suspense>
          ),
        },
      ]}
    />
  );
}
