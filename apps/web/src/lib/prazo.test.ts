import { describe, expect, it } from 'vitest';
import { sugerirDataFim } from './prazo';

describe('sugerirDataFim', () => {
  it('soma meses em UTC', () => {
    expect(sugerirDataFim('2024-01-15', 3, 'MESES')).toBe('2024-04-15');
  });

  it('retorna null sem data ou valor', () => {
    expect(sugerirDataFim('', 12, 'MESES')).toBeNull();
    expect(sugerirDataFim('2024-01-01', 0, 'MESES')).toBeNull();
  });
});
