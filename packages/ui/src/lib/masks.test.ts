import { describe, expect, it } from 'vitest';
import { applyMask, getMaskPlaceholder, maskCnpj, maskCpf, onlyDigits } from './masks';

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

describe('máscaras de exibição', () => {
  it('CNPJ, CPF e onlyDigits', () => {
    expect(maskCnpj('12345678000199')).toBe('12.345.678/0001-99');
    expect(maskCpf('12345678901')).toBe('123.456.789-01');
    expect(onlyDigits('12.345')).toBe('12345');
  });
});
