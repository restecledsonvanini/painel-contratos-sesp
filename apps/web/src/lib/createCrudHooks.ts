import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { http } from './http';
import { invalidateKeys, invalidateLookups } from './invalidate';
import { parseListResponse, type ListParams, type PaginatedResult } from './listResponse';

type CrudPaths = {
  list: string;
  detail: (id: string) => string;
};

type CreateCrudHooksOptions<_TEntity, TCreate, TUpdate> = {
  resource: string;
  listKey: QueryKey;
  detailKey: (id: string) => QueryKey;
  paths: CrudPaths;
  alsoInvalidate?: QueryKey[];
  withLookups?: boolean;
  staleTime?: number;
  createBody?: (payload: TCreate) => unknown;
  updateBody?: (payload: TUpdate) => unknown;
};

/**
 * Factory de hooks list/get/create/update/delete com invalidação padronizada.
 * `useList` devolve `{ data, meta }` (array legado da API também é aceito).
 */
export function createCrudHooks<
  TEntity,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>,
>(opts: CreateCrudHooksOptions<TEntity, TCreate, TUpdate>) {
  const {
    listKey,
    detailKey,
    paths,
    alsoInvalidate = [],
    withLookups = true,
    staleTime = 1000 * 60 * 10,
  } = opts;

  function invalidateAll(qc: ReturnType<typeof useQueryClient>, id?: string) {
    const keys: QueryKey[] = [listKey, ...alsoInvalidate];
    if (id) keys.push(detailKey(id));
    invalidateKeys(qc, keys);
    if (withLookups) invalidateLookups(qc);
  }

  function useList(
    params: ListParams = {},
    queryOptions?: Partial<UseQueryOptions<PaginatedResult<TEntity>>>,
  ) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 25;
    const q = params.q ?? '';
    return useQuery({
      queryKey: [...listKey, { page, pageSize, q }],
      queryFn: async () => {
        const raw = (
          await http.get<unknown>(paths.list, {
            params: { page, pageSize, q: q || undefined },
          })
        ).data;
        return parseListResponse<TEntity>(raw, page, pageSize);
      },
      staleTime,
      ...queryOptions,
    });
  }

  function useOne(id?: string, queryOptions?: Partial<UseQueryOptions<TEntity>>) {
    return useQuery({
      queryKey: id ? detailKey(id) : [opts.resource, 'empty'],
      queryFn: async () => (await http.get<TEntity>(paths.detail(id!))).data,
      enabled: Boolean(id),
      staleTime,
      ...queryOptions,
    });
  }

  function useCreate(
    mutationOptions?: Omit<UseMutationOptions<TEntity, Error, TCreate>, 'mutationFn'>,
  ) {
    const qc = useQueryClient();
    const { onSuccess, ...rest } = mutationOptions ?? {};
    return useMutation({
      mutationFn: async (payload: TCreate) =>
        (
          await http.post<TEntity>(
            paths.list.replace(/\?.*$/, ''),
            opts.createBody ? opts.createBody(payload) : payload,
          )
        ).data,
      ...rest,
      onSuccess: (data, vars, ctx, mutationCtx) => {
        invalidateAll(qc);
        onSuccess?.(data, vars, ctx, mutationCtx);
      },
    });
  }

  function useUpdate(
    mutationOptions?: Omit<
      UseMutationOptions<TEntity, Error, { id: string; payload: TUpdate }>,
      'mutationFn'
    >,
  ) {
    const qc = useQueryClient();
    const { onSuccess, ...rest } = mutationOptions ?? {};
    return useMutation({
      mutationFn: async ({ id, payload }: { id: string; payload: TUpdate }) =>
        (
          await http.put<TEntity>(
            paths.detail(id),
            opts.updateBody ? opts.updateBody(payload) : payload,
          )
        ).data,
      ...rest,
      onSuccess: (data, vars, ctx, mutationCtx) => {
        invalidateAll(qc, vars.id);
        onSuccess?.(data, vars, ctx, mutationCtx);
      },
    });
  }

  function useRemove(
    mutationOptions?: Omit<UseMutationOptions<unknown, Error, string>, 'mutationFn'>,
  ) {
    const qc = useQueryClient();
    const { onSuccess, ...rest } = mutationOptions ?? {};
    return useMutation({
      mutationFn: async (id: string) => (await http.delete(paths.detail(id))).data,
      ...rest,
      onSuccess: (data, id, ctx, mutationCtx) => {
        invalidateAll(qc, id);
        onSuccess?.(data, id, ctx, mutationCtx);
      },
    });
  }

  return {
    useList,
    useOne,
    useCreate,
    useUpdate,
    useRemove,
    invalidateAll,
  };
}
