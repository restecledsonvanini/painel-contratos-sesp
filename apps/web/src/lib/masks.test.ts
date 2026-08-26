import { describe, expect, it } from 'vitest';
import { maskCnpj, maskCpf, onlyDigits } from './masks';

describe('máscaras', () => {
  it('CNPJ e CPF', () => {
    expect(maskCnpj('12345678000199')).toBe('12.345.678/0001-99');
    expect(maskCpf('12345678901')).toBe('123.456.789-01');
  });

  it('só dígitos', () => {
    expect(onlyDigits('12.345')).toBe('12345');
  });
});
