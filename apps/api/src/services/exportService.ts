import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import type { Request } from 'express';
import { contratoService } from './contratoService';
import { getOrgaoScope } from '../lib/scope';
import { notFound } from '../lib/errors';

export type ExportFilters = {
  situacao?: string;
  orgaoId?: string;
  fornecedorId?: string;
  modalidade?: string;
  pilar?: string;
  responsavelId?: string;
  vencimento?: string;
};

const ACERVO_HEADERS = [
  'id',
  'numeroGms',
  'anoGms',
  'protocolo',
  'objeto',
  'situacao',
  'fornecedor',
  'unidadeGestora',
  'subunidade',
  'valorGlobalOriginal',
  'dataInicioVigencia',
  'dataFimVigenciaOriginal',
  'gestor',
  'fiscal',
] as const;

type MappedContract = Awaited<ReturnType<typeof contratoService.getById>>;

/**
 * Excel e LibreOffice interpretam células iniciadas por `=`, `+`, `-`, `@`
 * (e por tab/CR) como fórmula. Prefixar com aspa simples neutraliza sem
 * alterar o texto exibido.
 */
function neutralizeFormula(s: string): string {
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
}

function csvEscape(value: unknown): string {
  const s = neutralizeFormula(value == null ? '' : String(value));
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toDateStr(v: unknown): string {
  if (!v) return '';
  return String(v).slice(0, 10);
}

function diasAteFim(contract: MappedContract): number | null {
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

export function parseExportFilters(query: Request['query']): ExportFilters {
  const str = (k: string) => {
    const v = query[k];
    return typeof v === 'string' && v.trim() ? v.trim() : undefined;
  };
  return {
    situacao: str('situacao'),
    orgaoId: str('orgaoId'),
    fornecedorId: str('fornecedorId'),
    modalidade: str('modalidade'),
    pilar: str('pilar'),
    responsavelId: str('responsavelId'),
    vencimento: str('vencimento'),
  };
}

export function filterExportRows(rows: MappedContract[], filters: ExportFilters): MappedContract[] {
  return rows.filter((c) => {
    if (filters.situacao) {
      const sit = (c.situacao || c.status || '').toUpperCase();
      const want = filters.situacao.toUpperCase();
      const ok =
        want === 'VIGENTE'
          ? sit === 'VIGENTE' || String(c.status || '').toLowerCase() === 'vigente'
          : sit === want;
      if (!ok) return false;
    }
    if (filters.fornecedorId && c.fornecedorId !== filters.fornecedorId) {
      return false;
    }
    if (
      filters.modalidade &&
      (c.modalidade || '').toUpperCase() !== filters.modalidade.toUpperCase()
    ) {
      return false;
    }
    if (filters.pilar && (c.pilar || '').toUpperCase() !== filters.pilar.toUpperCase()) {
      return false;
    }
    if (filters.orgaoId && c.unidadeGestoraId !== filters.orgaoId) return false;
    if (
      filters.responsavelId &&
      c.gestorId !== filters.responsavelId &&
      c.fiscalId !== filters.responsavelId
    ) {
      return false;
    }
    if (filters.vencimento && !matchVencimento(diasAteFim(c), filters.vencimento)) return false;
    return true;
  });
}

function rowValues(c: MappedContract): (string | number)[] {
  return [
    c.id,
    c.numeroGms ?? '',
    c.anoGms ?? '',
    c.protocoloCabeca ?? c.eProtocolo ?? '',
    c.objeto ?? '',
    c.situacao ?? c.status ?? '',
    c.fornecedorName ?? '',
    c.unidadeGestora?.sigla ?? '',
    c.subunidade?.sigla ?? '',
    c.valorGlobalOriginal ?? c.valorAnual ?? '',
    toDateStr(c.dataInicioVigencia ?? c.dataInicio),
    toDateStr(c.dataFimVigenciaOriginal ?? c.dataFimOrig),
    c.gestorName ?? '',
    c.fiscalName ?? '',
  ];
}

export function contractsToCsv(rows: MappedContract[]): string {
  const lines = [ACERVO_HEADERS.join(',')];
  for (const r of rows) {
    lines.push(rowValues(r).map(csvEscape).join(','));
  }
  return `\uFEFF${lines.join('\n')}\n`;
}

export async function contractsToXlsx(rows: MappedContract[]): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Painel Contratos SESP';
  wb.created = new Date();
  const sheet = wb.addWorksheet('Contratos', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });
  sheet.addRow([...ACERVO_HEADERS]);
  sheet.getRow(1).font = { bold: true };
  for (const r of rows) {
    sheet.addRow(rowValues(r));
  }
  sheet.columns.forEach((col) => {
    let max = 10;
    col.eachCell?.({ includeEmpty: true }, (cell) => {
      const len = String(cell.value ?? '').length;
      if (len > max) max = Math.min(len, 48);
    });
    col.width = max + 2;
  });
  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}

