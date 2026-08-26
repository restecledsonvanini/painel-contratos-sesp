export type PaginationQuery = {
  page: number;
  pageSize: number;
  sort?: string;
  q?: string;
};

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

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

export function parsePagination(query: Record<string, unknown>): PaginationQuery {
  const pageRaw = Number(query.page ?? DEFAULT_PAGE);
  const sizeRaw = Number(query.pageSize ?? DEFAULT_PAGE_SIZE);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : DEFAULT_PAGE;
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Number.isFinite(sizeRaw) && sizeRaw > 0 ? Math.floor(sizeRaw) : DEFAULT_PAGE_SIZE,
  );
  const sort = typeof query.sort === 'string' && query.sort ? query.sort : undefined;
  const q = typeof query.q === 'string' && query.q.trim() ? query.q.trim() : undefined;
  return { page, pageSize, sort, q };
}

export function paginationMeta(total: number, page: number, pageSize: number): PaginatedMeta {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize) || 1),
  };
}

export function skipTake(page: number, pageSize: number) {
  return { skip: (page - 1) * pageSize, take: pageSize };
}
