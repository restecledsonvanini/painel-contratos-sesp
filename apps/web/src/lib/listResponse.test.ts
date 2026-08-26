import { describe, expect, it } from 'vitest';
import { parseListResponse } from './listResponse';

describe('parseListResponse', () => {
  it('lê { data, meta } da API paginada', () => {
    const raw = {
      data: [{ id: 'a' }, { id: 'b' }],
      meta: { page: 2, pageSize: 10, total: 22, totalPages: 3 },
    };
    expect(parseListResponse(raw, 1, 25)).toEqual({
      data: [{ id: 'a' }, { id: 'b' }],
      meta: { page: 2, pageSize: 10, total: 22, totalPages: 3 },
    });
  });

  it('fatia array legado no cliente', () => {
    const raw = [1, 2, 3, 4, 5];
    expect(parseListResponse(raw, 2, 2)).toEqual({
      data: [3, 4],
      meta: { page: 2, pageSize: 2, total: 5, totalPages: 3 },
    });
  });

  it('devolve vazio para payload inesperado', () => {
    expect(parseListResponse(null)).toEqual({
      data: [],
      meta: { page: 1, pageSize: 25, total: 0, totalPages: 1 },
    });
    expect(parseListResponse({ data: 'nope' })).toEqual({
      data: [],
      meta: { page: 1, pageSize: 25, total: 0, totalPages: 1 },
    });
  });
});
