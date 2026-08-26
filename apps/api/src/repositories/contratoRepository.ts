import { getPrisma } from '../lib/prisma';
import { limiteProrrogacaoMesesDefault } from '@painel/domain';
import type { NaturezaObjeto } from '@painel/domain';
import { buildContratoWhere, type ContratoListFilters } from '../lib/contratoQuery';
import { paginationMeta, skipTake } from '../lib/pagination';
import {
  monthsBetween,
  resolveCategoriaId,
  resolveModalidadeId,
  resolveRateioUnidadeId,
  resolveUnidadeGestoraId,
} from './contratoResolve';

function asUsuarioFk(actorId: string | null | undefined): string | null {
  if (!actorId) return null;
  if (actorId === 'system' || actorId.startsWith('user-')) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actorId)) {
    return null;
  }
  return actorId;
}

const orgaoSelect = { id: true, sigla: true, nome: true, tipo: true } as const;
const unidadeSelect = {
  id: true,
  sigla: true,
  nome: true,
  nivel: true,
  orgaoId: true,
} as const;
const usuarioSelect = { id: true, nome: true, email: true } as const;

/** Listagem e export: sem itens, rateios nem alterações. */
const listInclude = {
  fornecedor: { select: { id: true, razaoSocial: true, documento: true } },
  unidadeGestora: { select: orgaoSelect },
  subunidade: { select: unidadeSelect },
  modalidadeRef: { select: { id: true, codigo: true, label: true } },
  categoriaContratacao: { select: { id: true, codigo: true, label: true } },
  criadoPor: { select: usuarioSelect },
  atualizadoPor: { select: usuarioSelect },
  responsaveis: {
    where: { dataFim: null },
    include: { servidor: { select: { id: true, nome: true } } },
    orderBy: [{ papel: 'asc' as const }, { dataInicio: 'desc' as const }],
  },
};

const detailInclude = {
  alteracoes: {
    orderBy: [{ dataAssinatura: 'asc' as const }, { numero: 'asc' as const }],
  },
  fornecedor: true,
  unidadeGestora: { select: orgaoSelect },
  subunidade: { select: unidadeSelect },
  modalidadeRef: true,
  categoriaContratacao: true,
  fundamentoLegal: true,
  criadoPor: { select: usuarioSelect },
  atualizadoPor: { select: usuarioSelect },
  responsaveis: {
    include: { servidor: true },
    orderBy: [{ papel: 'asc' as const }, { dataInicio: 'desc' as const }],
  },
  rateios: {
    include: { unidade: { select: { id: true, sigla: true, nome: true } } },
  },
  itens: {
    orderBy: { sequencia: 'asc' as const },
    include: {
      catalogoItem: {
        include: { categoriaItem: { select: { id: true, codigo: true, label: true } } },
      },
      unidadeMedida: { select: { id: true, codigo: true, label: true } },
      unidadeDestino: { select: { id: true, sigla: true, nome: true } },
    },
  },
};

export type ContractInclude = typeof detailInclude;

