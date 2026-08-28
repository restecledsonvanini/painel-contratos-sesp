import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTabParam } from '../../../lib/useTabParam';
import { useContract, useDeleteContract } from '../../../hooks/useContracts';
import {
  Breadcrumbs,
  Button,
  ConfirmDialog,
  ErrorState,
  Page,
  Popover,
  Skeleton,
  Tabs,
  useToast,
} from '@painel/ui';
import { ApiError, getErrorMessage } from '../../../lib/http';
import { downloadApiFile } from '../../../lib/download';
import { useConfirmDialog } from '../../../lib/useConfirmDialog';
import { useCanManage, useCanWrite } from '../../../lib/access';
import { CONTRACT_TAB_LABELS, pushRecentContract, removeRecentContract } from '../../../lib/recentContracts';
import { authorLabel, formatDateBr, formatRelativePast } from '../../../lib/formatRelative';
import { useContractExtras } from './useContractExtras';
import { Download } from 'lucide-react';
import { ResumoTab } from './tabs/ResumoTab';
import { TimelineTab } from './tabs/TimelineTab';
import { ItensTab } from './tabs/ItensTab';
import { AlteracoesTab } from './tabs/AlteracoesTab';
import { FinanceiroTab } from './tabs/FinanceiroTab';
import { FiscalizacaoTab } from './tabs/FiscalizacaoTab';
import { RateioTab } from './tabs/RateioTab';
import { PublicidadeTab } from './tabs/PublicidadeTab';
import { DocumentosTab } from './tabs/DocumentosTab';
import { AuditoriaTab } from './tabs/AuditoriaTab';

const TAB_IDS = [
  'resumo',
  'timeline',
  'itens',
  'alteracoes',
  'financeiro',
  'fiscalizacao',
  'rateio',
  'publicidade',
  'documentos',
  'auditoria',
] as const;

