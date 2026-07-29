import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useContract, useDeleteContract } from '../hooks/useContracts';
import { Button, Card, StatusBadge } from '@painel/ui';

export default function ContractDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: contract, isLoading, error } = useContract(id);
  const deleteContract = useDeleteContract();

  const handleDelete = async () => {
    if (!id || !contract) return;

    if (!window.confirm('Deseja excluir este contrato?')) {
      return;
    }

    try {
      await deleteContract.mutateAsync(id);
      navigate('/contracts');
    } catch {
      alert('Falha ao excluir contrato.');
    }
  };

  if (isLoading) return <div>Carregando contrato...</div>;
  if (error || !contract) return <div>Contrato não encontrado.</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Detalhe do contrato</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--text)]">{contract.protocoloCabeca || `Contrato ${contract.id}`}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/contracts">
            <Button variant="ghost">Voltar</Button>
          </Link>
          {id && (
            <Link to={`/contracts/${id}/edit`}>
              <Button variant="secondary">Editar</Button>
            </Link>
          )}
          <Button variant="ghost" type="button" onClick={handleDelete} disabled={deleteContract.isLoading}>
            {deleteContract.isLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>

      <Card className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <section className="space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--text)]">Dados principais</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Protocolo</p>
                <p className="mt-1 text-[var(--text)]">{contract.protocoloCabeca || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">GMS / Ano</p>
                <p className="mt-1 text-[var(--text)]">{contract.numGms}/{contract.anoGms}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Unidade</p>
                <p className="mt-1 text-[var(--text)]">{contract.unidadeFspId}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <div className="mt-1">
                  <StatusBadge status={contract.status || 'Ativo'} />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--text)]">Financeiro</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Valor anual</p>
                <p className="mt-1 text-[var(--text)]">R$ {contract.valorAnual?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Data início</p>
                <p className="mt-1 text-[var(--text)]">{contract.dataInicio || '-'}</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <Card className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Resumo</p>
            <p className="mt-3 text-[var(--text)] leading-6">Visualize o contrato, acompanhe aditivos e mantenha o compliance alinhado com as exigências da lei 14.133/2021.</p>
          </Card>
          <Card className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Aditivos</p>
            {contract.aditivos && contract.aditivos.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {contract.aditivos.map((aditivo, index) => (
                  <li key={index} className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="font-semibold text-[var(--text)]">Aditivo {aditivo.numAditivo}</p>
                    <p className="text-sm text-slate-500">{aditivo.protocoloAdit}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Nenhum aditivo registrado.</p>
            )}
          </Card>
        </aside>
      </Card>
    </div>
  );
}
