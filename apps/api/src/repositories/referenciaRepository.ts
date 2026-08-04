import { getPrisma } from '../lib/prisma';
import { writeAuditLog } from '../lib/audit';

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

  empresas: {
    list: () => getPrisma().empresa.findMany({ orderBy: { razaoSocial: 'asc' } }),
    get: (id: string) => getPrisma().empresa.findUnique({ where: { id } }),
    create: async (data: { cnpj: string; razaoSocial: string }, changedBy: string | null) => {
      const empresa = await getPrisma().empresa.create({ data });
      await audit({ tabela: 'empresa', registroId: empresa.id, action: 'create', changedBy, diff: empresa });
      return empresa;
    },
    update: async (
      id: string,
      data: Partial<{ cnpj: string; razaoSocial: string }>,
      existing: unknown,
      changedBy: string | null,
    ) => {
      const updated = await getPrisma().empresa.update({ where: { id }, data });
      await audit({
        tabela: 'empresa',
        registroId: updated.id,
        action: 'update',
        changedBy,
        diff: { before: existing, patch: data },
      });
      return updated;
    },
    remove: async (id: string, existing: { id: string }, changedBy: string | null) => {
      await getPrisma().empresa.delete({ where: { id } });
      await audit({ tabela: 'empresa', registroId: existing.id, action: 'delete', changedBy, diff: existing });
    },
  },

  entidadesGestoras: {
    list: () => getPrisma().entidadeGestora.findMany({ orderBy: { nome: 'asc' } }),
    get: (id: string) => getPrisma().entidadeGestora.findUnique({ where: { id } }),
    create: async (data: { nome: string; cpf: string }, changedBy: string | null) => {
      const entidade = await getPrisma().entidadeGestora.create({ data });
      await audit({
        tabela: 'entidadeGestora',
        registroId: entidade.id,
        action: 'create',
        changedBy,
        diff: entidade,
      });
      return entidade;
    },
    update: async (
      id: string,
      data: Partial<{ nome: string; cpf: string }>,
      existing: unknown,
      changedBy: string | null,
    ) => {
      const updated = await getPrisma().entidadeGestora.update({ where: { id }, data });
      await audit({
        tabela: 'entidadeGestora',
        registroId: updated.id,
        action: 'update',
        changedBy,
        diff: { before: existing, patch: data },
      });
      return updated;
    },
    remove: async (id: string, existing: { id: string }, changedBy: string | null) => {
      await getPrisma().entidadeGestora.delete({ where: { id } });
      await audit({
        tabela: 'entidadeGestora',
        registroId: existing.id,
        action: 'delete',
        changedBy,
        diff: existing,
      });
    },
  },

  fornecedores: {
    list: async () => {
      const rows = await getPrisma().fornecedor.findMany({ orderBy: { nome: 'asc' } });
      return rows.map((item) => ({ ...item, cnpj: item.cnpj ?? '' }));
    },
    get: async (id: string) => {
      const record = await getPrisma().fornecedor.findUnique({ where: { id } });
      return record ? { ...record, cnpj: record.cnpj ?? '' } : null;
    },
    create: async (data: { nome: string; cnpj?: string | null }, changedBy: string | null) => {
      const record = await getPrisma().fornecedor.create({
        data: { nome: data.nome, cnpj: data.cnpj || null },
      });
      await audit({ tabela: 'fornecedor', registroId: record.id, action: 'create', changedBy, diff: record });
      return { ...record, cnpj: record.cnpj ?? '' };
    },
    update: async (
      id: string,
      data: { nome?: string; cnpj?: string | null },
      existing: { nome: string; cnpj: string | null },
      changedBy: string | null,
    ) => {
      const updated = await getPrisma().fornecedor.update({
        where: { id },
        data: {
          nome: data.nome ?? existing.nome,
          cnpj: data.cnpj === undefined ? existing.cnpj : data.cnpj || null,
        },
      });
      await audit({
        tabela: 'fornecedor',
        registroId: updated.id,
        action: 'update',
        changedBy,
        diff: { before: existing, patch: data },
      });
      return { ...updated, cnpj: updated.cnpj ?? '' };
    },
    remove: async (id: string, existing: { id: string }, changedBy: string | null) => {
      await getPrisma().fornecedor.delete({ where: { id } });
      await audit({ tabela: 'fornecedor', registroId: existing.id, action: 'delete', changedBy, diff: existing });
    },
  },

  servicos: {
    list: async () => {
      const rows = await getPrisma().servico.findMany({ orderBy: { titulo: 'asc' } });
      return rows.map((item) => ({ ...item, descricao: item.descricao ?? '' }));
    },
    get: async (id: string) => {
      const record = await getPrisma().servico.findUnique({ where: { id } });
      return record ? { ...record, descricao: record.descricao ?? '' } : null;
    },
    create: async (data: { titulo: string; descricao?: string | null }, changedBy: string | null) => {
      const record = await getPrisma().servico.create({
        data: { titulo: data.titulo, descricao: data.descricao || null },
      });
      await audit({ tabela: 'servico', registroId: record.id, action: 'create', changedBy, diff: record });
      return { ...record, descricao: record.descricao ?? '' };
    },
    update: async (
      id: string,
      data: { titulo?: string; descricao?: string | null },
      existing: { titulo: string; descricao: string | null },
      changedBy: string | null,
    ) => {
      const updated = await getPrisma().servico.update({
        where: { id },
        data: {
          titulo: data.titulo ?? existing.titulo,
          descricao: data.descricao === undefined ? existing.descricao : data.descricao || null,
        },
      });
      await audit({
        tabela: 'servico',
        registroId: updated.id,
        action: 'update',
        changedBy,
        diff: { before: existing, patch: data },
      });
      return { ...updated, descricao: updated.descricao ?? '' };
    },
    remove: async (id: string, existing: { id: string }, changedBy: string | null) => {
      await getPrisma().servico.delete({ where: { id } });
      await audit({ tabela: 'servico', registroId: existing.id, action: 'delete', changedBy, diff: existing });
    },
  },
};
