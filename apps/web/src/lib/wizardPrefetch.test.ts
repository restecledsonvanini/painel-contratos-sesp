import { describe, expect, it } from 'vitest';
import { CONTRACT_WIZARD_STEPS } from '@painel/schema';
import { wizardPrefetch } from './wizardPrefetch';

describe('wizardPrefetch', () => {
  it('na identificação não pede partes nem catálogo', () => {
    expect(wizardPrefetch(CONTRACT_WIZARD_STEPS[0].id)).toEqual({
      partes: false,
      itens: false,
      unidades: false,
    });
  });

  it('em partes pede fornecedor/servidor/unidades', () => {
    expect(wizardPrefetch('partes')).toEqual({
      partes: true,
      itens: false,
      unidades: true,
    });
  });

  it('em itens pede só catálogo', () => {
    expect(wizardPrefetch('itens')).toEqual({
      partes: false,
      itens: true,
      unidades: false,
    });
  });
});
