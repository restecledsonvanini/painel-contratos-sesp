import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/** Resolve `?tab=` com fallback e whitelist de ids. */
export function resolveTabParam<T extends string>(
  raw: string | null,
  allowed: readonly T[],
  defaultTab: T,
): T {
  return (raw && (allowed as readonly string[]).includes(raw) ? raw : defaultTab) as T;
}

/**
 * Lê/escreve `?tab=` na URL, com default e validação de ids permitidos.
 * Mesmo padrão usado em ContractDetail — compartilhado pelas seções da Fase 3.
 */
export function useTabParam<T extends string>(
  allowed: readonly T[],
  defaultTab: T,
): [T, (next: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = resolveTabParam(searchParams.get('tab'), allowed, defaultTab);

  const setTab = useCallback(
    (next: string) => {
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          p.set('tab', next);
          p.delete('page');
          p.delete('q');
          return p;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return [tab, setTab];
}
