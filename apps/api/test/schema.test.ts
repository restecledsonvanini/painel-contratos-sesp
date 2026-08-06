import { describe, expect, it } from 'vitest';
import {
  ContractCreateSchema,
  ContractUpdateSchema,
  FornecedorCreateSchema,
} from '@painel/schema';

const baseContract = {
  numGms: 10,
  anoGms: 2026,
  unidadeGestoraId: 'a1111111-1111-4111-8111-111111111111',
  gestorId: 'a2222222-2222-4222-8222-222222222222',
  fiscalId: 'a3333333-3333-4333-8333-333333333333',
  fornecedorId: 'a4444444-4444-4444-8444-444444444444',
  modalidade: 'Dispensa',
  objeto: 'Objeto teste',
  valorAnual: 1500.5,
  dataInicio: '2026-01-01',
  dataFimOrig: '2026-12-31',
};

describe('ContractCreateSchema', () => {
  it('converts valorAnual to cents and normalizes fields', () => {
    const parsed = ContractCreateSchema.parse(baseContract);
    expect(parsed.valorGlobalOriginalCents).toBe(150050);
    expect(parsed.fornecedorId).toBe(baseContract.fornecedorId);
    expect(parsed.numeroGms).toBe('10');
    expect(parsed.situacao).toBe('VIGENTE');
  });

  it('accepts empresaId as alias for fornecedorId (input, um release)', () => {
    const { fornecedorId: _f, ...rest } = baseContract;
    const parsed = ContractCreateSchema.parse({
      ...rest,
      empresaId: 'a4444444-4444-4444-8444-444444444444',
    });
    expect(parsed.fornecedorId).toBe('a4444444-4444-4444-8444-444444444444');
  });

  it('rejects identical gestor and fiscal', () => {
    expect(() =>
      ContractCreateSchema.parse({
        ...baseContract,
        fiscalId: baseContract.gestorId,
      }),
    ).toThrow();
  });

  it('accepts elaborado as EM_ELABORACAO draft', () => {
    const parsed = ContractCreateSchema.parse({ ...baseContract, status: 'elaborado' });
    expect(parsed.situacao).toBe('EM_ELABORACAO');
  });
});

describe('Contract wizard step schemas', () => {
  it('validates identificação e partes', async () => {
    const { ContractStepIdentificacaoSchema, ContractStepPartesSchema } = await import(
      '@painel/schema'
    );
    expect(
      ContractStepIdentificacaoSchema.parse({
        numGms: 1,
        anoGms: 2026,
        pilar: 'SERVICOS',
        naturezaObjeto: 'SERVICO_CONTINUADO',
        modalidade: 'DISPENSA',
        objeto: 'Teste',
      }).objeto,
    ).toBe('Teste');
    expect(
      ContractStepPartesSchema.parse({
        fornecedorId: 'a4444444-4444-4444-8444-444444444444',
        unidadeGestoraId: 'a1111111-1111-4111-8111-111111111111',
        gestorId: '',
        fiscalId: '',
      }).fornecedorId,
    ).toBe('a4444444-4444-4444-8444-444444444444');
  });
});

describe('ContractUpdateSchema', () => {
  it('accepts partial payload and converts valorAnual', () => {
    const parsed = ContractUpdateSchema.parse({ valorAnual: 10, status: 'encerrado' });
    expect(parsed).toMatchObject({ valorGlobalOriginalCents: 1000, situacao: 'ENCERRADO' });
    expect((parsed as { valorAnual?: number }).valorAnual).toBeUndefined();
  });

  it('rejects identical gestor and fiscal when both present', () => {
    expect(() =>
      ContractUpdateSchema.parse({
        gestorId: 'a2222222-2222-4222-8222-222222222222',
        fiscalId: 'a2222222-2222-4222-8222-222222222222',
      }),
    ).toThrow();
  });
});

describe('fornecedor schemas', () => {
  it('requires fornecedor documento and razaoSocial', () => {
    expect(() => FornecedorCreateSchema.parse({ cnpj: '1' })).toThrow();
  });

  it('accepts legacy nome/cnpj aliases on input (um release)', () => {
    const parsed = FornecedorCreateSchema.parse({
      nome: 'ACME Ltda',
      cnpj: '12345678000100',
    });
    expect(parsed.razaoSocial).toBe('ACME Ltda');
    expect(parsed.documento).toBe('12345678000100');
  });
});
