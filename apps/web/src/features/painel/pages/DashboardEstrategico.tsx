import React, { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button, ChartCard, KpiCard, Page, Select, Skeleton } from '@painel/ui';
import { LayoutDashboard } from 'lucide-react';
import { formatCents } from '../../../lib/format';
import { contractsListHref } from '../../../lib/dashboardLinks';
import {
  useDashboardAditivos,
  useDashboardAlimentacao,
  useDashboardCustos,
  useDashboardFornecedores,
  useDashboardFrota,
  useDashboardImoveis,
  useDashboardItens,
  useDashboardKpis,
  useDashboardModalidade,
  useDashboardPorOrgao,
  useDashboardPostos,
} from '../../../hooks/useDashboard';

function num(v: unknown) {
  return Number(v ?? 0);
}

function moneyTooltip(value: number) {
  return formatCents(Math.round(value * 100));
}

export default function DashboardEstrategico() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const pilar = params.get('pilar') || '';

  const { data: kpis, isLoading } = useDashboardKpis();
  const { data: porOrgao = [] } = useDashboardPorOrgao();
  const { data: custosPilar = [] } = useDashboardCustos('pilar');
  const { data: custosFonte = [] } = useDashboardCustos('fonteRecurso');
  const { data: aditivos = [] } = useDashboardAditivos();
  const { data: fornecedores = [] } = useDashboardFornecedores();
  const { data: modalidade = [] } = useDashboardModalidade();
  const { data: frota = [] } = useDashboardFrota();
  const { data: imoveis = [] } = useDashboardImoveis();
  const { data: postos = [] } = useDashboardPostos();
  const { data: alimentacao = [] } = useDashboardAlimentacao();
  const { data: itens = [] } = useDashboardItens();

  const atualizadoEm = kpis?.atualizadoEm;
  const valorSobGestao = num(kpis?.valorSobGestaoCents);

  const orgaoBars = useMemo(
    () =>
      porOrgao.slice(0, 8).map((r: { orgaoSigla: string; orgaoId: string; qtdContratos: number; valorCents: number }) => ({
        nome: r.orgaoSigla,
        orgaoId: r.orgaoId,
        qtd: num(r.qtdContratos),
        valor: num(r.valorCents) / 100,
      })),
    [porOrgao],
  );

  const fonteBars = useMemo(
    () =>
      custosFonte.map((r: { fonteRecurso: string; valorPrevistoCents: number }) => ({
        nome: r.fonteRecurso,
        valor: num(r.valorPrevistoCents) / 100,
      })),
    [custosFonte],
  );

  const pilarBars = useMemo(
    () =>
      custosPilar.map((r: { pilar: string; valorPrevistoCents: number }) => ({
        nome: r.pilar,
        valor: num(r.valorPrevistoCents) / 100,
      })),
    [custosPilar],
  );

  const aditivosLine = useMemo(
    () =>
      aditivos.map((r: { mes: string; qtdAditivos: number; valorAditadoCents: number }) => ({
        mes: String(r.mes).slice(0, 7),
        qtd: num(r.qtdAditivos),
        valor: num(r.valorAditadoCents) / 100,
      })),
    [aditivos],
  );

  const modalidadeBars = useMemo(
    () =>
      modalidade.map((r: { modalidadeLabel?: string; modalidade: string; qtd: number; valorCents: number }) => ({
        nome: r.modalidadeLabel || r.modalidade,
        codigo: r.modalidade,
        qtd: num(r.qtd),
        valor: num(r.valorCents) / 100,
      })),
    [modalidade],
  );

  if (isLoading && !kpis) {
    return (
      <Page title="Painel estratégico">
        <Skeleton variant="card" lines={4} />
      </Page>
    );
  }

  return (
    <Page
      title="Painel estratégico"
      description={
        atualizadoEm
          ? `Dinheiro e comparação · atualizado em ${String(atualizadoEm).slice(0, 19).replace('T', ' ')}`
          : 'Agregados estratégicos a partir das MVs.'
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Select
            className="min-w-[14rem]"
            aria-label="Filtrar pilar"
            value={pilar || '__all__'}
            onChange={(v) => {
              const next = new URLSearchParams(params);
              if (v && v !== '__all__') next.set('pilar', v);
              else next.delete('pilar');
              setParams(next);
            }}
            options={[
              { id: '__all__', label: 'Todos os pilares' },
              { id: 'CUSTEIO', label: 'Custeio' },
              { id: 'INVESTIMENTO', label: 'Investimento' },
              { id: 'SERVICOS', label: 'Serviços' },
            ]}
          />
          <Button to="/" variant="secondary">
            <LayoutDashboard size={16} />
            Tático
          </Button>
        </div>
      }
    >
      <section className="grid grid-cols-1 gap-[var(--space-md)] sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Valor sob gestão"
          value={formatCents(valorSobGestao)}
          onClick={() => navigate(contractsListHref({ pilar: pilar || undefined }))}
        />
        <KpiCard
          title="Vigentes"
          value={String(kpis?.vigentes ?? 0)}
          onClick={() => navigate(contractsListHref({ situacao: 'VIGENTE', pilar: pilar || undefined }))}
        />
        <KpiCard
          title="% aditado médio"
          value={`${num(kpis?.percentualAditadoMedio).toFixed(1)}%`}
          onClick={() => navigate(contractsListHref({}))}
        />
        <KpiCard
          title="A vencer no horizonte"
          value={String(kpis?.aVencer ?? 0)}
          onClick={() => navigate(contractsListHref({ vencimento: '0-60' }))}
        />
      </section>

      <section className="mt-[var(--space-md)] grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-2">
        <ChartCard title="Valor por órgão" subtitle="Barras horizontais · drill-down na lista">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={orgaoBars} margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tickFormatter={(v) => `${Math.round(v / 1e6)}M`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="nome" width={72} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => moneyTooltip(v)} />
                <Bar
                  dataKey="valor"
                  name="Valor"
                  fill="var(--primary)"
                  radius={[0, 4, 4, 0]}
                  cursor="pointer"
                  onClick={(d) => {
                    const orgaoId = (d as { orgaoId?: string })?.orgaoId;
                    if (orgaoId) navigate(contractsListHref({ orgaoId, pilar: pilar || undefined }));
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Quem pagou" subtitle="Fonte de recurso">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fonteBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="nome" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${Math.round(v / 1e6)}M`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => moneyTooltip(v)} />
                <Bar dataKey="valor" name="Valor previsto" fill="var(--accent, var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {!fonteBars.length && (
            <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Sem dotações vinculadas.</p>
          )}
        </ChartCard>
      </section>

      <section className="mt-[var(--space-md)] grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-2">
        <ChartCard title="Custo por pilar" subtitle="Valor previsto orçamentário">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pilarBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="nome" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${Math.round(v / 1e6)}M`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => moneyTooltip(v)} />
                <Bar
                  dataKey="valor"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  onClick={(d) => {
                    const nome = (d as { nome?: string })?.nome;
                    if (nome) navigate(contractsListHref({ pilar: nome }));
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Evolução de aditivos" subtitle="Quantidade e valor por mês">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aditivosLine}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="qtd" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="valor" orientation="right" tickFormatter={(v) => `${Math.round(v / 1e3)}k`} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="qtd" type="monotone" dataKey="qtd" name="Qtd" stroke="var(--primary)" strokeWidth={2} />
                <Line yAxisId="valor" type="monotone" dataKey="valor" name="Valor (R$)" stroke="var(--warning)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="mt-[var(--space-md)] grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-2">
        <ChartCard title="Concentração de fornecedores" subtitle="Top 10 por valor">
          <div className="space-y-2">
            {fornecedores.slice(0, 10).map((f: {
              fornecedorId: string;
              fornecedorNome: string;
              qtdContratos: number;
              valorCents: number;
              participacaoPercent: number;
            }) => (
              <Link
                key={f.fornecedorId}
                to={contractsListHref({ fornecedorId: f.fornecedorId })}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 hover:border-[var(--primary)]"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{f.fornecedorNome}</p>
                  <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">
                    {num(f.qtdContratos)} contrato(s) · {num(f.participacaoPercent).toFixed(1)}%
                  </p>
                </div>
                <span className="shrink-0 text-[var(--font-size-sm)]">{formatCents(num(f.valorCents))}</span>
              </Link>
            ))}
            {!fornecedores.length && (
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Sem dados.</p>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Distribuição por modalidade" subtitle="Quantidade e valor">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modalidadeBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="nome" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number, name: string) => (name === 'valor' ? moneyTooltip(v) : v)} />
                <Bar
                  dataKey="qtd"
                  name="qtd"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  onClick={(d) => {
                    const codigo = (d as { codigo?: string })?.codigo;
                    if (codigo) navigate(contractsListHref({ modalidade: codigo }));
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="mt-[var(--space-md)] grid grid-cols-1 gap-[var(--space-md)] md:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Frota" subtitle="Locação × caracterização">
          <div className="space-y-2 text-[var(--font-size-sm)]">
            {frota.map((f: {
              tipoVeiculo?: string;
              caracterizacao?: string;
              modalidadeUso?: string;
              quantidade?: number;
              custoUnitarioMedioCents?: number;
            }, idx: number) => (
              <div key={idx} className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2">
                <p className="font-semibold">
                  {f.tipoVeiculo || '—'} · {f.caracterizacao || '—'}
                </p>
                <p className="text-[var(--text-muted)]">
                  {f.modalidadeUso} · {num(f.quantidade)} un · custo médio{' '}
                  {formatCents(num(f.custoUnitarioMedioCents))}
                </p>
              </div>
            ))}
            {!frota.length && <p className="text-[var(--text-muted)]">Sem KPI de frota.</p>}
          </div>
        </ChartCard>

        <ChartCard title="Imóveis" subtitle="Custo por m²">
          <div className="space-y-2 text-[var(--font-size-sm)]">
            {imoveis.map((i: Record<string, unknown>, idx: number) => (
              <div key={idx} className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2">
                <p className="font-semibold">{String(i.destinacao ?? i.unidadeSigla ?? 'Imóvel')}</p>
                <p className="text-[var(--text-muted)]">
                  {i.metragemM2 != null ? `${num(i.metragemM2)} m² · ` : ''}
                  {i.custoPorM2Cents != null
                    ? `${formatCents(num(i.custoPorM2Cents))}/m²`
                    : formatCents(num(i.custoAnualCents))}
                </p>
              </div>
            ))}
            {!imoveis.length && <p className="text-[var(--text-muted)]">Sem KPI de imóveis no seed.</p>}
          </div>
        </ChartCard>

        <ChartCard title="Postos de trabalho" subtitle="Por unidade">
          <div className="space-y-2 text-[var(--font-size-sm)]">
            {postos.map((p: {
              unidadeSigla?: string;
              nomePosto?: string;
              postos?: number;
              custoAnualCents?: number;
            }, idx: number) => (
              <div key={idx} className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2">
                <p className="font-semibold">
                  {p.unidadeSigla} · {p.nomePosto}
                </p>
                <p className="text-[var(--text-muted)]">
                  {num(p.postos)} posto(s) · {formatCents(num(p.custoAnualCents))}/ano
                </p>
              </div>
            ))}
            {!postos.length && <p className="text-[var(--text-muted)]">Sem KPI de postos.</p>}
          </div>
        </ChartCard>
      </section>

      <section className="mt-[var(--space-md)] grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-2">
        <ChartCard title="Alimentação" subtitle="Gêneros e refeições">
          <div className="space-y-2 text-[var(--font-size-sm)]">
            {alimentacao.map((a: { categoria?: string; custoAnualCents?: number }, idx: number) => (
              <div key={idx} className="flex justify-between rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2">
                <span className="font-semibold">{a.categoria || '—'}</span>
                <span>{formatCents(num(a.custoAnualCents))}</span>
              </div>
            ))}
            {!alimentacao.length && <p className="text-[var(--text-muted)]">Sem KPI de alimentação.</p>}
          </div>
        </ChartCard>

        <ChartCard title="Objeto contratado" subtitle="Itens de catálogo">
          <div className="space-y-2 text-[var(--font-size-sm)]">
            {itens.slice(0, 10).map((i: {
              catalogoItemId: string;
              catalogoNome: string;
              categoria: string;
              quantidadeTotal: number;
              valorTotalCents: number;
            }) => (
              <div
                key={i.catalogoItemId}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{i.catalogoNome}</p>
                  <p className="text-[var(--text-muted)]">
                    {i.categoria} · qtd {num(i.quantidadeTotal)}
                  </p>
                </div>
                <span className="shrink-0">{formatCents(num(i.valorTotalCents))}</span>
              </div>
            ))}
            {!itens.length && <p className="text-[var(--text-muted)]">Sem itens agregados.</p>}
          </div>
        </ChartCard>
      </section>
    </Page>
  );
}
