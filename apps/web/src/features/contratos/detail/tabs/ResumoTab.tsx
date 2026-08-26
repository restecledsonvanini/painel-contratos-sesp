import React from 'react';
import { Badge, Card, DescriptionList, StatusBadge } from '@painel/ui';
import type { Contract } from '../../../../hooks/useContracts';
import { money } from '../money';

export function ResumoTab({
  contract,
  financeiro,
  unidadeLabel,
}: {
  contract: Contract;
  financeiro?: Record<string, unknown>;
  unidadeLabel: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-2">
      <Card variant="bordered" className="p-[var(--space-lg)]">
        <div className="mb-4 flex flex-wrap gap-2">
          <StatusBadge status={contract.status || contract.situacao?.toLowerCase()} />
          {contract.pilar && <Badge variant="info">{contract.pilar}</Badge>}
          {contract.modalidade && <Badge>{contract.modalidade}</Badge>}
          {financeiro?.situacaoEfetiva != null && (
            <Badge variant="success">Efetiva: {String(financeiro.situacaoEfetiva)}</Badge>
          )}
        </div>
        <DescriptionList
          columns={2}
          items={[
            { term: 'GMS / Ano', detail: `${contract.numGms}/${contract.anoGms}` },
            { term: 'e-Protocolo', detail: contract.eProtocolo || contract.protocoloCabeca || '—' },
            { term: 'Fornecedor', detail: contract.fornecedorName || '—' },
            { term: 'Unidade gestora', detail: unidadeLabel },
            { term: 'Natureza', detail: contract.naturezaObjeto || '—' },
            {
              term: 'Vigência',
              detail: `${String(contract.dataInicioVigencia || contract.dataInicio || '—').slice(0, 10)} → ${String(contract.dataFimVigenciaOriginal || contract.dataFimOrig || '—').slice(0, 10)}`,
            },
            { term: 'Objeto', detail: contract.objeto || '—' },
          ]}
        />
      </Card>
      <div className="space-y-[var(--space-md)]">
        <Card variant="bordered" className="p-[var(--space-lg)]">
          <h3 className="mb-3 font-semibold text-[var(--primary)]">Vigência</h3>
          <DescriptionList
            items={[
              {
                term: 'Fim atual',
                detail: financeiro?.dataFimVigenciaAtual
                  ? String(financeiro.dataFimVigenciaAtual).slice(0, 10)
                  : '—',
              },
              {
                term: 'Dias até vencimento',
                detail:
                  financeiro?.diasAteVencimento != null ? String(financeiro.diasAteVencimento) : '—',
              },
              {
                term: 'PNCP',
                detail: financeiro?.publicadoPncp
                  ? 'Publicado'
                  : financeiro?.pendenciaPncp
                    ? 'Pendente'
                    : '—',
              },
            ]}
          />
        </Card>
        <Card variant="bordered" className="p-[var(--space-lg)]">
          <h3 className="mb-3 font-semibold text-[var(--primary)]">Financeiro</h3>
          <DescriptionList
            items={[
              {
                term: 'Original',
                detail: money(financeiro?.valorGlobalOriginalCents ?? (contract.valorAnual ?? 0) * 100),
              },
              { term: 'Atualizado', detail: money(financeiro?.valorGlobalAtualizadoCents) },
              { term: 'Empenhado', detail: money(financeiro?.valorEmpenhadoCents) },
              { term: 'Saldo a executar', detail: money(financeiro?.saldoAExecutarCents) },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
