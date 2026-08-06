import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button, ChartCard, KpiCard, Meter, Page, Skeleton } from '@painel/ui';
import { Bell, Clock, FilePlus2, LineChart } from 'lucide-react';
import { formatCents, formatCurrencyFromReais } from '../lib/format';
import { contractsListHref, janelaToVencimentoParam } from '../lib/dashboardLinks';
import {
  alertaTipoToTab,
  contractHref,
  readRecentContracts,
  type RecentContract,
} from '../lib/recentContracts';
import {
  useDashboardAlertas,
  useDashboardFiscalizacao,
  useDashboardKpis,
  useDashboardPublicidade,
  useDashboardVencimentos,
} from '../hooks/useDashboard';
import { useAuth } from '../providers/AuthProvider';

function num(v: unknown) {
  return Number(v ?? 0);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { hasMinRole, token } = useAuth();
  const canWrite = !token || hasMinRole('ANALISTA');

  const { data: kpis, isLoading: loadingKpis } = useDashboardKpis();
  const { data: vencimentos = [], isLoading: loadingVenc } = useDashboardVencimentos();
  const { data: publicidade = [] } = useDashboardPublicidade();
  const { data: fiscalizacao = [] } = useDashboardFiscalizacao();
  const { data: alertas = [] } = useDashboardAlertas();

  const atualizadoEm = kpis?.atualizadoEm ?? vencimentos[0]?.atualizadoEm;
  const pctAditado = num(kpis?.percentualAditadoMedio);
  const pncp = publicidade.find((p: { veiculo?: string }) => p.veiculo === 'PNCP');

  const vencChart = useMemo(
    () =>
      vencimentos.map((j) => ({
        janela: j.janela,
        qtd: num(j.qtd),
        valor: num(j.valorCents) / 100,
      })),
    [vencimentos],
  );

  const alertasAbertos = alertas
    .filter((a: { reconhecidoEm?: string | null }) => !a.reconhecidoEm)
    .slice(0, 6);

  const [recentes, setRecentes] = useState<RecentContract[]>(() => readRecentContracts());
  useEffect(() => {
    function refresh() {
      setRecentes(readRecentContracts());
    }
    window.addEventListener('painel:recent-contracts', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('painel:recent-contracts', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const acaoNecessaria = vencimentos.filter((j) =>
    ['vencidos', '0-30', '31-60'].includes(String(j.janela)),
  );

  if (loadingKpis && loadingVenc) {
    return (
      <Page title="Painel tático">
        <Skeleton variant="card" lines={4} />
      </Page>
    );
  }

  return (
    <Page
      title="Painel tático"
      description={
        atualizadoEm
          ? `Operação e prazos · atualizado em ${String(atualizadoEm).slice(0, 19).replace('T', ' ')}`
          : 'Operação e prazos a partir das views materializadas.'
      }
      actions={
        <div className="flex flex-wrap gap-2">
          <Link to="/painel?tab=estrategico">
            <Button variant="secondary">
              <LineChart size={16} />
              Estratégico
            </Button>
          </Link>
          {canWrite ? (
            <Link to="/contracts/new">
              <Button>
                <FilePlus2 size={16} />
                Novo contrato
              </Button>
            </Link>
          ) : null}
        </div>
      }
    >
      {recentes.length > 0 && (
        <section aria-label="Vistos recentemente" className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[var(--font-size-xs)] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            <Clock size={14} aria-hidden />
            Recentes
          </span>
          {recentes.map((r) => (
            <Link
              key={r.id}
              to={contractHref(r.id)}
              className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[var(--font-size-sm)] font-semibold text-[var(--primary)] hover:border-[var(--primary)]"
            >
              {r.gms ? `GMS ${r.gms}` : r.label}
            </Link>
          ))}
        </section>
      )}

      <section className="grid grid-cols-1 gap-[var(--space-md)] sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Contratos"
          value={loadingKpis ? '…' : String(kpis?.totalContratos ?? 0)}
          onClick={() => navigate(contractsListHref({}))}
        />
        <KpiCard
          title="Vigentes"
          value={loadingKpis ? '…' : String(kpis?.vigentes ?? 0)}
          onClick={() => navigate(contractsListHref({ situacao: 'VIGENTE' }))}
        />
        <KpiCard
          title="A vencer (≤60d)"
          value={loadingKpis ? '…' : String(kpis?.aVencer ?? 0)}
          onClick={() => navigate(contractsListHref({ vencimento: '0-60' }))}
        />
        <KpiCard
          title="Sem PNCP"
          value={
            pncp
              ? String(num(pncp.contratosElegiveis) - num(pncp.contratosPublicados))
              : '—'
          }
          onClick={() => navigate(contractsListHref({ publicacao: 'sem-pncp' }))}
        />
      </section>

      <section className="mt-[var(--space-md)] grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-2">
        <ChartCard
          title="Vencimentos por janela"
          subtitle="Clique na barra ou na lista para filtrar contratos"
          atualizadoEm={atualizadoEm}
        >
          {vencChart.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={vencChart}
                  onClick={(state) => {
                    const janela = (state?.activePayload?.[0]?.payload as { janela?: string })?.janela;
                    if (janela) {
                      navigate(
                        contractsListHref({ vencimento: janelaToVencimentoParam(janela) }),
                      );
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="janela" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number, name: string) =>
                      name === 'valor' ? formatCurrencyFromReais(value) : value
                    }
                  />
                  <Bar dataKey="qtd" name="Contratos" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Sem dados de vencimento.</p>
          )}
          <div className="mt-4">
            <Meter
              label="% aditado médio (limite 25%)"
              value={Number(pctAditado.toFixed(1))}
              max={25}
              thresholds={{ amber: 80, red: 100 }}
            />
          </div>
        </ChartCard>

        <ChartCard
          title="Alertas prioritários"
          subtitle="Não reconhecidos"
          actions={
            <Link to="/painel?tab=alertas">
              <Button variant="ghost" size="sm">
                <Bell size={14} />
                Ver todos
              </Button>
            </Link>
          }
        >
          <div className="space-y-2">
            {alertasAbertos.map((a: {
              id: string;
              tipo?: string;
              severidade: string;
              mensagem: string;
              contrato?: { id: string; numeroGms: string; anoGms: number };
            }) => (
              <Link
                key={a.id}
                to={
                  a.contrato?.id
                    ? contractHref(a.contrato.id, alertaTipoToTab(a.tipo))
                    : '/painel?tab=alertas'
                }
                className="block rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 hover:border-[var(--primary)]"
              >
                <p className="text-[var(--font-size-xs)] font-semibold uppercase text-[var(--text-muted)]">
                  {a.severidade}
                  {a.contrato ? ` · GMS ${a.contrato.numeroGms}/${a.contrato.anoGms}` : ''}
                </p>
                <p className="text-[var(--font-size-sm)] text-[var(--text)]">{a.mensagem}</p>
              </Link>
            ))}
            {!alertasAbertos.length && (
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Nenhum alerta aberto.</p>
            )}
          </div>
        </ChartCard>
      </section>

      <section className="mt-[var(--space-md)] grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-2">
        <ChartCard title="Ação necessária" subtitle="Janelas críticas de vencimento">
          <div className="space-y-2">
            {acaoNecessaria.map((j) => (
              <Link
                key={j.janela}
                to={contractsListHref({ vencimento: janelaToVencimentoParam(j.janela) })}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-3 hover:border-[var(--primary)]"
              >
                <span className="font-semibold">{j.janela}</span>
                <span className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
                  {num(j.qtd)} · {formatCents(num(j.valorCents))}
                </span>
              </Link>
            ))}
            {!acaoNecessaria.length && (
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
                Nenhuma janela crítica no momento.
              </p>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Conformidade de publicidade" subtitle="Publicados / elegíveis por veículo">
          <div className="space-y-3">
            {publicidade.map((p: {
              veiculo: string;
              contratosPublicados: number;
              contratosElegiveis: number;
              percentualPublicado: number;
            }) => (
              <div key={p.veiculo}>
                <div className="mb-1 flex justify-between text-[var(--font-size-sm)]">
                  <span className="font-semibold">{p.veiculo}</span>
                  <span className="text-[var(--text-muted)]">
                    {num(p.contratosPublicados)}/{num(p.contratosElegiveis)} ({num(p.percentualPublicado)}%)
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-muted)]"
                  role="meter"
                  aria-label={`Publicação ${p.veiculo}`}
                  aria-valuenow={num(p.percentualPublicado)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-[var(--radius-sm)] bg-[var(--success)]"
                    style={{ width: `${Math.min(100, Math.max(0, num(p.percentualPublicado)))}%` }}
                  />
                </div>
              </div>
            ))}
            {!publicidade.length && (
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Sem dados de publicidade.</p>
            )}
          </div>
        </ChartCard>
      </section>

      <section className="mt-[var(--space-md)]">
        <ChartCard title="Carga por gestor/fiscal" subtitle="Top responsabilidades ativas">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[var(--font-size-sm)]">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
                  <th className="py-2 pr-3 font-semibold">Servidor</th>
                  <th className="py-2 pr-3 font-semibold">Papel</th>
                  <th className="py-2 pr-3 font-semibold">Contratos</th>
                  <th className="py-2 font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody>
                {fiscalizacao.slice(0, 8).map((row: {
                  servidorId: string;
                  servidorNome: string;
                  papel: string;
                  qtdContratos: number;
                  valorCents: number;
                }) => (
                  <tr key={`${row.servidorId}-${row.papel}`} className="border-b border-[var(--border)]">
                    <td className="py-2 pr-3">
                      <Link
                        className="font-semibold text-[var(--primary)] hover:underline"
                        to={contractsListHref({ responsavelId: row.servidorId })}
                      >
                        {row.servidorNome}
                      </Link>
                    </td>
                    <td className="py-2 pr-3">{row.papel}</td>
                    <td className="py-2 pr-3">{num(row.qtdContratos)}</td>
                    <td className="py-2">{formatCents(num(row.valorCents))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!fiscalizacao.length && (
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Sem carga cadastrada.</p>
            )}
          </div>
        </ChartCard>
      </section>
    </Page>
  );
}
