import {
  simularAlteracao,
  type NaturezaObjeto,
  type TipoAlteracao,
} from '@painel/domain';
import type {
  AlteracaoContratualCreateInput,
  AlteracaoContratualUpdateInput,
  AlteracaoSimularInput,
} from '@painel/schema';
import type { Request } from 'express';
import { badRequest, legalRuleViolation, notFound } from '../lib/errors';
import { alteracaoRepository } from '../repositories/alteracaoRepository';
import { assertContratoInScope, loadContratoInScope } from '../lib/scope';

type AlteracaoItemRow = {
  id: string;
  itemContratoId?: string | null;
  itemContrato?: { sequencia?: number | null } | null;
  catalogoItemId?: string | null;
  catalogoItem?: { nome?: string | null } | null;
  quantidadeDelta: unknown;
  valorUnitarioNovoCents?: bigint | number | null;
  observacao?: string | null;
};

type AlteracaoRecord = {
  id: string;
  contratoId: string;
  tipo: string;
  numero: number;
  eProtocolo?: string | null;
  objetoDescricao: string;
  fundamentoLegalId?: string | null;
  fundamentoLegal?: unknown;
  justificativa?: string | null;
  justificativaExcepcional?: string | null;
  dataAssinatura: Date;
  dataInicioEfeito?: Date | null;
  prazoAcrescidoValor?: number | null;
  prazoAcrescidoUnidade?: string | null;
  novaDataFimVigencia?: Date | null;
  valorAcrescidoCents?: bigint | number | null;
  valorSuprimidoCents?: bigint | number | null;
  percentualReajuste?: unknown;
  situacao: string;
  codigoLegado?: string | null;
  itens?: AlteracaoItemRow[];
};

function mapAlteracao(record: AlteracaoRecord) {
  const valorAcrescidoCents = Number(record.valorAcrescidoCents ?? 0);
  const valorSuprimidoCents = Number(record.valorSuprimidoCents ?? 0);
  return {
    id: record.id,
    contratoId: record.contratoId,
    tipo: record.tipo,
    numero: record.numero,
    eProtocolo: record.eProtocolo,
    objetoDescricao: record.objetoDescricao,
    fundamentoLegalId: record.fundamentoLegalId,
    fundamentoLegal: record.fundamentoLegal,
    justificativa: record.justificativa,
    justificativaExcepcional: record.justificativaExcepcional,
    dataAssinatura: record.dataAssinatura,
    dataInicioEfeito: record.dataInicioEfeito,
    prazoAcrescidoValor: record.prazoAcrescidoValor,
    prazoAcrescidoUnidade: record.prazoAcrescidoUnidade,
    novaDataFimVigencia: record.novaDataFimVigencia,
    valorAcrescidoCents,
    valorAcrescido: valorAcrescidoCents / 100,
    valorSuprimidoCents,
    valorSuprimido: valorSuprimidoCents / 100,
    percentualReajuste:
      record.percentualReajuste != null ? Number(record.percentualReajuste) : null,
    situacao: record.situacao,
    codigoLegado: record.codigoLegado,
    itens: record.itens?.map((item) => ({
      id: item.id,
      itemContratoId: item.itemContratoId,
      itemSequencia: item.itemContrato?.sequencia,
      catalogoItemId: item.catalogoItemId,
      catalogoNome: item.catalogoItem?.nome,
      quantidadeDelta: Number(item.quantidadeDelta),
      valorUnitarioNovoCents:
        item.valorUnitarioNovoCents != null ? Number(item.valorUnitarioNovoCents) : null,
      valorUnitarioNovo:
        item.valorUnitarioNovoCents != null ? Number(item.valorUnitarioNovoCents) / 100 : null,
      observacao: item.observacao,
    })),
    // aliases legado Aditivo
    numAditivo: record.numero,
    protocoloAdit: record.eProtocolo,
    novoFimVigencia: record.novaDataFimVigencia,
    valorAdicional: valorAcrescidoCents / 100,
  };
}

type PgLike = { code?: string; message?: string; meta?: { code?: string; message?: string } };
function asPg(err: unknown): PgLike {
  return typeof err === 'object' && err ? (err as PgLike) : {};
}

