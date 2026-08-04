import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  ConfirmDialog,
  ErrorState,
  Page,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
} from '@painel/ui';
import { Plus } from 'lucide-react';
import { useEmpresas, useDeleteEmpresa } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';
import { useConfirmDialog } from '../lib/useConfirmDialog';

export default function EmpresasList() {
  const { data: empresas, isLoading, error, refetch } = useEmpresas();
  const del = useDeleteEmpresa();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Empresa excluída.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <Page title="Empresas" description="Carregando cadastros...">
        <Skeleton variant="table" lines={6} />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Empresas">
        <ErrorState
          title="Falha ao carregar empresas"
          message={getErrorMessage(error)}
          code={(error as { code?: string }).code}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Empresas"
      description="Cadastro de empresas contratadas (CNPJ)."
      actions={
        <Link to="/empresas/new">
          <Button>
            <Plus size={16} />
            Nova empresa
          </Button>
        </Link>
      }
    >
      <Card variant="bordered" className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>CNPJ</TableHeader>
                <TableHeader>Razão social</TableHeader>
                <TableHeader>Ações</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {empresas && empresas.length > 0 ? (
                empresas.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.cnpj}</TableCell>
                    <TableCell className="font-semibold">{e.razaoSocial}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/empresas/${e.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            confirm.ask(e.id, 'Excluir empresa?', 'Esta ação não pode ser desfeita.')
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
                  <TableCell colSpan={3} className="text-[var(--text-muted)]">
                    Nenhuma empresa encontrada.
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
        loading={del.isPending}
      />
    </Page>
  );
}
