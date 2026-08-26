import React from 'react';
import { Card, EmptyState, Meter } from '@painel/ui';
import type { Contract } from '../../../../hooks/useContracts';
import { money } from '../money';

export function RateioTab({ contract, rateioPct }: { contract: Contract; rateioPct: number }) {
  return (
    <Card variant="bordered" className="space-y-4 p-[var(--space-lg)]">
      <Meter
        label="Soma dos percentuais"
        value={rateioPct}
        max={100}
        thresholds={{ amber: 80, red: 100 }}
      />
      {contract.rateios?.length ? (
        <div className="space-y-2">
          {contract.rateios.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-[var(--font-size-sm)]"
            >
              <span className="font-semibold">{r.unidadeSigla || r.unidadeNome || r.unidadeId}</span>
              <span className="text-[var(--text-muted)]">
                {r.percentual != null ? `${Number(r.percentual).toFixed(1)}%` : '—'}
                {r.valorCents != null ? ` · ${money(r.valorCents)}` : ''}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Sem rateio" description="Inclua unidades no wizard na criação do contrato." />
      )}
    </Card>
  );
}
