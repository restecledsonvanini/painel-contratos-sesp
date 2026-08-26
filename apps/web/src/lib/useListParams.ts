import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type UrlPagination = { pageIndex: number; pageSize: number };

/** `page`, `pageSize` e `q` na URL — mesmo padrão da lista de contratos. */
export function useListParams(defaults?: { pageSize?: number }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultSize = defaults?.pageSize ?? 25;
  const page = Math.max(1, Number(searchParams.get('page') || 1) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number(searchParams.get('pageSize') || defaultSize) || defaultSize),
  );
  const q = searchParams.get('q') || '';
  const pagination: UrlPagination = { pageIndex: page - 1, pageSize };

  const patch = useCallback(
    (mut: (p: URLSearchParams) => void) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          mut(next);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      patch((p) => {
        p.set('page', String(nextPage));
      });
    },
    [patch],
  );

  const setPageSize = useCallback(
    (nextSize: number) => {
      patch((p) => {
        p.set('pageSize', String(nextSize));
        p.set('page', '1');
      });
    },
    [patch],
  );

  const setQ = useCallback(
    (nextQ: string) => {
      patch((p) => {
        if (nextQ) p.set('q', nextQ);
        else p.delete('q');
        p.set('page', '1');
      });
    },
    [patch],
  );

  const onPaginationChange = useCallback(
    (updater: UrlPagination | ((old: UrlPagination) => UrlPagination)) => {
      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          const currentPage = Math.max(1, Number(nextParams.get('page') || 1) || 1);
          const currentSize = Math.min(
            100,
            Math.max(1, Number(nextParams.get('pageSize') || defaultSize) || defaultSize),
          );
          const current = { pageIndex: currentPage - 1, pageSize: currentSize };
          const next = typeof updater === 'function' ? updater(current) : updater;
          nextParams.set('page', String(next.pageIndex + 1));
          nextParams.set('pageSize', String(next.pageSize));
          return nextParams;
        },
        { replace: true },
      );
    },
    [defaultSize, setSearchParams],
  );

  return { page, pageSize, q, setPage, setPageSize, setQ, pagination, onPaginationChange };
}
