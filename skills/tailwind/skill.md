# Tailwind CSS v4.1 — Padrões & Theming

Recomendações para aplicar Tailwind com desempenho e consistência visual.

- Configuração de design tokens em `tailwind.config.js` (cores, espaçamento, tipografia).
- Dark/Light theme via `theme-toggle` usando classes de root (`.dark`) ou CSS variables.
- Purge/Tree-shaking para reduzir bundle size; use JIT quando possível.
- Component utilities vs. Extracted components: prefira classes utilitárias compostas em componentes reutilizáveis.
- Responsividade mobile-first; use breakpoints claros e consistentes para layout do Dashboard.

Exemplo prático (Theme Toggle):
- Armazenar preferência no `localStorage` e respeitar `prefers-color-scheme`.

Checklist:
- [ ] Tokens sincronizados com Figma
- [ ] Variantes para estados (focus, hover, active)
- [ ] Testes visuais (Chromatic / Percy)
