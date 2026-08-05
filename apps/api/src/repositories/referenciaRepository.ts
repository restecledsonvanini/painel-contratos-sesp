import { getPrisma } from '../lib/prisma';
import { writeAuditLog } from '../lib/audit';
import { fornecedorRepository } from './fornecedorRepository';
import { servidorRepository } from './servidorRepository';
import { catalogoRepository } from './catalogoRepository';
import type { FornecedorCreateInput, ServidorCreateInput } from '@painel/schema';

type AuditArgs = {
  tabela: string;
  registroId: string;
  action: string;
  changedBy: string | null;
  diff?: unknown;
};

async function audit(args: AuditArgs) {
  await writeAuditLog({
    tabela: args.tabela,
    registroId: args.registroId,
    action: args.action,
    diff: args.diff,
    changedBy: args.changedBy,
    source: 'api',
  });
}

function asEmpresaShape(f: {
  id: string;
  documento: string;
  razaoSocial: string;
  [key: string]: unknown;
}) {
  return { id: f.id, cnpj: f.documento, razaoSocial: f.razaoSocial };
}

function asEntidadeShape(s: { id: string; nome: string; cpf: string | null; [key: string]: unknown }) {
  return { id: s.id, nome: s.nome, cpf: s.cpf ?? '' };
}

