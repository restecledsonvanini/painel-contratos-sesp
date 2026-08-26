import React, { lazy, Suspense } from 'react';
import { Skeleton, Tabs } from '@painel/ui';
import { useTabParam } from '../../../lib/useTabParam';

const ImportacaoWizard = lazy(() => import('./ImportacaoWizard'));
const ExportacaoPage = lazy(() => import('./ExportacaoPage'));

const TABS = ['importacao', 'exportacao'] as const;

export default function UtilitariosPage() {
  const [tab, setTab] = useTabParam(TABS, 'importacao');

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      items={[
        {
          id: 'importacao',
          label: 'Importação',
          content: (
            <Suspense fallback={<Skeleton variant="card" lines={6} />}>
              <ImportacaoWizard />
            </Suspense>
          ),
        },
        {
          id: 'exportacao',
          label: 'Exportação',
          content: (
            <Suspense fallback={<Skeleton variant="card" lines={6} />}>
              <ExportacaoPage />
            </Suspense>
          ),
        },
      ]}
    />
  );
}