export const contratoRepository = {
  include: detailInclude,

  async findMany(
    scope?: { orgaoId?: string | null },
    filters: ContratoListFilters = { page: 1, pageSize: 25 },
  ) {
    const built = buildContratoWhere(scope?.orgaoId, filters);
    if ('impossible' in built) {
      return { data: [], meta: paginationMeta(0, filters.page, filters.pageSize) };
    }
    const { skip, take } = skipTake(filters.page, filters.pageSize);
    const db = getPrisma();
    const [total, rows] = await Promise.all([
      db.contrato.count({ where: built }),
      db.contrato.findMany({
        where: built,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: listInclude,
      }),
    ]);
    return { data: rows, meta: paginationMeta(total, filters.page, filters.pageSize) };
  },

  async findManyForExport(
    scope?: { orgaoId?: string | null },
    filters: Omit<ContratoListFilters, 'page' | 'pageSize' | 'sort'> = {},
  ) {
    const built = buildContratoWhere(scope?.orgaoId, filters);
    if ('impossible' in built) return [];
    return getPrisma().contrato.findMany({
      where: built,
      orderBy: { createdAt: 'desc' },
      include: listInclude,
    });
  },

  async findById(id: string) {
    return getPrisma().contrato.findUnique({
      where: { id },
      include: detailInclude,
    });
  },

  async findByIdBare(id: string) {
    return getPrisma().contrato.findUnique({ where: { id } });
  },

  async createWithNested(
    input: {
      processoId: string | null;
      numeroGms: string;
      anoGms: number;
      numeroContrato: string | null;
      eProtocolo: string | null;
      pilar: string;
      categoriaContratacaoId: string | null;
      naturezaObjeto: NaturezaObjeto;
      modalidadeId: string | null;
      modalidadeCodigo: string | null;
      fundamentoLegalId: string | null;
      objeto: string;
      fornecedorId: string;
      unidadeGestoraId: string | null;
      subunidadeId?: string | null;
      unidadeFspIdLegacy: string | null;
      dataAssinatura: string | null;
      dataInicioVigencia: string;
      prazoInicialValor: number | null;
      prazoInicialUnidade: string;
      dataFimVigenciaOriginal: string;
      prorrogavel: boolean;
      limiteProrrogacaoMeses: number | null;
      valorGlobalOriginalCents: number;
      indiceReajuste: string | null;
      mesAniversarioReajuste: number | null;
      situacao: string;
      garantiaTipo: string | null;
      garantiaValorCents: number | null;
      garantiaValidade: string | null;
      observacoes: string | null;
      codigoLegado: string | null;
      gestorId: string | null;
      fiscalId: string | null;
      responsaveis?: Array<{
        servidorId: string;
        papel: string;
        atoDesignacao?: string | null;
        dataInicio: string;
        dataFim?: string | null;
      }>;
      rateios?: Array<{
        unidadeId: string;
        percentual?: number | null;
        valorCents?: number | null;
        quantidade?: number | null;
        observacao?: string | null;
      }>;
      itens?: Array<{
        sequencia?: number;
        catalogoItemId: string;
        descricaoComplementar?: string | null;
        quantidade: number;
        unidadeMedidaId?: string;
        valorUnitarioCents: number;
        periodicidade?: string;
        unidadeDestinoId?: string | null;
        municipioExecucaoId?: string | null;
        enderecoExecucao?: string | null;
        atributos?: Record<string, unknown> | null;
      }>;
      aditivos?: Array<{
        numAditivo: number;
        protocoloAdit: string;
        novoFimVigencia: Date | null;
        valorAdicionalCents: number | null;
      }>;
      alteracoes?: Array<{
        tipo: string;
        numero?: number;
        eProtocolo?: string | null;
        objetoDescricao: string;
        dataAssinatura: string;
        novaDataFimVigencia?: Date | string | null;
        valorAcrescidoCents?: number;
        valorSuprimidoCents?: number;
        situacao?: string;
        justificativaExcepcional?: string | null;
      }>;
    },
    audit: { changedBy: string | null },
  ) {
    const modalidadeId = await resolveModalidadeId(input.modalidadeId, input.modalidadeCodigo);
    if (!modalidadeId) throw Object.assign(new Error('Modalidade inválida'), { status: 400 });

    const unidadeGestoraId = await resolveUnidadeGestoraId(
      input.unidadeGestoraId,
      input.unidadeFspIdLegacy,
    );
    if (!unidadeGestoraId) {
      throw Object.assign(new Error('Unidade gestora inválida'), { status: 400 });
    }

    let subunidadeId = input.subunidadeId ?? null;
    if (subunidadeId) {
      const sub = await getPrisma().unidadeOrganizacional.findUnique({ where: { id: subunidadeId } });
      if (!sub || sub.orgaoId !== unidadeGestoraId) {
        throw Object.assign(new Error('Subunidade não pertence à unidade gestora'), { status: 400 });
      }
    }

    const categoriaContratacaoId = await resolveCategoriaId(
      input.categoriaContratacaoId,
      input.naturezaObjeto,
    );

    const inicio = new Date(input.dataInicioVigencia);
    const fim = new Date(input.dataFimVigenciaOriginal);
    const prazoInicialValor = input.prazoInicialValor ?? monthsBetween(inicio, fim);
    const limiteProrrogacaoMeses =
      input.limiteProrrogacaoMeses ?? limiteProrrogacaoMesesDefault(input.naturezaObjeto);

    const responsaveis =
      input.responsaveis?.length
        ? input.responsaveis
        : [
            ...(input.gestorId
              ? [
                  {
                    servidorId: input.gestorId,
                    papel: 'GESTOR',
                    dataInicio: input.dataInicioVigencia,
                    dataFim: null as string | null,
                    atoDesignacao: null as string | null,
                  },
                ]
              : []),
            ...(input.fiscalId
              ? [
                  {
                    servidorId: input.fiscalId,
                    papel: 'FISCAL_TECNICO',
                    dataInicio: input.dataInicioVigencia,
                    dataFim: null as string | null,
                    atoDesignacao: null as string | null,
                  },
                ]
              : []),
          ];

    if (!responsaveis.some((r) => r.papel === 'GESTOR')) {
      throw Object.assign(new Error('É obrigatório informar um gestor'), { status: 400 });
    }

    const rateioUnidadeId =
      input.rateios?.length
        ? null
        : await resolveRateioUnidadeId(unidadeGestoraId, subunidadeId);
    if (!input.rateios?.length && !rateioUnidadeId) {
      throw Object.assign(
        new Error('Não há unidade organizacional para rateio inicial nesta força'),
        { status: 400 },
      );
    }

    const rateios =
      input.rateios?.length
        ? input.rateios
        : [
            {
              unidadeId: rateioUnidadeId!,
              percentual: 100,
              valorCents: null,
              quantidade: null,
              observacao: null,
            },
          ];

    const actorId = asUsuarioFk(audit.changedBy);
    const db = getPrisma();
    return db.$transaction(async (tx) => {
      const contrato = await tx.contrato.create({
        data: {
          processoId: input.processoId,
          numeroGms: input.numeroGms,
          anoGms: input.anoGms,
          numeroContrato: input.numeroContrato,
          eProtocolo: input.eProtocolo,
          pilar: input.pilar as never,
          categoriaContratacaoId,
          naturezaObjeto: input.naturezaObjeto as never,
          modalidadeId,
          fundamentoLegalId: input.fundamentoLegalId,
          objeto: input.objeto,
          fornecedorId: input.fornecedorId,
          unidadeGestoraId,
          subunidadeId,
          dataAssinatura: input.dataAssinatura ? new Date(input.dataAssinatura) : null,
          dataInicioVigencia: inicio,
          prazoInicialValor,
          prazoInicialUnidade: input.prazoInicialUnidade as never,
          dataFimVigenciaOriginal: fim,
          prorrogavel: input.prorrogavel,
          limiteProrrogacaoMeses,
          valorGlobalOriginalCents: BigInt(input.valorGlobalOriginalCents),
          indiceReajuste: input.indiceReajuste,
          mesAniversarioReajuste: input.mesAniversarioReajuste,
          situacao: input.situacao as never,
          garantiaTipo: (input.garantiaTipo as never) ?? null,
          garantiaValorCents:
            input.garantiaValorCents != null ? BigInt(input.garantiaValorCents) : null,
          garantiaValidade: input.garantiaValidade ? new Date(input.garantiaValidade) : null,
          observacoes: input.observacoes,
          codigoLegado: input.codigoLegado,
          criadoPorId: actorId,
          atualizadoPorId: actorId,
        },
      });

      for (const r of responsaveis) {
        await tx.contratoResponsavel.create({
          data: {
            contratoId: contrato.id,
            servidorId: r.servidorId,
            papel: r.papel as never,
            atoDesignacao: r.atoDesignacao ?? null,
            dataInicio: new Date(r.dataInicio),
            dataFim: r.dataFim ? new Date(r.dataFim) : null,
          },
        });
      }

      for (const rateio of rateios) {
        await tx.contratoRateio.create({
          data: {
            contratoId: contrato.id,
            unidadeId: rateio.unidadeId,
            percentual: rateio.percentual ?? null,
            valorCents: rateio.valorCents != null ? BigInt(rateio.valorCents) : null,
            quantidade: rateio.quantidade ?? null,
            observacao: rateio.observacao ?? null,
          },
        });
      }

      const itens = input.itens ?? [];
      const catalogoIds = [...new Set(itens.map((i) => i.catalogoItemId))];
      const catalogos = catalogoIds.length
        ? await tx.catalogoItem.findMany({ where: { id: { in: catalogoIds } } })
        : [];
      const catalogoById = new Map(catalogos.map((c) => [c.id, c]));

      let seq = 1;
      for (const item of itens) {
        const catalogo = catalogoById.get(item.catalogoItemId);
        if (!catalogo) {
          throw Object.assign(new Error(`Catálogo ${item.catalogoItemId} não encontrado`), {
            status: 400,
          });
        }
        await tx.itemContrato.create({
          data: {
            contratoId: contrato.id,
            sequencia: item.sequencia ?? seq,
            catalogoItemId: item.catalogoItemId,
            descricaoComplementar: item.descricaoComplementar ?? null,
            quantidade: item.quantidade,
            unidadeMedidaId: item.unidadeMedidaId ?? catalogo.unidadeMedidaPadraoId,
            valorUnitarioCents: BigInt(item.valorUnitarioCents),
            periodicidade: (item.periodicidade as never) ?? 'UNICA',
            unidadeDestinoId: item.unidadeDestinoId ?? null,
            municipioExecucaoId: item.municipioExecucaoId ?? null,
            enderecoExecucao: item.enderecoExecucao ?? null,
            atributos: item.atributos ?? undefined,
          },
        });
        seq += 1;
      }

      for (const a of input.alteracoes ?? []) {
        await tx.alteracaoContratual.create({
          data: {
            contratoId: contrato.id,
            tipo: a.tipo as never,
            numero: a.numero ?? 1,
            eProtocolo: a.eProtocolo ?? null,
            objetoDescricao: a.objetoDescricao,
            dataAssinatura: new Date(a.dataAssinatura),
            novaDataFimVigencia: a.novaDataFimVigencia
              ? new Date(a.novaDataFimVigencia)
              : null,
            valorAcrescidoCents: BigInt(a.valorAcrescidoCents ?? 0),
            valorSuprimidoCents: BigInt(a.valorSuprimidoCents ?? 0),
            situacao: (a.situacao as never) ?? 'ASSINADO',
            justificativaExcepcional: a.justificativaExcepcional ?? null,
          },
        });
      }

      // Alias legado: aditivos aninhados → AlteracaoContratual
      for (const a of input.aditivos ?? []) {
        const valor = a.valorAdicionalCents ?? 0;
        const temPrazo = Boolean(a.novoFimVigencia);
        const tipo =
          temPrazo && valor > 0
            ? 'ADITIVO_PRAZO_VALOR'
            : temPrazo
              ? 'ADITIVO_PRAZO'
              : 'ADITIVO_ACRESCIMO_QUANTITATIVO';
        await tx.alteracaoContratual.create({
          data: {
            contratoId: contrato.id,
            tipo: tipo as never,
            numero: a.numAditivo,
            eProtocolo: a.protocoloAdit,
            objetoDescricao: 'Aditivo legado (compat)',
            dataAssinatura: inicio,
            novaDataFimVigencia: a.novoFimVigencia,
            valorAcrescidoCents: BigInt(valor),
            valorSuprimidoCents: BigInt(0),
            situacao: 'ASSINADO',
          },
        });
      }

      return contrato.id;
    });
  },

  async update(
    id: string,
    data: Record<string, unknown>,
    existing: unknown,
    audit: { changedBy: string | null },
  ) {
    const db = getPrisma();
    const actorId = asUsuarioFk(audit.changedBy);
    const patch: Record<string, unknown> = { ...data };
    if (actorId) patch.atualizadoPorId = actorId;

    if (patch.modalidadeCodigo && !patch.modalidadeId) {
      patch.modalidadeId = await resolveModalidadeId(null, String(patch.modalidadeCodigo));
    }
    delete patch.modalidadeCodigo;

    if (patch.unidadeFspIdLegacy && !patch.unidadeGestoraId) {
      patch.unidadeGestoraId = await resolveUnidadeGestoraId(null, String(patch.unidadeFspIdLegacy));
    }
    delete patch.unidadeFspIdLegacy;

    if (patch.unidadeGestoraId) {
      patch.unidadeGestoraId = await resolveUnidadeGestoraId(String(patch.unidadeGestoraId), null);
    }

    if (patch.subunidadeId === '') patch.subunidadeId = null;
    if (patch.subunidadeId && patch.unidadeGestoraId) {
      const sub = await db.unidadeOrganizacional.findUnique({
        where: { id: String(patch.subunidadeId) },
      });
      if (!sub || sub.orgaoId !== patch.unidadeGestoraId) {
        throw Object.assign(new Error('Subunidade não pertence à unidade gestora'), { status: 400 });
      }
    }

    const gestorId = patch.gestorId as string | undefined;
    const fiscalId = patch.fiscalId as string | undefined;
    delete patch.gestorId;
    delete patch.fiscalId;

    for (const dateKey of [
      'dataAssinatura',
      'dataInicioVigencia',
      'dataFimVigenciaOriginal',
      'garantiaValidade',
      'dataEncerramento',
    ]) {
      if (patch[dateKey] !== undefined) {
        patch[dateKey] = patch[dateKey] ? new Date(String(patch[dateKey])) : null;
      }
    }

    if (typeof patch.valorGlobalOriginalCents === 'number') {
      patch.valorGlobalOriginalCents = BigInt(patch.valorGlobalOriginalCents);
    }
    if (typeof patch.garantiaValorCents === 'number') {
      patch.garantiaValorCents = BigInt(patch.garantiaValorCents);
    }

    await db.$transaction(async (tx) => {
      if (Object.keys(patch).length) {
        await tx.contrato.update({ where: { id }, data: patch as never });
      }

      if (gestorId) {
        await tx.contratoResponsavel.updateMany({
          where: { contratoId: id, papel: 'GESTOR', dataFim: null },
          data: { dataFim: new Date() },
        });
        await tx.contratoResponsavel.create({
          data: {
            contratoId: id,
            servidorId: gestorId,
            papel: 'GESTOR',
            dataInicio: new Date(),
          },
        });
      }
      if (fiscalId) {
        await tx.contratoResponsavel.updateMany({
          where: {
            contratoId: id,
            papel: { in: ['FISCAL_TECNICO', 'FISCAL_ADMINISTRATIVO', 'FISCAL_SETORIAL'] },
            dataFim: null,
          },
          data: { dataFim: new Date() },
        });
        await tx.contratoResponsavel.create({
          data: {
            contratoId: id,
            servidorId: fiscalId,
            papel: 'FISCAL_TECNICO',
            dataInicio: new Date(),
          },
        });
      }
    });
  },

  async delete(
    id: string,
    existing: { id: string; alteracoes?: unknown[]; aditivos?: unknown[] },
    _audit: { changedBy: string | null },
  ) {
    const db = getPrisma();
    await db.$transaction(async (tx) => {
      await tx.alteracaoItem.deleteMany({
        where: { alteracao: { contratoId: id } },
      });
      await tx.alteracaoContratual.deleteMany({ where: { contratoId: id } });
      await tx.itemContrato.deleteMany({ where: { contratoId: id } });
      await tx.contratoResponsavel.deleteMany({ where: { contratoId: id } });
      await tx.contratoRateio.deleteMany({ where: { contratoId: id } });
      await tx.contrato.delete({ where: { id } });
    });
  },
};
