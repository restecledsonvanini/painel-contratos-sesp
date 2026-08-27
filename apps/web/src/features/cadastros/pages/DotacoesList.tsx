import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { http, getErrorMessage } from '../../../lib/http';
import { useCanWrite } from '../../../lib/access';
import { useConfirmDialog } from '../../../lib/useConfirmDialog';
import { invalidateDotacoes } from '../../../lib/invalidate';
import { parseListResponse } from '../../../lib/listResponse';
import { useListParams } from '../../../lib/useListParams';
import { qk } from '../../../lib/queryKeys';
import { ListSearch } from '../../../components/ListSearch';
import type { DotacaoDTO } from '@painel/schema';

export default function DotacoesList() {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const canWrite = useCanWrite();
  const { page, pageSize, q, setQ, pagination, onPaginationChange } = useListParams();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...qk.dotacoes, { page, pageSize, q }],
    queryFn: async () => {
      const raw = (
        await http.get<unknown>('/dotacoes', {
          params: { page, pageSize, q: q || undefined },
        })
      ).data;
      return parseListResponse<DotacaoDTO>(raw, page, pageSize);
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => (await http.delete(`/dotacoes/${id}`)).data,
    onSuccess: () => invalidateDotacoes(qc),
  });

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Dotação excluída.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  const columns: ColumnDef<DotacaoDTO>[] = [
    {
      accessorKey: 'exercicio',
      header: 'Exercício',
      enableSorting: false,
    },
    {
      accessorKey: 'codigo',
      header: 'Código',
      enableSorting: false,
      cell: ({ row }) => <span className="font-semibold">{row.original.codigo}</span>,
    },
    {
      id: 'natureza',
      header: 'Natureza',
      enableSorting: false,
      cell: ({ row }) =>
        row.original.naturezaDespesa?.label || row.original.naturezaDespesa?.codigo || '—',
    },
    {
      id: 'fonte',
      header: 'Fonte',
      enableSorting: false,
      cell: ({ row }) => row.original.fonteRecurso?.label || row.original.fonteRecurso?.codigo || '—',
    },
    {
      accessorKey: 'descricao',
      header: 'Descrição',
      enableSorting: false,
      cell: ({ row }) => row.original.descricao || '—',
    },
    {
      id: 'acoes',
      header: 'Ações',
      enableSorting: false,
      cell: ({ row }) =>
        canWrite ? (
          <div className="flex justify-end gap-1">
            <IconButton label="Editar" to={`/dotacoes/${row.original.id}/edit`}>
              <Pencil size={16} />
            </IconButton>
            <IconButton
              label="Excluir"
              variant="danger"
              onClick={() =>
                confirm.ask(
                  row.original.id,
                  'Excluir dotação?',
                  `Remover ${row.original.codigo}/${row.original.exercicio}. Vínculos com contratos podem impedir a exclusão.`,
                )
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
      <Page title="Dotações orçamentárias">
        <ErrorState
          title="Falha ao carregar"
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
      title="Dotações orçamentárias"
      description="Natureza de despesa e fonte de recurso por exercício."
      actions={
        canWrite ? (
          <Button to="/dotacoes/new">
            <Plus size={16} /> Nova dotação
          </Button>
        ) : undefined
      }
    >
      <ListSearch key={q} q={q} onSearch={setQ} placeholder="Código ou descrição" />
      <DataTable
        columns={columns}
        data={rows}
        pageCount={meta?.totalPages ?? 1}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalRows={meta?.total}
        loading={isLoading}
        emptyMessage="Nenhuma dotação cadastrada."
      />

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
