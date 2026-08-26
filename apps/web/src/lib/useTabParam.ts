import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Lê/escreve `?tab=` na URL, com default e validação de ids permitidos.
 * Mesmo padrão usado em ContractDetail — compartilhado pelas seções da Fase 3.
 */
export function useTabParam<T extends string>(
  allowed: readonly T[],
  defaultTab: T,
): [T, (next: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('tab');
  const tab = (raw && (allowed as readonly string[]).includes(raw) ? raw : defaultTab) as T;

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
