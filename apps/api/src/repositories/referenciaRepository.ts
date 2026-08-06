import { getPrisma } from '../lib/prisma';
import { writeAuditLog } from '../lib/audit';
import { fornecedorRepository } from './fornecedorRepository';
import type { FornecedorCreateInput } from '@painel/schema';

/** Auditoria app-level só para entidades sem trigger (UnidadeFsp). */
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
      await audit({
        tabela: 'unidadeFsp',
        registroId: unidade.id,
        action: 'create',
        changedBy,
        diff: unidade,
      });
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
};
