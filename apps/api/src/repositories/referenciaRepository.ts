import { getPrisma } from '../lib/prisma';
import { writeAuditLog } from '../lib/audit';
import { fornecedorRepository } from './fornecedorRepository';
import { servidorRepository } from './servidorRepository';
import { catalogoRepository } from './catalogoRepository';
import type { FornecedorCreateInput, ServidorCreateInput } from '@painel/schema';

/** Auditoria app-level só para entidades sem trigger (UnidadeFsp, CatalogoItem). */
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
    update: async (
      id: string,
      data: Partial<{ sigla: string; nome: string }>,
      existing: unknown,
      changedBy: string | null,
    ) => {
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
      await audit({
        tabela: 'unidadeFsp',
        registroId: existing.id,
        action: 'delete',
        changedBy,
        diff: existing,
      });
    },
  },

  /** Compat: Empresa → Fornecedor (auditoria via trigger) */
  empresas: {
    list: async () => {
      const rows = await fornecedorRepository.listAll();
      return rows.map(asEmpresaShape);
    },
    get: async (id: string) => asEmpresaShape(await fornecedorRepository.get(id)),
    create: async (data: FornecedorCreateInput, _changedBy: string | null) => {
      return asEmpresaShape(await fornecedorRepository.create(data));
    },
    update: async (
      id: string,
      data: { documento?: string; razaoSocial?: string },
      _existing: unknown,
      _changedBy: string | null,
    ) => {
      return asEmpresaShape(await fornecedorRepository.update(id, data));
    },
    remove: async (id: string, _existing: { id: string }, _changedBy: string | null) => {
      await fornecedorRepository.remove(id);
    },
  },

  /** Compat: EntidadeGestora → Servidor (auditoria via trigger) */
  entidadesGestoras: {
    list: async () => {
      const rows = await servidorRepository.listAll();
      return rows.map(asEntidadeShape);
    },
    get: async (id: string) => asEntidadeShape(await servidorRepository.get(id)),
    create: async (data: ServidorCreateInput, _changedBy: string | null) => {
      return asEntidadeShape(await servidorRepository.create(data));
    },
    update: async (
      id: string,
      data: { nome?: string; cpf?: string | null },
      _existing: unknown,
      _changedBy: string | null,
    ) => {
      return asEntidadeShape(await servidorRepository.update(id, data));
    },
    remove: async (id: string, _existing: { id: string }, _changedBy: string | null) => {
      await servidorRepository.remove(id);
    },
  },

  fornecedores: {
    list: () => fornecedorRepository.listAll(),
    get: (id: string) => fornecedorRepository.get(id),
    create: async (data: FornecedorCreateInput, _changedBy: string | null) => {
      return fornecedorRepository.create(data);
    },
    update: async (
      id: string,
      data: Record<string, unknown>,
      _existing: unknown,
      _changedBy: string | null,
    ) => {
      return fornecedorRepository.update(id, data as never);
    },
    remove: async (id: string, _existing: { id: string }, _changedBy: string | null) => {
      await fornecedorRepository.remove(id);
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
