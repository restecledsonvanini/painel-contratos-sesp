import { describe, expect, it } from 'vitest';
import { canSeeNav } from './access';

const deny = { token: null as string | null, hasMinRole: () => false };
const analista = {
  token: 't',
  hasMinRole: (m: string) => m === 'ANALISTA' || m === 'VISITANTE',
};

describe('canSeeNav', () => {
  it('sem papel mínimo sempre mostra', () => {
    expect(canSeeNav(undefined, deny, true)).toBe(true);
  });

  it('sem AUTH obrigatória libera o menu', () => {
    expect(canSeeNav('ADMIN', deny, false)).toBe(true);
  });

  it('com AUTH, exige token e papel', () => {
    expect(canSeeNav('ADMIN', deny, true)).toBe(false);
    expect(canSeeNav('ANALISTA', analista, true)).toBe(true);
    expect(canSeeNav('ADMIN', analista, true)).toBe(false);
  });
});
