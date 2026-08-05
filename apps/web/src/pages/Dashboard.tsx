import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Page, Meter } from '@painel/ui';
import { FilePlus2 } from 'lucide-react';
import { http } from '../lib/http';
import { useContracts } from '../hooks/useContracts';

type Kpis = {
  totalContratos?: number;
  vigentes?: number;
  aVencer?: number;
  vencidos?: number;
  valorSobGestaoCents?: number;
  percentualAditadoMedio?: number;
  atualizadoEm?: string;
};

type Janela = { janela: string; qtd: number; valorCents: number };

export default function Dashboard() {
  const { data: contractsData, isLoading: loadingContracts } = useContracts();
  const contracts = Array.isArray(contractsData) ? contractsData : [];

  const { data: kpis, isLoading: loadingKpis } = useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: async () => (await http.get<Kpis>('/dashboard/kpis')).data,
    staleTime: 1000 * 60,
  });

  const { data: vencimentos } = useQuery({
    queryKey: ['dashboard', 'vencimentos'],
    queryFn: async () => (await http.get<Janela[]>('/dashboard/vencimentos')).data,
    staleTime: 1000 * 60,
  });

  const { data: frota } = useQuery({
    queryKey: ['dashboard', 'frota'],
    queryFn: async () => (await http.get('/dashboard/frota')).data,
    staleTime: 1000 * 60,
  });

  const loading = loadingKpis || loadingContracts;
  const valorSobGestao = (kpis?.valorSobGestaoCents ?? 0) / 100;
  const pctAditado = Number(kpis?.percentualAditadoMedio ?? 0);

  const stats = [
    { label: 'Contratos', value: loading ? '…' : String(kpis?.totalContratos ?? contracts.length) },
    {
      label: 'Valor sob gestão',
      value: loading
        ? '…'
        : valorSobGestao.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
          }),
    },
    { label: 'Vigentes', value: loading ? '…' : String(kpis?.vigentes ?? 0) },
    { label: 'A vencer (≤60d)', value: loading ? '…' : String(kpis?.aVencer ?? 0) },
  ];

  return (
    <Page
      title="Painel de contratos"
      description={
        kpis?.atualizadoEm
          ? `KPIs analíticos · atualizado em ${String(kpis.atualizadoEm).slice(0, 19).replace('T', ' ')}`
          : 'Visão tática a partir das views materializadas.'
      }
      actions={
        <Link to="/contracts/new">
          <Button>
            <FilePlus2 size={16} />
            Novo contrato
          </Button>
        </Link>
      }
    >
      <section className="Form-Grade grid grid-cols-1 gap-[var(--space-md)] sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} variant="bordered" className="p-[var(--space-lg)]">
            <p className="text-[var(--font-size-xs)] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {item.label}
            </p>
            <p className="mt-3 text-[var(--font-size-2xl)] font-bold text-[var(--primary)]">{item.value}</p>
          </Card>
        ))}
      </section>

      <section className="mt-[var(--space-md)] grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-[1.2fr_1fr]">
        <Card variant="bordered" className="p-[var(--space-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-bold text-[var(--primary)]">Vencimentos</h2>
          <p className="mb-[var(--space-md)] text-[var(--font-size-sm)] text-[var(--text-muted)]">
            Buckets de dias até o fim da vigência atual.
          </p>
          <div className="space-y-3">
            {(vencimentos ?? []).map((j) => (
              <div key={j.janela} className="flex items-center justify-between gap-3 text-[var(--font-size-sm)]">
                <span className="font-semibold">{j.janela}</span>
                <span className="text-[var(--text-muted)]">
                  {j.qtd} ·{' '}
                  {(j.valorCents / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            ))}
            {!vencimentos?.length && (
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Sem dados de vencimento.</p>
            )}
          </div>
          <div className="mt-[var(--space-lg)]">
            <Meter
              label="% aditado médio"
              value={Number(pctAditado.toFixed(1))}
              max={25}
              thresholds={{ amber: 80, red: 100 }}
            />
          </div>
        </Card>

        <Card variant="bordered" className="p-[var(--space-lg)]">
          <div className="mb-[var(--space-md)] flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[var(--font-size-lg)] font-bold text-[var(--primary)]">Contratos recentes</h2>
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Últimos registros da base.</p>
            </div>
            <Link to="/contracts">
              <Button variant="secondary" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {contracts.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to={`/contracts/${c.id}`}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--panel-bg)] px-3 py-3 hover:border-[var(--primary)]"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--text)]">
                    {c.protocoloCabeca || `${c.numGms}/${c.anoGms}`}
                  </p>
                  <p className="truncate text-[var(--font-size-sm)] text-[var(--text-muted)]">{c.objeto}</p>
                </div>
                <span className="shrink-0 text-[var(--font-size-xs)] font-semibold text-[var(--primary)]">
                  {c.status || '—'}
                </span>
              </Link>
            ))}
            {!loadingContracts && contracts.length === 0 && (
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Nenhum contrato ainda.</p>
            )}
          </div>

          {Array.isArray(frota) && frota.length > 0 && (
            <div className="mt-[var(--space-lg)] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">Frota (KPI)</p>
              {frota.slice(0, 3).map((f: any, idx: number) => (
                <p key={idx} className="mt-1 text-[var(--font-size-sm)] font-semibold">
                  {f.tipoVeiculo} · {f.caracterizacao} · {f.quantidade} un
                </p>
              ))}
            </div>
          )}
        </Card>
      </section>
    </Page>
  );
}
