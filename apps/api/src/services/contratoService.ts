import type { ContractCreateInput, ContractUpdateInput } from '@painel/schema';
import { ContractUpdateSchema } from '@painel/schema';
import { getActorId } from '../lib/audit';
import { badRequest, notFound } from '../lib/errors';
import { contratoRepository } from '../repositories/contratoRepository';
import type { Request } from 'express';

const SITUACAO_TO_STATUS: Record<string, string> = {
  EM_ELABORACAO: 'elaborado',
  ASSINADO: 'assinado',
  VIGENTE: 'vigente',
  SUSPENSO: 'suspenso',
  RESCINDIDO: 'rescindido',
  ENCERRADO: 'encerrado',
  ANULADO: 'anulado',
};

function centsToNumber(value: bigint | number | null | undefined) {
  if (value == null) return undefined;
  return Number(value);
}

function mapContractRecord(record: any) {
  const gestor = record.responsaveis?.find(
    (r: any) => r.papel === 'GESTOR' && !r.dataFim,
  );
  const fiscal = record.responsaveis?.find(
    (r: any) =>
      ['FISCAL_TECNICO', 'FISCAL_ADMINISTRATIVO', 'FISCAL_SETORIAL', 'FISCAL_SUBSTITUTO'].includes(
        r.papel,
      ) && !r.dataFim,
  );
  const valorCents = centsToNumber(record.valorGlobalOriginalCents);

  return {
    id: record.id,
    processoId: record.processoId,
    numeroGms: record.numeroGms,
    numGms: Number.parseInt(String(record.numeroGms).replace(/\D/g, ''), 10) || 0,
    anoGms: record.anoGms,
    numeroContrato: record.numeroContrato,
    eProtocolo: record.eProtocolo,
    protocoloCabeca: record.eProtocolo,
    pilar: record.pilar,
    categoriaContratacaoId: record.categoriaContratacaoId,
    categoriaContratacao: record.categoriaContratacao
      ? {
          id: record.categoriaContratacao.id,
          codigo: record.categoriaContratacao.codigo,
          label: record.categoriaContratacao.label,
        }
      : undefined,
    naturezaObjeto: record.naturezaObjeto,
    modalidadeId: record.modalidadeId,
    modalidade: record.modalidadeRef?.codigo ?? record.modalidade,
    modalidadeLabel: record.modalidadeRef?.label,
    fundamentoLegalId: record.fundamentoLegalId,
    objeto: record.objeto,
    fornecedorId: record.fornecedorId,
    fornecedorName: record.fornecedor?.razaoSocial,
    empresaId: record.fornecedorId,
    empresaName: record.fornecedor?.razaoSocial,
    unidadeGestoraId: record.unidadeGestoraId,
    unidadeGestora: record.unidadeGestora
      ? {
          id: record.unidadeGestora.id,
          sigla: record.unidadeGestora.sigla,
          nome: record.unidadeGestora.nome,
          orgao: record.unidadeGestora.orgao,
        }
      : undefined,
    unidadeFspId: record.unidadeGestoraId,
    unidadeFsp: record.unidadeGestora
      ? {
          id: record.unidadeGestora.id,
          sigla: record.unidadeGestora.sigla,
          nome: record.unidadeGestora.nome,
        }
      : undefined,
    gestorId: gestor?.servidorId,
    gestorName: gestor?.servidor?.nome,
    fiscalId: fiscal?.servidorId,
    fiscalName: fiscal?.servidor?.nome,
    dataAssinatura: record.dataAssinatura,
    dataInicioVigencia: record.dataInicioVigencia,
    dataInicio: record.dataInicioVigencia,
    prazoInicialValor: record.prazoInicialValor,
    prazoInicialUnidade: record.prazoInicialUnidade,
    dataFimVigenciaOriginal: record.dataFimVigenciaOriginal,
    dataFimOrig: record.dataFimVigenciaOriginal,
    prorrogavel: record.prorrogavel,
    limiteProrrogacaoMeses: record.limiteProrrogacaoMeses,
    valorGlobalOriginalCents: valorCents,
    valorAnualCents: valorCents,
    valorAnual: valorCents != null ? valorCents / 100 : undefined,
    valorGlobalOriginal: valorCents != null ? valorCents / 100 : undefined,
    indiceReajuste: record.indiceReajuste,
    mesAniversarioReajuste: record.mesAniversarioReajuste,
    situacao: record.situacao,
    status: SITUACAO_TO_STATUS[record.situacao] ?? String(record.situacao).toLowerCase(),
    observacoes: record.observacoes,
    codigoLegado: record.codigoLegado,
    responsaveis: record.responsaveis?.map((r: any) => ({
      id: r.id,
      servidorId: r.servidorId,
      servidorNome: r.servidor?.nome,
      papel: r.papel,
      atoDesignacao: r.atoDesignacao,
      dataInicio: r.dataInicio,
      dataFim: r.dataFim,
    })),
    rateios: record.rateios?.map((r: any) => ({
      id: r.id,
      unidadeId: r.unidadeId,
      unidadeSigla: r.unidade?.sigla,
      unidadeNome: r.unidade?.nome,
      percentual: r.percentual != null ? Number(r.percentual) : null,
      valorCents: centsToNumber(r.valorCents) ?? null,
      quantidade: r.quantidade != null ? Number(r.quantidade) : null,
      observacao: r.observacao,
    })),
    itens: record.itens?.map((item: any) => {
      const qtd = Number(item.quantidade);
      const unit = Number(item.valorUnitarioCents);
      return {
        id: item.id,
        sequencia: item.sequencia,
        catalogoItemId: item.catalogoItemId,
        catalogoNome: item.catalogoItem?.nome,
        categoria: item.catalogoItem?.categoriaItem?.codigo,
        descricaoComplementar: item.descricaoComplementar,
        quantidade: qtd,
        unidadeMedidaId: item.unidadeMedidaId,
        unidadeMedida: item.unidadeMedida?.codigo,
        valorUnitarioCents: unit,
        valorUnitario: unit / 100,
        valorTotalCents: Math.round(qtd * unit),
        valorTotal: (qtd * unit) / 100,
        periodicidade: item.periodicidade,
        unidadeDestinoId: item.unidadeDestinoId,
        unidadeDestinoSigla: item.unidadeDestino?.sigla,
        atributos: item.atributos,
      };
    }),
    alteracoes: record.alteracoes?.map((alt: any) => {
      const valorAcrescidoCents = Number(alt.valorAcrescidoCents ?? 0);
      return {
        id: alt.id,
        tipo: alt.tipo,
        numero: alt.numero,
        eProtocolo: alt.eProtocolo,
        objetoDescricao: alt.objetoDescricao,
        dataAssinatura: alt.dataAssinatura,
        novaDataFimVigencia: alt.novaDataFimVigencia,
        valorAcrescidoCents,
        valorAcrescido: valorAcrescidoCents / 100,
        valorSuprimidoCents: Number(alt.valorSuprimidoCents ?? 0),
        situacao: alt.situacao,
      };
    }),
    // Alias legado
    aditivos: record.alteracoes?.map((alt: any) => ({
      id: alt.id,
      numAditivo: alt.numero,
      protocoloAdit: alt.eProtocolo,
      novoFimVigencia: alt.novaDataFimVigencia,
      valorAdicional:
        alt.valorAcrescidoCents != null ? Number(alt.valorAcrescidoCents) / 100 : undefined,
    })),
  };
}

