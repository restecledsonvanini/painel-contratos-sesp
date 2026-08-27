import { describe, expect, it } from 'vitest';
import { badgeVariantFromStatus, formatStatusLabel } from './Badge';

describe('formatStatusLabel', () => {
  it('humaniza enums conhecidos', () => {
    expect(formatStatusLabel('ATIVO')).toBe('Ativo');
    expect(formatStatusLabel('INATIVO')).toBe('Inativo');
    expect(formatStatusLabel('INIDONEO')).toBe('Inidôneo');
    expect(formatStatusLabel('CRITICO')).toBe('Crítico');
    expect(formatStatusLabel('ATENCAO')).toBe('Atenção');
  });
});

describe('badgeVariantFromStatus', () => {
  it('não trata INATIVO como ativo', () => {
    expect(badgeVariantFromStatus('INATIVO')).toBe('default');
    expect(badgeVariantFromStatus('ATIVO')).toBe('success');
    expect(badgeVariantFromStatus('IMPEDIDO')).toBe('danger');
  });
});
