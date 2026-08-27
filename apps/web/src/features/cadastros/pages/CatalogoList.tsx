import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  ConfirmDialog,
  DataTable,
  ErrorState,
  IconButton,
  Page,
  type ColumnDef,
  useToast,
} from '@painel/ui';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http, getErrorMessage } from '../../../lib/http';
import { useCanWrite } from '../../../lib/access';
import { useConfirmDialog } from '../../../lib/useConfirmDialog';
import { parseListResponse } from '../../../lib/listResponse';
import { useListParams } from '../../../lib/useListParams';
import { qk } from '../../../lib/queryKeys';
import { ListSearch } from '../../../components/ListSearch';
import type { CatalogoItemDTO } from '@painel/schema';

export default function CatalogoList() {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const canWrite = useCanWrite();
  const { page, pageSize, q, setQ, pagination, onPaginationChange } = useListParams();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...qk.catalogoItens, { page, pageSize, q }],
    queryFn: async () => {
      const raw = (
        await http.get<unknown>('/catalogo-itens', {
          params: { page, pageSize, q: q || undefined },
        })
      ).data;
      return parseListResponse<CatalogoItemDTO>(raw, page, pageSize);
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => (await http.delete(`/catalogo-itens/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.catalogoItens });
      qc.invalidateQueries({ queryKey: ['lookups'] });
    },
  });

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Item desativado.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  const columns: ColumnDef<CatalogoItemDTO>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome',
      enableSorting: false,
      cell: ({ row }) => <span className="font-semibold">{row.original.nome}</span>,
    },
    {
      id: 'categoria',
      header: 'Categoria',
      enableSorting: false,
      cell: ({ row }) => row.original.categoriaItem?.label || '—',
    },
    {
      id: 'unidade',
      header: 'Unidade',
      enableSorting: false,
      cell: ({ row }) => row.original.unidadeMedidaPadrao?.codigo || '—',
    },
    {
      id: 'acoes',
      header: 'Ações',
      enableSorting: false,
      cell: ({ row }) =>
        canWrite ? (
          <div className="flex justify-end gap-1">
            <Link to={`/catalogo-itens/${row.original.id}/edit`}>
              <IconButton label="Editar">
                <Pencil size={16} />
              </IconButton>
            </Link>
            <IconButton
              label="Desativar"
              variant="danger"
              onClick={() =>
                confirm.ask(row.original.id, 'Desativar item?', 'O item deixa de aparecer nas listas.')
              }
            >
              <Trash2 size={16} />
            </IconButton>
          </div>
        ) : (
          '—'
        ),
    },
  ];

  if (error) {
    return (
      <Page title="Catálogo de itens">
        <ErrorState
          title="Falha ao carregar catálogo"
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  const rows = data?.data ?? [];
  const meta = data?.meta;

  return (
    <Page
      title="Catálogo de itens"
      description="Itens reutilizáveis nos contratos (viaturas, postos, alimentos…)."
      actions={
        canWrite ? (
          <Link to="/catalogo-itens/new">
            <Button>
              <Plus size={16} /> Novo
            </Button>
          </Link>
        ) : undefined
      }
    >
      <ListSearch key={q} q={q} onSearch={setQ} placeholder="Nome do item" />
      <DataTable
        columns={columns}
        data={rows}
        pageCount={meta?.totalPages ?? 1}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalRows={meta?.total}
        loading={isLoading}
        emptyMessage="Nenhum item no catálogo."
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
