import { describe, expect, it } from 'vitest';
import { matchVencimento, sugerirDataFim } from './prazo';

describe('sugerirDataFim', () => {
  it('soma meses em UTC', () => {
    expect(sugerirDataFim('2026-01-15', 12, 'MESES')).toBe('2027-01-15');
  });

  it('recusa vazio ou prazo inválido', () => {
    expect(sugerirDataFim('', 12)).toBeNull();
    expect(sugerirDataFim('2026-01-15', 0)).toBeNull();
  });
});

describe('matchVencimento', () => {
  it('classifica janelas', () => {
    expect(matchVencimento(null, '0-30')).toBe(false);
    expect(matchVencimento(-1, 'vencidos')).toBe(true);
    expect(matchVencimento(10, '0-30')).toBe(true);
    expect(matchVencimento(45, '0-30')).toBe(false);
    expect(matchVencimento(200, '>180')).toBe(true);
  });
});
