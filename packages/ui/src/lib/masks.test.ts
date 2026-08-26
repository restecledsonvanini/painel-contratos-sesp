import { describe, expect, it } from 'vitest';
import { applyMask, getMaskPlaceholder } from './masks';

describe('applyMask', () => {
  it('formata CNPJ', () => {
    expect(applyMask('cnpj', '12345678000199').display).toBe('12.345.678/0001-99');
  });

  it('trunca no máximo de dígitos', () => {
    expect(applyMask('cpf', '12345678901234').digits).toHaveLength(11);
  });
});

describe('getMaskPlaceholder', () => {
  it('devolve o placeholder do CPF', () => {
    expect(getMaskPlaceholder('cpf')).toBe('000.000.000-00');
  });
});
