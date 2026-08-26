import React from 'react';
import { Card, EmptyState } from '@painel/ui';

export function DocumentosTab({
  documentos,
}: {
  documentos?: Array<{
    id: string;
    nome: string;
    tipoDocumento?: { label?: string; codigo?: string };
    urlExterna?: string | null;
    createdAt?: string;
  }>;
}) {
  return (
    <Card variant="bordered" className="space-y-3 p-[var(--space-lg)]">
      {Array.isArray(documentos) && documentos.length ? (
        documentos.map((d) => (
          <div
            key={d.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-[var(--font-size-sm)]"
          >
            <div>
              <p className="font-semibold">{d.nome}</p>
              <p className="text-[var(--text-muted)]">
                {d.tipoDocumento?.label || d.tipoDocumento?.codigo || 'Documento'}
                {d.createdAt ? ` · ${String(d.createdAt).slice(0, 10)}` : ''}
              </p>
            </div>
            {d.urlExterna ? (
              <a
                className="font-semibold text-[var(--primary)] underline"
                href={d.urlExterna}
                target="_blank"
                rel="noreferrer"
              >
                Abrir
              </a>
            ) : null}
          </div>
        ))
      ) : (
        <EmptyState title="Nenhum documento" description="Anexos e links externos aparecem aqui." />
      )}
    </Card>
  );
}
