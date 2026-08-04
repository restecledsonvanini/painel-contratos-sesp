import { getPrisma } from '../lib/prisma';

const contractInclude = {
  aditivos: true,
  unidadeFsp: true,
  gestor: true,
  fiscal: true,
  empresa: true,
} as const;

export type ContractInclude = typeof contractInclude;

export const contratoRepository = {
  include: contractInclude,

  async findMany() {
    const db = getPrisma();
    return db.contrato.findMany({
      orderBy: { createdAt: 'desc' },
      include: contractInclude,
    });
  },

  async findById(id: string) {
    const db = getPrisma();
    return db.contrato.findUnique({
      where: { id },
      include: contractInclude,
    });
  },

  async findByIdBare(id: string) {
    const db = getPrisma();
    return db.contrato.findUnique({ where: { id } });
  },

  async createWithAditivos(
    data: {
      protocoloCabeca: string | null;
      numGms: number;
      anoGms: number;
      unidadeFspId: string;
      gestorId: string;
      fiscalId: string;
      empresaId: string;
      modalidade: string;
      objeto: string;
      valorAnualCents: number;
      dataInicio: Date | null;
      dataFimOrig: Date | null;
      status: string;
    },
    aditivos: Array<{
      numAditivo: number;
      protocoloAdit: string;
      novoFimVigencia: Date | null;
      valorAdicionalCents: number | null;
    }>,
    audit: { changedBy: string | null },
  ) {
    const db = getPrisma();
    return db.$transaction(async (tx) => {
      const contrato = await tx.contrato.create({ data });
      for (const a of aditivos) {
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
    await db.$transaction(async (tx) => {
      await tx.contrato.update({ where: { id }, data });
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
