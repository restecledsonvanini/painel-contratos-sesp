import { getPrisma } from '../lib/prisma';
import { limiteProrrogacaoMesesDefault } from '@painel/domain';
import type { NaturezaObjeto } from '@painel/domain';

const contractInclude = {
  aditivos: true,
  fornecedor: true,
  unidadeGestora: {
    include: { orgao: { select: { id: true, sigla: true, nome: true } } },
  },
  modalidadeRef: true,
  categoriaContratacao: true,
  fundamentoLegal: true,
  responsaveis: {
    include: { servidor: true },
    orderBy: [{ papel: 'asc' as const }, { dataInicio: 'desc' as const }],
  },
  rateios: {
    include: { unidade: { select: { id: true, sigla: true, nome: true } } },
  },
} as const;

export type ContractInclude = typeof contractInclude;

async function resolveModalidadeId(modalidadeId: string | null, modalidadeCodigo: string | null) {
  if (modalidadeId) return modalidadeId;
  if (!modalidadeCodigo) return null;
  const db = getPrisma();
  const dominio = await db.dominio.findUnique({ where: { slug: 'modalidade-licitacao' } });
  if (!dominio) return null;
  const valor = await db.dominioValor.findFirst({
    where: {
      dominioId: dominio.id,
      OR: [
        { codigo: { equals: modalidadeCodigo, mode: 'insensitive' } },
        { id: modalidadeCodigo },
      ],
    },
  });
  return valor?.id ?? null;
}

async function resolveCategoriaId(categoriaId: string | null, natureza: NaturezaObjeto) {
  if (categoriaId) return categoriaId;
  const db = getPrisma();
  const dominio = await db.dominio.findUnique({ where: { slug: 'categoria-contratacao' } });
  if (!dominio) throw new Error('Domínio categoria-contratacao não encontrado');
  const codigoPreferido =
    natureza === 'LOCACAO_BEM_MOVEL'
      ? 'LOCACAO_VEICULOS'
      : natureza === 'LOCACAO_IMOVEL'
        ? 'LOCACAO_IMOVEIS'
        : natureza === 'COMPRA'
          ? 'GENEROS_ALIMENTICIOS'
          : 'SERVICO_EVENTUAL';
  const preferido = await db.dominioValor.findFirst({
    where: { dominioId: dominio.id, codigo: codigoPreferido },
  });
  if (preferido) return preferido.id;
  const any = await db.dominioValor.findFirst({
    where: { dominioId: dominio.id, ativo: true },
    orderBy: { ordem: 'asc' },
  });
  if (!any) throw new Error('Nenhuma categoria de contratação cadastrada');
  return any.id;
}

async function resolveUnidadeGestoraId(
  unidadeGestoraId: string | null,
  unidadeFspIdLegacy: string | null,
) {
  if (unidadeGestoraId) return unidadeGestoraId;
  if (!unidadeFspIdLegacy) return null;
  const db = getPrisma();
  const fsp = await db.unidadeFsp.findUnique({ where: { id: unidadeFspIdLegacy } });
  if (!fsp) return null;
  const orgao = await db.orgao.findUnique({ where: { sigla: fsp.sigla } });
  if (orgao) {
    const root = await db.unidadeOrganizacional.findFirst({
      where: { orgaoId: orgao.id, parentId: null, ativo: true },
      orderBy: { sigla: 'asc' },
    });
    if (root) return root.id;
    const any = await db.unidadeOrganizacional.findFirst({
      where: { orgaoId: orgao.id, ativo: true },
      orderBy: { sigla: 'asc' },
    });
    if (any) return any.id;
  }
  const fallback = await db.unidadeOrganizacional.findFirst({
    where: { ativo: true },
    orderBy: { sigla: 'asc' },
  });
  return fallback?.id ?? null;
}

function monthsBetween(start: Date, end: Date) {
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(1, months || 1);
}

export const contratoRepository = {
  include: contractInclude,

  async findMany() {
    return getPrisma().contrato.findMany({
      orderBy: { createdAt: 'desc' },
      include: contractInclude,
    });
  },

  async findById(id: string) {
    return getPrisma().contrato.findUnique({
      where: { id },
      include: contractInclude,
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
      aditivos?: Array<{
        numAditivo: number;
        protocoloAdit: string;
        novoFimVigencia: Date | null;
        valorAdicionalCents: number | null;
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

    const rateios =
      input.rateios?.length
        ? input.rateios
        : [{ unidadeId: unidadeGestoraId, percentual: 100, valorCents: null, quantidade: null, observacao: null }];

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

      for (const a of input.aditivos ?? []) {
        await tx.aditivo.create({
          data: {
            contratoId: contrato.id,
            numAditivo: a.numAditivo,
            protocoloAdit: a.protocoloAdit,
            novoFimVigencia: a.novoFimVigencia,
            valorAdicionalCents: a.valorAdicionalCents,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          tabela: 'contrato',
          registroId: contrato.id,
          action: 'create',
          diff: { id: contrato.id },
          changedBy: audit.changedBy,
          source: 'api',
        },
      });

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
    const patch: Record<string, unknown> = { ...data };

    if (patch.modalidadeCodigo && !patch.modalidadeId) {
      patch.modalidadeId = await resolveModalidadeId(null, String(patch.modalidadeCodigo));
    }
    delete patch.modalidadeCodigo;

    if (patch.unidadeFspIdLegacy && !patch.unidadeGestoraId) {
      patch.unidadeGestoraId = await resolveUnidadeGestoraId(null, String(patch.unidadeFspIdLegacy));
    }
    delete patch.unidadeFspIdLegacy;

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

      await tx.auditLog.create({
        data: {
          tabela: 'contrato',
          registroId: id,
          action: 'update',
          diff: { before: existing, patch: data } as object,
          changedBy: audit.changedBy,
          source: 'api',
        },
      });
    });
  },

  async delete(id: string, existing: { id: string; aditivos: unknown[] }, audit: { changedBy: string | null }) {
    const db = getPrisma();
    await db.$transaction(async (tx) => {
      await tx.aditivo.deleteMany({ where: { contratoId: id } });
      await tx.contratoResponsavel.deleteMany({ where: { contratoId: id } });
      await tx.contratoRateio.deleteMany({ where: { contratoId: id } });
      await tx.contrato.delete({ where: { id } });
      await tx.auditLog.create({
        data: {
          tabela: 'contrato',
          registroId: id,
          action: 'delete',
          diff: { id: existing.id, aditivos: existing.aditivos.length },
          changedBy: audit.changedBy,
          source: 'api',
        },
      });
    });
  },
};
