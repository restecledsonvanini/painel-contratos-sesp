# Lucid React — Padrões de Componentes

Lucid React foca em criar componentes acessíveis, previsíveis e composáveis.

- Use slots / compound components para composição (e.g., `Table`, `Table.Row`, `Table.Cell`).
- Prop drilling mínimo; prefira context providers com selectors.
- Documente APIs em Storybook com knobs/controls.
- Forneça classes e tokens para fácil theming (integração com Tailwind tokens).

Aplicação ao projeto:
- Componentes de tabela para exibir `VIEW_CONSOLIDADA` com paginação, filtros por unidade e export CSV.
- Componentes de alerta para gerenciamento de aditivos e notificações de vencimento.

Checklist:
- [ ] Stories para todos os componentes
- [ ] A11y checks automatizados
- [ ] Tokens de estilo reutilizáveis
