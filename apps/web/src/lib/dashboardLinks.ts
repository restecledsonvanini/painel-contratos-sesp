/** Monta links de drill-down do dashboard → lista de contratos. */
export function contractsListHref(filters: Record<string, string | number | undefined | null>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value == null || value === '') continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `/contracts?${qs}` : '/contracts';
}

export function janelaToVencimentoParam(janela: string): string {
  const map: Record<string, string> = {
    vencidos: 'vencidos',
    '0-30': '0-30',
    '31-60': '31-60',
    '61-90': '61-90',
    '91-120': '91-120',
    '121-180': '121-180',
    '>180': '>180',
  };
  return map[janela] ?? janela;
}