async function loadMappedContract(id: string) {
  const record = await contratoRepository.findById(id);
  if (!record) throw notFound('Contract not found');
  return mapContractRecord(record);
}

export const contratoService = {
  async list(scope?: { orgaoId?: string | null }) {
    const records = await contratoRepository.findMany(scope);
    return records.map(mapContractRecord);
  },

  async getById(id: string) {
    return loadMappedContract(id);
  },

  async create(parsed: ContractCreateInput, req: Request) {
    try {
      const createdId = await contratoRepository.createWithNested(
        {
          ...parsed,
          aditivos: (parsed.aditivos ?? []).map((a) => ({
            numAditivo: a.numAditivo,
            protocoloAdit: a.protocoloAdit,
            novoFimVigencia: a.novoFimVigencia ? new Date(a.novoFimVigencia) : null,
            valorAdicionalCents:
              a.valorAdicional != null ? Math.round(a.valorAdicional * 100) : null,
          })),
        },
        { changedBy: getActorId(req) },
      );
      return loadMappedContract(createdId);
    } catch (err: any) {
      if (err?.status === 400) throw badRequest(err.message);
      throw err;
    }
  },

  async update(id: string, parsed: ContractUpdateInput, req: Request) {
    const existing = await contratoRepository.findByIdBare(id);
    if (!existing) throw notFound('Contract not found');

    const gestorId = (parsed.gestorId as string | undefined) ?? undefined;
    const fiscalId = (parsed.fiscalId as string | undefined) ?? undefined;
    if (gestorId && fiscalId && gestorId === fiscalId) {
      ContractUpdateSchema.parse({ ...parsed, gestorId, fiscalId });
    }

    try {
      await contratoRepository.update(id, parsed as Record<string, unknown>, existing, {
        changedBy: getActorId(req),
      });
    } catch (err: any) {
      if (err?.status === 400) throw badRequest(err.message);
      throw err;
    }
    return loadMappedContract(id);
  },

  async remove(id: string, req: Request) {
    const existing = await contratoRepository.findById(id);
    if (!existing) throw notFound('Contract not found');
    await contratoRepository.delete(id, existing, { changedBy: getActorId(req) });
    return { success: true };
  },
};
