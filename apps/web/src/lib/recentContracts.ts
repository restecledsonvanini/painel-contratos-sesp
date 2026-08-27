/** Contratos vistos recentemente (localStorage) e helpers de deep-link. */

export type RecentContract = {
  id: string;
  label: string;
  gms: string;
  visitedAt: number;
};

export const RECENT_CONTRACTS_KEY = 'painel:recent-contracts';
export const RECENT_CONTRACTS_MAX = 5;

export const CONTRACT_TAB_LABELS: Record<string, string> = {
  resumo: 'Resumo',
  timeline: 'Timeline',
  itens: 'Itens',
  alteracoes: 'Alterações',
  financeiro: 'Financeiro',
  fiscalizacao: 'Fiscalização',
  rateio: 'Rateio',
  publicidade: 'Publicidade',
  documentos: 'Documentos',
  auditoria: 'Auditoria',
};

/** Abas mais úteis como atalho na command palette. */
export const CONTRACT_TAB_SHORTCUTS = [
  'resumo',
  'financeiro',
  'alteracoes',
  'publicidade',
  'fiscalizacao',
] as const;

/** Mapeia tipo de alerta → aba do detalhe. */
export function alertaTipoToTab(tipo: string | undefined | null): string {
  switch ((tipo || '').toUpperCase()) {
    case 'PUBLICACAO_PENDENTE':
      return 'publicidade';
    case 'LIMITE_ACRESCIMO':
      return 'alteracoes';
    case 'VENCIMENTO':
    case 'GARANTIA_VENCENDO':
    default:
      return 'resumo';
  }
}

export function contractHref(id: string, tab?: string) {
  if (!tab || tab === 'resumo') return `/contracts/${id}`;
  return `/contracts/${id}?tab=${tab}`;
}

export function readRecentContracts(): RecentContract[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_CONTRACTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentContract[];
    return Array.isArray(parsed) ? parsed.slice(0, RECENT_CONTRACTS_MAX) : [];
  } catch {
    return [];
  }
}

function persistRecentContracts(next: RecentContract[]) {
  try {
    window.localStorage.setItem(RECENT_CONTRACTS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('painel:recent-contracts'));
  } catch {
    /* ignore quota */
  }
}

export function pushRecentContract(entry: Omit<RecentContract, 'visitedAt'>) {
  if (typeof window === 'undefined' || !entry.id) return;
  persistRecentContracts(
    [
      { ...entry, visitedAt: Date.now() },
      ...readRecentContracts().filter((r) => r.id !== entry.id),
    ].slice(0, RECENT_CONTRACTS_MAX),
  );
}

export function removeRecentContract(id: string) {
  if (typeof window === 'undefined' || !id) return;
  persistRecentContracts(readRecentContracts().filter((r) => r.id !== id));
}
