import React, { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Card,
  ConfirmDialog,
  ErrorState,
  Page,
  Pagination,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
} from '@painel/ui';
import { Download, Plus, X } from 'lucide-react';
import { useContracts, useDeleteContract, type Contract } from '../hooks/useContracts';
import { downloadApiFile } from '../lib/download';
import { formatCurrencyFromReais } from '../lib/format';
import { getErrorMessage } from '../lib/http';
import { authorLabel, formatRelativePast } from '../lib/formatRelative';
import { useConfirmDialog } from '../lib/useConfirmDialog';
import { useCanAct } from '../lib/access';

function diasAteFim(contract: Contract): number | null {
  const raw = contract.dataFimVigenciaOriginal || contract.dataFimOrig;
  if (!raw) return null;
  const end = new Date(String(raw).slice(0, 10) + 'T00:00:00Z');
  const today = new Date();
  const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const finish = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  return Math.round((finish - start) / 86_400_000);
}

function matchVencimento(dias: number | null, filtro: string): boolean {
  if (dias == null) return false;
  if (filtro === 'vencidos') return dias < 0;
  if (filtro === '0-60') return dias >= 0 && dias <= 60;
  if (filtro === '0-30') return dias >= 0 && dias <= 30;
  if (filtro === '31-60') return dias >= 31 && dias <= 60;
  if (filtro === '61-90') return dias >= 61 && dias <= 90;
  if (filtro === '91-120') return dias >= 91 && dias <= 120;
  if (filtro === '121-180') return dias >= 121 && dias <= 180;
  if (filtro === '>180') return dias > 180;
  return true;
}

export default function ContractsList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const page = Math.max(1, Number(searchParams.get('page') || 1) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || 25) || 25));
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

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    setSearchParams(next);
  };

  const setPageSize = (nextSize: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('pageSize', String(nextSize));
    next.set('page', '1');
    setSearchParams(next);
  };

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

  if (isLoading) {
    return (
      <Page title="Contratos" description="Carregando cadastros...">
        <Skeleton variant="table" lines={6} />
      </Page>
    );
  }

  if (error) {
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
            <Link to="/contracts/new">
              <Button>
                <Plus size={16} />
                Novo contrato
              </Button>
            </Link>
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

      <Card variant="bordered" className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="table-as-cards">
            <TableHead>
              <TableRow>
                <TableHeader>Protocolo</TableHeader>
                <TableHeader>GMS/Ano</TableHeader>
                <TableHeader>Unidade</TableHeader>
                <TableHeader>Fornecedor</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Valor anual</TableHeader>
                <TableHeader>Última alteração</TableHeader>
                <TableHeader>Ações</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.length > 0 ? (
                contracts.map((contract) => {
                  const detailTo = `/contracts/${contract.id}`;
                  return (
                  <TableRow
                    key={contract.id}
                    className="cursor-pointer"
                    role="link"
                    tabIndex={0}
                    aria-label={`Abrir contrato ${contract.protocoloCabeca || `${contract.numGms}/${contract.anoGms}`}`}
                    onClick={() => navigate(detailTo)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(detailTo);
                      }
                    }}
                  >
                    <TableCell className="font-semibold" data-label="Protocolo">
                      <Link
                        className="text-[var(--primary)] hover:underline"
                        to={detailTo}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {contract.protocoloCabeca || '—'}
                      </Link>
                    </TableCell>
                    <TableCell data-label="GMS/Ano">
                      {contract.numGms}/{contract.anoGms}
                    </TableCell>
                    <TableCell data-label="Unidade">
                      {[
                        contract.unidadeGestora?.sigla,
                        contract.subunidade?.sigla,
                      ]
                        .filter(Boolean)
                        .join(' / ') ||
                        contract.unidadeGestoraId ||
                        '—'}
                    </TableCell>
                    <TableCell data-label="Fornecedor">
                      {contract.fornecedorName || contract.fornecedorId || '—'}
                    </TableCell>
                    <TableCell data-label="Status">
                      <StatusBadge status={contract.status || contract.situacao?.toLowerCase()} />
                    </TableCell>
                    <TableCell data-label="Valor anual">
                      {formatCurrencyFromReais(contract.valorAnual)}
                    </TableCell>
                    <TableCell data-label="Última alteração">
                      <span className="text-[var(--font-size-xs)] text-[var(--text-muted)]">
                        {authorLabel(contract.atualizadoPor)} ·{' '}
                        {formatRelativePast(contract.updatedAt)}
                      </span>
                    </TableCell>
                    <TableCell
                      data-label="Ações"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-wrap gap-2">
                        <Link to={detailTo}>
                          <Button size="sm" variant="secondary">
                            Ver
                          </Button>
                        </Link>
                        {canWrite ? (
                          <>
                            <Link to={`/contracts/${contract.id}/edit`}>
                              <Button size="sm" variant="ghost">
                                Editar
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                confirm.ask(
                                  contract.id,
                                  'Excluir contrato?',
                                  'Esta ação não pode ser desfeita.',
                                )
                              }
                            >
                              Excluir
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-[var(--text-muted)]">
                    Nenhum contrato {activeFilters.length ? 'com esses filtros' : 'cadastrado'}.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {meta && meta.totalPages > 1 ? (
        <Pagination
          pageIndex={page - 1}
          pageSize={pageSize}
          pageCount={meta.totalPages}
          totalRows={meta.total}
          onPageChange={(pageIndex) => setPage(pageIndex + 1)}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50, 100]}
          className="mt-[var(--space-md)]"
        />
      ) : null}

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
