# Plano — Design system e shell frontend (DEST/SESP)

Data: 2026-08-03  
Status: implementado  
Referência visual: [Ferramentas DEST · SESP](https://restecledsonvanini.github.io/app-dest/ferramentas/index.html)  
Relacionado: [front_ui_2026-07-29.md](./front_ui_2026-07-29.md), [tech_debt_2026-08-03.md](./tech_debt_2026-08-03.md)

## Objetivo

Corrigir responsividade, cores e padrões do `apps/web` + `packages/ui`, alinhando o produto ao ecossistema DEST/SESP: tokens sem hardcode, tipografia e radius padronizados, sidebar tipo toolbar (ícones), main content em largura útil para formulários densos.

## Diagnóstico (estado atual)

- Tokens mortos em `packages/ui/src/theme.ts` (`#0d6efd`) divergem do CSS vivo e da referência DEST (`#0b3d91`).
- Hardcodes `#4C5B8B`, `#f3f3f3`, `rounded-[28px]`, `slate-*` espalhados em Sidebar, Header, ContractsList, layout.
- Sidebar só muda largura; no mobile empilha e não age como drawer; ícones SVG manuais fracos.
- `main` + páginas com `max-w-7xl` + padding duplo → conteúdo estreito.
- Tailwind v4 via Vite, mas `theme.ts` / `tailwind.config.cjs` / hardcodes não formam um sistema.

## Decisões de design (travadas)

| Tema | Decisão |
|---|---|
| Primary | `#0b3d91` (DEST `--primary`) |
| Primary deep / headings | `#192a5a` (DEST `--tab-active` / `--tool-h3`) |
| Page bg | `#f3f4f6` |
| Surface | `#ffffff` |
| Borders | `#e5e7eb` / inputs `#d1d5db` |
| Tipografia | stack institucional DEST: `Arial, Helvetica, sans-serif` (coerência com ferramentas SESP) |
| Ícones | `lucide-react` (limpos; substitui SVGs manuais) |
| Radius | `--radius-sm: 4px`, `--radius-md: 8px`, `--radius-lg: 12px` (sem “pill cards” 28px) |
| Shell | Header superior + **rail lateral** colapsável (expandido: ícone+label; recolhido: só ícones) |
| Mobile | rail como overlay + backdrop; hamburger no header |
| Largura | main `flex-1 min-w-0`; páginas sem `max-w-7xl` restritivo; `Page` com padding único via tokens |

## Escopo desta entrega

1. Tokens CSS + `theme.ts` alinhados à DEST; dark mode completo.
2. `@theme` Tailwind v4 mapeando tokens (evitar hex nas páginas).
3. Componentes UI: Button, Card, Input, Textarea, Table, StatusBadge, Page, Header, Sidebar.
4. `DashboardLayout` full-bleed útil + sidebar toolbar.
5. Limpeza das páginas principais (ContractsList, Dashboard, lists/forms) — remover hex/radius arbitrários.
6. Dependência `lucide-react` em `@painel/ui`.

## Fora de escopo (agora)

- Redesign profundo de cada formulário (steps, campos custom).
- Dashboard com KPIs reais da API.
- Storybook / Chromatic.
- Troca de marca visual completa (logo asset — usar placeholder tipográfico SESP se `/logo-sesp.png` ausente).

## Ordem de implementação

1. Plano neste arquivo + tokens (`theme.css`, `theme.ts`, `index.css` `@theme`).
2. Shell: Sidebar (Lucide + collapse) + Header + DashboardLayout + Page.
3. Primitives UI (Button/Card/Input/Table/Badge).
4. Páginas: remover hardcodes, full width, grids responsivos (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`).
5. Smoke visual + ajuste fino.

## Critério de pronto

- [x] Nenhum `#hex` de chrome/layout nas páginas tocadas (só via `var(--*)` ou classes `@theme`).
- [x] Sidebar recolhida mostra só ícones; expandida mostra labels; mobile overlay.
- [x] Main ocupa a largura restante da viewport (sem card “flutuante” estreito).
- [x] Radius/tipografia consistentes nos componentes `@painel/ui`.
- [x] Referência DEST reconhecível (azul `#0b3d91`, painéis claros, UI utilitária).

## Checklist

- [x] `tokens-theme`
- [x] `shell-sidebar-header`
- [x] `ui-primitives`
- [x] `pages-cleanup`
- [x] `responsive-grids`

## Notas de execução

- Referência: [Ferramentas DEST](https://restecledsonvanini.github.io/app-dest/ferramentas/index.html)
- Primary DEST `#0b3d91`; tipografia Arial/Helvetica (ecossistema SESP).
- Ícones: Lucide (LayoutDashboard, FileText, Building2, etc.).
- Componente `Page` padroniza título/ações; formulários usam grade `1/2/3` cols.

### Follow-up logo + edge toggle + forms (2026-08-03)

- Logo circular: `/logo-sesp-dest.png` com `border-radius: 100%`.
- Primary da marca: `#002d54` (azul da logo DEST); accent verde `#0e5235`.
- Collapse estilo Docker Desktop: botão circular na borda do rail (`.app-sidebar__edge-toggle`), acompanha `--rail-width`.
- Forms padronizados via `.app-form` / `.app-form__panel` / `.app-form__grid` (sem `max-w-3xl` + padding duplo).


**Causa:** Tailwind v4 não escaneava `packages/ui`, então `bg-[var(--primary)]`, `md:hidden`, widths etc. **não geravam CSS**. A sidebar ficava “fantasma” (texto preto no fundo cinza), hamburger sempre visível e collapse sem efeito — parecia container dentro de container.

**Correção:**
1. `@source` em `apps/web/src/index.css` apontando para `packages/ui`.
2. Shell em **CSS estável** (`.app-shell`, `.app-sidebar`, `.app-content`, `.app-header`, `.app-main`) em `theme.css` — não depende do scan.
3. Layout clássico `h-screen flex`: sidebar | (header + main scroll), sem nested flex disputando largura.
4. Header branco + sidebar azul DEST (padrão dashboard).
