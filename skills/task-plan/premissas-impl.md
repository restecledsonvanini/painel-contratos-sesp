# 📚 DOCUMENTAÇÃO CONSOLIDADA - Central de Contratos Sesp 2026

**Data Consolidação**:   
**Propósito**: Reforçar o uso de premissas inegáveis para desenvolvimento  
**Uso**: Ler e se seguir, sempre que for tomar uma decisão de implementação destrutiva ou de mudança de arquitetura

---

## Fluxo de interação x trabalho de implementação

- Sempre começar pelo fluxo de interação
- Depois, implementar:

>> Assimile o contexto da aplicação:

- Leia os arquivos de Projeto de implementação e do últim módulo implementado
- Verifique os arquivos de documentação consolidada, e avalie as dívidas técnicas e testes

>> Caso haja dívida técnica, informe juntamente com a proposta de e ordem de solução, caso contrário, pergunte ao usuário (dev).
>> SEMPRE PERGUNTE:

- Evite implementação antes de tirar todas as dúvidas técnicas e intenções do usuário.
- Pergunte sempre que usuário não for claro sobre os objetivos e intenções.
- Pergunte sempre que suas soluções não parecem surgir o efeito necessário (Pode ter sido falta de clareza nos requisitos do usuário)

>> SEMPRE: Avalie o cenário, os erros, ou proposta de feature, Apresente um planejamento sólido sequencial - Do mais crítico para o menos crítico. Só após aprovado, siga para fase de implementação.

## 📊LAYOUT E ESTILIZAÇÃO

- SEMPRE UTILIZE TAILWIND CSS V4.1 neste projeto
- NUNCA UTILIZE CSS CUSTOMIZADO, EXCETO `CSS-PARA-HUMANOS` -> Classes cujo objetio identificar para o Dev componentes e blocos do Layout, ou EM CASOS QUE Já faça parte das personalizações do projeto em Theme, por exemplo, cores, fontes, etc.

### 📌 PADRÃO /CSS-Para-Humanos

Manter classes semânticas em português para identificação:

```tsx
<div className="Página-Home">
<div className="Seção-Hero">
<div className="Card-Resultado">
<button className="Botão-Calcular">
```

Essas classes NÃO têm estilo - são apenas para legibilidade e DevTools
----

## UI X UX

- Sempre que houver dúvida, seguir o padrão de UI do projeto dos módulos já finalizados -> Neste caso, não se deve alterá-lo a menos que seja solicitado pelo usuário.
- Política User-First: Esta é uma plataforma educacional, portanto, deve-se priorizar a experiência do usuário -> Primeiro o usáro tem acesso a funcionalidade, depois descobre os extras (passo a passo, dicas, soluções alternativas, etc)
- Mobile First: Foco em responsividade
- PWA (Botões de instalação, navegação Bottom navigation, etc)
- Acessibilidade, title, aria-label, htmlFor, popover, tabindex, etc
- FontControl, Toggle Theme
- Icones: Lucide Icons -> nunca usar emojis ou fujir do padrão
- Avalie código legado, seletores universais, código css inline e corrija para nosso padrão.

## CUIDADOS EXTRAS

- **SEMPRE** pergunte antes de agir
- **NUNCA** tente implementar algo que não foi planejado (Isso é uma ansia huma que temos de evitar)
- **SEMPRE** use padrões de projetos, separação clara de responsabilidade,
- **NUNCA** misture types ou dados em componentes visuais
- **NUNCA** CRIE DOCUMENTOS .MD durante o planejamento a menos que seja solicitado pelo usuário -> Traga para a janela de chat
- **NUNCA** Faça commits, sempre sugira a hora certa de fazer o commit + mensagem sugerida conforme implementação da feature ou avanço
- **NUNCA** Faça push, sempre sugira a hora certa de fazer o push
- **SEMPRE** Faça pesquisas com foco em estratégia de evolução e referencias profissionais de design, arquitetura, matemática, ux, ui, e implementação
- **SEMPRE** Faça pesquisas com foco em estratégia de evolução e referencias profissionais de design, arquitetura, matemática, ux, ui, e implementação
- **SEMPRE** Anote isso: Se o arquivo passar de 250 linha deve ser imediatamente separado em partes menores

**DOCUMENTO VIVO - SEMPRE QUE PRECISO, AJUSTAREMOS!**
