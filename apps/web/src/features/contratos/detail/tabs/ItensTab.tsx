import React from 'react';
import { Card, EmptyState } from '@painel/ui';
import { formatCurrencyFromReais } from '../../../../lib/format';
import type { Contract } from '../../../../hooks/useContracts';

export function ItensTab({ contract }: { contract: Contract }) {
  return (
    <Card variant="bordered" className="space-y-3 p-[var(--space-lg)]">
      {contract.itens?.length ? (
        contract.itens.map((item) => (
          <div
            key={item.id}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3"
          >
            <p className="font-semibold">
              {item.sequencia}. {item.catalogoNome || item.catalogoItemId}
              {item.categoria ? ` · ${item.categoria}` : ''}
            </p>
            <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
              {item.quantidade} {item.unidadeMedida || 'un'}
              {' · '}
              {formatCurrencyFromReais(item.valorUnitario ?? 0)}
              {' unit. · total '}
              {formatCurrencyFromReais(item.valorTotal ?? 0)}
              {item.periodicidade ? ` · ${item.periodicidade}` : ''}
            </p>
          </div>
        ))
      ) : (
        <EmptyState title="Nenhum item" description="Cadastre itens no wizard ou via API." />
      )}
    </Card>
  );
}