function isPgCheck(err: unknown) {
  const e = asPg(err);
  const msg = String(e.message || e.meta?.message || '');
  return (
    e.code === 'P2010' ||
    e.meta?.code === '23514' ||
    e.code === '23514' ||
    msg.includes('check_violation') ||
    msg.includes('SqlState(E23514)') ||
    msg.includes('novaDataFimVigencia') ||
    msg.includes('justificativaExcepcional') ||
    msg.includes('Apostilamento') ||
    msg.includes('não é prorrogável')
  );
}

export const alteracaoService = {
  async list(contratoId: string, req: Request) {
    await assertContratoInScope(contratoId, req);
    const rows = await alteracaoRepository.listByContrato(contratoId);
    return rows.map((row) => mapAlteracao(row as AlteracaoRecord));
  },

  async get(contratoId: string, alteracaoId: string, req: Request) {
    await assertContratoInScope(contratoId, req);
    const row = await alteracaoRepository.findById(contratoId, alteracaoId);
    if (!row) throw notFound('Alteração not found');
    return mapAlteracao(row as AlteracaoRecord);
  },

  async simular(contratoId: string, body: AlteracaoSimularInput, req: Request) {
    const contrato = await loadContratoInScope(contratoId, req);
    const totais = await alteracaoRepository.totaisAcumulados(contratoId);
    return simularAlteracao({
      tipo: body.tipo as TipoAlteracao,
      naturezaObjeto: contrato.naturezaObjeto as NaturezaObjeto,
      prorrogavel: contrato.prorrogavel,
      limiteProrrogacaoMeses: contrato.limiteProrrogacaoMeses,
      dataFimVigenciaOriginal: contrato.dataFimVigenciaOriginal,
      novasDatasFimExistentes: totais.novasDatas,
      valorGlobalOriginalCents: Number(contrato.valorGlobalOriginalCents),
      valorAcrescidoAtualCents: totais.valorAcrescido,
      valorSuprimidoAtualCents: totais.valorSuprimido,
      valorAcrescidoNovoCents: body.valorAcrescidoCents,
      valorSuprimidoNovoCents: body.valorSuprimidoCents,
      novaDataFimVigencia: body.novaDataFimVigencia
        ? new Date(body.novaDataFimVigencia)
        : null,
      justificativaExcepcional: body.justificativaExcepcional,
    });
  },

  async create(contratoId: string, body: AlteracaoContratualCreateInput, req: Request) {
    const simulacao = await this.simular(contratoId, body, req);
    if (!simulacao.ok && body.situacao !== 'MINUTA') {
      throw legalRuleViolation(simulacao.erros.join('; '), simulacao);
    }
    try {
      const created = await alteracaoRepository.create(contratoId, body);
      return mapAlteracao(created as AlteracaoRecord);
    } catch (err) {
      if (isPgCheck(err)) {
        const e = asPg(err);
        throw legalRuleViolation(e.meta?.message || e.message || 'Regra legal violada');
      }
      if (asPg(err).code === 'P2002') throw badRequest('Número de alteração já existe para este tipo');
      throw err;
    }
  },

  async update(
    contratoId: string,
    alteracaoId: string,
    body: AlteracaoContratualUpdateInput,
    req: Request,
  ) {
    await assertContratoInScope(contratoId, req);
    const existing = await alteracaoRepository.findById(contratoId, alteracaoId);
    if (!existing) throw notFound('Alteração not found');
    try {
      const updated = await alteracaoRepository.update(contratoId, alteracaoId, body);
      if (!updated) throw notFound('Alteração not found');
      return mapAlteracao(updated as AlteracaoRecord);
    } catch (err) {
      if (isPgCheck(err)) {
        const e = asPg(err);
        throw legalRuleViolation(e.meta?.message || e.message || 'Regra legal violada');
      }
      throw err;
    }
  },

  async remove(contratoId: string, alteracaoId: string, req: Request) {
    await assertContratoInScope(contratoId, req);
    const ok = await alteracaoRepository.remove(contratoId, alteracaoId);
    if (!ok) throw notFound('Alteração not found');
    return { success: true };
  },
};
