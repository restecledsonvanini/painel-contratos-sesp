import React from 'react';
import { Card, EmptyState } from '@painel/ui';

export function PublicidadeTab({
  financeiro,
  publicacoes,
}: {
  financeiro?: Record<string, unknown>;
  publicacoes?: Array<{
    id: string;
    veiculo?: { codigo?: string; label?: string };
    dataPublicacao: string;
    idPncp?: string | null;
    url?: string | null;
  }>;
}) {
  return (
    <Card variant="bordered" className="space-y-3 p-[var(--space-lg)]">
      {Boolean(financeiro?.pendenciaPncp) && (
        <p className="rounded-[var(--radius-md)] border border-[var(--warning)] bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] px-3 py-2 text-[var(--font-size-sm)]">
          Pendência de publicação no PNCP.
        </p>
      )}
      {Array.isArray(publicacoes) && publicacoes.length ? (
        publicacoes.map((p) => (
          <div
            key={p.id}
            className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-[var(--font-size-sm)]"
          >
            <p className="font-semibold">
              {p.veiculo?.label || p.veiculo?.codigo || '—'} · {String(p.dataPublicacao).slice(0, 10)}
            </p>
            <p className="text-[var(--text-muted)]">
              {p.idPncp ? `PNCP ${p.idPncp}` : 'Sem id PNCP'}
              {p.url ? (
                <>
                  {' · '}
                  <a className="text-[var(--primary)] underline" href={p.url} target="_blank" rel="noreferrer">
                    Abrir
                  </a>
                </>
              ) : null}
            </p>
          </div>
        ))
      ) : (
        <EmptyState title="Nenhuma publicação" description="Registre PNCP/DOE na API de publicações." />
      )}
    </Card>
  );
}
