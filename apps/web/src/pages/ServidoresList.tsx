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
import { useServidores, useDeleteServidor } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';
import { useConfirmDialog } from '../lib/useConfirmDialog';
import { maskCpf } from '../lib/masks';

export default function ServidoresList() {
  const { data: servidores, isLoading, error, refetch } = useServidores();
  const del = useDeleteServidor();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Servidor desativado.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <Page title="Servidores" description="Carregando cadastros...">
        <Skeleton variant="table" lines={6} />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Servidores">
        <ErrorState
          title="Falha ao carregar servidores"
          message={getErrorMessage(error)}
          code={(error as { code?: string }).code}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Servidores"
      description="Gestores e fiscais de contrato (servidores públicos)."
      actions={
        <Link to="/servidores/new">
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
                <TableHeader>CPF</TableHeader>
                <TableHeader>Cargo</TableHeader>
                <TableHeader>Ações</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {servidores?.length ? (
                servidores.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-semibold">{s.nome}</TableCell>
                    <TableCell>{s.cpf ? maskCpf(s.cpf) : '—'}</TableCell>
                    <TableCell>{s.cargo || '—'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`/servidores/${s.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            confirm.ask(s.id, 'Desativar servidor?', 'O registro será marcado como inativo.')
                          }
                        >
                          Desativar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-[var(--text-muted)]">
                    Nenhum servidor.
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
        confirmLabel="Desativar"
        onConfirm={handleDelete}
        loading={del.isPending}
      />
    </Page>
  );
}
