import type { ContractWizardStepId } from '@painel/schema';

/** Quais listas o wizard precisa nesta etapa — o resto fica `enabled: false`. */
export function wizardPrefetch(step: ContractWizardStepId) {
  return {
    partes: step === 'partes',
    itens: step === 'itens',
    unidades: step === 'partes' || step === 'rateio',
  };
}