export default function ContractDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useTabParam(TAB_IDS, 'resumo');

  const { data: contract, isLoading, error, isSuccess, refetch } = useContract(id);
  const deleteContract = useDeleteContract();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const canWrite = useCanWrite();
  const canManage = useCanManage();

  useEffect(() => {
    if (!contract?.id) return;
    const gms = `${contract.numGms}/${contract.anoGms}`;
    pushRecentContract({
      id: contract.id,
      gms,
      label: contract.protocoloCabeca || `GMS ${gms}`,
    });
  }, [contract?.id, contract?.numGms, contract?.anoGms, contract?.protocoloCabeca]);

  useEffect(() => {
    if (!id) return;
    if (error instanceof ApiError && error.status === 404) {
      removeRecentContract(id);
    }
  }, [id, error]);

  const {
    financeiro,
    dotacoes,
    empenhos,
    publicacoes,
    documentos,
    timeline,
    limites,
    auditoria,
  } = useContractExtras(id, tab, Boolean(id) && isSuccess);

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await deleteContract.mutateAsync(confirm.pending.payload);
      toast.success('Contrato excluído.');
      navigate('/contracts');
    } catch (err) {
      toast.error('Falha ao excluir contrato.', getErrorMessage(err));
    }
  };

  async function exportFicha(formato: 'csv' | 'xlsx' | 'pdf') {
    if (!id) return;
    try {
      await downloadApiFile(
        `/contracts/${id}/export.${formato}`,
        `contrato-${contract?.numeroGms || id}.${formato}`,
      );
      toast.success(`Ficha ${formato.toUpperCase()} baixada.`);
    } catch (err) {
      toast.error('Falha ao exportar ficha.', getErrorMessage(err));
    }
  }

  const timelineEvents = useMemo(() => {
    const rows = Array.isArray(timeline) ? timeline : [];
    return rows
      .filter((ev: { data?: string | null }) => Boolean(ev.data))
      .map((ev: { origemId?: string; data: string; titulo?: string; detalhe?: string; tipo?: string }, idx: number) => ({
        id: `${ev.origemId ?? 'ev'}-${idx}`,
        date: String(ev.data).slice(0, 10),
        title: ev.titulo || ev.tipo || 'Evento',
        detail: ev.detalhe || undefined,
        tipo: ev.tipo,
      }));
  }, [timeline]);

  const rateioPct = useMemo(
    () => (contract?.rateios ?? []).reduce((sum, r) => sum + (Number(r.percentual) || 0), 0),
    [contract?.rateios],
  );

  const alteracoes = useMemo(() => {
    if (contract?.alteracoes?.length) return contract.alteracoes;
    return (
      contract?.aditivos?.map((a) => ({
        id: a.id || String(a.numAditivo),
        tipo: 'ADITIVO',
        numero: a.numAditivo,
        eProtocolo: a.protocoloAdit,
        novaDataFimVigencia: a.novoFimVigencia,
        valorAcrescido: a.valorAdicional,
        situacao: 'ASSINADO',
      })) ?? []
    );
  }, [contract]);

  if (isLoading) {
    return (
      <Page title="Contrato">
        <Skeleton variant="card" />
      </Page>
    );
  }

  if (error || !contract) {
    return (
      <Page title="Contrato">
        <ErrorState
          title="Contrato não encontrado"
          message={error ? getErrorMessage(error) : 'O contrato solicitado não existe ou foi removido.'}
          code={(error as { code?: string } | undefined)?.code}
          onRetry={error ? () => refetch() : undefined}
        />
      </Page>
    );
  }

  const unidadeLabel = [
    contract.unidadeGestora?.sigla,
    contract.subunidade?.sigla,
  ]
    .filter(Boolean)
    .join(' / ') ||
    contract.unidadeGestoraId ||
    '—';

  const tabItems = [
    { id: 'resumo', label: 'Resumo', content: <ResumoTab contract={contract} financeiro={financeiro} unidadeLabel={unidadeLabel} /> },
    { id: 'timeline', label: 'Linha do tempo', content: <TimelineTab events={timelineEvents} /> },
    { id: 'itens', label: 'Itens', content: <ItensTab contract={contract} /> },
    { id: 'alteracoes', label: 'Alterações', content: <AlteracoesTab id={id} canManage={canManage} alteracoes={alteracoes} limites={limites} /> },
    { id: 'financeiro', label: 'Financeiro', content: <FinanceiroTab financeiro={financeiro} dotacoes={dotacoes} empenhos={empenhos} /> },
    { id: 'fiscalizacao', label: 'Fiscalização', content: <FiscalizacaoTab contract={contract} /> },
    { id: 'rateio', label: 'Rateio', content: <RateioTab contract={contract} rateioPct={rateioPct} /> },
    { id: 'publicidade', label: 'Publicidade', content: <PublicidadeTab financeiro={financeiro} publicacoes={publicacoes} /> },
    { id: 'documentos', label: 'Documentos', content: <DocumentosTab documentos={documentos} /> },
    { id: 'auditoria', label: 'Auditoria', content: <AuditoriaTab auditoria={auditoria} /> },
  ];

  const gmsLabel = `GMS ${contract.numGms}/${contract.anoGms}`;
  const tabLabel = CONTRACT_TAB_LABELS[tab] ?? tab;
  const autoria = [
    `Criado por ${authorLabel(contract.criadoPor)} em ${formatDateBr(contract.createdAt)}`,
    `Última alteração por ${authorLabel(contract.atualizadoPor)} ${formatRelativePast(contract.updatedAt)}`,
  ].join(' · ');

  return (
    <Page
      breadcrumb={
        <Breadcrumbs
          items={[
            { label: 'Contratos', href: '/contracts' },
            { label: gmsLabel, href: `/contracts/${id}` },
            { label: tabLabel },
          ]}
        />
      }
      title={contract.protocoloCabeca || `Contrato ${contract.numGms}/${contract.anoGms}`}
      description={
        <>
          {unidadeLabel} · {contract.fornecedorName || 'Fornecedor'} · Lei
          14.133/2021
          <br />
          <button
            type="button"
            className="mt-1 text-left text-[var(--font-size-xs)] text-[var(--text-muted)] underline-offset-2 hover:underline"
            onClick={() => setTab('auditoria')}
          >
            {autoria} — ver auditoria
          </button>
        </>
      }
      actions={
        <>
          <Button to="/contracts" variant="ghost">
            Voltar
          </Button>
          {id && (
            <Popover
              align="end"
              trigger={
                <Button variant="secondary" type="button">
                  <Download size={16} />
                  Exportar
                </Button>
              }
              contentClassName="min-w-[10rem] p-1"
            >
              <div className="flex flex-col">
                <button
                  type="button"
                  className="rounded px-3 py-2 text-left text-sm hover:bg-[var(--surface-muted)]"
                  onClick={() => void exportFicha('pdf')}
                >
                  PDF — ficha
                </button>
                <button
                  type="button"
                  className="rounded px-3 py-2 text-left text-sm hover:bg-[var(--surface-muted)]"
                  onClick={() => void exportFicha('xlsx')}
                >
                  Excel (XLSX)
                </button>
                <button
                  type="button"
                  className="rounded px-3 py-2 text-left text-sm hover:bg-[var(--surface-muted)]"
                  onClick={() => void exportFicha('csv')}
                >
                  CSV
                </button>
              </div>
            </Popover>
          )}
          {id && canWrite && (
            <Button to={`/contracts/${id}/edit`} variant="secondary">
              Editar
            </Button>
          )}
          {id && canManage && (
            <Button to={`/contracts/${id}/alteracoes/nova`} variant="secondary">
              Nova alteração
            </Button>
          )}
          {canWrite && (
            <Button
              variant="danger"
              type="button"
              onClick={() =>
                id && confirm.ask(id, 'Excluir contrato?', 'Esta ação não pode ser desfeita.')
              }
              disabled={deleteContract.isPending}
            >
              Excluir
            </Button>
          )}
        </>
      }
    >
      <Tabs items={tabItems} value={tab} onValueChange={setTab} />

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
