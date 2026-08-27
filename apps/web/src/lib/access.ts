import type { Role } from '@painel/domain';
import { isAuthRequired } from '../components/RequireRole';
import { useAuth } from '../providers/AuthProvider';

/**
 * Espelha o bypass da API: sem AUTH obrigatória, libera ações no UI.
 * Com AUTH ligada, exige sessão + papel mínimo (deny-by-default).
 */
export function useCanAct(min: Role | string = 'ANALISTA') {
  const { user, hasMinRole } = useAuth();
  if (!isAuthRequired()) return true;
  return Boolean(user) && hasMinRole(min);
}

/** Atalho tipado para escrita de cadastros (ANALISTA+). */
export function useCanWrite() {
  return useCanAct('ANALISTA');
}

/** GESTOR+ (organograma, alterações). */
export function useCanManage() {
  return useCanAct('GESTOR');
}

/** ADMIN only. */
export function useIsAdmin() {
  return useCanAct('ADMIN');
}

/** Para Sidebar / callbacks fora de hook de página. */
export function canSeeNav(
  min: string | undefined,
  opts: { token?: string | null; user?: unknown; hasMinRole: (m: string) => boolean },
  required = isAuthRequired(),
): boolean {
  if (!min) return true;
  if (!required) return true;
  return Boolean(opts.user ?? opts.token) && opts.hasMinRole(min);
}
