import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useContract, useDeleteContract } from '../hooks/useContracts';
import {
  Button,
  Card,
  ConfirmDialog,
  ErrorState,
  Page,
  Skeleton,
  StatusBadge,
  useToast,
} from '@painel/ui';
import { getErrorMessage, http } from '../lib/http';
import { useConfirmDialog } from '../lib/useConfirmDialog';

export default function ContractDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: contract, isLoading, error, refetch } = useContract(id);
  const deleteContract = useDeleteContract();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();

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

  return (
    <Page
      title={contract.protocoloCabeca || `Contrato ${contract.numGms}/${contract.anoGms}`}
      description="Detalhe, status e aditivos."
      actions={
        <>
          <Link to="/contracts">
            <Button variant="ghost">Voltar</Button>
          </Link>
          {id && (
            <Link to={`/contracts/${id}/edit`}>
              <Button variant="secondary">Editar</Button>
            </Link>
          )}
          {id && (
            <Link to={`/contracts/${id}/alteracoes/nova`}>
              <Button variant="secondary">Nova alteração</Button>
            </Link>
          )}
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
        </>
      }
    >
      <div className="grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-[1.4fr_1fr]">
        <Card variant="bordered" className="space-y-[var(--space-lg)] p-[var(--space-lg)]">
          <section>
            <h2 className="mb-3 text-[var(--font-size-lg)] font-bold text-[var(--primary)]">Dados principais</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">Protocolo</p>
                <p className="mt-1 font-semibold">{contract.protocoloCabeca || '—'}</p>
              </div>
              <div>
                <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">GMS / Ano</p>
                <p className="mt-1 font-semibold">
                  {contract.numGms}/{contract.anoGms}
                </p>
              </div>
              <div>
                <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">Unidade</p>
                <p className="mt-1 font-semibold">{contract.unidadeFsp?.sigla || contract.unidadeFspId}</p>
              </div>
              <div>
                <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">Status</p>
                <div className="mt-1">
                  <StatusBadge status={contract.status} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">Objeto</p>
                <p className="mt-1">{contract.objeto || '—'}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[var(--font-size-lg)] font-bold text-[var(--primary)]">Itens</h2>
            <div className="space-y-2">
              {contract.itens?.length ? (
                contract.itens.map((item: any) => (
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
                <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Nenhum item.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[var(--font-size-lg)] font-bold text-[var(--primary)]">Financeiro e vigência</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">Valor anual</p>
                <p className="mt-1 font-semibold">
                  {contract.valorAnual != null
                    ? contract.valorAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">Início</p>
                <p className="mt-1 font-semibold">{contract.dataInicio || '—'}</p>
              </div>
              <div>
                <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">Fim original</p>
                <p className="mt-1 font-semibold">{contract.dataFimOrig || '—'}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">Dotações</p>
              {dotacoes?.length ? (
                dotacoes.map((d: any) => (
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
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">Empenhos</p>
              {empenhos?.length ? (
                empenhos.map((e: any) => (
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
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">Publicações</p>
              {publicacoes?.length ? (
                publicacoes.map((p: any) => (
                  <p key={p.id} className="text-[var(--font-size-sm)]">
                    {p.veiculo?.codigo || '—'} · {String(p.dataPublicacao).slice(0, 10)}
                    {p.idPncp ? ` · ${p.idPncp}` : ''}
                  </p>
                ))
              ) : (
                <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Nenhuma publicação.</p>
              )}
            </div>
          </section>
        </Card>

        <Card variant="panel" className="p-[var(--space-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-bold text-[var(--primary)]">Alterações</h2>
          <div className="mt-3 space-y-2">
            {(contract.alteracoes ?? contract.aditivos)?.length ? (
              (contract.alteracoes ??
                contract.aditivos?.map((a: any) => ({
                  id: a.id,
                  tipo: 'ADITIVO',
                  numero: a.numAditivo,
                  eProtocolo: a.protocoloAdit,
                  novaDataFimVigencia: a.novoFimVigencia,
                  valorAcrescido: a.valorAdicional,
                  situacao: 'ASSINADO',
                })) ??
                []
              ).map((a: any) => (
                <div key={a.id ?? a.numero} className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
                  <p className="font-semibold">
                    {a.tipo || 'ADITIVO'} #{a.numero ?? a.numAditivo}
                    {a.eProtocolo || a.protocoloAdit ? ` · ${a.eProtocolo || a.protocoloAdit}` : ''}
                  </p>
                  <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
                    {a.situacao ? `${a.situacao} · ` : ''}
                    Novo fim: {a.novaDataFimVigencia || a.novoFimVigencia || '—'}
                    {(a.valorAcrescido ?? a.valorAdicional) != null
                      ? ` · + ${(a.valorAcrescido ?? a.valorAdicional).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                      : ''}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Nenhuma alteração.</p>
            )}
          </div>
          <p className="mt-[var(--space-md)] text-[var(--font-size-sm)] text-[var(--text-muted)]">
            Compliance Lei 14.133/2021 — simule limites antes de gravar aditivos.
          </p>
        </Card>
      </div>

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
