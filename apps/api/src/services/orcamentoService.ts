import type {
  ContratoDotacaoCreateInput,
  DocumentoCreateInput,
  DotacaoCreateInput,
  EmpenhoCreateInput,
  EmpenhoUpdateInput,
  PublicacaoCreateInput,
  ReservaCreateInput,
} from '@painel/schema';
import type { Request } from 'express';
import { badRequest, notFound } from '../lib/errors';
import { assertContratoInScope } from '../lib/scope';
import { orcamentoRepository } from '../repositories/orcamentoRepository';
import {
  mapContratoDotacao,
  mapDocumento,
  mapDotacao,
  mapEmpenho,
  mapPublicacao,
  mapReserva,
} from './orcamentoMappers';

const ensureContrato = assertContratoInScope;

/** Exclusões por id global: descobre o contrato dono e valida o escopo. */
async function ensureOwnerContrato(contratoId: string | null, req: Request) {
  if (contratoId) await assertContratoInScope(contratoId, req);
}

type PgLike = {
  status?: number;
  code?: string;
  message?: string;
  meta?: { code?: string; message?: string };
};

function asPg(err: unknown): PgLike {
  return typeof err === 'object' && err ? (err as PgLike) : {};
}

function wrapPg(err: unknown, notFoundLabel?: string): never {
  const e = asPg(err);
  if (notFoundLabel && e.code === 'P2025') throw notFound(notFoundLabel);
  if (e.status === 400) throw badRequest(e.message || 'Bad request');
  if (e.code === 'P2002') throw badRequest('Registro duplicado');
  if (e.code === 'P2003') throw badRequest('Referência inválida');
  if (e.code === '23514' || String(e.message || '').includes('check_violation')) {
    throw badRequest(e.meta?.message || e.message || 'Violação de regra');
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
    } catch (err) {
      wrapPg(err, 'Dotação not found');
    }
  },

  async deleteDotacao(id: string) {
    try {
      return await orcamentoRepository.deleteDotacao(id);
    } catch (err) {
      wrapPg(err, 'Dotação not found');
    }
  },

  async listContratoDotacoes(contratoId: string, req: Request) {
    await ensureContrato(contratoId, req);
    return (await orcamentoRepository.listContratoDotacoes(contratoId)).map(mapContratoDotacao);
  },

  async linkContratoDotacao(contratoId: string, body: ContratoDotacaoCreateInput, req: Request) {
    await ensureContrato(contratoId, req);
    try {
      return mapContratoDotacao(await orcamentoRepository.linkContratoDotacao(contratoId, body));
    } catch (err) {
      wrapPg(err);
    }
  },

  async unlinkContratoDotacao(contratoId: string, id: string, req: Request) {
    await ensureContrato(contratoId, req);
    const ok = await orcamentoRepository.unlinkContratoDotacao(contratoId, id);
    if (!ok) throw notFound('Vínculo de dotação not found');
    return { success: true };
  },

  async listEmpenhos(contratoId: string, req: Request) {
    await ensureContrato(contratoId, req);
    return (await orcamentoRepository.listEmpenhos(contratoId)).map(mapEmpenho);
  },

  async createEmpenho(contratoId: string, body: EmpenhoCreateInput, req: Request) {
    await ensureContrato(contratoId, req);
    try {
      return mapEmpenho(await orcamentoRepository.createEmpenho(contratoId, body));
    } catch (err) {
      wrapPg(err);
    }
  },

  async updateEmpenho(contratoId: string, id: string, body: EmpenhoUpdateInput, req: Request) {
    await ensureContrato(contratoId, req);
    try {
      const row = await orcamentoRepository.updateEmpenho(contratoId, id, body);
      if (!row) throw notFound('Empenho not found');
      return mapEmpenho(row);
    } catch (err) {
      wrapPg(err);
    }
  },

  async deleteEmpenho(contratoId: string, id: string, req: Request) {
    await ensureContrato(contratoId, req);
    const ok = await orcamentoRepository.deleteEmpenho(contratoId, id);
    if (!ok) throw notFound('Empenho not found');
    return { success: true };
  },

  async listReservas(contratoId: string | undefined, req: Request) {
    if (contratoId) await ensureContrato(contratoId, req);
    return (await orcamentoRepository.listReservas({ contratoId })).map(mapReserva);
  },

  async createReserva(body: ReservaCreateInput, req: Request) {
    if (body.contratoId) await ensureContrato(body.contratoId, req);
    try {
      return mapReserva(await orcamentoRepository.createReserva(body));
    } catch (err) {
      wrapPg(err);
    }
  },

  async deleteReserva(id: string, req: Request) {
    await ensureOwnerContrato(await orcamentoRepository.contratoIdOfReserva(id), req);
    try {
      return await orcamentoRepository.deleteReserva(id);
    } catch (err) {
      wrapPg(err, 'Reserva not found');
    }
  },

  async listPublicacoes(
    filters: { contratoId?: string; alteracaoId?: string },
    req: Request,
  ) {
    if (filters.contratoId) await ensureContrato(filters.contratoId, req);
    return (await orcamentoRepository.listPublicacoes(filters)).map(mapPublicacao);
  },

  async createPublicacao(body: PublicacaoCreateInput, req: Request) {
    if (body.contratoId) await ensureContrato(body.contratoId, req);
    try {
      return mapPublicacao(await orcamentoRepository.createPublicacao(body));
    } catch (err) {
      wrapPg(err);
    }
  },

  async deletePublicacao(id: string, req: Request) {
    await ensureOwnerContrato(await orcamentoRepository.contratoIdOfPublicacao(id), req);
    try {
      return await orcamentoRepository.deletePublicacao(id);
    } catch (err) {
      wrapPg(err, 'Publicação not found');
    }
  },

  async listDocumentos(
    filters: {
      contratoId?: string;
      alteracaoId?: string;
      processoId?: string;
    },
    req: Request,
  ) {
    if (filters.contratoId) await ensureContrato(filters.contratoId, req);
    return (await orcamentoRepository.listDocumentos(filters)).map(mapDocumento);
  },

  async createDocumento(body: DocumentoCreateInput, req: Request) {
    if (body.contratoId) await ensureContrato(body.contratoId, req);
    try {
      return mapDocumento(await orcamentoRepository.createDocumento(body));
    } catch (err) {
      wrapPg(err);
    }
  },

  async deleteDocumento(id: string, req: Request) {
    await ensureOwnerContrato(await orcamentoRepository.contratoIdOfDocumento(id), req);
    try {
      return await orcamentoRepository.deleteDocumento(id);
    } catch (err) {
      wrapPg(err, 'Documento not found');
    }
  },
};
