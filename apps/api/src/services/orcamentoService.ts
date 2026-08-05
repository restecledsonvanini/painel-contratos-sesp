import type {
  ContratoDotacaoCreateInput,
  DocumentoCreateInput,
  DotacaoCreateInput,
  EmpenhoCreateInput,
  EmpenhoUpdateInput,
  PublicacaoCreateInput,
  ReservaCreateInput,
} from '@painel/schema';
import { badRequest, notFound } from '../lib/errors';
import { getPrisma } from '../lib/prisma';
import {
  mapContratoDotacao,
  mapDocumento,
  mapDotacao,
  mapEmpenho,
  mapPublicacao,
  mapReserva,
  orcamentoRepository,
} from '../repositories/orcamentoRepository';

async function ensureContrato(contratoId: string) {
  const db = getPrisma();
  const c = await db.contrato.findUnique({ where: { id: contratoId }, select: { id: true } });
  if (!c) throw notFound('Contract not found');
}

function wrapPg(err: any): never {
  if (err?.status === 400) throw badRequest(err.message);
  if (err?.code === 'P2002') throw badRequest('Registro duplicado');
  if (err?.code === 'P2003') throw badRequest('Referência inválida');
  if (err?.code === '23514' || String(err?.message || '').includes('check_violation')) {
    throw badRequest(err.meta?.message || err.message || 'Violação de regra');
  }
  throw err;
}

export const orcamentoService = {
  async listDotacoes(query: Record<string, unknown>) {
    const exercicio = query.exercicio != null ? Number(query.exercicio) : undefined;
    const q = typeof query.q === 'string' ? query.q : undefined;
    return (await orcamentoRepository.listDotacoes({ exercicio, q })).map(mapDotacao);
  },

  async getDotacao(id: string) {
    const row = await orcamentoRepository.getDotacao(id);
    if (!row) throw notFound('Dotação not found');
    return mapDotacao(row);
  },

  async createDotacao(body: DotacaoCreateInput) {
    try {
      return mapDotacao(await orcamentoRepository.createDotacao(body));
    } catch (err) {
      wrapPg(err);
    }
  },

  async updateDotacao(id: string, body: Record<string, unknown>) {
    try {
      return mapDotacao(await orcamentoRepository.updateDotacao(id, body));
    } catch (err: any) {
      if (err?.code === 'P2025') throw notFound('Dotação not found');
      wrapPg(err);
    }
  },

  async deleteDotacao(id: string) {
    try {
      return await orcamentoRepository.deleteDotacao(id);
    } catch (err: any) {
      if (err?.code === 'P2025') throw notFound('Dotação not found');
      wrapPg(err);
    }
  },

  async listContratoDotacoes(contratoId: string) {
    await ensureContrato(contratoId);
    return (await orcamentoRepository.listContratoDotacoes(contratoId)).map(mapContratoDotacao);
  },

  async linkContratoDotacao(contratoId: string, body: ContratoDotacaoCreateInput) {
    await ensureContrato(contratoId);
    try {
      return mapContratoDotacao(await orcamentoRepository.linkContratoDotacao(contratoId, body));
    } catch (err) {
      wrapPg(err);
    }
  },

  async unlinkContratoDotacao(contratoId: string, id: string) {
    await ensureContrato(contratoId);
    const ok = await orcamentoRepository.unlinkContratoDotacao(contratoId, id);
    if (!ok) throw notFound('Vínculo de dotação not found');
    return { success: true };
  },

  async listEmpenhos(contratoId: string) {
    await ensureContrato(contratoId);
    return (await orcamentoRepository.listEmpenhos(contratoId)).map(mapEmpenho);
  },

  async createEmpenho(contratoId: string, body: EmpenhoCreateInput) {
    await ensureContrato(contratoId);
    try {
      return mapEmpenho(await orcamentoRepository.createEmpenho(contratoId, body));
    } catch (err) {
      wrapPg(err);
    }
  },

  async updateEmpenho(contratoId: string, id: string, body: EmpenhoUpdateInput) {
    await ensureContrato(contratoId);
    try {
      const row = await orcamentoRepository.updateEmpenho(contratoId, id, body);
      if (!row) throw notFound('Empenho not found');
      return mapEmpenho(row);
    } catch (err) {
      wrapPg(err);
    }
  },

  async deleteEmpenho(contratoId: string, id: string) {
    await ensureContrato(contratoId);
    const ok = await orcamentoRepository.deleteEmpenho(contratoId, id);
    if (!ok) throw notFound('Empenho not found');
    return { success: true };
  },

  async listReservas(contratoId?: string) {
    if (contratoId) await ensureContrato(contratoId);
    return (await orcamentoRepository.listReservas({ contratoId })).map(mapReserva);
  },

  async createReserva(body: ReservaCreateInput) {
    if (body.contratoId) await ensureContrato(body.contratoId);
    try {
      return mapReserva(await orcamentoRepository.createReserva(body));
    } catch (err) {
      wrapPg(err);
    }
  },

  async deleteReserva(id: string) {
    try {
      return await orcamentoRepository.deleteReserva(id);
    } catch (err: any) {
      if (err?.code === 'P2025') throw notFound('Reserva not found');
      wrapPg(err);
    }
  },

  async listPublicacoes(filters: { contratoId?: string; alteracaoId?: string }) {
    if (filters.contratoId) await ensureContrato(filters.contratoId);
    return (await orcamentoRepository.listPublicacoes(filters)).map(mapPublicacao);
  },

  async createPublicacao(body: PublicacaoCreateInput) {
    if (body.contratoId) await ensureContrato(body.contratoId);
    try {
      return mapPublicacao(await orcamentoRepository.createPublicacao(body));
    } catch (err) {
      wrapPg(err);
    }
  },

  async deletePublicacao(id: string) {
    try {
      return await orcamentoRepository.deletePublicacao(id);
    } catch (err: any) {
      if (err?.code === 'P2025') throw notFound('Publicação not found');
      wrapPg(err);
    }
  },

  async listDocumentos(filters: {
    contratoId?: string;
    alteracaoId?: string;
    processoId?: string;
  }) {
    if (filters.contratoId) await ensureContrato(filters.contratoId);
    return (await orcamentoRepository.listDocumentos(filters)).map(mapDocumento);
  },

  async createDocumento(body: DocumentoCreateInput) {
    if (body.contratoId) await ensureContrato(body.contratoId);
    try {
      return mapDocumento(await orcamentoRepository.createDocumento(body));
    } catch (err) {
      wrapPg(err);
    }
  },

  async deleteDocumento(id: string) {
    try {
      return await orcamentoRepository.deleteDocumento(id);
    } catch (err: any) {
      if (err?.code === 'P2025') throw notFound('Documento not found');
      wrapPg(err);
    }
  },
};
