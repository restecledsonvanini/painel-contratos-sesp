import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, Page, useToast } from '@painel/ui';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { downloadApiFile } from '../lib/download';
import { getErrorMessage } from '../lib/http';
import { useAuth } from '../providers/AuthProvider';

type Formato = 'csv' | 'xlsx';
type Escopo = 'todos' | 'filtros';

const FILTER_KEYS = [
  'situacao',
  'vencimento',
  'orgaoId',
  'fornecedorId',
  'modalidade',
  'pilar',
  'responsavelId',
  'publicacao',
] as const;

export default function ExportacaoPage() {
  const toast = useToast();
  const { hasMinRole, token } = useAuth();
  const canExport = !token || hasMinRole('COLABORADOR');
  const [searchParams] = useSearchParams();
  const [formato, setFormato] = useState<Formato>('xlsx');
  const [escopo, setEscopo] = useState<Escopo>('todos');
  const [busy, setBusy] = useState(false);

  const listFilters = useMemo(() => {
    const q = new URLSearchParams();
    for (const key of FILTER_KEYS) {
      const v = searchParams.get(key);
      if (v) q.set(key, v);
    }
    // Também aceita filtros "herdados" via sessionStorage da lista (opcional)
    try {
      const raw = sessionStorage.getItem('contracts:lastFilters');
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, string>;
        for (const key of FILTER_KEYS) {
          if (parsed[key] && !q.has(key)) q.set(key, parsed[key]);
        }
      }
    } catch {
      /* ignore */
    }
    return q;
  }, [searchParams]);

  const activeFilterCount = [...listFilters.keys()].length;

  async function exportar() {
    if (!canExport) {
      toast.error('Sem permissão para exportar.');
      return;
    }
    setBusy(true);
    try {
      const q = escopo === 'filtros' ? listFilters : new URLSearchParams();
      const qs = q.toString();
      const path = `/exports/contratos.${formato}${qs ? `?${qs}` : ''}`;
      const filename = `contratos.${formato}`;
      await downloadApiFile(path, filename);
      toast.success(`Exportação ${formato.toUpperCase()} iniciada.`);
    } catch (err) {
      toast.error('Falha ao exportar.', getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page
      title="Exportação"
      description="Exporte o acervo de contratos em CSV ou XLSX, com ou sem filtros da lista."
    >
      <Card variant="bordered" className="max-w-xl space-y-5 p-5">
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Formato</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="formato"
              checked={formato === 'xlsx'}
              onChange={() => setFormato('xlsx')}
            />
            <FileSpreadsheet size={16} aria-hidden />
            Excel (XLSX)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="formato"
              checked={formato === 'csv'}
              onChange={() => setFormato('csv')}
            />
            <FileText size={16} aria-hidden />
            CSV
          </label>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Escopo</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="escopo"
              checked={escopo === 'todos'}
              onChange={() => setEscopo('todos')}
            />
            Todo o acervo (no escopo do órgão)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="escopo"
              checked={escopo === 'filtros'}
              onChange={() => setEscopo('filtros')}
              disabled={activeFilterCount === 0}
            />
            Com filtros da lista de contratos
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ' (nenhum filtro ativo)'}
          </label>
        </fieldset>

        <p className="text-sm text-[var(--text-muted)]">
          Ficha individual em PDF/CSV/XLSX fica no detalhe do contrato. Aplique filtros em{' '}
          <Link className="text-[var(--primary)] underline" to="/contracts">
            Contratos
          </Link>{' '}
          e volte aqui para exportar o recorte.
        </p>

        <Button onClick={() => void exportar()} disabled={busy || !canExport}>
          <Download size={16} />
          {busy ? 'Gerando…' : `Exportar ${formato.toUpperCase()}`}
        </Button>
      </Card>
    </Page>
  );
}
