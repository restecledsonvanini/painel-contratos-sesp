import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useContract, useDeleteContract } from '../hooks/useContracts';
import { Button, Card, Page, StatusBadge } from '@painel/ui';

export default function ContractDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: contract, isLoading, error } = useContract(id);
  const deleteContract = useDeleteContract();
  const deleting = Boolean((deleteContract as any).isPending ?? (deleteContract as any).isLoading);

  const handleDelete = async () => {
    if (!id || !contract) return;
    if (!window.confirm('Deseja excluir este contrato?')) return;
    try {
      await deleteContract.mutateAsync(id);
      navigate('/contracts');
    } catch {
      alert('Falha ao excluir contrato.');
    }
  };

  if (isLoading) {
    return (
      <Page title="Contrato">
        <Card className="p-[var(--space-lg)]">Carregando...</Card>
      </Page>
    );
  }

  if (error || !contract) {
    return (
      <Page title="Contrato">
        <Card className="p-[var(--space-lg)] text-[var(--danger)]">Contrato não encontrado.</Card>
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
          <Button variant="danger" type="button" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Excluindo...' : 'Excluir'}
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
          </section>
        </Card>

        <Card variant="panel" className="p-[var(--space-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-bold text-[var(--primary)]">Aditivos</h2>
          <div className="mt-3 space-y-2">
            {contract.aditivos?.length ? (
              contract.aditivos.map((a, idx) => (
                <div key={idx} className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
                  <p className="font-semibold">
                    #{a.numAditivo} · {a.protocoloAdit}
                  </p>
                  <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
                    Novo fim: {a.novoFimVigencia || '—'}
                    {a.valorAdicional != null
                      ? ` · + ${a.valorAdicional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                      : ''}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Nenhum aditivo.</p>
            )}
          </div>
          <p className="mt-[var(--space-md)] text-[var(--font-size-sm)] text-[var(--text-muted)]">
            Compliance Lei 14.133/2021 — acompanhe vigência e segregação gestor/fiscal.
          </p>
        </Card>
      </div>
    </Page>
  );
}
