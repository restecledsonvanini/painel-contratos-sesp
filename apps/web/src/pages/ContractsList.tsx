import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  Page,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@painel/ui';
import { Plus } from 'lucide-react';
import { useContracts, useDeleteContract } from '../hooks/useContracts';

export default function ContractsList() {
  const { data, isLoading, error } = useContracts();
  const deleteContract = useDeleteContract();
  const contracts = Array.isArray(data) ? data.filter(Boolean) : [];

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja realmente excluir este contrato?')) return;
    try {
      await deleteContract.mutateAsync(id);
    } catch {
      alert('Falha ao excluir contrato.');
    }
  };

  if (isLoading) {
    return (
      <Page title="Contratos" description="Carregando cadastros...">
        <Card className="p-[var(--space-lg)] text-[var(--text-muted)]">Carregando contratos...</Card>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Contratos">
        <Card className="p-[var(--space-lg)] text-[var(--danger)]">
          Falha ao carregar contratos. Verifique se a API está rodando (`npm run api:dev`).
        </Card>
      </Page>
    );
  }

  return (
    <Page
      title="Contratos"
      description="Lista e gestão dos contratos cadastrados."
      actions={
        <Link to="/contracts/new">
          <Button>
            <Plus size={16} />
            Novo contrato
          </Button>
        </Link>
      }
    >
      <Card variant="bordered" className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Protocolo</TableHeader>
                <TableHeader>GMS/Ano</TableHeader>
                <TableHeader>Unidade</TableHeader>
                <TableHeader>Empresa</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Valor anual</TableHeader>
                <TableHeader>Ações</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.length > 0 ? (
                contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-semibold">
                      <Link className="text-[var(--primary)] hover:underline" to={`/contracts/${contract.id}`}>
                        {contract.protocoloCabeca || '—'}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {contract.numGms}/{contract.anoGms}
                    </TableCell>
                    <TableCell>{contract.unidadeFsp?.sigla || contract.unidadeFspId}</TableCell>
                    <TableCell>{contract.empresaName || contract.empresaId || '—'}</TableCell>
                    <TableCell>
                      <StatusBadge status={contract.status} />
                    </TableCell>
                    <TableCell>
                      {contract.valorAnual != null
                        ? contract.valorAnual.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/contracts/${contract.id}`}>
                          <Button size="sm" variant="secondary">
                            Ver
                          </Button>
                        </Link>
                        <Link to={`/contracts/${contract.id}/edit`}>
                          <Button size="sm" variant="ghost">
                            Editar
                          </Button>
                        </Link>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(contract.id)}>
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-[var(--text-muted)]">
                    Nenhum contrato cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </Page>
  );
}
