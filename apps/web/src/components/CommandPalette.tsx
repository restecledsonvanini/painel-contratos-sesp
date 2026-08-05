import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { useQuery } from '@tanstack/react-query';
import { http } from '../lib/http';

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
              {q.trim().length < 2 ? 'Digite ao menos 2 caracteres.' : 'Nenhum resultado.'}
            </Command.Empty>

            <Command.Group heading="Atalhos" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[var(--text-muted)]">
              <Command.Item
                value="ir-contratos"
                onSelect={() => go('/contracts')}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                Ir para contratos
              </Command.Item>
              <Command.Item
                value="ir-estrategico"
                onSelect={() => go('/estrategico')}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                Ir para painel estratégico
              </Command.Item>
              <Command.Item
                value="ir-alertas"
                onSelect={() => go('/alertas')}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                Ir para alertas
              </Command.Item>
              <Command.Item
                value="ir-importacao"
                onSelect={() => go('/importacao')}
                className="cursor-pointer rounded px-2 py-2 data-[selected=true]:bg-[var(--surface-muted)]"
              >
                Ir para importação
              </Command.Item>
            </Command.Group>

            {(data?.contratos ?? []).map((c) => (
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
