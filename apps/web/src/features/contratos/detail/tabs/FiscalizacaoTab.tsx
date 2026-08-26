import React from 'react';
import { Card, EmptyState } from '@painel/ui';
import type { Contract } from '../../../../hooks/useContracts';

export function FiscalizacaoTab({ contract }: { contract: Contract }) {
  return (
    <Card variant="bordered" className="p-[var(--space-lg)]">
      {contract.responsaveis?.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[var(--font-size-sm)]">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
                <th className="py-2 pr-3">Servidor</th>
                <th className="py-2 pr-3">Papel</th>
                <th className="py-2 pr-3">Portaria / ato</th>
                <th className="py-2">Período</th>
              </tr>
            </thead>
            <tbody>
              {contract.responsaveis.map((r) => (
                <tr key={r.id} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-3 font-semibold">{r.servidorNome || r.servidorId}</td>
                  <td className="py-2 pr-3">{r.papel}</td>
                  <td className="py-2 pr-3">{r.atoDesignacao || '—'}</td>
                  <td className="py-2">
                    {r.dataInicio ? String(r.dataInicio).slice(0, 10) : '—'}
                    {' → '}
                    {r.dataFim ? String(r.dataFim).slice(0, 10) : 'atual'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="Sem responsáveis"
          description={`Gestor: ${contract.gestorName || '—'} · Fiscal: ${contract.fiscalName || '—'}`}
        />
      )}
    </Card>
  );
}
