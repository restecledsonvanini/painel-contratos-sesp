import type {
  CatalogoItemCreateInput,
  CatalogoItemUpdateInput,
  ItemAtributoDefCreateInput,
  ItemAtributoDefUpdateInput,
  ItemContratoCreateInput,
  ItemContratoUpdateInput,
} from '@painel/schema';
import { getPrisma } from '../lib/prisma';
import { notFound } from '../lib/errors';
import { parsePagination, paginationMeta, skipTake } from '../lib/pagination';

const catalogoInclude = {
  categoriaItem: { select: { id: true, codigo: true, label: true } },
  unidadeMedidaPadrao: { select: { id: true, codigo: true, label: true } },
} as const;

const itemInclude = {
  catalogoItem: {
    include: {
      categoriaItem: { select: { id: true, codigo: true, label: true } },
    },
  },
  unidadeMedida: { select: { id: true, codigo: true, label: true } },
  unidadeDestino: { select: { id: true, sigla: true, nome: true } },
  municipioExecucao: { select: { id: true, nome: true, uf: true } },
} as const;

type CatalogItemRow = {
  quantidade: unknown;
  valorUnitarioCents: bigint | number;
  [key: string]: unknown;
};

function mapItem(row: CatalogItemRow) {
  const qtd = Number(row.quantidade);
  const unit = Number(row.valorUnitarioCents);
  return {
    ...row,
    quantidade: qtd,
    valorUnitarioCents: unit,
    valorUnitario: unit / 100,
    valorTotalCents: Math.round(qtd * unit),
    valorTotal: (qtd * unit) / 100,
  };
}

export const catalogoRepository = {
  async list(query: Record<string, unknown> = {}) {
    const { page, pageSize, q } = parsePagination(query);
    const { skip, take } = skipTake(page, pageSize);
    const categoriaItemId =
      typeof query.categoriaItemId === 'string' ? query.categoriaItemId : undefined;
    const ativoOnly = String(query.ativo ?? 'true') !== 'false';
    const where = {
      ...(ativoOnly ? { ativo: true } : {}),
      ...(categoriaItemId ? { categoriaItemId } : {}),
      ...(q
        ? {
            OR: [
              { nome: { contains: q, mode: 'insensitive' as const } },
              { codigo: { contains: q, mode: 'insensitive' as const } },
              { descricao: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      getPrisma().catalogoItem.count({ where }),
      getPrisma().catalogoItem.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take,
        include: catalogoInclude,
      }),
    ]);
    return { data: rows, meta: paginationMeta(total, page, pageSize) };
  },

  listAll() {
    return getPrisma().catalogoItem.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
      include: catalogoInclude,
    });
  },

  async get(id: string) {
    const record = await getPrisma().catalogoItem.findUnique({
      where: { id },
      include: catalogoInclude,
    });
    if (!record) throw notFound('Item de catálogo não encontrado');
    return record;
  },

  create(data: CatalogoItemCreateInput) {
    return getPrisma().catalogoItem.create({
      data: {
        categoriaItemId: data.categoriaItemId,
        codigo: data.codigo ?? null,
        nome: data.nome,
        descricao: data.descricao ?? null,
        unidadeMedidaPadraoId: data.unidadeMedidaPadraoId,
        atributosPadrao: data.atributosPadrao ?? undefined,
        ativo: data.ativo ?? true,
      },
      include: catalogoInclude,
    });
  },

  async update(id: string, data: CatalogoItemUpdateInput) {
    await this.get(id);
    return getPrisma().catalogoItem.update({
      where: { id },
      data,
      include: catalogoInclude,
    });
  },

  async remove(id: string) {
    await this.get(id);
    return getPrisma().catalogoItem.update({
      where: { id },
      data: { ativo: false },
      include: catalogoInclude,
    });
  },

  async searchLookup(query: Record<string, unknown>) {
    const { page, pageSize, q } = parsePagination(query);
    const { skip, take } = skipTake(page, pageSize);
    const categoriaItemId =
      typeof query.categoriaItemId === 'string' ? query.categoriaItemId : undefined;
    const where = {
      ativo: true,
      ...(categoriaItemId ? { categoriaItemId } : {}),
      ...(q
        ? {
            OR: [
              { nome: { contains: q, mode: 'insensitive' as const } },
              { codigo: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      getPrisma().catalogoItem.count({ where }),
      getPrisma().catalogoItem.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take,
        include: catalogoInclude,
      }),
    ]);
    return {
      data: rows.map((r) => ({
        id: r.id,
        label: r.nome,
        codigo: r.codigo ?? undefined,
        metadata: {
          categoriaItemId: r.categoriaItemId,
          categoria: r.categoriaItem.codigo,
          unidadeMedidaPadraoId: r.unidadeMedidaPadraoId,
        },
      })),
      meta: paginationMeta(total, page, pageSize),
    };
  },
};

