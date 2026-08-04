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
import { useUnidadesFsp, useDeleteUnidadeFsp } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';
import { useConfirmDialog } from '../lib/useConfirmDialog';

export default function UnidadesFspList() {
  const { data: unidades, isLoading, error, refetch } = useUnidadesFsp();
  const del = useDeleteUnidadeFsp();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Unidade FSP excluída.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <Page title="Unidades FSP" description="Carregando cadastros...">
        <Skeleton variant="table" lines={6} />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Unidades FSP">
        <ErrorState
          title="Falha ao carregar unidades FSP"
          message={getErrorMessage(error)}
          code={(error as { code?: string }).code}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Unidades FSP"
      description="Forças e unidades de segurança pública."
      actions={
        <Link to="/unidades-fsp/new">
          <Button>
            <Plus size={16} /> Nova
          </Button>
        </Link>
      }
    >
      <Card variant="bordered" className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Sigla</TableHeader>
                <TableHeader>Nome</TableHeader>
                <TableHeader>Ações</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {unidades?.length ? (
                unidades.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-semibold">{u.sigla}</TableCell>
                    <TableCell>{u.nome}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`/unidades-fsp/${u.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            confirm.ask(u.id, 'Excluir unidade FSP?', 'Esta ação não pode ser desfeita.')
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
                    Nenhuma unidade.
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