export async function loadContractForExport(id: string, req: Request) {
  try {
    // getById já valida existência e escopo de órgão.
    return await contratoService.getById(id, req);
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status;
    if (status === 404) throw notFound('Contract not found');
    throw err;
  }
}

export async function listContractsForExport(req: Request, filters: ExportFilters) {
  const rows = (await contratoService.listForExport(
    getOrgaoScope(req),
    filters as Record<string, unknown>,
  )) as MappedContract[];
  return filterExportRows(rows, filters);
}

function moneyBr(v: unknown): string {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export async function contractToPdf(
  contract: MappedContract,
  meta: { emitidoPor: string },
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48 });
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c as Buffer));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const gms = `${contract.numeroGms ?? contract.numGms}/${contract.anoGms}`;
    const unidade = [contract.unidadeGestora?.sigla, contract.subunidade?.sigla]
      .filter(Boolean)
      .join(' / ');

    doc.fontSize(14).font('Helvetica-Bold').text('SESP · Ficha de contrato', { align: 'left' });
    doc.moveDown(0.3);
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#444')
      .text('Hub de Inteligência Contratual · Lei 14.133/2021');
    doc.fillColor('#000');
    doc.moveDown(0.8);

    doc.fontSize(12).font('Helvetica-Bold').text(`GMS ${gms}`);
    doc.fontSize(10).font('Helvetica').text(contract.objeto || '—', { width: 500 });
    doc.moveDown(0.8);

    const line = (label: string, value: string) => {
      doc.font('Helvetica-Bold').fontSize(9).text(label, { continued: true });
      doc.font('Helvetica').text(`  ${value}`);
    };

    doc.fontSize(11).font('Helvetica-Bold').text('Identificação');
    doc.moveDown(0.3);
    line('Protocolo:', String(contract.protocoloCabeca ?? contract.eProtocolo ?? '—'));
    line('Situação:', String(contract.situacao ?? contract.status ?? '—'));
    line('Pilar:', String(contract.pilar ?? '—'));
    line('Modalidade:', String(contract.modalidadeLabel ?? contract.modalidade ?? '—'));
    line('Natureza:', String(contract.naturezaObjeto ?? '—'));
    line('Unidade gestora:', unidade || '—');
    doc.moveDown(0.6);

    doc.fontSize(11).font('Helvetica-Bold').text('Fornecedor');
    doc.moveDown(0.3);
    line('Razão social:', String(contract.fornecedorName ?? '—'));
    doc.moveDown(0.6);

    doc.fontSize(11).font('Helvetica-Bold').text('Vigência e valores');
    doc.moveDown(0.3);
    line(
      'Início:',
      toDateStr(contract.dataInicioVigencia ?? contract.dataInicio) || '—',
    );
    line(
      'Fim (original):',
      toDateStr(contract.dataFimVigenciaOriginal ?? contract.dataFimOrig) || '—',
    );
    line('Valor global:', moneyBr(contract.valorGlobalOriginal ?? contract.valorAnual));
    doc.moveDown(0.6);

    doc.fontSize(11).font('Helvetica-Bold').text('Responsáveis');
    doc.moveDown(0.3);
    line('Gestor:', String(contract.gestorName ?? '—'));
    line('Fiscal:', String(contract.fiscalName ?? '—'));
    doc.moveDown(0.6);

    const alts = (contract.alteracoes ?? []).slice(-5).reverse();
    doc.fontSize(11).font('Helvetica-Bold').text('Últimas alterações');
    doc.moveDown(0.3);
    if (!alts.length) {
      doc.font('Helvetica').fontSize(9).text('Nenhuma alteração registrada.');
    } else {
      for (const a of alts) {
        const tip = a.tipo || 'ALTERACAO';
        const num = a.numero != null ? `#${a.numero}` : '';
        const data = toDateStr(a.dataAssinatura) || '—';
        const valor =
          a.valorAcrescido != null && Number(a.valorAcrescido) !== 0
            ? ` · ${moneyBr(a.valorAcrescido)}`
            : '';
        doc
          .font('Helvetica')
          .fontSize(9)
          .text(`${data} · ${tip} ${num}${valor}`.trim());
      }
    }

    doc.moveDown(1.2);
    doc
      .fontSize(8)
      .fillColor('#555')
      .text(
        `Emitido em ${new Date().toLocaleString('pt-BR')} por ${meta.emitidoPor}`,
        { align: 'left' },
      );

    doc.end();
  });
}

export function emitidoPor(req: Request): string {
  const u = req.user;
  if (!u) return 'sistema';
  return u.nome || u.email || u.id || 'sistema';
}
