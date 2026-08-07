import { describe, expect, it } from 'vitest';
import { NaturezaObjeto, TipoAlteracao } from './enums';
import { simularAlteracao, type SimulacaoAlteracaoInput } from './limites';

function base(overrides: Partial<SimulacaoAlteracaoInput> = {}): SimulacaoAlteracaoInput {
  return {
    tipo: TipoAlteracao.ADITIVO_PRAZO,
    naturezaObjeto: NaturezaObjeto.SERVICO_CONTINUADO,
    prorrogavel: true,
    limiteProrrogacaoMeses: 120,
    dataFimVigenciaOriginal: new Date('2026-12-31T12:00:00Z'),
    novasDatasFimExistentes: [],
    valorGlobalOriginalCents: 1_000_000_00,
    valorAcrescidoAtualCents: 0,
    valorSuprimidoAtualCents: 0,
    valorAcrescidoNovoCents: 0,
    valorSuprimidoNovoCents: 0,
    novaDataFimVigencia: null,
    justificativaExcepcional: null,
    ...overrides,
  };
}

describe('simularAlteracao', () => {
  it('rejeita aditivo de prazo sem novaDataFimVigencia', () => {
    const res = simularAlteracao(base({ novaDataFimVigencia: null }));
    expect(res.ok).toBe(false);
    expect(res.erros.join(' ')).toMatch(/exige novaDataFimVigencia/i);
  });

  it('rejeita novaDataFimVigencia igual ou anterior à vigência atual', () => {
    const fim = new Date('2026-12-31T12:00:00Z');
    const igual = simularAlteracao(base({ novaDataFimVigencia: fim }));
    expect(igual.ok).toBe(false);
    expect(igual.erros.join(' ')).toMatch(/posterior/i);

    const anterior = simularAlteracao(
      base({ novaDataFimVigencia: new Date('2025-01-01T12:00:00Z') }),
    );
    expect(anterior.ok).toBe(false);
    expect(anterior.erros.join(' ')).toMatch(/posterior/i);
  });

  it('aceita prorrogação válida', () => {
    const res = simularAlteracao(
      base({ novaDataFimVigencia: new Date('2027-12-31T12:00:00Z') }),
    );
    expect(res.ok).toBe(true);
    expect(res.erros).toHaveLength(0);
    expect(res.dataFimVigenciaProjetada).toMatch(/^2027-12-31/);
  });

  it('rejeita apostilamento com acréscimo de valor', () => {
    const res = simularAlteracao(
      base({
        tipo: TipoAlteracao.APOSTILAMENTO_REAJUSTE,
        valorAcrescidoNovoCents: 100_00,
        novaDataFimVigencia: null,
      }),
    );
    expect(res.ok).toBe(false);
    expect(res.erros.join(' ')).toMatch(/Apostilamento/i);
  });
});
