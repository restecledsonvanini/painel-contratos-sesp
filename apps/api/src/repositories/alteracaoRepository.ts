import { getPrisma } from '../lib/prisma';
import type {
  AlteracaoContratualCreateInput,
  AlteracaoContratualUpdateInput,
  AlteracaoItemCreateInput,
} from '@painel/schema';

const alteracaoInclude = {
  fundamentoLegal: { select: { id: true, codigo: true, label: true } },
  itens: {
    include: {
      itemContrato: { select: { id: true, sequencia: true } },
      catalogoItem: { select: { id: true, nome: true } },
    },
  },
} as const;

export const alteracaoRepository = {
  async listByContrato(contratoId: string) {
    const db = getPrisma();
    return db.alteracaoContratual.findMany({
      where: { contratoId },
      include: alteracaoInclude,
      orderBy: [{ dataAssinatura: 'asc' }, { numero: 'asc' }],
    });
  },

  async findById(contratoId: string, alteracaoId: string) {
    const db = getPrisma();
    return db.alteracaoContratual.findFirst({
      where: { id: alteracaoId, contratoId },
      include: alteracaoInclude,
    });
  },

  async nextNumero(contratoId: string, tipo: string) {
    const db = getPrisma();
    const last = await db.alteracaoContratual.findFirst({
      where: { contratoId, tipo: tipo as never },
      orderBy: { numero: 'desc' },
      select: { numero: true },
    });
    return (last?.numero ?? 0) + 1;
  },

  async totaisAcumulados(contratoId: string, excludeId?: string) {
    const db = getPrisma();
    const rows = await db.alteracaoContratual.findMany({
      where: {
        contratoId,
        situacao: { not: 'CANCELADO' },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: {
        tipo: true,
        valorAcrescidoCents: true,
        valorSuprimidoCents: true,
        novaDataFimVigencia: true,
      },
    });
    let valorAcrescido = 0;
    let valorSuprimido = 0;
    const novasDatas: Date[] = [];
    for (const r of rows) {
      valorAcrescido += Number(r.valorAcrescidoCents);
      valorSuprimido += Number(r.valorSuprimidoCents);
      if (r.novaDataFimVigencia) novasDatas.push(r.novaDataFimVigencia);
    }
    return { valorAcrescido, valorSuprimido, novasDatas };
  },

  async create(contratoId: string, data: AlteracaoContratualCreateInput) {
    const db = getPrisma();
    const numero = data.numero ?? (await this.nextNumero(contratoId, data.tipo));
    return db.$transaction(async (tx) => {
      const created = await tx.alteracaoContratual.create({
        data: {
          contratoId,
          tipo: data.tipo as never,
          numero,
          eProtocolo: data.eProtocolo,
          objetoDescricao: data.objetoDescricao,
          fundamentoLegalId: data.fundamentoLegalId,
          justificativa: data.justificativa,
          justificativaExcepcional: data.justificativaExcepcional,
          dataAssinatura: new Date(data.dataAssinatura),
          dataInicioEfeito: data.dataInicioEfeito ? new Date(data.dataInicioEfeito) : null,
          prazoAcrescidoValor: data.prazoAcrescidoValor,
          prazoAcrescidoUnidade: (data.prazoAcrescidoUnidade as never) ?? null,
          novaDataFimVigencia: data.novaDataFimVigencia
            ? new Date(data.novaDataFimVigencia)
            : null,
          valorAcrescidoCents: BigInt(data.valorAcrescidoCents),
          valorSuprimidoCents: BigInt(data.valorSuprimidoCents),
          percentualReajuste: data.percentualReajuste,
          situacao: data.situacao as never,
          codigoLegado: data.codigoLegado,
        },
      });

      for (const item of data.itens ?? []) {
        await tx.alteracaoItem.create({
          data: {
            alteracaoId: created.id,
            itemContratoId: item.itemContratoId,
            catalogoItemId: item.catalogoItemId,
            quantidadeDelta: item.quantidadeDelta,
            valorUnitarioNovoCents:
              item.valorUnitarioNovoCents != null ? BigInt(item.valorUnitarioNovoCents) : null,
            observacao: item.observacao,
          },
        });
      }

      return tx.alteracaoContratual.findUniqueOrThrow({
        where: { id: created.id },
        include: alteracaoInclude,
      });
    });
  },

  async update(contratoId: string, alteracaoId: string, data: AlteracaoContratualUpdateInput) {
    const db = getPrisma();
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v === undefined) continue;
      if (k === 'dataAssinatura' || k === 'dataInicioEfeito' || k === 'novaDataFimVigencia') {
        patch[k] = v ? new Date(String(v)) : null;
      } else if (k === 'valorAcrescidoCents' || k === 'valorSuprimidoCents') {
        patch[k] = BigInt(v as number);
      } else {
        patch[k] = v;
      }
    }
    await db.alteracaoContratual.updateMany({
      where: { id: alteracaoId, contratoId },
      data: patch as never,
    });
    return this.findById(contratoId, alteracaoId);
  },

  async remove(contratoId: string, alteracaoId: string) {
    const db = getPrisma();
    await db.alteracaoItem.deleteMany({ where: { alteracaoId } });
    const result = await db.alteracaoContratual.deleteMany({
      where: { id: alteracaoId, contratoId },
    });
    return result.count > 0;
  },

  async addItem(alteracaoId: string, item: AlteracaoItemCreateInput) {
    const db = getPrisma();
    return db.alteracaoItem.create({
      data: {
        alteracaoId,
        itemContratoId: item.itemContratoId,
        catalogoItemId: item.catalogoItemId,
        quantidadeDelta: item.quantidadeDelta,
        valorUnitarioNovoCents:
          item.valorUnitarioNovoCents != null ? BigInt(item.valorUnitarioNovoCents) : null,
        observacao: item.observacao,
      },
    });
  },
};
