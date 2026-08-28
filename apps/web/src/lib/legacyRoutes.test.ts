import { describe, expect, it } from 'vitest';
import { LEGACY_EDIT_REDIRECTS, LEGACY_REDIRECTS } from './legacyRoutes';

describe('legacyRoutes', () => {
  it('mapeia aliases antigos para rotas canônicas', () => {
    expect(LEGACY_REDIRECTS.find((r) => r.path === '/empresas')?.to).toBe(
      '/cadastros?tab=fornecedores',
    );
    expect(LEGACY_EDIT_REDIRECTS.find((r) => r.path === '/empresas/:id/edit')?.toBase).toBe(
      '/fornecedores',
    );
  });
});
