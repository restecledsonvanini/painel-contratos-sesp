import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  ConfirmDialog,
  ErrorState,
  Page,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
} from '@painel/ui';
import { Plus } from 'lucide-react';
import { useContracts, useDeleteContract } from '../hooks/useContracts';
import { getErrorMessage } from '../lib/http';
import { useConfirmDialog } from '../lib/useConfirmDialog';

export default function ContractsList() {
  const { data, isLoading, error, refetch } = useContracts();
  const deleteContract = useDeleteContract();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const contracts = Array.isArray(data) ? data.filter(Boolean) : [];

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await deleteContract.mutateAsync(confirm.pending.payload);
      toast.success('Contrato excluído.');
    } catch (err) {
      toast.error('Falha ao excluir contrato.', getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <Page title="Contratos" description="Carregando cadastros...">
        <Skeleton variant="table" lines={6} />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Contratos">
        <ErrorState
          title="Falha ao carregar contratos"
          message={getErrorMessage(error)}
          code={(error as { code?: string }).code}
          onRetry={() => refetch()}
        />
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
                <TableHeader>Fornecedor</TableHeader>
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
                    <TableCell>
                      {contract.fornecedorName ||
                        contract.empresaName ||
                        contract.fornecedorId ||
                        contract.empresaId ||
                        '—'}
                    </TableCell>
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
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            confirm.ask(contract.id, 'Excluir contrato?', 'Esta ação não pode ser desfeita.')
                          }
                        >
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
