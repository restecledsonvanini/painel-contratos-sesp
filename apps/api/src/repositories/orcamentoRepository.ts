import { getPrisma } from '../lib/prisma';
import type {
  ContratoDotacaoCreateInput,
  DocumentoCreateInput,
  DotacaoCreateInput,
  EmpenhoCreateInput,
  EmpenhoUpdateInput,
  PublicacaoCreateInput,
  ReservaCreateInput,
} from '@painel/schema';

async function resolveDominioValorId(slug: string, id: string | null, codigo: string | null) {
  if (id) return id;
  if (!codigo) return null;
  const db = getPrisma();
  const dominio = await db.dominio.findUnique({ where: { slug } });
  if (!dominio) return null;
  const valor = await db.dominioValor.findFirst({
    where: {
      dominioId: dominio.id,
      OR: [{ codigo: { equals: codigo, mode: 'insensitive' } }, { id: codigo }],
    },
  });
  return valor?.id ?? null;
}

export const orcamentoRepository = {
  async listDotacoes(filters?: { exercicio?: number; q?: string }) {
    const db = getPrisma();
    return db.dotacaoOrcamentaria.findMany({
      where: {
        ...(filters?.exercicio ? { exercicio: filters.exercicio } : {}),
        ...(filters?.q
          ? {
              OR: [
                { codigo: { contains: filters.q, mode: 'insensitive' } },
                { descricao: { contains: filters.q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        naturezaDespesa: { select: { id: true, codigo: true, label: true } },
        fonteRecurso: { select: { id: true, codigo: true, label: true } },
      },
      orderBy: [{ exercicio: 'desc' }, { codigo: 'asc' }],
    });
  },

  async getDotacao(id: string) {
    const db = getPrisma();
    return db.dotacaoOrcamentaria.findUnique({
      where: { id },
      include: {
        naturezaDespesa: { select: { id: true, codigo: true, label: true } },
        fonteRecurso: { select: { id: true, codigo: true, label: true } },
      },
    });
  },

  async createDotacao(data: DotacaoCreateInput) {
    const db = getPrisma();
    return db.dotacaoOrcamentaria.create({
      data: {
        exercicio: data.exercicio,
        codigo: data.codigo,
        unidadeOrcamentaria: data.unidadeOrcamentaria,
        funcionalProgramatica: data.funcionalProgramatica,
        naturezaDespesaId: data.naturezaDespesaId,
        fonteRecursoId: data.fonteRecursoId,
        descricao: data.descricao,
      },
      include: {
        naturezaDespesa: { select: { id: true, codigo: true, label: true } },
        fonteRecurso: { select: { id: true, codigo: true, label: true } },
      },
    });
  },

  async updateDotacao(id: string, data: Record<string, unknown>) {
    const db = getPrisma();
    return db.dotacaoOrcamentaria.update({
      where: { id },
      data: data as never,
      include: {
        naturezaDespesa: { select: { id: true, codigo: true, label: true } },
        fonteRecurso: { select: { id: true, codigo: true, label: true } },
      },
    });
  },

  async deleteDotacao(id: string) {
    const db = getPrisma();
    await db.dotacaoOrcamentaria.delete({ where: { id } });
    return { success: true };
  },

  async listContratoDotacoes(contratoId: string) {
    const db = getPrisma();
    return db.contratoDotacao.findMany({
      where: { contratoId },
      include: {
        dotacao: {
          include: {
            naturezaDespesa: { select: { id: true, codigo: true, label: true } },
            fonteRecurso: { select: { id: true, codigo: true, label: true } },
          },
        },
      },
      orderBy: [{ exercicio: 'desc' }],
    });
  },

  async linkContratoDotacao(contratoId: string, data: ContratoDotacaoCreateInput) {
    const db = getPrisma();
    return db.contratoDotacao.create({
      data: {
        contratoId,
        dotacaoId: data.dotacaoId,
        exercicio: data.exercicio,
        valorPrevistoCents: BigInt(data.valorPrevistoCents),
      },
      include: {
        dotacao: {
          include: {
            naturezaDespesa: { select: { id: true, codigo: true, label: true } },
            fonteRecurso: { select: { id: true, codigo: true, label: true } },
          },
        },
      },
    });
  },

  async unlinkContratoDotacao(contratoId: string, id: string) {
    const db = getPrisma();
    const result = await db.contratoDotacao.deleteMany({ where: { id, contratoId } });
    return result.count > 0;
  },

  async listEmpenhos(contratoId: string) {
    const db = getPrisma();
    return db.empenho.findMany({
      where: { contratoId },
      include: {
        dotacao: { select: { id: true, codigo: true, exercicio: true } },
      },
      orderBy: [{ exercicio: 'desc' }, { data: 'desc' }],
    });
  },

  async createEmpenho(contratoId: string, data: EmpenhoCreateInput) {
    const db = getPrisma();
    return db.empenho.create({
      data: {
        contratoId,
        dotacaoId: data.dotacaoId,
        numero: data.numero,
        exercicio: data.exercicio,
        tipo: data.tipo as never,
        data: new Date(data.data),
        valorCents: BigInt(data.valorCents),
        valorLiquidadoCents: BigInt(data.valorLiquidadoCents),
        valorPagoCents: BigInt(data.valorPagoCents),
        situacao: data.situacao as never,
      },
      include: {
        dotacao: { select: { id: true, codigo: true, exercicio: true } },
      },
    });
  },

  async updateEmpenho(contratoId: string, id: string, data: EmpenhoUpdateInput) {
    const db = getPrisma();
    const patch: Record<string, unknown> = { ...data };
    if (data.data) patch.data = new Date(data.data);
    for (const key of ['valorCents', 'valorLiquidadoCents', 'valorPagoCents'] as const) {
      if (data[key] != null) patch[key] = BigInt(data[key] as number);
    }
    await db.empenho.updateMany({ where: { id, contratoId }, data: patch as never });
    return db.empenho.findFirst({
      where: { id, contratoId },
      include: { dotacao: { select: { id: true, codigo: true, exercicio: true } } },
    });
  },

  async deleteEmpenho(contratoId: string, id: string) {
    const db = getPrisma();
    const result = await db.empenho.deleteMany({ where: { id, contratoId } });
    return result.count > 0;
  },

  async listReservas(filters?: { contratoId?: string }) {
    const db = getPrisma();
    return db.reservaOrcamentaria.findMany({
      where: filters?.contratoId ? { contratoId: filters.contratoId } : undefined,
      orderBy: [{ data: 'desc' }],
    });
  },

  async createReserva(data: ReservaCreateInput) {
    const db = getPrisma();
    return db.reservaOrcamentaria.create({
      data: {
        contratoId: data.contratoId,
        processoId: data.processoId,
        numero: data.numero,
        data: new Date(data.data),
        valorCents: BigInt(data.valorCents),
        situacao: data.situacao as never,
      },
    });
  },

  async deleteReserva(id: string) {
    const db = getPrisma();
    await db.reservaOrcamentaria.delete({ where: { id } });
    return { success: true };
  },

  async listPublicacoes(filters: { contratoId?: string; alteracaoId?: string }) {
    const db = getPrisma();
    return db.publicacao.findMany({
      where: {
        ...(filters.contratoId ? { contratoId: filters.contratoId } : {}),
        ...(filters.alteracaoId ? { alteracaoId: filters.alteracaoId } : {}),
      },
      include: {
        veiculo: { select: { id: true, codigo: true, label: true } },
      },
      orderBy: [{ dataPublicacao: 'desc' }],
    });
  },

  async createPublicacao(data: PublicacaoCreateInput) {
    const veiculoId = await resolveDominioValorId(
      'veiculo-publicacao',
      data.veiculoId,
      data.veiculoCodigo,
    );
    if (!veiculoId) throw Object.assign(new Error('Veículo de publicação inválido'), { status: 400 });
    const db = getPrisma();
    return db.publicacao.create({
      data: {
        contratoId: data.contratoId,
        alteracaoId: data.alteracaoId,
        veiculoId,
        dataPublicacao: new Date(data.dataPublicacao),
        numeroEdicao: data.numeroEdicao,
        idPncp: data.idPncp,
        url: data.url,
      },
      include: {
        veiculo: { select: { id: true, codigo: true, label: true } },
      },
    });
  },

  async deletePublicacao(id: string) {
    const db = getPrisma();
    await db.publicacao.delete({ where: { id } });
    return { success: true };
  },

  async listDocumentos(filters: {
    contratoId?: string;
    alteracaoId?: string;
    processoId?: string;
  }) {
    const db = getPrisma();
    return db.documento.findMany({
      where: {
        ...(filters.contratoId ? { contratoId: filters.contratoId } : {}),
        ...(filters.alteracaoId ? { alteracaoId: filters.alteracaoId } : {}),
        ...(filters.processoId ? { processoId: filters.processoId } : {}),
      },
      include: {
        tipoDocumento: { select: { id: true, codigo: true, label: true } },
      },
      orderBy: [{ createdAt: 'desc' }],
    });
  },

  async createDocumento(data: DocumentoCreateInput) {
    const tipoDocumentoId = await resolveDominioValorId(
      'tipo-documento',
      data.tipoDocumentoId,
      data.tipoDocumentoCodigo,
    );
    if (!tipoDocumentoId) {
      throw Object.assign(new Error('Tipo de documento inválido'), { status: 400 });
    }
    const db = getPrisma();
    return db.documento.create({
      data: {
        contratoId: data.contratoId,
        alteracaoId: data.alteracaoId,
        processoId: data.processoId,
        tipoDocumentoId,
        nome: data.nome,
        storageKey: data.storageKey,
        urlExterna: data.urlExterna,
        mimeType: data.mimeType,
        tamanhoBytes: data.tamanhoBytes,
        uploadedById: data.uploadedById,
      },
      include: {
        tipoDocumento: { select: { id: true, codigo: true, label: true } },
      },
    });
  },

  async deleteDocumento(id: string) {
    const db = getPrisma();
    await db.documento.delete({ where: { id } });
    return { success: true };
  },

  /** Contrato dono do registro, para checagem de escopo antes de excluir. */
  async contratoIdOfReserva(id: string) {
    const row = await getPrisma().reservaOrcamentaria.findUnique({
      where: { id },
      select: { contratoId: true },
    });
    return row?.contratoId ?? null;
  },

  async contratoIdOfPublicacao(id: string) {
    const row = await getPrisma().publicacao.findUnique({
      where: { id },
      select: { contratoId: true },
    });
    return row?.contratoId ?? null;
  },

  async contratoIdOfDocumento(id: string) {
    const row = await getPrisma().documento.findUnique({
      where: { id },
      select: { contratoId: true },
    });
    return row?.contratoId ?? null;
  },
};
