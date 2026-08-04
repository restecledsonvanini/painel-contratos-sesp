import {
  EmpresaCreateSchema,
  EmpresaUpdateSchema,
  EntidadeGestoraCreateSchema,
  EntidadeGestoraUpdateSchema,
  FornecedorCreateSchema,
  FornecedorUpdateSchema,
  ServicoCreateSchema,
  ServicoUpdateSchema,
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

  empresas: {
    list: () => referenciaRepository.empresas.list(),
    get: async (id: string) => {
      const record = await referenciaRepository.empresas.get(id);
      if (!record) throw notFound('Empresa not found');
      return record;
    },
    create: (body: unknown, req: Request) => {
      const parsed = EmpresaCreateSchema.parse(body);
      return referenciaRepository.empresas.create(parsed, actor(req));
    },
    update: async (id: string, body: unknown, req: Request) => {
      const parsed = EmpresaUpdateSchema.parse(body);
      const existing = await referenciaRepository.empresas.get(id);
      if (!existing) throw notFound('Empresa not found');
      return referenciaRepository.empresas.update(id, parsed, existing, actor(req));
    },
    remove: async (id: string, req: Request) => {
      const existing = await referenciaRepository.empresas.get(id);
      if (!existing) throw notFound('Empresa not found');
      await referenciaRepository.empresas.remove(id, existing, actor(req));
      return { success: true };
    },
  },

  entidadesGestoras: {
    list: () => referenciaRepository.entidadesGestoras.list(),
    get: async (id: string) => {
      const record = await referenciaRepository.entidadesGestoras.get(id);
      if (!record) throw notFound('Entidade not found');
      return record;
    },
    create: (body: unknown, req: Request) => {
      const parsed = EntidadeGestoraCreateSchema.parse(body);
      return referenciaRepository.entidadesGestoras.create(parsed, actor(req));
    },
    update: async (id: string, body: unknown, req: Request) => {
      const parsed = EntidadeGestoraUpdateSchema.parse(body);
      const existing = await referenciaRepository.entidadesGestoras.get(id);
      if (!existing) throw notFound('Entidade not found');
      return referenciaRepository.entidadesGestoras.update(id, parsed, existing, actor(req));
    },
    remove: async (id: string, req: Request) => {
      const existing = await referenciaRepository.entidadesGestoras.get(id);
      if (!existing) throw notFound('Entidade not found');
      await referenciaRepository.entidadesGestoras.remove(id, existing, actor(req));
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

  servicos: {
    list: () => referenciaRepository.servicos.list(),
    get: async (id: string) => {
      const record = await referenciaRepository.servicos.get(id);
      if (!record) throw notFound('Servico not found');
      return record;
    },
    create: (body: unknown, req: Request) => {
      const parsed = ServicoCreateSchema.parse(body);
      return referenciaRepository.servicos.create(parsed, actor(req));
    },
    update: async (id: string, body: unknown, req: Request) => {
      const parsed = ServicoUpdateSchema.parse(body);
      const existing = await referenciaRepository.servicos.get(id);
      if (!existing) throw notFound('Servico not found');
      return referenciaRepository.servicos.update(id, parsed, existing, actor(req));
    },
    remove: async (id: string, req: Request) => {
      const existing = await referenciaRepository.servicos.get(id);
      if (!existing) throw notFound('Servico not found');
      await referenciaRepository.servicos.remove(id, existing, actor(req));
      return { success: true };
    },
  },
};
