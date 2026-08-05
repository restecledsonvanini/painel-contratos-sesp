import type { ServidorCreateInput, ServidorUpdateInput } from '@painel/schema';
import { getPrisma } from '../lib/prisma';
import { notFound } from '../lib/errors';
import { parsePagination, paginationMeta, skipTake } from '../lib/pagination';

const detailInclude = {
  orgao: { select: { id: true, sigla: true, nome: true } },
  unidade: { select: { id: true, sigla: true, nome: true } },
} as const;

export const servidorRepository = {
  async list(query: Record<string, unknown> = {}, scope?: { orgaoId?: string | null }) {
    const { page, pageSize, q } = parsePagination(query);
    const { skip, take } = skipTake(page, pageSize);
    const ativoOnly = String(query.ativo ?? 'true') !== 'false';
    const where = {
      ...(ativoOnly ? { ativo: true } : {}),
      ...(scope?.orgaoId ? { orgaoId: scope.orgaoId } : {}),
      ...(q
        ? {
            OR: [
              { nome: { contains: q, mode: 'insensitive' as const } },
              { cpf: { contains: q.replace(/\D/g, '') || q } },
              { rgFuncional: { contains: q, mode: 'insensitive' as const } },
              { cargo: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      getPrisma().servidor.count({ where }),
      getPrisma().servidor.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take,
        include: detailInclude,
      }),
    ]);
    return { data: rows, meta: paginationMeta(total, page, pageSize) };
  },

  async listAll(scope?: { orgaoId?: string | null }) {
    return getPrisma().servidor.findMany({
      where: {
        ativo: true,
        ...(scope?.orgaoId ? { orgaoId: scope.orgaoId } : {}),
      },
      orderBy: { nome: 'asc' },
      include: detailInclude,
    });
  },

  async get(id: string) {
    const record = await getPrisma().servidor.findUnique({
      where: { id },
      include: detailInclude,
    });
    if (!record) throw notFound('Servidor não encontrado');
    return record;
  },

  async create(data: ServidorCreateInput) {
    return getPrisma().servidor.create({
      data: {
        nome: data.nome,
        cpf: data.cpf,
        rgFuncional: data.rgFuncional,
        cargo: data.cargo,
        orgaoId: data.orgaoId,
        unidadeId: data.unidadeId,
        email: data.email,
        telefone: data.telefone,
        ativo: data.ativo,
      },
      include: detailInclude,
    });
  },

  async update(id: string, data: ServidorUpdateInput) {
    await this.get(id);
    return getPrisma().servidor.update({
      where: { id },
      data,
      include: detailInclude,
    });
  },

  async remove(id: string) {
    await this.get(id);
    return getPrisma().servidor.update({
      where: { id },
      data: { ativo: false },
      include: detailInclude,
    });
  },

  async searchLookup(query: Record<string, unknown>) {
    const { page, pageSize, q } = parsePagination(query);
    const { skip, take } = skipTake(page, pageSize);
    const where = {
      ativo: true,
      ...(q
        ? {
            OR: [
              { nome: { contains: q, mode: 'insensitive' as const } },
              { cpf: { contains: q.replace(/\D/g, '') || q } },
              { cargo: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      getPrisma().servidor.count({ where }),
      getPrisma().servidor.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take,
        include: { orgao: { select: { sigla: true } } },
      }),
    ]);
    return {
      data: rows.map((s) => ({
        id: s.id,
        label: s.cargo ? `${s.nome} — ${s.cargo}` : s.nome,
        codigo: s.cpf ?? undefined,
        metadata: {
          orgao: s.orgao?.sigla ?? null,
          email: s.email,
        },
      })),
      meta: paginationMeta(total, page, pageSize),
    };
  },
};
