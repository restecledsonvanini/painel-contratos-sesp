export type PaginatedMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  data: T[];
  meta: PaginatedMeta;
};

export type ListParams = {
  page?: number;
  pageSize?: number;
  q?: string;
};

function metaFrom(total: number, page: number, pageSize: number): PaginatedMeta {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize) || 1),
  };
}

/**
 * Aceita `{ data, meta }` (API paginada) ou array legado. Array é fatiado no
 * cliente — ainda baixa tudo, mas a UI não quebra.
 */
export function parseListResponse<T>(
  raw: unknown,
  page = 1,
  pageSize = 25,
): PaginatedResult<T> {
  if (Array.isArray(raw)) {
    const total = raw.length;
    const start = (page - 1) * pageSize;
    return {
      data: raw.slice(start, start + pageSize) as T[],
      meta: metaFrom(total, page, pageSize),
    };
  }
  if (raw && typeof raw === 'object' && Array.isArray((raw as { data?: unknown }).data)) {
    const body = raw as { data: T[]; meta?: Partial<PaginatedMeta> & { total?: number } };
    const total = Number(body.meta?.total ?? body.data.length);
    return {
      data: body.data,
      meta: {
        page: Number(body.meta?.page ?? page),
        pageSize: Number(body.meta?.pageSize ?? pageSize),
        total,
        totalPages: Number(body.meta?.totalPages ?? metaFrom(total, page, pageSize).totalPages),
      },
    };
  }
  return { data: [], meta: metaFrom(0, page, pageSize) };
}