export const atributoDefRepository = {
  listByCategoria(categoriaItemId: string, includeInativos = false) {
    return getPrisma().itemAtributoDef.findMany({
      where: {
        categoriaItemId,
        ...(includeInativos ? {} : { ativo: true }),
      },
      orderBy: [{ ordem: 'asc' }, { label: 'asc' }],
    });
  },

  async get(id: string) {
    const record = await getPrisma().itemAtributoDef.findUnique({ where: { id } });
    if (!record) throw notFound('Definição de atributo não encontrada');
    return record;
  },

  create(data: ItemAtributoDefCreateInput) {
    return getPrisma().itemAtributoDef.create({
      data: {
        categoriaItemId: data.categoriaItemId,
        chave: data.chave,
        label: data.label,
        tipo: data.tipo,
        dominioSlug: data.dominioSlug ?? null,
        obrigatorio: data.obrigatorio ?? false,
        unidade: data.unidade ?? null,
        ordem: data.ordem ?? 0,
        ajuda: data.ajuda ?? null,
        ativo: data.ativo ?? true,
      },
    });
  },

  async update(id: string, data: ItemAtributoDefUpdateInput) {
    await this.get(id);
    return getPrisma().itemAtributoDef.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.get(id);
    return getPrisma().itemAtributoDef.update({ where: { id }, data: { ativo: false } });
  },
};

export const itemContratoRepository = {
  async listByContrato(contratoId: string) {
    const rows = await getPrisma().itemContrato.findMany({
      where: { contratoId },
      orderBy: { sequencia: 'asc' },
      include: itemInclude,
    });
    return rows.map(mapItem);
  },

  async get(contratoId: string, itemId: string) {
    const record = await getPrisma().itemContrato.findFirst({
      where: { id: itemId, contratoId },
      include: itemInclude,
    });
    if (!record) throw notFound('Item do contrato não encontrado');
    return mapItem(record);
  },

  async nextSequencia(contratoId: string) {
    const last = await getPrisma().itemContrato.findFirst({
      where: { contratoId },
      orderBy: { sequencia: 'desc' },
      select: { sequencia: true },
    });
    return (last?.sequencia ?? 0) + 1;
  },

  async create(contratoId: string, data: ItemContratoCreateInput) {
    const catalogo = await catalogoRepository.get(data.catalogoItemId);
    const sequencia = data.sequencia ?? (await this.nextSequencia(contratoId));
    const created = await getPrisma().itemContrato.create({
      data: {
        contratoId,
        sequencia,
        catalogoItemId: data.catalogoItemId,
        descricaoComplementar: data.descricaoComplementar ?? null,
        quantidade: data.quantidade,
        unidadeMedidaId: data.unidadeMedidaId ?? catalogo.unidadeMedidaPadraoId,
        valorUnitarioCents: BigInt(data.valorUnitarioCents),
        periodicidade: data.periodicidade as never,
        unidadeDestinoId: data.unidadeDestinoId ?? null,
        municipioExecucaoId: data.municipioExecucaoId ?? null,
        enderecoExecucao: data.enderecoExecucao ?? null,
        atributos: data.atributos ?? undefined,
      },
      include: itemInclude,
    });
    return mapItem(created);
  },

  async update(contratoId: string, itemId: string, data: ItemContratoUpdateInput) {
    await this.get(contratoId, itemId);
    const patch: Record<string, unknown> = { ...data };
    if (typeof patch.valorUnitarioCents === 'number') {
      patch.valorUnitarioCents = BigInt(patch.valorUnitarioCents);
    }
    const updated = await getPrisma().itemContrato.update({
      where: { id: itemId },
      data: patch as never,
      include: itemInclude,
    });
    return mapItem(updated);
  },

  async remove(contratoId: string, itemId: string) {
    await this.get(contratoId, itemId);
    await getPrisma().itemContrato.delete({ where: { id: itemId } });
    return { success: true };
  },
};
