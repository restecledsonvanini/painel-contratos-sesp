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
import { useEntidadesGestoras, useDeleteEntidadeGestora } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';
import { useConfirmDialog } from '../lib/useConfirmDialog';

export default function EntidadesGestorasList() {
  const { data: entidades, isLoading, error, refetch } = useEntidadesGestoras();
  const del = useDeleteEntidadeGestora();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Entidade excluída.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <Page title="Entidades gestoras" description="Carregando cadastros...">
        <Skeleton variant="table" lines={6} />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Entidades gestoras">
        <ErrorState
          title="Falha ao carregar entidades gestoras"
          message={getErrorMessage(error)}
          code={(error as { code?: string }).code}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Entidades gestoras"
      description="Gestores e fiscais de contrato."
      actions={
        <Link to="/entidades-gestoras/new">
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
                <TableHeader>Nome</TableHeader>
                <TableHeader>CPF</TableHeader>
                <TableHeader>Ações</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {entidades?.length ? (
                entidades.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-semibold">{e.nome}</TableCell>
                    <TableCell>{e.cpf}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`/entidades-gestoras/${e.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            confirm.ask(e.id, 'Excluir entidade?', 'Esta ação não pode ser desfeita.')
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
                    Nenhuma entidade.
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
