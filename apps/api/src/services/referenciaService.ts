import {
  FornecedorCreateSchema,
  FornecedorUpdateSchema,
  UnidadeFspCreateSchema,
  UnidadeFspUpdateSchema,
} from '@painel/schema';
import type { Request } from 'express';
import { getActorId } from '../lib/audit';
import { notFound } from '../lib/errors';
import { referenciaRepository } from '../repositories/referenciaRepository';

function actor(req: Request) {
  return getActorId(req);
}

export const referenciaService = {
  unidadesFsp: {
    list: () => referenciaRepository.unidadesFsp.list(),
    get: async (id: string) => {
      const record = await referenciaRepository.unidadesFsp.get(id);
      if (!record) throw notFound('Unidade not found');
      return record;
    },
    create: (body: unknown, req: Request) => {
      const parsed = UnidadeFspCreateSchema.parse(body);
      return referenciaRepository.unidadesFsp.create(parsed, actor(req));
    },
    update: async (id: string, body: unknown, req: Request) => {
      const parsed = UnidadeFspUpdateSchema.parse(body);
      const existing = await referenciaRepository.unidadesFsp.get(id);
      if (!existing) throw notFound('Unidade not found');
      return referenciaRepository.unidadesFsp.update(id, parsed, existing, actor(req));
    },
    remove: async (id: string, req: Request) => {
      const existing = await referenciaRepository.unidadesFsp.get(id);
      if (!existing) throw notFound('Unidade not found');
      await referenciaRepository.unidadesFsp.remove(id, existing, actor(req));
      return { success: true };
    },
  },

  fornecedores: {
    list: () => referenciaRepository.fornecedores.list(),
    get: async (id: string) => {
      const record = await referenciaRepository.fornecedores.get(id);
      if (!record) throw notFound('Fornecedor not found');
      return record;
    },
    create: (body: unknown, req: Request) => {
      const parsed = FornecedorCreateSchema.parse(body);
      return referenciaRepository.fornecedores.create(parsed, actor(req));
    },
    update: async (id: string, body: unknown, req: Request) => {
      const parsed = FornecedorUpdateSchema.parse(body);
      const existing = await referenciaRepository.fornecedores.get(id);
      if (!existing) throw notFound('Fornecedor not found');
      return referenciaRepository.fornecedores.update(id, parsed, existing, actor(req));
    },
    remove: async (id: string, req: Request) => {
      const existing = await referenciaRepository.fornecedores.get(id);
      if (!existing) throw notFound('Fornecedor not found');
      await referenciaRepository.fornecedores.remove(id, existing, actor(req));
      return { success: true };
    },
  },
};
