import { createHash } from 'node:crypto';
import { getPrisma } from '../lib/prisma';
import { parsePagination, paginationMeta, skipTake } from '../lib/pagination';

function toOption(v: {
  id: string;
  label: string;
  codigo: string;
  parentId: string | null;
  metadata: unknown;
}) {
  return {
    id: v.id,
    label: v.label,
    codigo: v.codigo,
    parentId: v.parentId,
    metadata: (v.metadata as Record<string, unknown> | null) ?? null,
  };
}

export const lookupRepository = {
  async buildPayload() {
    const db = getPrisma();
    const [dominios, orgaos, unidades] = await Promise.all([
      db.dominio.findMany({
        orderBy: { nome: 'asc' },
        include: {
          valores: {
            where: { ativo: true },
            orderBy: [{ ordem: 'asc' }, { label: 'asc' }],
          },
        },
      }),
      db.orgao.findMany({ where: { ativo: true }, orderBy: { sigla: 'asc' } }),
      db.unidadeOrganizacional.findMany({
        where: { ativo: true },
        orderBy: [{ sigla: 'asc' }],
        include: { municipio: { select: { id: true, nome: true, uf: true, codigoIbge: true } } },
      }),
    ]);

    const dominiosBySlug: Record<string, ReturnType<typeof toOption>[]> = {};
    const dominioMeta: Record<
      string,
      { id: string; nome: string; editavelPeloUsuario: boolean; permiteHierarquia: boolean }
    > = {};

    for (const d of dominios) {
      dominioMeta[d.slug] = {
        id: d.id,
        nome: d.nome,
        editavelPeloUsuario: d.editavelPeloUsuario,
        permiteHierarquia: d.permiteHierarquia,
      };
      dominiosBySlug[d.slug] = d.valores.map(toOption);
    }

    const unidadesPorOrgao = orgaos.map((o) => ({
      id: o.id,
      sigla: o.sigla,
      nome: o.nome,
      tipo: o.tipo,
      unidades: unidades
        .filter((u) => u.orgaoId === o.id)
        .map((u) => ({
          id: u.id,
          label: `${u.sigla} — ${u.nome}`,
          sigla: u.sigla,
          nome: u.nome,
          nivel: u.nivel,
          parentId: u.parentId,
          municipioId: u.municipioId,
          municipio: u.municipio,
        })),
    }));

    const payload = {
      dominios: dominiosBySlug,
      dominioMeta,
      orgaos: unidadesPorOrgao,
      atualizadoEm: new Date().toISOString(),
    };

    const etag = createHash('sha1').update(JSON.stringify(payload)).digest('hex');
    return { payload, etag: `"${etag}"` };
  },

  async searchSlug(slug: string, query: Record<string, unknown>) {
    const db = getPrisma();
    const { page, pageSize, q } = parsePagination(query);
    const { skip, take } = skipTake(page, pageSize);

    if (slug === 'municipios') {
      const where = q
        ? {
            OR: [
              { nome: { contains: q, mode: 'insensitive' as const } },
              { codigoIbge: { contains: q } },
            ],
          }
        : {};
      const [total, rows] = await Promise.all([
        db.municipio.count({ where }),
        db.municipio.findMany({
          where,
          orderBy: [{ nome: 'asc' }],
          skip,
          take,
        }),
      ]);
      return {
        data: rows.map((m) => ({
          id: m.id,
          label: `${m.nome}/${m.uf}`,
          codigo: m.codigoIbge,
          nome: m.nome,
          uf: m.uf,
        })),
        meta: paginationMeta(total, page, pageSize),
      };
    }

    if (slug === 'fornecedores') {
      const { fornecedorRepository } = await import('./fornecedorRepository');
      return fornecedorRepository.searchLookup(query);
    }

    if (slug === 'servidores') {
      const { servidorRepository } = await import('./servidorRepository');
      return servidorRepository.searchLookup(query);
    }

    if (slug === 'catalogo' || slug === 'catalogo-itens') {
      const { catalogoRepository } = await import('./catalogoRepository');
      return catalogoRepository.searchLookup(query);
    }

    // Domínio genérico por slug
    const dominio = await db.dominio.findUnique({ where: { slug } });
    if (!dominio) return null;

    const where = {
      dominioId: dominio.id,
      ativo: true,
      ...(q
        ? {
            OR: [
              { label: { contains: q, mode: 'insensitive' as const } },
              { codigo: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      db.dominioValor.count({ where }),
      db.dominioValor.findMany({
        where,
        orderBy: [{ ordem: 'asc' }, { label: 'asc' }],
        skip,
        take,
      }),
    ]);

    return {
      data: rows.map(toOption),
      meta: paginationMeta(total, page, pageSize),
    };
  },
};
