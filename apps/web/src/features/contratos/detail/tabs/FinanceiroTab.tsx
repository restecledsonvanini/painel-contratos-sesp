import React from 'react';
import { Card, DescriptionList } from '@painel/ui';
import { formatCurrencyFromReais } from '../../../../lib/format';
import { money, num } from '../money';

export function FinanceiroTab({
  financeiro,
  dotacoes,
  empenhos,
}: {
  financeiro?: Record<string, unknown>;
  dotacoes?: Array<{
    id: string;
    exercicio: number;
    valorPrevisto?: number;
    dotacao?: { codigo?: string; fonteRecurso?: { label?: string } };
  }>;
  empenhos?: Array<{
    id: string;
    numero: string;
    exercicio: number;
    situacao: string;
    valor?: number;
  }>;
}) {
  return (
    <div className="space-y-[var(--space-md)]">
      <Card variant="bordered" className="p-[var(--space-lg)]">
        <DescriptionList
          columns={2}
          items={[
            { term: 'Valor original', detail: money(financeiro?.valorGlobalOriginalCents) },
            { term: 'Valor atualizado', detail: money(financeiro?.valorGlobalAtualizadoCents) },
            { term: 'Itens', detail: money(financeiro?.valorItensCents) },
            { term: '% aditado', detail: `${num(financeiro?.percentualAcrescido).toFixed(2)}%` },
            { term: 'Empenhado', detail: money(financeiro?.valorEmpenhadoCents) },
            { term: 'Pago', detail: money(financeiro?.valorPagoCents) },
            { term: 'Saldo', detail: money(financeiro?.saldoAExecutarCents) },
          ]}
        />
      </Card>
      <div className="grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-2">
        <Card variant="bordered" className="space-y-2 p-[var(--space-lg)]">
          <h3 className="font-semibold text-[var(--primary)]">Dotações</h3>
          {Array.isArray(dotacoes) && dotacoes.length ? (
            dotacoes.map((d) => (
              <p key={d.id} className="text-[var(--font-size-sm)]">
                {d.exercicio} · {d.dotacao?.codigo}
                {' · '}
                {formatCurrencyFromReais(d.valorPrevisto ?? 0)}
                {d.dotacao?.fonteRecurso?.label ? ` · ${d.dotacao.fonteRecurso.label}` : ''}
              </p>
            ))
          ) : (
            <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Nenhuma dotação.</p>
          )}
        </Card>
        <Card variant="bordered" className="space-y-2 p-[var(--space-lg)]">
          <h3 className="font-semibold text-[var(--primary)]">Empenhos</h3>
          {Array.isArray(empenhos) && empenhos.length ? (
            empenhos.map((e) => (
              <p key={e.id} className="text-[var(--font-size-sm)]">
                {e.numero}/{e.exercicio} · {e.situacao}
                {' · '}
                {formatCurrencyFromReais(e.valor ?? 0)}
              </p>
            ))
          ) : (
            <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Nenhum empenho.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
