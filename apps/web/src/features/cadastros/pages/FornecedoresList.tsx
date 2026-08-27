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
import { useFornecedores, useDeleteFornecedor, type Fornecedor } from '../../../hooks/useReferences';
import { getErrorMessage } from '../../../lib/http';
import { useCanWrite } from '../../../lib/access';
import { useConfirmDialog } from '../../../lib/useConfirmDialog';
import { maskCnpj, maskCpf } from '../../../lib/masks';
import { useListParams } from '../../../lib/useListParams';
import { ListSearch } from '../../../components/ListSearch';

function formatDoc(documento: string, tipo?: string) {
  if (!documento) return '—';
  return tipo === 'FISICA' ? maskCpf(documento) : maskCnpj(documento);
}

export default function FornecedoresList() {
  const { page, pageSize, q, setQ, pagination, onPaginationChange } = useListParams();
  const { data, isLoading, error, refetch } = useFornecedores({ page, pageSize, q });
  const del = useDeleteFornecedor();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const canWrite = useCanWrite();

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Fornecedor desativado.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  const columns: ColumnDef<Fornecedor>[] = [
    {
      id: 'razao',
      header: 'Razão social',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.razaoSocial || row.original.nomeFantasia}</span>
      ),
    },
    {
      id: 'documento',
      header: 'Documento',
      enableSorting: false,
      cell: ({ row }) => formatDoc(row.original.documento || '', row.original.tipoPessoa),
    },
    {
      accessorKey: 'situacao',
      header: 'Situação',
      enableSorting: false,
      cell: ({ row }) => row.original.situacao || 'ATIVO',
    },
    {
      id: 'contatos',
      header: 'Contatos',
      enableSorting: false,
      cell: ({ row }) => row.original._count?.contatos ?? row.original.contatos?.length ?? 0,
    },
    {
      id: 'sancoes',
      header: 'Sanções',
      enableSorting: false,
      cell: ({ row }) => {
        const n = row.original._count?.sancoes ?? row.original.sancoes?.length ?? 0;
        return n > 0 ? (
          <span className="font-medium text-[var(--danger, #b91c1c)]">{n}</span>
        ) : (
          0
        );
      },
    },
    {
      id: 'acoes',
      header: 'Ações',
      enableSorting: false,
      cell: ({ row }) =>
        canWrite ? (
          <div className="flex justify-end gap-1">
            <Link to={`/fornecedores/${row.original.id}/edit`}>
              <IconButton label="Editar">
                <Pencil size={16} />
              </IconButton>
            </Link>
            <IconButton
              label="Desativar"
              variant="danger"
              onClick={() =>
                confirm.ask(row.original.id, 'Desativar fornecedor?', 'O registro será marcado como inativo.')
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

  const rows = data?.data ?? [];
  const meta = data?.meta;

  return (
    <Page
      title="Fornecedores"
      description="Cadastro unificado de contratadas (PJ/PF), com contatos e sanções."
      actions={
        canWrite ? (
          <Link to="/fornecedores/new">
            <Button>
              <Plus size={16} /> Novo
            </Button>
          </Link>
        ) : undefined
      }
    >
      <ListSearch
        key={q}
        q={q}
        onSearch={setQ}
        placeholder="Razão social ou documento"
      />
      <DataTable
        columns={columns}
        data={rows}
        pageCount={meta?.totalPages ?? 1}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalRows={meta?.total}
        loading={isLoading}
        emptyMessage="Nenhum fornecedor."
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
