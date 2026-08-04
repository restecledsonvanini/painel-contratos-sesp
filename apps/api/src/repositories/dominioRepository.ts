import { getPrisma } from '../lib/prisma';
import { notFound, badRequest } from '../lib/errors';
import type { DominioValorCreateInput, DominioValorUpdateInput } from '@painel/schema';

export const dominioRepository = {
  list() {
    return getPrisma().dominio.findMany({
      orderBy: { nome: 'asc' },
      include: { _count: { select: { valores: true } } },
    });
  },

  async getBySlug(slug: string) {
    const record = await getPrisma().dominio.findUnique({
      where: { slug },
      include: {
        valores: { orderBy: [{ ordem: 'asc' }, { label: 'asc' }] },
      },
    });
    if (!record) throw notFound(`Domínio '${slug}' não encontrado`);
    return record;
  },

  async listValores(slug: string, includeInativos = false) {
    const dominio = await this.getBySlug(slug);
    return getPrisma().dominioValor.findMany({
      where: {
        dominioId: dominio.id,
        ...(includeInativos ? {} : { ativo: true }),
      },
      orderBy: [{ ordem: 'asc' }, { label: 'asc' }],
    });
  },

  async createValor(slug: string, data: DominioValorCreateInput) {
    const dominio = await this.getBySlug(slug);
    if (!dominio.editavelPeloUsuario) {
      throw badRequest(`Domínio '${slug}' não é editável pelo usuário`);
    }
    return getPrisma().dominioValor.create({
      data: {
        dominioId: dominio.id,
        codigo: data.codigo,
        label: data.label,
        parentId: data.parentId ?? null,
        ordem: data.ordem ?? 0,
        metadata: (data.metadata ?? undefined) as object | undefined,
        codigoLegado: data.codigoLegado ?? null,
      },
    });
  },

  async updateValor(slug: string, id: string, data: DominioValorUpdateInput) {
    const dominio = await this.getBySlug(slug);
    if (!dominio.editavelPeloUsuario) {
      throw badRequest(`Domínio '${slug}' não é editável pelo usuário`);
    }
    const existing = await getPrisma().dominioValor.findFirst({
      where: { id, dominioId: dominio.id },
    });
    if (!existing) throw notFound('Valor de domínio não encontrado');

    const patch: Record<string, unknown> = {};
    if (data.codigo !== undefined) patch.codigo = data.codigo;
    if (data.label !== undefined) patch.label = data.label;
    if (data.parentId !== undefined) patch.parentId = data.parentId;
    if (data.ordem !== undefined) patch.ordem = data.ordem;
    if (data.metadata !== undefined) patch.metadata = data.metadata as object | null;
    if (data.ativo !== undefined) patch.ativo = data.ativo;
    if (data.codigoLegado !== undefined) patch.codigoLegado = data.codigoLegado;

    return getPrisma().dominioValor.update({
      where: { id },
      data: patch,
    });
  },

  async deactivateValor(slug: string, id: string) {
    return this.updateValor(slug, id, { ativo: false });
  },
};
