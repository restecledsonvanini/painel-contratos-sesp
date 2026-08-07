import { getPrisma } from '../lib/prisma';
import { notFound, badRequest } from '../lib/errors';
import type { DominioValorCreateInput, DominioValorUpdateInput } from '@painel/schema';
import { EMAIL_DOMAINS_SLUG } from '@painel/domain';

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

  /** Bootstrap do allowlist de e-mail se o seed ainda não rodou neste DB. */
  async ensureEmailDomainsDominio() {
    const db = getPrisma();
    const existing = await db.dominio.findUnique({ where: { slug: EMAIL_DOMAINS_SLUG } });
    if (existing) return existing;
    return db.dominio.create({
      data: {
        slug: EMAIL_DOMAINS_SLUG,
        nome: 'Domínios de e-mail permitidos',
        descricao: 'Allowlist de domínio no login e no cadastro de usuários (ADMIN).',
        editavelPeloUsuario: true,
        valores: {
          create: [{ codigo: 'sesp.pr.gov.br', label: 'sesp.pr.gov.br', ordem: 1 }],
        },
      },
    });
  },

  async listValores(slug: string, includeInativos = false) {
    let dominio = await getPrisma().dominio.findUnique({ where: { slug } });
    if (!dominio && slug === EMAIL_DOMAINS_SLUG) {
      dominio = await this.ensureEmailDomainsDominio();
    }
    if (!dominio) throw notFound(`Domínio '${slug}' não encontrado`);
    return getPrisma().dominioValor.findMany({
      where: {
        dominioId: dominio.id,
        ...(includeInativos ? {} : { ativo: true }),
      },
      orderBy: [{ ordem: 'asc' }, { label: 'asc' }],
    });
  },

  async createValor(slug: string, data: DominioValorCreateInput) {
    let dominio = await getPrisma().dominio.findUnique({ where: { slug } });
    if (!dominio && slug === EMAIL_DOMAINS_SLUG) {
      dominio = await this.ensureEmailDomainsDominio();
    }
    if (!dominio) throw notFound(`Domínio '${slug}' não encontrado`);
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
