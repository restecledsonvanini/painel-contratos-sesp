import { getPrisma } from '../lib/prisma';
import type { NaturezaObjeto } from '@painel/domain';

export async function resolveModalidadeId(
  modalidadeId: string | null,
  modalidadeCodigo: string | null,
) {
  if (modalidadeId) return modalidadeId;
  if (!modalidadeCodigo) return null;
  const db = getPrisma();
  const dominio = await db.dominio.findUnique({ where: { slug: 'modalidade-licitacao' } });
  if (!dominio) return null;
  const valor = await db.dominioValor.findFirst({
    where: {
      dominioId: dominio.id,
      OR: [
        { codigo: { equals: modalidadeCodigo, mode: 'insensitive' } },
        { id: modalidadeCodigo },
      ],
    },
  });
  return valor?.id ?? null;
}

export async function resolveCategoriaId(categoriaId: string | null, natureza: NaturezaObjeto) {
  if (categoriaId) return categoriaId;
  const db = getPrisma();
  const dominio = await db.dominio.findUnique({ where: { slug: 'categoria-contratacao' } });
  if (!dominio) throw new Error('Domínio categoria-contratacao não encontrado');
  const codigoPreferido =
    natureza === 'LOCACAO_BEM_MOVEL'
      ? 'LOCACAO_VEICULOS'
      : natureza === 'LOCACAO_IMOVEL'
        ? 'LOCACAO_IMOVEIS'
        : natureza === 'COMPRA'
          ? 'GENEROS_ALIMENTICIOS'
          : 'SERVICO_EVENTUAL';
  const preferido = await db.dominioValor.findFirst({
    where: { dominioId: dominio.id, codigo: codigoPreferido },
  });
  if (preferido) return preferido.id;
  const any = await db.dominioValor.findFirst({
    where: { dominioId: dominio.id, ativo: true },
    orderBy: { ordem: 'asc' },
  });
  if (!any) throw new Error('Nenhuma categoria de contratação cadastrada');
  return any.id;
}

/** Resolve unidade gestora como Orgao (força/SESP). Legado FSP → Orgao por sigla. */
export async function resolveUnidadeGestoraId(
  unidadeGestoraId: string | null,
  unidadeFspIdLegacy: string | null,
) {
  const db = getPrisma();
  if (unidadeGestoraId) {
    const orgao = await db.orgao.findUnique({ where: { id: unidadeGestoraId } });
    if (orgao) return orgao.id;
    const unidade = await db.unidadeOrganizacional.findUnique({ where: { id: unidadeGestoraId } });
    if (unidade) return unidade.orgaoId;
    return null;
  }
  if (!unidadeFspIdLegacy) return null;
  const fsp = await db.unidadeFsp.findUnique({ where: { id: unidadeFspIdLegacy } });
  if (!fsp) return null;
  const orgao = await db.orgao.findUnique({ where: { sigla: fsp.sigla } });
  return orgao?.id ?? null;
}

/** Unidade padrão para rateio: subunidade informada ou sede do órgão. */
export async function resolveRateioUnidadeId(orgaoId: string, subunidadeId: string | null) {
  if (subunidadeId) return subunidadeId;
  const db = getPrisma();
  const sede = await db.unidadeOrganizacional.findFirst({
    where: { orgaoId, parentId: null, ativo: true },
    orderBy: { sigla: 'asc' },
  });
  if (sede) return sede.id;
  const any = await db.unidadeOrganizacional.findFirst({
    where: { orgaoId, ativo: true },
    orderBy: { sigla: 'asc' },
  });
  return any?.id ?? null;
}

export function monthsBetween(start: Date, end: Date) {
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(1, months || 1);
}
