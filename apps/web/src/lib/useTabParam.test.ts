import { describe, expect, it } from 'vitest';
import { resolveTabParam } from './useTabParam';

describe('resolveTabParam', () => {
  const allowed = ['fornecedores', 'servidores', 'catalogo'] as const;

  it('usa default quando tab ausente ou inválida', () => {
    expect(resolveTabParam(null, allowed, 'fornecedores')).toBe('fornecedores');
    expect(resolveTabParam('', allowed, 'fornecedores')).toBe('fornecedores');
    expect(resolveTabParam('invalido', allowed, 'fornecedores')).toBe('fornecedores');
  });

  it('aceita tab permitida', () => {
    expect(resolveTabParam('servidores', allowed, 'fornecedores')).toBe('servidores');
  });
});