export const referenciaRepository = {
  unidadesFsp: {
    list: () => getPrisma().unidadeFsp.findMany({ orderBy: { nome: 'asc' } }),
    get: (id: string) => getPrisma().unidadeFsp.findUnique({ where: { id } }),
    create: async (data: { sigla: string; nome: string }, changedBy: string | null) => {
      const unidade = await getPrisma().unidadeFsp.create({ data });
      await audit({ tabela: 'unidadeFsp', registroId: unidade.id, action: 'create', changedBy, diff: unidade });
      return unidade;
    },
    update: async (id: string, data: Partial<{ sigla: string; nome: string }>, existing: unknown, changedBy: string | null) => {
      const updated = await getPrisma().unidadeFsp.update({ where: { id }, data });
      await audit({
        tabela: 'unidadeFsp',
        registroId: updated.id,
        action: 'update',
        changedBy,
        diff: { before: existing, patch: data },
      });
      return updated;
    },
    remove: async (id: string, existing: { id: string }, changedBy: string | null) => {
      await getPrisma().unidadeFsp.delete({ where: { id } });
      await audit({ tabela: 'unidadeFsp', registroId: existing.id, action: 'delete', changedBy, diff: existing });
    },
  },

  /** Compat: Empresa → Fornecedor */
  empresas: {
    list: async () => {
      const rows = await fornecedorRepository.listAll();
      return rows.map(asEmpresaShape);
    },
    get: async (id: string) => asEmpresaShape(await fornecedorRepository.get(id)),
    create: async (data: FornecedorCreateInput, changedBy: string | null) => {
      const created = await fornecedorRepository.create(data);
      await audit({ tabela: 'fornecedor', registroId: created.id, action: 'create', changedBy, diff: created });
      return asEmpresaShape(created);
    },
    update: async (
      id: string,
      data: { documento?: string; razaoSocial?: string },
      existing: unknown,
      changedBy: string | null,
    ) => {
      const updated = await fornecedorRepository.update(id, data);
      await audit({
        tabela: 'fornecedor',
        registroId: updated.id,
        action: 'update',
        changedBy,
        diff: { before: existing, patch: data },
      });
      return asEmpresaShape(updated);
    },
    remove: async (id: string, existing: { id: string }, changedBy: string | null) => {
      await fornecedorRepository.remove(id);
      await audit({ tabela: 'fornecedor', registroId: existing.id, action: 'delete', changedBy, diff: existing });
    },
  },

  /** Compat: EntidadeGestora → Servidor */
  entidadesGestoras: {
    list: async () => {
      const rows = await servidorRepository.listAll();
      return rows.map(asEntidadeShape);
    },
    get: async (id: string) => asEntidadeShape(await servidorRepository.get(id)),
    create: async (data: ServidorCreateInput, changedBy: string | null) => {
      const created = await servidorRepository.create(data);
      await audit({ tabela: 'servidor', registroId: created.id, action: 'create', changedBy, diff: created });
      return asEntidadeShape(created);
    },
    update: async (
      id: string,
      data: { nome?: string; cpf?: string | null },
      existing: unknown,
      changedBy: string | null,
    ) => {
      const updated = await servidorRepository.update(id, data);
      await audit({
        tabela: 'servidor',
        registroId: updated.id,
        action: 'update',
        changedBy,
        diff: { before: existing, patch: data },
      });
      return asEntidadeShape(updated);
    },
    remove: async (id: string, existing: { id: string }, changedBy: string | null) => {
      await servidorRepository.remove(id);
      await audit({ tabela: 'servidor', registroId: existing.id, action: 'delete', changedBy, diff: existing });
    },
  },

  fornecedores: {
    list: () => fornecedorRepository.listAll(),
    get: (id: string) => fornecedorRepository.get(id),
    create: async (data: FornecedorCreateInput, changedBy: string | null) => {
      const record = await fornecedorRepository.create(data);
      await audit({ tabela: 'fornecedor', registroId: record.id, action: 'create', changedBy, diff: record });
      return record;
    },
    update: async (id: string, data: Record<string, unknown>, existing: unknown, changedBy: string | null) => {
      const updated = await fornecedorRepository.update(id, data as never);
      await audit({
        tabela: 'fornecedor',
        registroId: updated.id,
        action: 'update',
        changedBy,
        diff: { before: existing, patch: data },
      });
      return updated;
    },
    remove: async (id: string, existing: { id: string }, changedBy: string | null) => {
      await fornecedorRepository.remove(id);
      await audit({ tabela: 'fornecedor', registroId: existing.id, action: 'delete', changedBy, diff: existing });
    },
  },

  servicos: {
    list: async () => {
      const rows = await catalogoRepository.listAll();
      return rows.map((item) => ({
        id: item.id,
        titulo: item.nome,
        descricao: item.descricao ?? '',
      }));
    },
    get: async (id: string) => {
      const record = await catalogoRepository.get(id);
      return { id: record.id, titulo: record.nome, descricao: record.descricao ?? '' };
    },
    create: async (
      data: { titulo: string; descricao?: string | null },
      changedBy: string | null,
    ) => {
      const db = getPrisma();
      const cat = await db.dominioValor.findFirst({
        where: { dominio: { slug: 'categoria-item' }, codigo: 'SERVICO' },
      });
      const um = await db.dominioValor.findFirst({
        where: { dominio: { slug: 'unidade-medida' }, codigo: 'SERVICO' },
      });
      if (!cat || !um) throw new Error('Domínios categoria-item/unidade-medida ausentes');
      const record = await catalogoRepository.create({
        categoriaItemId: cat.id,
        nome: data.titulo,
        descricao: data.descricao ?? null,
        unidadeMedidaPadraoId: um.id,
      });
      await audit({
        tabela: 'catalogoItem',
        registroId: record.id,
        action: 'create',
        changedBy,
        diff: record,
      });
      return { id: record.id, titulo: record.nome, descricao: record.descricao ?? '' };
    },
    update: async (
      id: string,
      data: { titulo?: string; descricao?: string | null },
      existing: { titulo: string; descricao: string | null },
      changedBy: string | null,
    ) => {
      const updated = await catalogoRepository.update(id, {
        nome: data.titulo,
        descricao: data.descricao === undefined ? existing.descricao : data.descricao,
      });
      await audit({
        tabela: 'catalogoItem',
        registroId: updated.id,
        action: 'update',
        changedBy,
        diff: { before: existing, patch: data },
      });
      return { id: updated.id, titulo: updated.nome, descricao: updated.descricao ?? '' };
    },
    remove: async (id: string, existing: { id: string }, changedBy: string | null) => {
      await catalogoRepository.remove(id);
      await audit({
        tabela: 'catalogoItem',
        registroId: existing.id,
        action: 'delete',
        changedBy,
        diff: existing,
      });
    },
  },
};
