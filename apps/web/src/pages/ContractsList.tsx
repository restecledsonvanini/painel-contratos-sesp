import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@painel/ui';
import { useContracts, useDeleteContract } from '../hooks/useContracts';

export default function ContractsList() {
  const { data, isLoading, error } = useContracts();
  const deleteContract = useDeleteContract();

  const contracts = Array.isArray(data) ? data.filter(Boolean) : [];

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja realmente excluir este contrato?')) {
      return;
    }

    try {
      await deleteContract.mutateAsync(id);
      alert('Contrato excluído.');
    } catch {
      alert('Falha ao excluir contrato.');
    }
  };

  if (isLoading) return <div>Carregando contratos...</div>;
  if (error) return <div>Falha ao carregar contratos.</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Gestão de contratos</p>
          <h2 className="mt-2 text-3xl font-semibold text-[var(--text)]">Contratos</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" className="rounded-full px-4 py-2">
            Todos
          </Button>
          <Button variant="secondary" className="rounded-full px-4 py-2">
            Ativos
          </Button>
          <Button variant="ghost" className="rounded-full px-4 py-2">
            Vencendo
          </Button>
          <Link
            to="/contracts/new"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--text-inverse)] shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            Novo contrato
          </Link>
        </div>
      </div>

      <Card className="grid gap-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Total de contratos</p>
            <p className="text-3xl font-semibold text-[var(--text)]">{contracts.length}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[var(--border)]">
            <p className="text-sm font-semibold text-[var(--text)]">Visão geral rápida</p>
            <p className="mt-2 text-sm text-slate-500">Acompanhe os contratos ativos, próximos vencimentos e ações do mês.</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl bg-[var(--surface)] shadow-sm">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Protocolo</TableHeader>
                <TableHeader>GMS / Ano</TableHeader>
                <TableHeader>Unidade</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Ações</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.length > 0 ? (
                contracts.map((contract, index: number) => (
                  <TableRow
                    key={contract?.id ?? index}
                    className={index % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-white'}
                  >
                    <TableCell>{contract?.protocoloCabeca || '-'}</TableCell>
                    <TableCell>{contract?.numGms ?? '-'} / {contract?.anoGms ?? '-'}</TableCell>
                    <TableCell>{contract?.unidadeFspId || '-'}</TableCell>
                    <TableCell>
                      <StatusBadge status={contract?.status || 'Ativo'} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={contract?.id ? `/contracts/${contract.id}` : '/contracts'}
                          className="inline-flex rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[var(--text-inverse)] transition hover:bg-[var(--primary-dark)]"
                        >
                          Ver
                        </Link>
                        {contract?.id && (
                          <Link
                            to={`/contracts/${contract.id}/edit`}
                            className="inline-flex rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                          >
                            Editar
                          </Link>
                        )}
                        {contract?.id && (
                          <button
                            type="button"
                            onClick={() => handleDelete(contract.id)}
                            className="inline-flex rounded-xl bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                            disabled={deleteContract.isLoading}
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="border-t border-[var(--border)] text-center" colSpan={5}>
                    Nenhum contrato encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
