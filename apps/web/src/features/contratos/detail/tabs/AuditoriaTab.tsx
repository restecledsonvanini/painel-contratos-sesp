import React from 'react';
import { Card, EmptyState } from '@painel/ui';

export function AuditoriaTab({
  auditoria,
}: {
  auditoria?: Array<{
    id: string;
    action: string;
    changedBy?: string | null;
    changedAt: string;
    source?: string | null;
  }>;
}) {
  return (
    <Card variant="bordered" className="space-y-3 p-[var(--space-lg)]">
      {Array.isArray(auditoria) && auditoria.length ? (
        auditoria.map((row) => (
          <div
            key={row.id}
            className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-[var(--font-size-sm)]"
          >
            <p className="font-semibold">
              {row.action}
              {row.changedBy ? ` · ${row.changedBy}` : ''}
            </p>
            <p className="text-[var(--text-muted)]">
              {String(row.changedAt).replace('T', ' ').slice(0, 19)}
              {row.source ? ` · ${row.source}` : ''}
            </p>
          </div>
        ))
      ) : (
        <EmptyState
          title="Sem eventos de auditoria"
          description="Alterações no contrato gravadas por trigger aparecem nesta aba."
        />
      )}
    </Card>
  );
}
