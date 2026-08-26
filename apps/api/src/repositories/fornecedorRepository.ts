import type {
  FornecedorContatoCreateInput,
  FornecedorContatoUpdateInput,
  FornecedorCreateInput,
  FornecedorSancaoCreateInput,
  FornecedorSancaoUpdateInput,
  FornecedorUpdateInput,
} from '@painel/schema';
import { getPrisma } from '../lib/prisma';
import { notFound } from '../lib/errors';
import { parsePagination, paginationMeta, skipTake } from '../lib/pagination';

const detailInclude = {
  municipio: { select: { id: true, nome: true, uf: true, codigoIbge: true } },
  contatos: { orderBy: [{ principal: 'desc' as const }, { nome: 'asc' as const }] },
  sancoes: { orderBy: { dataInicio: 'desc' as const } },
} as const;

export const fornecedorRepository = {
  async list(query: Record<string, unknown> = {}) {
    const { page, pageSize, q } = parsePagination(query);
    const { skip, take } = skipTake(page, pageSize);
    const situacao = typeof query.situacao === 'string' ? query.situacao : undefined;
    const where = {
      ...(situacao ? { situacao: situacao as 'ATIVO' | 'INATIVO' | 'IMPEDIDO' | 'INIDONEO' } : {}),
      ...(q
        ? {
            OR: [
              { razaoSocial: { contains: q, mode: 'insensitive' as const } },
              { nomeFantasia: { contains: q, mode: 'insensitive' as const } },
              { documento: { contains: q.replace(/\D/g, '') || q } },
            ],
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      getPrisma().fornecedor.count({ where }),
      getPrisma().fornecedor.findMany({
        where,
        orderBy: { razaoSocial: 'asc' },
        skip,
        take,
        include: {
          municipio: { select: { id: true, nome: true, uf: true } },
          _count: { select: { contatos: true, sancoes: true, contratos: true } },
        },
      }),
    ]);
    return {
      data: rows,
      meta: paginationMeta(total, page, pageSize),
    };
  },

  async listAll() {
    const rows = await getPrisma().fornecedor.findMany({
      where: { situacao: 'ATIVO' },
      orderBy: { razaoSocial: 'asc' },
      include: {
        _count: { select: { contatos: true, sancoes: true } },
      },
    });
    return rows;
  },

  async get(id: string) {
    const record = await getPrisma().fornecedor.findUnique({
      where: { id },
      include: detailInclude,
    });
    if (!record) throw notFound('Fornecedor não encontrado');
    return record;
  },

  async create(data: FornecedorCreateInput) {
    const { contatos, ...rest } = data;
    const created = await getPrisma().fornecedor.create({
      data: {
        tipoPessoa: rest.tipoPessoa,
        documento: rest.documento,
        razaoSocial: rest.razaoSocial,
        nomeFantasia: rest.nomeFantasia,
        inscricaoEstadual: rest.inscricaoEstadual,
        porte: rest.porte,
        municipioId: rest.municipioId,
        situacao: rest.situacao,
        codigoLegado: rest.codigoLegado,
        contatos: contatos?.length
          ? {
              create: contatos.map((c) => ({
                nome: c.nome,
                cargo: c.cargo || null,
                email: c.email || null,
                telefone: c.telefone || null,
                principal: c.principal ?? false,
              })),
            }
          : undefined,
      },
      include: detailInclude,
    });
    return created;
  },

  async update(id: string, data: FornecedorUpdateInput) {
    await this.get(id);
    const updated = await getPrisma().fornecedor.update({
      where: { id },
      data,
      include: detailInclude,
    });
    return updated;
  },

  async remove(id: string) {
    await this.get(id);
    const updated = await getPrisma().fornecedor.update({
      where: { id },
      data: { situacao: 'INATIVO' },
      include: detailInclude,
    });
    return updated;
  },

  async createContato(fornecedorId: string, data: FornecedorContatoCreateInput) {
    await this.get(fornecedorId);
    return getPrisma().fornecedorContato.create({
      data: {
        fornecedorId,
        nome: data.nome,
        cargo: data.cargo || null,
        email: data.email || null,
        telefone: data.telefone || null,
        principal: data.principal ?? false,
      },
    });
  },

  async updateContato(fornecedorId: string, contatoId: string, data: FornecedorContatoUpdateInput) {
    const contato = await getPrisma().fornecedorContato.findFirst({
      where: { id: contatoId, fornecedorId },
    });
    if (!contato) throw notFound('Contato não encontrado');
    return getPrisma().fornecedorContato.update({ where: { id: contatoId }, data });
  },

  async removeContato(fornecedorId: string, contatoId: string) {
    const contato = await getPrisma().fornecedorContato.findFirst({
      where: { id: contatoId, fornecedorId },
    });
    if (!contato) throw notFound('Contato não encontrado');
    await getPrisma().fornecedorContato.delete({ where: { id: contatoId } });
    return { success: true };
  },

  async createSancao(fornecedorId: string, data: FornecedorSancaoCreateInput) {
    await this.get(fornecedorId);
    return getPrisma().fornecedorSancao.create({
      data: {
        fornecedorId,
        tipo: data.tipo,
        processo: data.processo || null,
        dataInicio: new Date(data.dataInicio),
        dataFim: data.dataFim ? new Date(data.dataFim) : null,
        abrangencia: data.abrangencia || null,
        fonte: data.fonte || null,
      },
    });
  },

  async updateSancao(fornecedorId: string, sancaoId: string, data: FornecedorSancaoUpdateInput) {
    const sancao = await getPrisma().fornecedorSancao.findFirst({
      where: { id: sancaoId, fornecedorId },
    });
    if (!sancao) throw notFound('Sanção não encontrada');
    return getPrisma().fornecedorSancao.update({
      where: { id: sancaoId },
      data: {
        ...data,
        dataInicio: data.dataInicio ? new Date(data.dataInicio) : undefined,
        dataFim: data.dataFim === undefined ? undefined : data.dataFim ? new Date(data.dataFim) : null,
      },
    });
  },

  async removeSancao(fornecedorId: string, sancaoId: string) {
    const sancao = await getPrisma().fornecedorSancao.findFirst({
      where: { id: sancaoId, fornecedorId },
    });
    if (!sancao) throw notFound('Sanção não encontrada');
    await getPrisma().fornecedorSancao.delete({ where: { id: sancaoId } });
    return { success: true };
  },

  async searchLookup(query: Record<string, unknown>) {
    const { page, pageSize, q } = parsePagination(query);
    const { skip, take } = skipTake(page, pageSize);
    const where = {
      situacao: 'ATIVO' as const,
      ...(q
        ? {
            OR: [
              { razaoSocial: { contains: q, mode: 'insensitive' as const } },
              { nomeFantasia: { contains: q, mode: 'insensitive' as const } },
              { documento: { contains: q.replace(/\D/g, '') || q } },
            ],
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      getPrisma().fornecedor.count({ where }),
      getPrisma().fornecedor.findMany({
        where,
        orderBy: { razaoSocial: 'asc' },
        skip,
        take,
        include: {
          sancoes: {
            where: {
              OR: [{ dataFim: null }, { dataFim: { gte: new Date() } }],
            },
            take: 3,
            orderBy: { dataInicio: 'desc' },
          },
        },
      }),
    ]);
    return {
      data: rows.map((f) => ({
        id: f.id,
        label: `${f.razaoSocial} (${f.documento})`,
        codigo: f.documento,
        metadata: {
          tipoPessoa: f.tipoPessoa,
          situacao: f.situacao,
          sancoesVigentes: f.sancoes.length,
        },
      })),
      meta: paginationMeta(total, page, pageSize),
    };
  },
};
