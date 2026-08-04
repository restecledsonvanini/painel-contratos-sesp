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
import { useFornecedores, useDeleteFornecedor } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';
import { useConfirmDialog } from '../lib/useConfirmDialog';

export default function FornecedoresList() {
  const { data: fornecedores, isLoading, error, refetch } = useFornecedores();
  const del = useDeleteFornecedor();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Fornecedor excluído.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <Page title="Fornecedores" description="Carregando cadastros...">
        <Skeleton variant="table" lines={6} />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Fornecedores">
        <ErrorState
          title="Falha ao carregar fornecedores"
          message={getErrorMessage(error)}
          code={(error as { code?: string }).code}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Fornecedores"
      description="Cadastro de fornecedores."
      actions={
        <Link to="/fornecedores/new">
          <Button>
            <Plus size={16} /> Novo
          </Button>
        </Link>
      }
    >
      <Card variant="bordered" className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Nome</TableHeader>
                <TableHeader>CNPJ</TableHeader>
                <TableHeader>Ações</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {fornecedores?.length ? (
                fornecedores.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-semibold">{f.nome}</TableCell>
                    <TableCell>{f.cnpj || '—'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`/fornecedores/${f.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            confirm.ask(f.id, 'Excluir fornecedor?', 'Esta ação não pode ser desfeita.')
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
                    Nenhum fornecedor.
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
