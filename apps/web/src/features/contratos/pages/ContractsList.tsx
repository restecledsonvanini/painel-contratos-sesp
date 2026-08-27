import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Button,
  ConfirmDialog,
  DataTable,
  ErrorState,
  IconButton,
  Page,
  Skeleton,
  StatusBadge,
  useToast,
  type ColumnDef,
} from '@painel/ui';
import { Download, Eye, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useContracts, useDeleteContract, type Contract } from '../../../hooks/useContracts';
import { downloadApiFile } from '../../../lib/download';
import { formatCurrencyFromReais } from '../../../lib/format';
import { getErrorMessage } from '../../../lib/http';
import { authorLabel, formatRelativePast } from '../../../lib/formatRelative';
import { useConfirmDialog } from '../../../lib/useConfirmDialog';
import { useCanAct } from '../../../lib/access';
import { useListParams } from '../../../lib/useListParams';

export default function ContractsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, pageSize, pagination, onPaginationChange } = useListParams();
  const deleteContract = useDeleteContract();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const canWrite = useCanAct('ANALISTA');

  const filterKey = searchParams.toString();
  const filters = useMemo(
    () => ({
      situacao: searchParams.get('situacao') || '',
      vencimento: searchParams.get('vencimento') || '',
      orgaoId: searchParams.get('orgaoId') || '',
      fornecedorId: searchParams.get('fornecedorId') || '',
      modalidade: searchParams.get('modalidade') || '',
      pilar: searchParams.get('pilar') || '',
      responsavelId: searchParams.get('responsavelId') || '',
      publicacao: searchParams.get('publicacao') || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filterKey captura searchParams
    [filterKey],
  );
  const { data, isLoading, error, refetch } = useContracts({ ...filters, page, pageSize });
  const contracts = data?.data ?? [];
  const meta = data?.meta;

  React.useEffect(() => {
    const payload: Record<string, string> = {};
    for (const [k, v] of Object.entries(filters)) {
      if (v) payload[k] = v;
    }
    try {
      sessionStorage.setItem('contracts:lastFilters', JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [filters]);

  const activeFilters = Object.entries(filters).filter(([, v]) => Boolean(v));

  const clearFilter = (key: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const clearAll = () => setSearchParams({});

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await deleteContract.mutateAsync(confirm.pending.payload);
      toast.success('Contrato excluído.');
    } catch (err) {
      toast.error('Falha ao excluir contrato.', getErrorMessage(err));
    }
  };

  async function exportAcervo(formato: 'csv' | 'xlsx') {
    try {
      const q = new URLSearchParams();
      for (const [k, v] of Object.entries(filters)) {
        if (v) q.set(k, v);
      }
      const qs = q.toString();
      await downloadApiFile(
        `/exports/contratos.${formato}${qs ? `?${qs}` : ''}`,
        `contratos.${formato}`,
      );
      toast.success(`Exportação ${formato.toUpperCase()} iniciada.`);
    } catch (err) {
      toast.error('Falha ao exportar.', getErrorMessage(err));
    }
  }

  const columns: ColumnDef<Contract>[] = useMemo(
    () => [
      {
        id: 'protocolo',
        header: 'Protocolo',
        enableSorting: false,
        cell: ({ row }) => {
          const c = row.original;
          const label = c.protocoloCabeca || `${c.numGms}/${c.anoGms}`;
          return (
            <Link
              className="font-semibold text-[var(--primary)] hover:underline"
              to={`/contracts/${c.id}`}
              aria-label={`Abrir contrato ${label}`}
            >
              {c.protocoloCabeca || '—'}
            </Link>
          );
        },
      },
      {
        id: 'gms',
        header: 'GMS/Ano',
        enableSorting: false,
        cell: ({ row }) => `${row.original.numGms}/${row.original.anoGms}`,
      },
      {
        id: 'unidade',
        header: 'Unidade',
        enableSorting: false,
        cell: ({ row }) =>
          [row.original.unidadeGestora?.sigla, row.original.subunidade?.sigla]
            .filter(Boolean)
            .join(' / ') ||
          row.original.unidadeGestoraId ||
          '—',
      },
      {
        id: 'fornecedor',
        header: 'Fornecedor',
        enableSorting: false,
        cell: ({ row }) => row.original.fornecedorName || row.original.fornecedorId || '—',
      },
      {
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ row }) => (
          <StatusBadge status={row.original.status || row.original.situacao?.toLowerCase()} />
        ),
      },
      {
        id: 'valor',
        header: 'Valor anual',
        enableSorting: false,
        cell: ({ row }) => formatCurrencyFromReais(row.original.valorAnual),
      },
      {
        id: 'atualizado',
        header: 'Última alteração',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-[var(--font-size-xs)] text-[var(--text-muted)]">
            {authorLabel(row.original.atualizadoPor)} · {formatRelativePast(row.original.updatedAt)}
          </span>
        ),
      },
      {
        id: 'acoes',
        header: 'Ações',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap justify-end gap-1">
            <IconButton label="Ver" to={`/contracts/${row.original.id}`}>
              <Eye size={16} />
            </IconButton>
            {canWrite ? (
              <>
                <IconButton label="Editar" to={`/contracts/${row.original.id}/edit`}>
                  <Pencil size={16} />
                </IconButton>
                <IconButton
                  label="Excluir"
                  variant="danger"
                  onClick={() =>
                    confirm.ask(
                      row.original.id,
                      'Excluir contrato?',
                      'Esta ação não pode ser desfeita.',
                    )
                  }
                >
                  <Trash2 size={16} />
                </IconButton>
              </>
            ) : null}
          </div>
        ),
      },
    ],
    [canWrite, confirm],
  );

  if (error && !data) {
    return (
      <Page title="Contratos">
        <ErrorState
          title="Falha ao carregar contratos"
          message={getErrorMessage(error)}
          code={(error as { code?: string }).code}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Contratos"
      description={
        meta
          ? `${meta.total} contrato${meta.total === 1 ? '' : 's'}${
              activeFilters.length ? ' (filtros do dashboard)' : ''
            }.`
          : 'Lista e gestão dos contratos cadastrados.'
      }
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => void exportAcervo('csv')}>
            <Download size={16} />
            CSV
          </Button>
          <Button variant="ghost" onClick={() => void exportAcervo('xlsx')}>
            <Download size={16} />
            XLSX
          </Button>
          {canWrite ? (
            <Button to="/contracts/new">
              <Plus size={16} />
              Novo contrato
            </Button>
          ) : null}
        </div>
      }
    >
      {activeFilters.length > 0 && (
        <div className="mb-[var(--space-md)] flex flex-wrap items-center gap-2">
          {activeFilters.map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => clearFilter(key)}
              className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-1 text-[var(--font-size-xs)] font-semibold"
            >
              {key}={value}
              <X size={12} aria-hidden />
            </button>
          ))}
          <Button size="sm" variant="ghost" onClick={clearAll}>
            Limpar filtros
          </Button>
        </div>
      )}

      {isLoading && !data ? (
        <Skeleton variant="table" lines={6} />
      ) : (
        <DataTable
          columns={columns}
          data={contracts}
          pageCount={meta?.totalPages ?? 1}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          totalRows={meta?.total}
          loading={isLoading}
          emptyMessage={
            activeFilters.length ? 'Nenhum contrato com esses filtros.' : 'Nenhum contrato cadastrado.'
          }
          pageSizeOptions={[10, 25, 50, 100]}
        />
      )}

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.onOpenChange}
        title={confirm.pending?.title ?? 'Confirmar'}
        description={confirm.pending?.description}
        variant="danger"
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        loading={deleteContract.isPending}
      />
    </Page>
  );
}
