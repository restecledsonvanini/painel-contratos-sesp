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

type CrudPaths = {
  list: string;
  detail: (id: string) => string;
};

type CreateCrudHooksOptions<TEntity, TCreate, TUpdate> = {
  resource: string;
  listKey: QueryKey;
  detailKey: (id: string) => QueryKey;
  paths: CrudPaths;
  /** Extra query keys invalidated after any write (besides list/detail/lookups). */
  alsoInvalidate?: QueryKey[];
  withLookups?: boolean;
  staleTime?: number;
  createBody?: (payload: TCreate) => unknown;
  updateBody?: (payload: TUpdate) => unknown;
};

/**
 * Factory de hooks list/get/create/update/delete com invalidação padronizada.
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

  function useList(queryOptions?: Partial<UseQueryOptions<TEntity[]>>) {
    return useQuery({
      queryKey: listKey,
      queryFn: async () => (await http.get<TEntity[]>(paths.list)).data,
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
    mutationOptions?: UseMutationOptions<TEntity, Error, TCreate>,
  ) {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: async (payload: TCreate) =>
        (
          await http.post<TEntity>(
            paths.list.replace(/\?.*$/, ''),
            opts.createBody ? opts.createBody(payload) : payload,
          )
        ).data,
      onSuccess: (...args) => {
        invalidateAll(qc);
        mutationOptions?.onSuccess?.(...args);
      },
      ...mutationOptions,
      // keep our onSuccess after spread override
      onSettled: mutationOptions?.onSettled,
    });
  }

  // Fix create to properly compose onSuccess
  function useCreateFixed(
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
      onSuccess: (data, vars, ctx) => {
        invalidateAll(qc);
        onSuccess?.(data, vars, ctx);
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
      onSuccess: (data, vars, ctx) => {
        invalidateAll(qc, vars.id);
        onSuccess?.(data, vars, ctx);
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
      onSuccess: (data, id, ctx) => {
        invalidateAll(qc, id);
        onSuccess?.(data, id, ctx);
      },
    });
  }

  return {
    useList,
    useOne,
    useCreate: useCreateFixed,
    useUpdate,
    useRemove,
    invalidateAll,
  };
}
