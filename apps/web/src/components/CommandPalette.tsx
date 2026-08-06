import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { useQuery } from '@tanstack/react-query';
import { http } from '../lib/http';
import {
  CONTRACT_TAB_LABELS,
  CONTRACT_TAB_SHORTCUTS,
  contractHref,
  readRecentContracts,
  type RecentContract,
} from '../lib/recentContracts';

type SearchHit = { id: string; label: string; to: string };
type SearchResult = {
  contratos: SearchHit[];
  fornecedores: SearchHit[];
  servidores: SearchHit[];
};

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent('painel:open-command-palette'));
}

/** Busca global Ctrl+K (e clique no search do header). */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [recentes, setRecentes] = useState<RecentContract[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('painel:open-command-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('painel:open-command-palette', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) setRecentes(readRecentContracts());
  }, [open]);

  const { data } = useQuery({
    queryKey: ['search', q],
    queryFn: async () => (await http.get<SearchResult>('/search', { params: { q } })).data,
    enabled: open && q.trim().length >= 2,
    staleTime: 10_000,
  });

  function go(to: string) {
    setOpen(false);
    setQ('');
    navigate(to);
  }

  if (!open) return null;

  const searching = q.trim().length >= 2;
  const contratos = data?.contratos ?? [];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-[color-mix(in_srgb,var(--text)_35%,transparent)] pt-[12vh] px-4"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Busca global"
      >
        <Command label="Busca global" shouldFilter={false} className="cmdk-root">
          <Command.Input
            autoFocus
            value={q}
            onValueChange={setQ}
            placeholder="Buscar contratos, fornecedores, servidores… (Ctrl+K)"
            className="w-full border-b border-[var(--border)] bg-transparent px-4 py-3 text-[var(--font-size-sm)] outline-none"
          />
          <Command.List className="max-h-80 overflow-y-auto p-2 text-[var(--font-size-sm)]">
            <Command.Empty className="px-3 py-6 text-[var(--text-muted)]">
              {searching ? 'Nenhum resultado.' : 'Digite ao menos 2 caracteres ou escolha um recente.'}
            </Command.Empty>

            {!searching && recentes.length > 0 && (
              <Command.Group
                heading="Vistos recentemente"
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[var(--text-muted)]"
              >
                {recentes.map((r) => (
                  <Command.Item
                    key={`recent-${r.id}`}
                    value={`recent-${r.gms}-${r.label}`}
                    onSelect={() => go(contractHref(r.id))}
                    className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
                  >
                    GMS {r.gms}
                    {r.label && r.label !== `GMS ${r.gms}` ? ` — ${r.label}` : ''}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group
              heading="Atalhos"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[var(--text-muted)]"
            >
              <Command.Item
                value="ir-painel"
                onSelect={() => go('/painel?tab=tatico')}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                Ir para painel tático
              </Command.Item>
              <Command.Item
                value="ir-contratos"
                onSelect={() => go('/contracts')}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                Ir para contratos
              </Command.Item>
              <Command.Item
                value="ir-estrategico"
                onSelect={() => go('/painel?tab=estrategico')}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                Ir para painel estratégico
              </Command.Item>
              <Command.Item
                value="ir-alertas"
                onSelect={() => go('/painel?tab=alertas')}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                Ir para alertas
              </Command.Item>
              <Command.Item
                value="ir-cadastros"
                onSelect={() => go('/cadastros?tab=fornecedores')}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                Ir para cadastros
              </Command.Item>
              <Command.Item
                value="ir-unidades"
                onSelect={() => go('/configuracoes?tab=organizacao')}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                Ir para estrutura organizacional
              </Command.Item>
              <Command.Item
                value="ir-importacao"
                onSelect={() => go('/utilitarios?tab=importacao')}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                Ir para importação
              </Command.Item>
            </Command.Group>

            {contratos.slice(0, 3).map((c) => (
              <React.Fragment key={c.id}>
                <Command.Item
                  value={`c-${c.id}-${c.label}`}
                  onSelect={() => go(c.to)}
                  className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
                >
                  {c.label}
                </Command.Item>
                {CONTRACT_TAB_SHORTCUTS.map((tabId) => (
                  <Command.Item
                    key={`${c.id}-${tabId}`}
                    value={`c-${c.id}-${c.label}-${CONTRACT_TAB_LABELS[tabId]}`}
                    onSelect={() => go(contractHref(c.id, tabId))}
                    className="cursor-pointer rounded px-2 py-1.5 pl-4 text-[var(--text-muted)] data-[selected=true]:bg-[var(--surface-muted)] data-[selected=true]:text-[var(--text)]"
                  >
                    {c.label.split('—')[0]?.trim() || c.label} › {CONTRACT_TAB_LABELS[tabId]}
                  </Command.Item>
                ))}
              </React.Fragment>
            ))}
            {contratos.slice(3).map((c) => (
              <Command.Item
                key={c.id}
                value={`c-${c.id}-${c.label}`}
                onSelect={() => go(c.to)}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                {c.label}
              </Command.Item>
            ))}
            {(data?.fornecedores ?? []).map((f) => (
              <Command.Item
                key={f.id}
                value={`f-${f.id}-${f.label}`}
                onSelect={() => go(f.to)}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                {f.label}
              </Command.Item>
            ))}
            {(data?.servidores ?? []).map((s) => (
              <Command.Item
                key={s.id}
                value={`s-${s.id}-${s.label}`}
                onSelect={() => go(s.to)}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                {s.label}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
