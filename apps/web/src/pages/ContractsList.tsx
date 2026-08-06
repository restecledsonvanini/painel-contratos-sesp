import React, { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Card,
  ConfirmDialog,
  ErrorState,
  Page,
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
import { getErrorMessage } from '../lib/http';
import { useConfirmDialog } from '../lib/useConfirmDialog';
import { useAuth } from '../providers/AuthProvider';

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
  const { data, isLoading, error, refetch } = useContracts();
  const deleteContract = useDeleteContract();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const { hasMinRole, token } = useAuth();
  const canWrite = !token || hasMinRole('COLABORADOR');
  const allContracts = Array.isArray(data) ? data.filter(Boolean) : [];

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

  const contracts = useMemo(() => {
    return allContracts.filter((c) => {
      if (filters.situacao) {
        const sit = (c.situacao || c.status || '').toUpperCase();
        const want = filters.situacao.toUpperCase();
        const legacy =
          want === 'VIGENTE'
            ? sit === 'VIGENTE' || (c.status || '').toLowerCase() === 'vigente'
            : sit === want;
        if (!legacy) return false;
      }
      if (filters.fornecedorId && c.fornecedorId !== filters.fornecedorId && c.empresaId !== filters.fornecedorId) {
        return false;
      }
      if (filters.modalidade && (c.modalidade || '').toUpperCase() !== filters.modalidade.toUpperCase()) {
        return false;
      }
      if (filters.pilar && (c.pilar || '').toUpperCase() !== filters.pilar.toUpperCase()) {
        return false;
      }
      if (filters.orgaoId) {
        if (c.unidadeGestoraId !== filters.orgaoId) return false;
      }
      if (filters.responsavelId) {
        if (c.gestorId !== filters.responsavelId && c.fiscalId !== filters.responsavelId) return false;
      }
      if (filters.vencimento && !matchVencimento(diasAteFim(c), filters.vencimento)) return false;
      return true;
    });
  }, [allContracts, filters]);

  const clearFilter = (key: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
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
        activeFilters.length
          ? `${contracts.length} de ${allContracts.length} contratos (filtros do dashboard).`
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
                        contract.unidadeFsp?.sigla ||
                        contract.unidadeGestoraId ||
                        contract.unidadeFspId ||
                        '—'}
                    </TableCell>
                    <TableCell data-label="Fornecedor">
                      {contract.fornecedorName ||
                        contract.empresaName ||
                        contract.fornecedorId ||
                        contract.empresaId ||
                        '—'}
                    </TableCell>
                    <TableCell data-label="Status">
                      <StatusBadge status={contract.status || contract.situacao?.toLowerCase()} />
                    </TableCell>
                    <TableCell data-label="Valor anual">
                      {contract.valorAnual != null
                        ? contract.valorAnual.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                        : '—'}
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
                  <TableCell colSpan={7} className="text-[var(--text-muted)]">
                    Nenhum contrato {activeFilters.length ? 'com esses filtros' : 'cadastrado'}.
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
        loading={deleteContract.isPending}
      />
    </Page>
  );
}
