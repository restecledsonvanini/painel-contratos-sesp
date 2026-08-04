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
import { useServicos, useDeleteServico } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';
import { useConfirmDialog } from '../lib/useConfirmDialog';

export default function ServicosList() {
  const { data: servicos, isLoading, error, refetch } = useServicos();
  const del = useDeleteServico();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Serviço excluído.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <Page title="Serviços" description="Carregando cadastros...">
        <Skeleton variant="table" lines={6} />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Serviços">
        <ErrorState
          title="Falha ao carregar serviços"
          message={getErrorMessage(error)}
          code={(error as { code?: string }).code}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Serviços"
      description="Catálogo de serviços."
      actions={
        <Link to="/servicos/new">
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
                <TableHeader>Título</TableHeader>
                <TableHeader>Descrição</TableHeader>
                <TableHeader>Ações</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicos?.length ? (
                servicos.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-semibold">{s.titulo}</TableCell>
                    <TableCell>{s.descricao || '—'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`/servicos/${s.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            confirm.ask(s.id, 'Excluir serviço?', 'Esta ação não pode ser desfeita.')
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
                    Nenhum serviço.
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
