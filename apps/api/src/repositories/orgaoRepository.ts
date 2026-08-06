import { getPrisma } from '../lib/prisma';
import { notFound } from '../lib/errors';
import type {
  OrgaoCreateInput,
  OrgaoUpdateInput,
  UnidadeOrganizacionalCreateInput,
  UnidadeOrganizacionalUpdateInput,
} from '@painel/schema';
import { parsePagination, paginationMeta, skipTake } from '../lib/pagination';

export const orgaoRepository = {
  list() {
    return getPrisma().orgao.findMany({
      orderBy: { sigla: 'asc' },
      include: { parent: { select: { id: true, sigla: true, nome: true } } },
    });
  },

  async get(id: string) {
    const record = await getPrisma().orgao.findUnique({
      where: { id },
      include: { parent: { select: { id: true, sigla: true, nome: true } } },
    });
    if (!record) throw notFound('Órgão não encontrado');
    return record;
  },

  create(data: OrgaoCreateInput) {
    return getPrisma().orgao.create({
      data: {
        sigla: data.sigla,
        nome: data.nome,
        tipo: data.tipo,
        parentId: data.parentId ?? null,
        ativo: data.ativo ?? true,
      },
    });
  },

  async update(id: string, data: OrgaoUpdateInput) {
    await this.get(id);
    return getPrisma().orgao.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.get(id);
    return getPrisma().orgao.update({ where: { id }, data: { ativo: false } });
  },

  /**
   * Árvore SESP → forças → subunidades (UnidadeOrganizacional).
   * Nós de órgão têm kind='orgao'; nós de unidade têm kind='unidade' + nivel.
   */
  async arvore() {
    const [orgaos, unidades] = await Promise.all([
      getPrisma().orgao.findMany({ where: { ativo: true }, orderBy: { sigla: 'asc' } }),
      getPrisma().unidadeOrganizacional.findMany({
        where: { ativo: true },
        orderBy: { sigla: 'asc' },
        include: { municipio: { select: { id: true, nome: true, uf: true } } },
      }),
    ]);

    type UnitNode = {
      id: string;
      kind: 'unidade';
      label: string;
      sigla: string;
      nome: string;
      nivel: string;
      orgaoId: string;
      municipio?: { id: string; nome: string; uf: string };
      children: UnitNode[];
    };

    type OrgaoNode = {
      id: string;
      kind: 'orgao';
      label: string;
      sigla: string;
      nome: string;
      tipo: string;
      parentId: string | null;
      children: Array<OrgaoNode | UnitNode>;
    };

    const unitTrees = new Map<string, UnitNode[]>();
    for (const o of orgaos) {
      unitTrees.set(
        o.id,
        annotateUnitTree(
          buildTree(
            unidades
              .filter((u) => u.orgaoId === o.id)
              .map((u) => ({
                id: u.id,
                sigla: u.sigla,
                nome: u.nome,
                parentId: u.parentId,
                nivel: u.nivel,
                municipio: u.municipio,
              })),
          ),
          o.id,
        ) as UnitNode[],
      );
    }

    const orgaoMap = new Map<string, OrgaoNode>();
    for (const o of orgaos) {
      orgaoMap.set(o.id, {
        id: o.id,
        kind: 'orgao',
        label: `${o.sigla} — ${o.nome}`,
        sigla: o.sigla,
        nome: o.nome,
        tipo: o.tipo,
        parentId: o.parentId,
        children: [...(unitTrees.get(o.id) ?? [])],
      });
    }

    const roots: OrgaoNode[] = [];
    for (const o of orgaos) {
      const node = orgaoMap.get(o.id)!;
      if (o.parentId && orgaoMap.has(o.parentId)) {
        orgaoMap.get(o.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    // Preferência: SESP primeiro; demais raízes órfãs ao final
    roots.sort((a, b) => {
      if (a.sigla === 'SESP') return -1;
      if (b.sigla === 'SESP') return 1;
      return a.sigla.localeCompare(b.sigla);
    });

    return roots;
  },
};

export const unidadeRepository = {
  list() {
    return getPrisma().unidadeOrganizacional.findMany({
      orderBy: { sigla: 'asc' },
      include: {
        orgao: { select: { id: true, sigla: true, nome: true } },
        municipio: { select: { id: true, nome: true, uf: true, codigoIbge: true } },
      },
    });
  },

  async arvore() {
    // Mesma hierarquia SESP → forças → subunidades (compatível com UI existente)
    return orgaoRepository.arvore();
  },

  async get(id: string) {
    const record = await getPrisma().unidadeOrganizacional.findUnique({
      where: { id },
      include: {
        orgao: true,
        municipio: true,
        parent: true,
      },
    });
    if (!record) throw notFound('Unidade não encontrada');
    return record;
  },

  create(data: UnidadeOrganizacionalCreateInput) {
    return getPrisma().unidadeOrganizacional.create({
      data: {
        orgaoId: data.orgaoId,
        parentId: data.parentId ?? null,
        sigla: data.sigla,
        nome: data.nome,
        nivel: data.nivel,
        municipioId: data.municipioId,
        ativo: data.ativo ?? true,
      },
    });
  },

  async update(id: string, data: UnidadeOrganizacionalUpdateInput) {
    await this.get(id);
    return getPrisma().unidadeOrganizacional.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.get(id);
    return getPrisma().unidadeOrganizacional.update({ where: { id }, data: { ativo: false } });
  },
};

export const municipioRepository = {
  async search(query: Record<string, unknown>) {
    const { page, pageSize, q } = parsePagination(query);
    const { skip, take } = skipTake(page, pageSize);
    const where = q
      ? {
          OR: [
            { nome: { contains: q, mode: 'insensitive' as const } },
            { codigoIbge: { contains: q } },
          ],
        }
      : {};
    const [total, data] = await Promise.all([
      getPrisma().municipio.count({ where }),
      getPrisma().municipio.findMany({ where, orderBy: { nome: 'asc' }, skip, take }),
    ]);
    return { data, meta: paginationMeta(total, page, pageSize) };
  },
};

function buildTree(
  flat: Array<{
    id: string;
    sigla: string;
    nome: string;
    parentId: string | null;
    nivel: string;
    municipio: { id: string; nome: string; uf: string };
  }>,
) {
  type Node = {
    id: string;
    label: string;
    sigla: string;
    nome: string;
    nivel: string;
    municipio: { id: string; nome: string; uf: string };
    children: Node[];
  };
  const map = new Map<string, Node>();
  for (const u of flat) {
    map.set(u.id, {
      id: u.id,
      label: `${u.sigla} — ${u.nome}`,
      sigla: u.sigla,
      nome: u.nome,
      nivel: u.nivel,
      municipio: u.municipio,
      children: [],
    });
  }
  const roots: Node[] = [];
  for (const u of flat) {
    const node = map.get(u.id)!;
    if (u.parentId && map.has(u.parentId)) {
      map.get(u.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

/** Anexa kind/orgaoId recursivamente após buildTree (compat tipagem). */
function annotateUnitTree(
  nodes: ReturnType<typeof buildTree>,
  orgaoId: string,
): Array<
  ReturnType<typeof buildTree>[number] & { kind: 'unidade'; orgaoId: string; children: unknown[] }
> {
  return nodes.map((n) => ({
    ...n,
    kind: 'unidade' as const,
    orgaoId,
    children: annotateUnitTree(n.children, orgaoId),
  }));
}
