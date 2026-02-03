# React 19+ & TypeScript — Boas Práticas

Resumo das práticas recomendadas para construir o frontend do Hub de Inteligência Contratual.

Principais pontos:
- Component-Driven Architecture (Atomic Design). Priorize componentes pequenos e testáveis.
- Tipagem rigorosa com TypeScript: prefira interfaces e types para props e estados, use `zod` / `io-ts` para validações em borda.
- Hooks customizados para abstrair lógica de dados (ex.: `useContracts`, `useFleetMap`, `useAditivos`).
- State: Server state com React Query / SWR; local state leve com Zustand/Context + selectors.
- Performance: memoização seletiva (`useMemo`, `useCallback`) e `React.lazy` para rotas pesadas (mapas, relatórios).
- Acessibilidade: use elementos semânticos e role attributes quando necessário (ver a11y/skill.md).
- Internacionalização: preparar para PT/EN (i18n).

Integração com o projeto:
- Consumir a `VIEW_CONSOLIDADA` para alimentar queries que geram gráficos e KPIs.
- Manter reatividade para alertas de proximidade de vencimento (Saúde Contratual).

Checklist:
- [ ] Components com Storybook
- [ ] Unit tests (Vitest)
- [ ] Type coverage mínimo
- [ ] Perf budgets (Lighthouse)
