# Acessibilidade (a11y) — Diretrizes

Priorize inclusão desde o início do desenvolvimento do Dashboard Executivo.

Práticas essenciais:
- Semântica HTML e roles ARIA quando necessário.
- Foco visível e navegação por teclado completa (tabelas e mapas interativos).
- Contraste de cores suficiente (WCAG AA) e verificação com tools (axe, lighthouse).
- Testes automatizados e manuais (NVDA/VoiceOver) nos fluxos críticos: visualização de contratos, filtros e notificações.

Considerações do projeto:
- Garantir que o Viaturômetro (mapas) e tabelas sejam totalmente navegáveis por teclado e que leitores de tela descrevam dados relevantes (ex.: colunas, indicadores de risco).

Checklist:
- [ ] ARIA labels nos controles dinâmicos
- [ ] Tab order consistente
- [ ] Testes com axe e auditoria manual
