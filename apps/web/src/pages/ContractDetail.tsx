import React, { useMemo } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useContract, useDeleteContract } from '../hooks/useContracts';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DescriptionList,
  EmptyState,
  ErrorState,
  Meter,
  Page,
  Skeleton,
  StatusBadge,
  Tabs,
  Timeline,
  useToast,
} from '@painel/ui';
import { getErrorMessage, http } from '../lib/http';
import { formatCents } from '../lib/format';
import { useConfirmDialog } from '../lib/useConfirmDialog';
import { useAuth } from '../providers/AuthProvider';

const TAB_IDS = [
  'resumo',
  'timeline',
  'itens',
  'alteracoes',
  'financeiro',
  'fiscalizacao',
  'rateio',
  'publicidade',
  'documentos',
  'auditoria',
] as const;

type TabId = (typeof TAB_IDS)[number];

function isTabId(value: string | null): value is TabId {
  return Boolean(value && (TAB_IDS as readonly string[]).includes(value));
}

function num(v: unknown) {
  return Number(v ?? 0);
}

function money(cents: unknown) {
  return formatCents(num(cents));
}

export default function ContractDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab: TabId = isTabId(tabParam) ? tabParam : 'resumo';

  const { data: contract, isLoading, error, refetch } = useContract(id);
  const deleteContract = useDeleteContract();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const { hasMinRole, token } = useAuth();
  const canWrite = !token || hasMinRole('COLABORADOR');

  const setTab = (next: string) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('tab', next);
      return p;
    });
  };

  const { data: financeiro } = useQuery({
    queryKey: ['contrato-financeiro', id],
    queryFn: async () => (await http.get(`/contracts/${id}/financeiro`)).data,
    enabled: Boolean(id),
  });
  const { data: dotacoes } = useQuery({
    queryKey: ['contrato-dotacoes', id],
    queryFn: async () => (await http.get(`/contracts/${id}/dotacoes`)).data,
    enabled: Boolean(id),
  });
  const { data: empenhos } = useQuery({
    queryKey: ['contrato-empenhos', id],
    queryFn: async () => (await http.get(`/contracts/${id}/empenhos`)).data,
    enabled: Boolean(id),
  });
  const { data: publicacoes } = useQuery({
    queryKey: ['contrato-publicacoes', id],
    queryFn: async () => (await http.get(`/contracts/${id}/publicacoes`)).data,
    enabled: Boolean(id),
  });
  const { data: documentos } = useQuery({
    queryKey: ['contrato-documentos', id],
    queryFn: async () => (await http.get(`/contracts/${id}/documentos`)).data,
    enabled: Boolean(id),
  });
  const { data: timeline } = useQuery({
    queryKey: ['contrato-timeline', id],
    queryFn: async () => (await http.get(`/contracts/${id}/timeline`)).data,
    enabled: Boolean(id),
  });
  const { data: limites } = useQuery({
    queryKey: ['contrato-limites', id],
    queryFn: async () => (await http.get(`/contracts/${id}/limites`)).data,
    enabled: Boolean(id),
  });
  const { data: auditoria } = useQuery({
    queryKey: ['contrato-auditoria', id],
    queryFn: async () => (await http.get(`/contracts/${id}/auditoria`)).data,
    enabled: Boolean(id) && tab === 'auditoria',
  });

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await deleteContract.mutateAsync(confirm.pending.payload);
      toast.success('Contrato excluído.');
      navigate('/contracts');
    } catch (err) {
      toast.error('Falha ao excluir contrato.', getErrorMessage(err));
    }
  };

  const timelineEvents = useMemo(() => {
    const rows = Array.isArray(timeline) ? timeline : [];
    return rows
      .filter((ev: { data?: string | null }) => Boolean(ev.data))
      .map((ev: { origemId?: string; data: string; titulo?: string; detalhe?: string; tipo?: string }, idx: number) => ({
        id: `${ev.origemId ?? 'ev'}-${idx}`,
        date: String(ev.data).slice(0, 10),
        title: ev.titulo || ev.tipo || 'Evento',
        detail: ev.detalhe || undefined,
        tipo: ev.tipo,
      }));
  }, [timeline]);

  const rateioPct = useMemo(
    () => (contract?.rateios ?? []).reduce((sum, r) => sum + (Number(r.percentual) || 0), 0),
    [contract?.rateios],
  );

  const alteracoes = useMemo(() => {
    if (contract?.alteracoes?.length) return contract.alteracoes;
    return (
      contract?.aditivos?.map((a) => ({
        id: a.id || String(a.numAditivo),
        tipo: 'ADITIVO',
        numero: a.numAditivo,
        eProtocolo: a.protocoloAdit,
        novaDataFimVigencia: a.novoFimVigencia,
        valorAcrescido: a.valorAdicional,
        situacao: 'ASSINADO',
      })) ?? []
    );
  }, [contract]);

  if (isLoading) {
    return (
      <Page title="Contrato" description="Carregando...">
        <Skeleton variant="card" />
      </Page>
    );
  }

  if (error || !contract) {
    return (
      <Page title="Contrato">
        <ErrorState
          title="Contrato não encontrado"
          message={error ? getErrorMessage(error) : 'O contrato solicitado não existe ou foi removido.'}
          code={(error as { code?: string } | undefined)?.code}
          onRetry={error ? () => refetch() : undefined}
        />
      </Page>
    );
  }

  const unidadeLabel =
    contract.unidadeGestora?.sigla ||
    contract.unidadeFsp?.sigla ||
    contract.unidadeGestoraId ||
    contract.unidadeFspId ||
    '—';

  const tabItems = [
    {
      id: 'resumo',
      label: 'Resumo',
      content: (
        <div className="grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-2">
          <Card variant="bordered" className="p-[var(--space-lg)]">
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusBadge status={contract.status || contract.situacao?.toLowerCase()} />
              {contract.pilar && <Badge variant="info">{contract.pilar}</Badge>}
              {contract.modalidade && <Badge>{contract.modalidade}</Badge>}
              {financeiro?.situacaoEfetiva && (
                <Badge variant="success">Efetiva: {String(financeiro.situacaoEfetiva)}</Badge>
              )}
            </div>
            <DescriptionList
              columns={2}
              items={[
                { term: 'GMS / Ano', detail: `${contract.numGms}/${contract.anoGms}` },
                { term: 'e-Protocolo', detail: contract.eProtocolo || contract.protocoloCabeca || '—' },
                { term: 'Fornecedor', detail: contract.fornecedorName || contract.empresaName || '—' },
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
                      financeiro?.diasAteVencimento != null
                        ? String(financeiro.diasAteVencimento)
                        : '—',
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
                  {
                    term: 'Atualizado',
                    detail: money(financeiro?.valorGlobalAtualizadoCents),
                  },
                  {
                    term: 'Empenhado',
                    detail: money(financeiro?.valorEmpenhadoCents),
                  },
                  {
                    term: 'Saldo a executar',
                    detail: money(financeiro?.saldoAExecutarCents),
                  },
                ]}
              />
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'timeline',
      label: 'Linha do tempo',
      content: timelineEvents.length ? (
        <Card variant="bordered" className="p-[var(--space-lg)]">
          <Timeline events={timelineEvents} />
        </Card>
      ) : (
        <EmptyState title="Sem eventos" description="A linha do tempo ainda não tem registros." />
      ),
    },
    {
      id: 'itens',
      label: 'Itens',
      content: (
        <Card variant="bordered" className="space-y-3 p-[var(--space-lg)]">
          {contract.itens?.length ? (
            contract.itens.map((item) => (
              <div
                key={item.id}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3"
              >
                <p className="font-semibold">
                  {item.sequencia}. {item.catalogoNome || item.catalogoItemId}
                  {item.categoria ? ` · ${item.categoria}` : ''}
                </p>
                <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
                  {item.quantidade} {item.unidadeMedida || 'un'}
                  {' · '}
                  {(item.valorUnitario ?? 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                  {' unit. · total '}
                  {(item.valorTotal ?? 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                  {item.periodicidade ? ` · ${item.periodicidade}` : ''}
                </p>
              </div>
            ))
          ) : (
            <EmptyState title="Nenhum item" description="Cadastre itens no wizard ou via API." />
          )}
        </Card>
      ),
    },
    {
      id: 'alteracoes',
      label: 'Alterações',
      content: (
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
                    {a.valorAcrescido != null
                      ? ` · + ${a.valorAcrescido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                      : ''}
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
                  {limites.prazoRestanteMeses != null
                    ? ` · ${limites.prazoRestanteMeses} restantes no teto`
                    : ''}
                </p>
              </>
            ) : (
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Limites indisponíveis.</p>
            )}
            {id && canWrite && (
              <Link to={`/contracts/${id}/alteracoes/nova`}>
                <Button className="w-full">Nova alteração</Button>
              </Link>
            )}
          </Card>
        </div>
      ),
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      content: (
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
                dotacoes.map((d: {
                  id: string;
                  exercicio: number;
                  valorPrevisto?: number;
                  dotacao?: { codigo?: string; fonteRecurso?: { label?: string } };
                }) => (
                  <p key={d.id} className="text-[var(--font-size-sm)]">
                    {d.exercicio} · {d.dotacao?.codigo}
                    {' · '}
                    {(d.valorPrevisto ?? 0).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
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
                empenhos.map((e: {
                  id: string;
                  numero: string;
                  exercicio: number;
                  situacao: string;
                  valor?: number;
                }) => (
                  <p key={e.id} className="text-[var(--font-size-sm)]">
                    {e.numero}/{e.exercicio} · {e.situacao}
                    {' · '}
                    {(e.valor ?? 0).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                ))
              ) : (
                <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Nenhum empenho.</p>
              )}
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'fiscalizacao',
      label: 'Fiscalização',
      content: (
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
      ),
    },
    {
      id: 'rateio',
      label: 'Rateio',
      content: (
        <Card variant="bordered" className="space-y-4 p-[var(--space-lg)]">
          <Meter
            label="Soma dos percentuais"
            value={rateioPct}
            max={100}
            thresholds={{ amber: 80, red: 100 }}
          />
          {contract.rateios?.length ? (
            <div className="space-y-2">
              {contract.rateios.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-[var(--font-size-sm)]"
                >
                  <span className="font-semibold">
                    {r.unidadeSigla || r.unidadeNome || r.unidadeId}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {r.percentual != null ? `${Number(r.percentual).toFixed(1)}%` : '—'}
                    {r.valorCents != null ? ` · ${money(r.valorCents)}` : ''}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Sem rateio" description="Inclua unidades no wizard na criação do contrato." />
          )}
        </Card>
      ),
    },
    {
      id: 'publicidade',
      label: 'Publicidade',
      content: (
        <Card variant="bordered" className="space-y-3 p-[var(--space-lg)]">
          {financeiro?.pendenciaPncp && (
            <p className="rounded-[var(--radius-md)] border border-[var(--warning)] bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] px-3 py-2 text-[var(--font-size-sm)]">
              Pendência de publicação no PNCP.
            </p>
          )}
          {Array.isArray(publicacoes) && publicacoes.length ? (
            publicacoes.map((p: {
              id: string;
              veiculo?: { codigo?: string; label?: string };
              dataPublicacao: string;
              idPncp?: string | null;
              url?: string | null;
            }) => (
              <div
                key={p.id}
                className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-[var(--font-size-sm)]"
              >
                <p className="font-semibold">
                  {p.veiculo?.label || p.veiculo?.codigo || '—'} ·{' '}
                  {String(p.dataPublicacao).slice(0, 10)}
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
      ),
    },
    {
      id: 'documentos',
      label: 'Documentos',
      content: (
        <Card variant="bordered" className="space-y-3 p-[var(--space-lg)]">
          {Array.isArray(documentos) && documentos.length ? (
            documentos.map((d: {
              id: string;
              nome: string;
              tipoDocumento?: { label?: string; codigo?: string };
              urlExterna?: string | null;
              createdAt?: string;
            }) => (
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
      ),
    },
    {
      id: 'auditoria',
      label: 'Auditoria',
      content: (
        <Card variant="bordered" className="space-y-3 p-[var(--space-lg)]">
          {Array.isArray(auditoria) && auditoria.length ? (
            auditoria.map((row: {
              id: string;
              action: string;
              changedBy?: string | null;
              changedAt: string;
              source?: string | null;
            }) => (
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
      ),
    },
  ];

  return (
    <Page
      title={contract.protocoloCabeca || `Contrato ${contract.numGms}/${contract.anoGms}`}
      description={`${unidadeLabel} · ${contract.fornecedorName || contract.empresaName || 'Fornecedor'} · Lei 14.133/2021`}
      actions={
        <>
          <Link to="/contracts">
            <Button variant="ghost">Voltar</Button>
          </Link>
          {id && canWrite && (
            <Link to={`/contracts/${id}/edit`}>
              <Button variant="secondary">Editar</Button>
            </Link>
          )}
          {id && canWrite && (
            <Link to={`/contracts/${id}/alteracoes/nova`}>
              <Button variant="secondary">Nova alteração</Button>
            </Link>
          )}
          {canWrite && (
            <Button
              variant="danger"
              type="button"
              onClick={() =>
                id && confirm.ask(id, 'Excluir contrato?', 'Esta ação não pode ser desfeita.')
              }
              disabled={deleteContract.isPending}
            >
              Excluir
            </Button>
          )}
        </>
      }
    >
      <Tabs items={tabItems} value={tab} onValueChange={setTab} />

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.onOpenChange}
        title={confirm.pending?.title ?? 'Confirmar'}
        description={confirm.pending?.description}
        variant="danger"
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        loading={deleteContract.isPending}
      />
    </Page>
  );
}
