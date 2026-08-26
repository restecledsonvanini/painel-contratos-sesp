import type { Prisma } from '@painel/db';
import { parsePagination, type PaginationQuery } from './pagination';

export type ContratoListFilters = PaginationQuery & {
  situacao?: string;
  vencimento?: string;
  orgaoId?: string;
  fornecedorId?: string;
  modalidade?: string;
  pilar?: string;
  responsavelId?: string;
};

function str(query: Record<string, unknown>, key: string): string | undefined {
  const v = query[key];
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t || undefined;
}

export function parseContratoListQuery(query: Record<string, unknown>): ContratoListFilters {
  return {
    ...parsePagination(query),
    situacao: str(query, 'situacao'),
    vencimento: str(query, 'vencimento'),
    orgaoId: str(query, 'orgaoId'),
    fornecedorId: str(query, 'fornecedorId'),
    modalidade: str(query, 'modalidade'),
    pilar: str(query, 'pilar'),
    responsavelId: str(query, 'responsavelId'),
  };
}

function utcDay(offsetDays: number): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offsetDays));
}

function vencimentoWhere(filtro: string): Prisma.ContratoWhereInput | null {
  const today = utcDay(0);
  switch (filtro) {
    case 'vencidos':
      return { dataFimVigenciaOriginal: { lt: today } };
    case '0-30':
      return { dataFimVigenciaOriginal: { gte: today, lte: utcDay(30) } };
    case '0-60':
      return { dataFimVigenciaOriginal: { gte: today, lte: utcDay(60) } };
    case '31-60':
      return { dataFimVigenciaOriginal: { gte: utcDay(31), lte: utcDay(60) } };
    case '61-90':
      return { dataFimVigenciaOriginal: { gte: utcDay(61), lte: utcDay(90) } };
    case '91-120':
      return { dataFimVigenciaOriginal: { gte: utcDay(91), lte: utcDay(120) } };
    case '121-180':
      return { dataFimVigenciaOriginal: { gte: utcDay(121), lte: utcDay(180) } };
    case '>180':
      return { dataFimVigenciaOriginal: { gt: utcDay(180) } };
    default:
      return null;
  }
}

/**
 * Filtro da listagem/export. `scopeOrgaoId` é o órgão do usuário (não-ADMIN);
 * `filters.orgaoId` é o recorte pedido na query — os dois se combinam.
 */
export function buildContratoWhere(
  scopeOrgaoId?: string | null,
  filters: Omit<ContratoListFilters, 'page' | 'pageSize' | 'sort'> = {},
): Prisma.ContratoWhereInput | { impossible: true } {
  if (scopeOrgaoId && filters.orgaoId && filters.orgaoId !== scopeOrgaoId) {
    return { impossible: true };
  }

  const where: Prisma.ContratoWhereInput = {};
  const orgaoId = scopeOrgaoId || filters.orgaoId;
  if (orgaoId) where.unidadeGestoraId = orgaoId;
  if (filters.fornecedorId) where.fornecedorId = filters.fornecedorId;
  if (filters.situacao) where.situacao = filters.situacao as never;
  if (filters.pilar) where.pilar = filters.pilar as never;
  if (filters.modalidade) {
    where.modalidadeRef = { codigo: { equals: filters.modalidade, mode: 'insensitive' } };
  }
  if (filters.responsavelId) {
    where.responsaveis = {
      some: { servidorId: filters.responsavelId, dataFim: null },
    };
  }
  if (filters.q) {
    where.OR = [
      { numeroGms: { contains: filters.q, mode: 'insensitive' } },
      { objeto: { contains: filters.q, mode: 'insensitive' } },
      { eProtocolo: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  if (filters.vencimento) {
    const extra = vencimentoWhere(filters.vencimento);
    if (extra) Object.assign(where, extra);
  }
  return where;
}
