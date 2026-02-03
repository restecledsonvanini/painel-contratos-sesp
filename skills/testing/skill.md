# Testes & Storybook — Estratégia

Garantir qualidade e confiança com uma pirâmide de testes prática.

- Unit tests: **Vitest/Jest** para utilitários e lógica de componente.
- Integration / E2E: **Playwright** para fluxos críticos (ex.: geração de relatórios, filtros e export CSV).
- Storybook: documentar componentes e usar snapshots visuais para regressões.
- Test Data: fixtures para simular `VIEW_CONSOLIDADA` e cenários de aditivos/vencimentos.

Checklist:
- [ ] Coverage mínima por módulo
- [ ] Playwright flows para Critical Paths
- [ ] Storybook atualizada e integrada ao CI
