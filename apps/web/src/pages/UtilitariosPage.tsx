import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Page, Skeleton, Tabs } from '@painel/ui';
import { useTabParam } from '../lib/useTabParam';

const ImportacaoWizard = lazy(() => import('./ImportacaoWizard'));

const TABS = ['importacao', 'exportacao'] as const;

function ExportacaoPlaceholder() {
  return (
    <Page
      title="Exportação"
      description="Exporte o acervo de contratos. Formatos XLSX e PDF entram na Fase 4."
    >
      <Card variant="bordered" className="space-y-3 p-4">
        <p className="text-sm text-[var(--text-muted)]">
          Por enquanto, a exportação CSV do acervo (com filtros da lista) está na tela de
          contratos.
        </p>
        <Link to="/contracts">
          <Button>Ir para contratos e exportar CSV</Button>
        </Link>
      </Card>
    </Page>
  );
}

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
          content: <ExportacaoPlaceholder />,
        },
      ]}
    />
  );
}
