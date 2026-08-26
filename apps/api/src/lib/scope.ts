import type { Request } from 'express';
import { normalizeRole } from './authTypes';
import { forbidden, notFound } from './errors';
import { getPrisma } from './prisma';

export type OrgaoScope = { orgaoId?: string | null };

const OUT_OF_SCOPE = 'Contrato fora do escopo do órgão';

/**
 * Principais criados pela própria API, que legitimamente não têm órgão: o
 * usuário do bypass de desenvolvimento e os papéis sintéticos da suíte de
 * testes. Mesma convenção já usada em `authService.me`.
 */
function isSyntheticPrincipal(id: string): boolean {
  return id === 'system' || id.startsWith('user-');
}

/**
 * Escopo de órgão do requisitante.
 *
 * ADMIN enxerga tudo; os demais papéis ficam restritos ao próprio órgão. Um
 * usuário real sem órgão vinculado não tem escopo possível, então o acesso é
 * negado em vez de liberado — o contrário abriria todos os órgãos.
 */
export function getOrgaoScope(req: Request): OrgaoScope {
  const user = req.user;
  if (!user) throw forbidden('Requisição sem usuário autenticado');
  if (normalizeRole(user.role) === 'ADMIN') return {};
  if (isSyntheticPrincipal(user.id)) return {};
  if (!user.orgaoId) throw forbidden('Usuário sem órgão vinculado');
  return { orgaoId: user.orgaoId };
}

export function assertOrgaoInScope(orgaoId: string | null | undefined, req: Request): void {
  const scope = getOrgaoScope(req);
  if (scope.orgaoId && orgaoId !== scope.orgaoId) throw forbidden(OUT_OF_SCOPE);
}

/**
 * Garante que o contrato existe e pertence ao escopo do requisitante.
 * Substitui os `ensureContrato` que só checavam existência.
 */
export async function assertContratoInScope(contratoId: string, req: Request) {
  const contrato = await getPrisma().contrato.findUnique({
    where: { id: contratoId },
    select: { id: true, unidadeGestoraId: true },
  });
  if (!contrato) throw notFound('Contract not found');
  assertOrgaoInScope(contrato.unidadeGestoraId, req);
  return contrato;
}

/**
 * Valida o destino de um contrato na criação/edição. Aceita tanto o id do
 * órgão quanto o de uma unidade organizacional dele, porque o repositório
 * promove unidade → órgão por compatibilidade.
 */
export async function assertUnidadeGestoraInScope(
  unidadeGestoraId: string | null | undefined,
  req: Request,
): Promise<void> {
  const scope = getOrgaoScope(req);
  if (!scope.orgaoId || !unidadeGestoraId) return;
  if (unidadeGestoraId === scope.orgaoId) return;
  const unidade = await getPrisma().unidadeOrganizacional.findUnique({
    where: { id: unidadeGestoraId },
    select: { orgaoId: true },
  });
  if (unidade?.orgaoId === scope.orgaoId) return;
  throw forbidden(OUT_OF_SCOPE);
}

/** Igual a `assertContratoInScope`, mas devolve o registro completo. */
export async function loadContratoInScope(contratoId: string, req: Request) {
  const contrato = await getPrisma().contrato.findUnique({ where: { id: contratoId } });
  if (!contrato) throw notFound('Contract not found');
  assertOrgaoInScope(contrato.unidadeGestoraId, req);
  return contrato;
}
