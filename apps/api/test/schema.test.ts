import { describe, expect, it } from 'vitest';
import {
  ContractCreateSchema,
  ContractUpdateSchema,
  EmpresaCreateSchema,
  FornecedorCreateSchema,
} from '@painel/schema';

const baseContract = {
  numGms: 10,
  anoGms: 2026,
  unidadeFspId: 'a1111111-1111-4111-8111-111111111111',
  gestorId: 'a2222222-2222-4222-8222-222222222222',
  fiscalId: 'a3333333-3333-4333-8333-333333333333',
  empresaId: 'a4444444-4444-4444-8444-444444444444',
  modalidade: 'Dispensa',
  objeto: 'Objeto teste',
  valorAnual: 1500.5,
};

describe('ContractCreateSchema', () => {
  it('converts valorAnual to cents', () => {
    const parsed = ContractCreateSchema.parse(baseContract);
    expect(parsed.valorAnualCents).toBe(150050);
  });

  it('rejects identical gestor and fiscal', () => {
    expect(() =>
      ContractCreateSchema.parse({
        ...baseContract,
        fiscalId: baseContract.gestorId,
      })
    ).toThrow();
  });
});

describe('ContractUpdateSchema', () => {
  it('accepts partial payload and converts valorAnual', () => {
    const parsed = ContractUpdateSchema.parse({ valorAnual: 10, status: 'encerrado' });
    expect(parsed).toMatchObject({ valorAnualCents: 1000, status: 'encerrado' });
    expect((parsed as any).valorAnual).toBeUndefined();
  });

  it('rejects identical gestor and fiscal when both present', () => {
    expect(() =>
      ContractUpdateSchema.parse({
        gestorId: 'a2222222-2222-4222-8222-222222222222',
        fiscalId: 'a2222222-2222-4222-8222-222222222222',
      })
    ).toThrow();
  });
});

describe('reference schemas', () => {
  it('validates empresa create', () => {
    expect(EmpresaCreateSchema.parse({ cnpj: '12345678000100', razaoSocial: 'ACME' })).toEqual({
      cnpj: '12345678000100',
      razaoSocial: 'ACME',
    });
  });

  it('requires fornecedor nome', () => {
    expect(() => FornecedorCreateSchema.parse({ cnpj: '1' })).toThrow();
  });
});
