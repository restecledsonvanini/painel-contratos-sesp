import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, StatusBadge, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@painel/ui';
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
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-[#d7dce9] bg-[#f3f3f3] p-6 shadow-sm">
        <div className="flex flex-col gap-4 rounded-[20px] bg-white px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#4c5b8b]/80">Cadastros em andamento</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#1f2937]">Cadastros em andamento</h1>
          </div>
          <div className="inline-flex items-center rounded-full border border-[#d7dce9] bg-white px-4 py-2 text-sm font-semibold text-[#1f2937] shadow-sm">
            ANO: 2025
          </div>
        </div>
      </div>

      <Card className="space-y-8 rounded-[28px] border border-[#d7dce9] bg-[#f3f3f3] p-6 shadow-sm">
        <div className="rounded-[20px] border border-[#dde1e8] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.32em] text-[#4c5b8b]/80">Filtros de cadastros GMS</p>
            <Button variant="primary" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm">
              <span>Filtrar</span>
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-2">
              <Input label="Nº SESP" placeholder="0001" className="bg-white" />
            </div>
            <div className="lg:col-span-3">
              <Input label="e-Protocolo" placeholder="00.000.000-0" className="bg-white" />
            </div>
            <div className="lg:col-span-2">
              <Input label="Nº Licitação" placeholder="0000/0000" className="bg-white" />
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#334155]">FSP</label>
                <select className="w-full rounded-md border border-[#d7dce9] bg-white px-3 py-2 text-sm text-[#334155] shadow-sm outline-none transition focus:border-[#4c5b8b] focus:ring-2 focus:ring-[#4c5b8b]/20">
                  <option>ESCOLHA UMA OPÇÃO</option>
                </select>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#334155]">Fonte Material</label>
                <select className="w-full rounded-md border border-[#d7dce9] bg-white px-3 py-2 text-sm text-[#334155] shadow-sm outline-none transition focus:border-[#4c5b8b] focus:ring-2 focus:ring-[#4c5b8b]/20">
                  <option>ESCOLHA UMA OPÇÃO</option>
                </select>
              </div>
            </div>
            <div className="lg:col-span-1 flex items-end">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#334155]">
                <input type="checkbox" className="h-4 w-4 rounded border-[#d7dce9] text-[#4c5b8b] focus:ring-[#4c5b8b]" />
                Internacional
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#dde1e8] bg-white p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#4c5b8b]/80">Cadastros com pendências</p>
            </div>
            <span className="rounded-full bg-[#f8fafc] px-4 py-2 text-sm font-semibold text-[#475569]">Progresso salvo a cada 10s</span>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-full border-separate border-spacing-0 text-sm">
              <TableHead>
                <TableRow className="bg-[#ffffff]">
                  <TableHeader className="px-4 py-3 font-semibold text-[#475569]">Nº SESP</TableHeader>
                  <TableHeader className="px-4 py-3 font-semibold text-[#475569]">GMS</TableHeader>
                  <TableHeader className="px-4 py-3 font-semibold text-[#475569]">STATUS</TableHeader>
                  <TableHeader className="px-4 py-3 font-semibold text-[#475569]">FSP</TableHeader>
                  <TableHeader className="px-4 py-3 font-semibold text-[#475569]">E-PROTOCOLO</TableHeader>
                  <TableHeader className="px-4 py-3 font-semibold text-[#475569]">Nº LICITAÇÃO</TableHeader>
                  <TableHeader className="px-4 py-3 font-semibold text-[#475569]">INTERNAC.</TableHeader>
                  <TableHeader className="px-4 py-3 font-semibold text-[#475569]">MATERIAL</TableHeader>
                  <TableHeader className="px-4 py-3 font-semibold text-[#475569]">RESPONSÁVEL</TableHeader>
                  <TableHeader className="px-4 py-3 font-semibold text-[#475569]">AÇÃO</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts.length > 0 ? (
                  contracts.map((contract, index) => (
                    <TableRow key={contract?.id ?? index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f4ebe1]'}>
                      <TableCell className="border-t border-[#e2e8f0] px-4 py-3">{contract?.id ?? '0021'}</TableCell>
                      <TableCell className="border-t border-[#e2e8f0] px-4 py-3">{contract?.numGms ?? '-'} / {contract?.anoGms ?? '-'}</TableCell>
                      <TableCell className="border-t border-[#e2e8f0] px-4 py-3">
                        <StatusBadge status={contract?.status ? contract.status.toUpperCase() : 'PEND.'} />
                      </TableCell>
                      <TableCell className="border-t border-[#e2e8f0] px-4 py-3">{contract?.unidadeFsp?.sigla ?? contract?.unidadeFspId ?? 'CB'}</TableCell>
                      <TableCell className="border-t border-[#e2e8f0] px-4 py-3">{contract?.protocoloCabeca ?? '22.161.406-2'}</TableCell>
                      <TableCell className="border-t border-[#e2e8f0] px-4 py-3">3861/2023</TableCell>
                      <TableCell className="border-t border-[#e2e8f0] px-4 py-3">NÃO</TableCell>
                      <TableCell className="border-t border-[#e2e8f0] px-4 py-3">SERVIÇO</TableCell>
                      <TableCell className="border-t border-[#e2e8f0] px-4 py-3">LUCAS Z.</TableCell>
                      <TableCell className="border-t border-[#e2e8f0] px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d7dce9] bg-white text-[#4c5b8b] transition hover:bg-[#eef2ff]" aria-label="Editar">
                            ✎
                          </button>
                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d7dce9] bg-white text-[#e53935] transition hover:bg-[#fee2e2]" aria-label="Excluir">
                            ✕
                          </button>
                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d7dce9] bg-white text-[#424242] transition hover:bg-[#f8fafc]" aria-label="Visualizar">
                            👁
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="border-t border-[#e2e8f0] px-4 py-6 text-center text-sm text-[#475569]" colSpan={10}>
                      Nenhum contrato encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#475569]">Progresso salvo a cada 10s</p>
            <Button variant="primary" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
              Concluir
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
