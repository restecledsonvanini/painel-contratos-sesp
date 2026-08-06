/**
 * Papéis de acesso (RBAC). FISCAL contratual ≠ papel de login.
 *
 * Matriz alvo (mínimo por recurso) — espelhar front + API:
 * | Recurso                         | Leitura   | Escrita      |
 * | Painel / contratos lista-detalhe | VISITANTE | —            |
 * | Contrato CUD / cadastros / CSV   | VISITANTE | ANALISTA     |
 * | Alterações / organograma write   | VISITANTE | GESTOR       |
 * | Domínios / usuários / segurança  | GESTOR*   | ADMIN        |
 * | Jobs admin (alertas, analytics)  | —         | ADMIN        |
 * (* domínios: GESTOR lê; ADMIN escreve)
 * Detalhe: plan/2026-08-06_tipagem_rbac_e_higiene.md §3
 */

export const Role = {
  VISITANTE: 'VISITANTE',
  ANALISTA: 'ANALISTA',
  GESTOR: 'GESTOR',
  ADMIN: 'ADMIN',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

/** Aliases legados ainda aceitos por um release (normalizados). */
export const LEGACY_ROLES = {
  LEITOR: 'LEITOR',
  COLABORADOR: 'COLABORADOR',
  FISCAL: 'FISCAL',
} as const;

export const ROLE_RANK: Record<Role, number> = {
  VISITANTE: 1,
  ANALISTA: 2,
  GESTOR: 3,
  ADMIN: 4,
};

const ALIASES: Record<string, Role> = {
  VISITANTE: 'VISITANTE',
  ANALISTA: 'ANALISTA',
  GESTOR: 'GESTOR',
  ADMIN: 'ADMIN',
  // legado → alvo
  LEITOR: 'VISITANTE',
  COLABORADOR: 'ANALISTA',
  FISCAL: 'ANALISTA',
  leitor: 'VISITANTE',
  colaborador: 'ANALISTA',
  fiscal: 'ANALISTA',
  gestor: 'GESTOR',
  admin: 'ADMIN',
  administrador: 'ADMIN',
  visitante: 'VISITANTE',
  analista: 'ANALISTA',
};

export function normalizeRole(role: string | null | undefined): Role {
  if (!role) return 'VISITANTE';
  return ALIASES[role] ?? ALIASES[role.toUpperCase()] ?? ALIASES[role.toLowerCase()] ?? 'VISITANTE';
}

export function hasMinRole(userRole: string | null | undefined, min: string): boolean {
  return ROLE_RANK[normalizeRole(userRole)] >= ROLE_RANK[normalizeRole(min)];
}

export const ROLE_LABELS: Record<Role, string> = {
  VISITANTE: 'Visitante',
  ANALISTA: 'Analista',
  GESTOR: 'Gestor',
  ADMIN: 'Administrador',
};

export const EMAIL_DOMAINS_SLUG = 'dominios-email-permitidos';
