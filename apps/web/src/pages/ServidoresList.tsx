import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  ConfirmDialog,
  DataTable,
  ErrorState,
  Page,
  type ColumnDef,
  useToast,
} from '@painel/ui';
import { Plus } from 'lucide-react';
import { useServidores, useDeleteServidor, type Servidor } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';
import { useCanWrite } from '../lib/access';
import { useConfirmDialog } from '../lib/useConfirmDialog';
import { maskCpf } from '../lib/masks';
import { useListParams } from '../lib/useListParams';
import { ListSearch } from '../components/ListSearch';

export default function ServidoresList() {
  const { page, pageSize, q, setQ, pagination, onPaginationChange } = useListParams();
  const { data, isLoading, error, refetch } = useServidores({ page, pageSize, q });
  const del = useDeleteServidor();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const canWrite = useCanWrite();

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Servidor desativado.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  const columns: ColumnDef<Servidor>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome',
      enableSorting: false,
      cell: ({ row }) => <span className="font-semibold">{row.original.nome}</span>,
    },
    {
      id: 'cpf',
      header: 'CPF',
      enableSorting: false,
      cell: ({ row }) => (row.original.cpf ? maskCpf(row.original.cpf) : '—'),
    },
    {
      accessorKey: 'cargo',
      header: 'Cargo',
      enableSorting: false,
      cell: ({ row }) => row.original.cargo || '—',
    },
    {
      id: 'acoes',
      header: 'Ações',
      enableSorting: false,
      cell: ({ row }) =>
        canWrite ? (
          <div className="flex gap-2">
            <Link to={`/servidores/${row.original.id}/edit`}>
              <Button size="sm" variant="secondary">
                Editar
              </Button>
            </Link>
            <Button
              size="sm"
              variant="danger"
              onClick={() =>
                confirm.ask(row.original.id, 'Desativar servidor?', 'O registro será marcado como inativo.')
              }
            >
              Desativar
            </Button>
          </div>
        ) : (
          '—'
        ),
    },
  ];

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

  const rows = data?.data ?? [];
  const meta = data?.meta;

  return (
    <Page
      title="Servidores"
      description="Gestores e fiscais de contrato (servidores públicos)."
      actions={
        canWrite ? (
          <Link to="/servidores/new">
            <Button>
              <Plus size={16} /> Novo
            </Button>
          </Link>
        ) : undefined
      }
    >
      <ListSearch key={q} q={q} onSearch={setQ} placeholder="Nome ou CPF" />
      <DataTable
        columns={columns}
        data={rows}
        pageCount={meta?.totalPages ?? 1}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalRows={meta?.total}
        loading={isLoading}
        emptyMessage="Nenhum servidor."
      />

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
