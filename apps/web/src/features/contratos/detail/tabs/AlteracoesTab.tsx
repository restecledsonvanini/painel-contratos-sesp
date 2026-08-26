import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, EmptyState, Meter } from '@painel/ui';
import { formatCurrencyFromReais } from '../../../../lib/format';
import type { Contract } from '../../../../hooks/useContracts';

export function AlteracoesTab({
  id,
  canManage,
  alteracoes,
  limites,
}: {
  id?: string;
  canManage: boolean;
  alteracoes: NonNullable<Contract['alteracoes']>;
  limites?: {
    limiteAcrescimoPercent?: number;
    percentualAcrescido?: number;
    mesesProrrogadosAcumulados?: number;
    prazoRestanteMeses?: number;
  };
}) {
  return (
    <div className="grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-[1.4fr_1fr]">
      <Card variant="bordered" className="space-y-3 p-[var(--space-lg)]">
        {alteracoes.length ? (
          alteracoes.map((a) => (
            <div
              key={a.id ?? a.numero}
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3"
            >
              <p className="font-semibold">
                {a.tipo || 'ADITIVO'} #{a.numero}
                {a.eProtocolo ? ` · ${a.eProtocolo}` : ''}
              </p>
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
                {a.situacao ? `${a.situacao} · ` : ''}
                Novo fim: {a.novaDataFimVigencia ? String(a.novaDataFimVigencia).slice(0, 10) : '—'}
                {a.valorAcrescido != null ? ` · + ${formatCurrencyFromReais(a.valorAcrescido)}` : ''}
              </p>
            </div>
          ))
        ) : (
          <EmptyState title="Nenhuma alteração" description="Aditivos e apostilamentos aparecem aqui." />
        )}
      </Card>
      <Card variant="bordered" className="space-y-3 p-[var(--space-lg)]">
        <h3 className="font-semibold text-[var(--primary)]">Limites legais</h3>
        {limites ? (
          <>
            <Meter
              label={`Acréscimo (limite ${limites.limiteAcrescimoPercent}%)`}
              value={Number(Number(limites.percentualAcrescido ?? 0).toFixed(2))}
              max={Number(limites.limiteAcrescimoPercent ?? 25)}
              thresholds={{ amber: 80, red: 100 }}
            />
            <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
              {limites.mesesProrrogadosAcumulados ?? 0} meses prorrogados
              {limites.prazoRestanteMeses != null ? ` · ${limites.prazoRestanteMeses} restantes no teto` : ''}
            </p>
          </>
        ) : (
          <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Limites indisponíveis.</p>
        )}
        {id && canManage && (
          <Link to={`/contracts/${id}/alteracoes/nova`}>
            <Button className="w-full">Nova alteração</Button>
          </Link>
        )}
      </Card>
    </div>
  );
}
