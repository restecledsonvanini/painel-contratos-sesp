# Plano de refatoração — Frontend do Centro de Inteligência Contratual

Data: 2026-08-04  
Status: proposto  
Escopo: adaptar o `apps/web` ao novo modelo contratual — lançamento guiado de dados, reaproveitamento total em listas suspensas, linha do tempo contratual e dashboards tático/estratégico  
Relacionado: [2026-08-03_frontend_design_system.md](./2026-08-03_frontend_design_system.md) · [tech_debt_2026-08-03.md](./tech_debt_2026-08-03.md) · [front_ui_2026-07-29.md](./front_ui_2026-07-29.md) · plano da API em [apps/api/plan/2026-08-04_api_refatoracao_modelo_contratual.md](../../api/plan/2026-08-04_api_refatoracao_modelo_contratual.md)

---

## 1. Objetivo

O design system e o shell já estão em pé (tokens DEST, sidebar colapsável, `.app-form`, Lucide). O que falta é o **produto**: hoje o front tem 8 cadastros planos e um dashboard que calcula KPIs no navegador a partir da lista inteira de contratos.

O novo modelo da API traz pilares orçamentários, itens com atributos dinâmicos, responsáveis com papéis, rateio por unidade, dotações e fontes de recurso, alterações contratuais (aditivos **e** apostilamentos), publicidade e uma camada analítica pronta. O frontend precisa de três capacidades novas:

1. **Lançar dado complexo sem assustar o usuário** — formulário em etapas, campos que aparecem conforme a categoria, cálculo ao vivo, rascunho salvo.
2. **Reaproveitar tudo em listas suspensas** — um único cache de lookups, combobox com busca e criação inline, sem obrigar o usuário a abrir outra tela para cadastrar um município ou um item de catálogo.
3. **Responder perguntas** — linha do tempo contratual, medidor de limite legal, painéis tático e estratégico servidos por endpoints agregados.

---

## 2. Diagnóstico do frontend atual

| Área | Situação | Ação |
|---|---|---|
| Cliente HTTP | `axios` chamado direto em cada hook, URL literal repetida ~30 vezes, sem instância, sem interceptor, sem header de auth | `lib/http.ts` com instância única, `baseURL` por env, normalização de erro |
| Chaves de cache | strings soltas; `useUpdateContract` invalida `['contracts']` mas não `['contract', id]` | fábrica central em `lib/queryKeys.ts` |
| Estrutura de pastas | `pages/` plano com 14 arquivos; sem `components/` (o `@source` do Tailwind aponta para pasta inexistente) | organização por feature |
| Validação | só `ContractForm` usa Zod; os 5 formulários de referência usam `required` inline do RHF | `@painel/schema` compartilhado em todos |
| `zod` | `apps/web` em `^4.4.3`, API/schema em `3.25.76` | alinhar em `3.25.x` |
| Selects | `<select>` nativo com `className="select-field"`, sem busca, sem criar inline | `Select` + `Combobox` no design system |
| Feedback | `alert()` para sucesso/erro e `window.confirm()` para excluir | `Toaster` + `ConfirmDialog` |
| Estados de carga | textos "Carregando..." ad hoc; mensagens de erro genéricas ("Erro ao carregar empresas") | `Skeleton`, `EmptyState`, `ErrorState` com detalhe do `error.code` |
| Listas | tabela inteira em memória, sem paginação, ordenação ou filtro | `DataTable` com paginação/ordenação/filtro no servidor e estado na URL |
| Dashboard | 3 cards calculados no cliente sobre `useContracts()`, 5 contratos recentes, um painel de texto estático | consumo de `/dashboard/*` com gráficos e drill-down |
| Duplicação | máscara de CNPJ/CPF copiada em 3 formulários; padrão de lista/excluir repetido em 6 páginas | `lib/masks.ts` + `ResourceListPage` genérico |
| Componentes ausentes | Select, Combobox, Modal, Drawer, Toast, Tabs, Stepper, Timeline, DataTable, Pagination, DatePicker, CurrencyInput, Skeleton, EmptyState, KpiCard, ChartCard, Meter | criar em `packages/ui` |
| Bibliotecas ausentes | nenhuma de gráfico, data, tabela ou toast | `recharts`, `date-fns`, `@tanstack/react-table`, `sonner`, primitivas Radix |
| Busca do header | input decorativo, sem comportamento | paleta de comandos (`cmdk`) com busca global |
| Cadastros órfãos | `/servicos` e `/fornecedores` alimentam tabelas que o contrato não usa | virar `/catalogo-itens` e `/fornecedores` unificado |
| Tailwind | `apps/web` mistura Tailwind v3 e o plugin Vite v4 | consolidar em v4 |

---

## 3. Decisões travadas

1. **Organização por feature.** `src/features/<dominio>/{api.ts,hooks.ts,components/,pages/}`; `src/lib` para infraestrutura; `src/components` só para composições genéricas do app. `packages/ui` continua sendo o design system puro, sem chamada de rede.
2. **Uma fonte de tipos.** `@painel/schema` (Zod) e `@painel/domain` (regras puras) são consumidos pelo front. Nada de `interface` duplicada de contrato no `apps/web`.
3. **Provedor de lookups global.** `LookupsProvider` busca `/api/v1/lookups` uma vez no boot (`staleTime` 30 min) e serve todos os selects. Listas grandes (fornecedores, servidores, municípios, catálogo) usam combobox assíncrono paginado. Quick-create injeta a opção no cache sem refetch.
4. **Formulário de contrato em etapas, com rascunho no servidor.** `situacao: EM_ELABORACAO` permite salvar incompleto; navegação livre entre etapas; validação por etapa com `zodResolver`; publicação exige o schema completo.
5. **Zero cálculo de KPI no cliente.** Todo agregado vem de `/dashboard/*`. O front só formata. Exceção: totais ao vivo dentro do formulário em edição (ainda não persistido), usando `@painel/domain` — a mesma função que a API usa.
6. **Estado de lista na URL.** Filtros, página, ordenação e aba viram `searchParams`. Isso dá links compartilháveis e habilita o drill-down do dashboard.
7. **Toast e diálogo, nunca `alert`/`confirm`.**
8. **Acessibilidade e mobile como critério de pronto**, não polimento: navegação por teclado no wizard e no combobox, `aria-live` para erros de formulário, tabelas viram cartões abaixo de 768 px.
9. **Migração feature a feature**, atrás de flag por rota, acompanhando as fases da API.

---

## 4. Arquitetura de pastas alvo

```
apps/web/src/
  lib/
    http.ts              instância axios, interceptors, ApiError normalizado
    queryKeys.ts         fábrica central de chaves
    format.ts            moeda (centavos), data, prazo, percentual — pt-BR
    masks.ts             CNPJ, CPF, protocolo, GMS, placa
    urlState.ts          hooks de sincronia com searchParams
    export.ts            download de CSV/XLSX
  providers/
    LookupsProvider.tsx  cache global de listas suspensas
    AuthProvider.tsx     papel do usuário e escopo por órgão
    ToastProvider.tsx
  features/
    dashboard/           painéis tático e estratégico
    contratos/           lista, wizard, detalhe com abas, alterações
    fornecedores/
    servidores/
    unidades/            órgãos + árvore de unidades
    catalogo/            itens de catálogo + definições de atributo
    dominios/            gestor de listas suspensas
    orcamento/           dotações, empenhos
    processos/
    alertas/
    importacao/
  components/
    ResourceListPage.tsx padrão de lista com DataTable + ações
    ResourceFormPage.tsx padrão de formulário simples
    LookupSelect.tsx     select ligado a um domínio
    LookupCombobox.tsx   combobox assíncrono + criar inline
    UnidadeTreeSelect.tsx
    MoneyField.tsx  DateField.tsx  DocumentField.tsx
    ContratoTimeline.tsx  LimiteLegalMeter.tsx
  layouts/
```

---

## 5. Camada de dados

### 5.1 Cliente HTTP

`lib/http.ts`: instância `axios` com `baseURL = import.meta.env.VITE_API_URL ?? '/api/v1'`, timeout de 15 s, `requestId` gerado por chamada, injeção de `Authorization`, e interceptor de resposta que converte o corpo `{ error: { code, message, details } }` em `ApiError` com `code`, `message`, `details`, `status`. Erro de rede vira `code: 'NETWORK_ERROR'`; timeout vira `'TIMEOUT'`; 503 vira `'SERVICE_UNAVAILABLE'` com mensagem "Banco de dados indisponível" — acabando com o genérico "Erro ao carregar empresas".

`lib/queryKeys.ts` centraliza as chaves:

```ts
export const qk = {
  lookups: ['lookups'] as const,
  lookup: (slug: string, q?: string) => ['lookups', slug, q ?? ''] as const,
  contratos: (filtros: ContratoFiltros) => ['contratos', filtros] as const,
  contrato: (id: string) => ['contratos', id] as const,
  contratoTimeline: (id: string) => ['contratos', id, 'timeline'] as const,
  contratoLimites: (id: string) => ['contratos', id, 'limites'] as const,
  dashboard: (painel: string, params?: object) => ['dashboard', painel, params ?? {}] as const,
};
```

Regra de invalidação: toda mutação em contrato invalida `['contratos']` (prefixo, pega lista e detalhe) e `['dashboard']`. Mutação em cadastro invalida `qk.lookups` **e** faz `setQueryData` otimista inserindo a nova opção.

### 5.2 Provedor de lookups

`GET /lookups` traz domínios, árvore de órgãos/unidades, catálogo resumido e definições de atributo. `LookupsProvider` expõe:

| Hook | Uso |
|---|---|
| `useDominio(slug)` | opções de um domínio, já ordenadas e filtradas por `ativo` |
| `useDominioValor(id)` | resolve id → label em tabelas e detalhes |
| `useUnidadeArvore()` | árvore para `UnidadeTreeSelect` |
| `useCatalogo(categoriaItemId)` | itens de catálogo por categoria |
| `useAtributosCategoria(categoriaItemId)` | definições que dirigem o formulário dinâmico de item |
| `useLookupSearch(slug, q)` | busca paginada para listas grandes |
| `useQuickCreate(slug)` | cria e devolve a opção, inserindo no cache |

O `ETag` do endpoint faz o boot subsequente custar um `304`.

---

## 6. Design system — o que criar em `packages/ui`

Nenhum componente novo pode ter cor, raio ou espaçamento literal: só `var(--*)` dos tokens existentes.

| Componente | Papel | Notas de implementação |
|---|---|---|
| `Select` | select acessível de lista curta | Radix Select; substitui `<select className="select-field">` |
| `Combobox` | busca assíncrona, opção "Cadastrar «texto»" | Radix Popover + `cmdk`; teclado completo; `renderOption` para exibir CNPJ/sigla ao lado do nome |
| `MultiSelect` | atributos `MULTI_SELECAO`, filtros | chips removíveis |
| `TreeSelect` | órgão → unidade → subunidade | expansão preguiçosa, busca achatada |
| `Modal` / `Drawer` | quick-create, edição contextual | foco preso, fecha no `Esc`, `Drawer` lateral para detalhe rápido |
| `ConfirmDialog` | exclusões e transições de situação | exige digitar o número do contrato em ações destrutivas |
| `Toaster` / `useToast` | feedback | `sonner`, posicionado abaixo do header |
| `Tabs` | abas do detalhe do contrato | Radix Tabs, aba sincronizada na URL |
| `Stepper` | wizard | mostra etapas concluídas/com erro/pendentes; clicável |
| `Timeline` | linha do tempo contratual | vertical, ícone por tipo de evento, valor e data à direita, agrupamento por ano |
| `DataTable` | listas | `@tanstack/react-table` em modo servidor: ordenação, paginação, visibilidade de coluna, seleção, densidade, export; vira cartões no mobile |
| `Pagination` | paginação | contagem total e salto de página |
| `DatePicker` / `DateRangePicker` | datas | `date-fns` + pt-BR; aceita digitação `dd/mm/aaaa` |
| `CurrencyInput` | dinheiro | opera em **centavos**, exibe `R$ 1.234,56`, nunca float |
| `NumberInput` | quantidades | decimais com locale pt-BR |
| `MaskedInput` | CNPJ, CPF, protocolo, GMS, placa | máscara na exibição, dígitos no valor |
| `FormField` / `FormSection` / `FormActions` | composição de formulário | envolve `.app-form__*` já existentes; label, hint, erro e `aria-describedby` |
| `FieldArrayList` | itens, responsáveis, rateios, dotações | adicionar/remover/reordenar linha |
| `Skeleton` | carregamento | variantes de texto, cartão e tabela |
| `EmptyState` / `ErrorState` | vazio e erro | ação primária no vazio; `code` + retry no erro |
| `KpiCard` | número + variação + ícone + drill-down | usada nos dois dashboards |
| `ChartCard` | moldura de gráfico com título, período e "atualizado em" | expõe o `atualizadoEm` das materialized views |
| `Meter` | medidor de limite legal | faixas verde/âmbar/vermelho para 25%/50% e prazo restante |
| `DescriptionList` | pares rótulo/valor no detalhe | responsivo, 1→2→3 colunas |
| `Badge` (evolução de `StatusBadge`) | situação, pilar, tipo de alteração | variantes por token, sem `switch` de cor espalhado |
| `Breadcrumbs` | navegação em rotas aninhadas | |
| `CommandPalette` | busca global (`Ctrl+K`) | ativa o input hoje inerte do header |
| `Tooltip` / `Popover` | ajuda de campo e base legal | texto do artigo da Lei 14.133 no ícone de ajuda |
| `Progress` | upload e importação CSV | |

Dependências a adicionar: `@tanstack/react-table`, `recharts`, `date-fns`, `sonner`, `cmdk`, `@radix-ui/react-{dialog,popover,select,tabs,tooltip,checkbox,radio-group}`. Remover a coexistência Tailwind v3/v4 no `apps/web`.

---

## 7. Sistema de listas suspensas (núcleo do pedido)

Toda referência do modelo é selecionável, buscável e criável no lugar onde é usada.

| Campo no formulário | Componente | Origem | Criar inline |
|---|---|---|---|
| Pilar orçamentário | `Select` (enum) | `@painel/domain` | não |
| Categoria de contratação | `Select` | `categoria-contratacao` | sim (admin) |
| Natureza do objeto | `Select` (enum) | `@painel/domain` | não |
| Modalidade | `Select` | `modalidade-licitacao` | não |
| Fundamento legal | `Select` dependente da modalidade | `fundamento-legal` (filtro por `parentId`) | sim |
| Fornecedor | `Combobox` assíncrono (busca por nome/CNPJ) | `/lookups/fornecedores` | sim → modal com CNPJ + razão social |
| Unidade gestora / destino / rateio | `TreeSelect` | árvore de unidades | sim → modal com órgão, sigla, nome, município |
| Município | `Combobox` | `/lookups/municipios` | não (semeado do IBGE) |
| Gestor e fiscais | `Combobox` múltiplo com papel | `/lookups/servidores` | sim → modal com nome, CPF, cargo |
| Item de catálogo | `Combobox` filtrado pela categoria | `/lookups/catalogo` | sim → modal com nome, categoria, unidade de medida |
| Unidade de medida | `Select` | `unidade-medida` | sim |
| Natureza de despesa / fonte de recurso | `Select` | domínios homônimos | sim |
| Dotação orçamentária | `Combobox` por exercício + código | `/lookups/dotacoes` | sim |
| Veículo de publicação | `Select` | `veiculo-publicacao` | não |
| Atributos de item (`SELECAO`) | `Select`/`MultiSelect` dinâmico | `dominioSlug` da definição | conforme domínio |

Padrão de quick-create: o `Combobox` mostra "Cadastrar «texto digitado»" quando não há resultado; abre `Modal` com o formulário mínimo daquela entidade; ao salvar, a opção entra no cache e já fica selecionada. O usuário nunca perde o preenchimento do contrato.

Tela `/dominios` (admin) permite criar, renomear, reordenar e desativar valores de qualquer lista, com aviso de quantos registros usam cada valor — desativar em vez de excluir quando há uso.

---

## 8. Wizard de lançamento de contrato

Rota `/contratos/novo` e `/contratos/:id/editar`, com `Stepper` e rascunho no servidor.

| Etapa | Campos | Validação e apoio |
|---|---|---|
| 1. Identificação | processo (opcional), nº GMS, ano, nº do contrato, e-Protocolo, pilar, categoria de contratação, natureza do objeto, modalidade, fundamento legal, objeto | fundamento obrigatório em dispensa/inexigibilidade; ao escolher a categoria, o pilar e a categoria de item padrão vêm de `metadata` |
| 2. Partes | fornecedor, unidade gestora, responsáveis (gestor + fiscais com papel, portaria e período) | aviso se o fornecedor tem sanção vigente; bloqueia gestor igual a fiscal; exige exatamente um gestor |
| 3. Objeto e itens | lista de itens: catálogo, quantidade, unidade de medida, valor unitário, periodicidade, unidade destino, município, endereço, atributos dinâmicos por categoria | total por item e total geral ao vivo; atributos renderizados de `useAtributosCategoria` |
| 4. Vigência | data de assinatura, início, prazo (valor + unidade), fim original (calculado e editável), prorrogável, limite de prorrogação, índice e mês de reajuste | fim sugerido a partir do prazo; limite de prorrogação sugerido pela natureza do objeto |
| 5. Orçamento | dotações (exercício, código, natureza, fonte, valor previsto), reserva, empenhos, valor global original | soma das dotações comparada ao valor global; alerta de divergência |
| 6. Rateio | distribuição por unidade em % ou valor, com quantidade | soma exibida em barra; bloqueia > 100% |
| 7. Publicidade e anexos | publicações (veículo, data, edição, id PNCP, URL), documentos por tipo | destaca ausência de publicação no PNCP |
| 8. Revisão | resumo completo, pendências por etapa, medidor de limites | "Salvar rascunho" sempre; "Publicar contrato" só com schema completo |

Comportamento: cada etapa valida com um sub-schema de `@painel/schema` e persiste via `PATCH /contratos/:id`; `Stepper` marca etapa com erro; sair da página avisa sobre alterações não salvas; `Ctrl+S` salva rascunho.

Formulário de **alteração contratual** (`/contratos/:id/alteracoes/nova`): tipo (aditivo × apostilamento com explicação da diferença legal em `Tooltip`), número, protocolo, fundamento, datas, prazo acrescido ou nova data fim, valores de acréscimo/supressão, percentual de reajuste, itens afetados. Antes de salvar, chama `POST /alteracoes/:id/simular` e mostra no `Meter` o impacto no limite de 25%/50% e no prazo máximo — o usuário vê o resultado legal **antes** de gravar.

---

## 9. Detalhe do contrato

Rota `/contratos/:id` com `Tabs` sincronizadas na URL:

| Aba | Conteúdo | Endpoint |
|---|---|---|
| Resumo | cabeçalho com nº GMS, fornecedor, unidade, situação efetiva, badges de pilar e modalidade; `DescriptionList`; cartões de vigência (dias até vencimento) e financeiro (original → atualizado) | `/contratos/:id`, `/financeiro` |
| Linha do tempo | `Timeline` vertical de todos os eventos, com filtro por tipo e marcador de "hoje" | `/contratos/:id/timeline` |
| Itens | tabela de itens com atributos expandidos e total | `/contratos/:id` |
| Alterações | aditivos e apostilamentos, com `Meter` de limites e ação de nova alteração | `/alteracoes`, `/limites` |
| Financeiro | dotações, fontes, empenhos, liquidado/pago, saldo | `/financeiro` |
| Fiscalização | responsáveis por papel e período, histórico de designações | `/responsaveis` |
| Rateio | distribuição por unidade, com gráfico de participação | `/rateios` |
| Publicidade | publicações e pendências | `/publicacoes` |
| Documentos | anexos por tipo | `/documentos` |
| Auditoria | histórico de alterações do `AuditLog`, com diff legível | `/auditoria` |

Ações no cabeçalho conforme papel: editar, nova alteração, suspender, reativar, encerrar, exportar, excluir.

---

## 10. Dashboards

Dois perfis, como em `fluxo_dashboard.md`.

### 10.1 Painel tático — `/` (fiscal e gestor)

Foco em operação e prazo.

| Widget | Endpoint |
|---|---|
| KPIs: sob minha responsabilidade, vencendo em 60 dias, sem publicação, no limite de acréscimo | `/dashboard/kpis`, `/dashboard/fiscalizacao` |
| Alertas priorizados por severidade, com reconhecer/ir para o contrato | `/alertas` |
| Barras de vencimento por janela (0–30, 31–60, 61–90, 91–120, 121–180), clicável para a lista filtrada | `/dashboard/vencimentos` |
| Tabela "ação necessária": contratos que exigem decisão de prorrogar ou relicitar | `/dashboard/vencimentos` |
| Conformidade de publicidade | `/dashboard/publicidade` |

### 10.2 Painel estratégico — `/estrategico` (secretário e diretores)

Foco em dinheiro e comparação.

| Widget | Endpoint |
|---|---|
| KPIs: total sob gestão, contratos vigentes, % aditado, contratos a vencer no trimestre | `/dashboard/kpis` |
| Valor e quantidade por órgão (barras horizontais, drill-down para unidade) | `/dashboard/por-orgao` |
| Custo por pilar × natureza de despesa (barras empilhadas) | `/dashboard/custos` |
| Composição por fonte de recurso (Tesouro, FUNESP, FUNSUSP, emenda) — responde "quem pagou" | `/dashboard/custos?agrupar=fonteRecurso` |
| Evolução mensal de aditivos e valor aditado (linha) | `/dashboard/aditivos` |
| Concentração de fornecedores (top 10 + participação) | `/dashboard/fornecedores` |
| Distribuição por modalidade, em quantidade e valor | `/dashboard/kpis` |
| Frota: locação vs aquisição, caracterizada vs descaracterizada, custo unitário por tipo | `/dashboard/frota` |
| Imóveis: custo por m² por destinação | `/dashboard/imoveis` |
| Postos de trabalho por unidade e custo anual | `/dashboard/postos` |
| Alimentação consolidada (gêneros + refeições) | `/dashboard/alimentacao` |
| Objeto contratado por item de catálogo (viaturas, kits APH, bastão retrátil, coldre) | `/dashboard/itens` |
| Carga por gestor/fiscal | `/dashboard/fiscalizacao` |

Regras de UI: todo gráfico é `ChartCard` com título, período, "atualizado em" (vindo da MV) e botão de exportar; todo número é clicável e leva para `/contratos` com os filtros correspondentes na URL; filtro global de exercício, órgão e pilar no topo, persistido em `searchParams`; sem gráfico de pizza para mais de 5 categorias.

---

## 11. Listas e cadastros

`ResourceListPage` genérica sobre `DataTable`, parametrizada por colunas, filtros, ações e rota de formulário. Substitui as 6 listas quase idênticas de hoje.

Lista de contratos (`/contratos`): colunas GMS/ano, objeto, fornecedor, unidade, pilar, modalidade, situação efetiva, vigência atual, dias até vencimento (com cor por faixa), valor atualizado; filtros de órgão/unidade, fornecedor, pilar, categoria, modalidade, situação, janela de vencimento, faixa de valor, fonte de recurso, exercício, responsável e busca livre; paginação e ordenação no servidor; visões salvas ("Vencendo em 60 dias", "Sem publicação", "No limite de acréscimo"); export CSV/XLSX; seleção múltipla para export em lote.

Cadastros com `ResourceFormPage`: fornecedores (com abas de contatos e sanções), servidores, órgãos, unidades (com árvore), catálogo de itens, definições de atributo por categoria, domínios, dotações, processos.

Rotas alteradas: `/empresas` é absorvida por `/fornecedores`; `/servicos` vira `/catalogo-itens`; `/entidades-gestoras` vira `/servidores`; `/unidades-fsp` vira `/unidades`. Redirects preservam links antigos. Sidebar reorganizada em grupos colapsáveis: **Visão geral** (Tático, Estratégico, Alertas), **Contratos** (Contratos, Novo contrato, Alterações, Processos), **Cadastros** (Fornecedores, Servidores, Órgãos e unidades, Catálogo de itens, Dotações), **Administração** (Listas suspensas, Atributos de item, Importação, Usuários, Auditoria).

---

## 12. UX transversal

- **Formatação pt-BR** central em `lib/format.ts`: moeda de centavos, data, prazo ("12 meses"), percentual, documento, dias até vencimento ("vence em 57 dias" / "vencido há 8 dias").
- **Cores semânticas por faixa de prazo**: ≤ 30 dias vermelho, 31–60 âmbar, 61–120 amarelo, > 120 neutro, vencido vermelho sólido — via tokens, sem literal.
- **Estados**: `Skeleton` no primeiro carregamento, `keepPreviousData` na paginação, `EmptyState` com ação, `ErrorState` com `code` e retry, `ErrorBoundary` por rota.
- **Otimismo controlado**: quick-create é otimista; mutação de contrato não é (regra legal pode recusar no servidor).
- **Acessibilidade**: foco visível com `--focus-ring`, `aria-live` no resumo de erros do formulário, rótulo em todo campo, combobox com `aria-activedescendant`, contraste AA nos tokens, `prefers-reduced-motion` respeitado.
- **Responsividade**: `DataTable` vira cartões < 768 px; wizard em uma coluna com `Stepper` horizontal rolável; dashboard 1→2→4 colunas; sidebar em drawer (já implementado).
- **Permissões na UI**: `useAuth().can('contrato:alterar')` esconde ação em vez de deixar o usuário tomar 403; papel `LEITOR` vê tudo em modo leitura.
- **Atalhos**: `Ctrl+K` paleta de comandos, `Ctrl+S` salvar rascunho, `g c` ir para contratos.

---

## 13. Importação de planilhas legadas

Tela `/importacao` em 4 passos: upload do CSV/XLSX → mapeamento de colunas para campos (com sugestão automática por nome) → relatório do dry-run (linhas válidas, linhas com erro detalhado, referências que serão criadas) → aplicar. Usa `/importacoes` e `/importacoes/:id/aplicar`, com `Progress` e histórico de lotes. É o caminho de entrada do acervo em planilha citado no `fluxo_dashboard.md`.

---

## 14. Fases

### Fase 0 — Fundação (independe da API nova)

`lib/http.ts`, `queryKeys.ts`, `format.ts`, `masks.ts`, `urlState.ts`; `ToastProvider` e `ConfirmDialog` substituindo `alert`/`confirm`; `zod` alinhado em `3.25.x`; consumo de `@painel/schema`; Tailwind consolidado em v4; corrigir `@source` inexistente; invalidação de cache corrigida; `Skeleton`/`EmptyState`/`ErrorState` com mensagem de erro real. Nada quebra, tudo melhora.

### Fase 1 — Design system

`Select`, `Combobox`, `MultiSelect`, `TreeSelect`, `Modal`, `Drawer`, `Tabs`, `DataTable`, `Pagination`, `DatePicker`, `CurrencyInput`, `NumberInput`, `MaskedInput`, `FormField`/`FormSection`, `FieldArrayList`, `Badge`, `DescriptionList`, `Tooltip`. Documentar cada um em uma rota interna `/dev/ui` (galeria) para revisão visual.

### Fase 2 — Lookups e cadastros

`LookupsProvider`, `LookupSelect`, `LookupCombobox`, `UnidadeTreeSelect`, quick-create em modal; `ResourceListPage`/`ResourceFormPage`; migração de fornecedores (absorvendo empresas), servidores, órgãos/unidades, catálogo, domínios, dotações; sidebar reorganizada; redirects das rotas antigas. **Depende das fases 1–2 da API.**

### Fase 3 — Contrato

Wizard de 8 etapas com rascunho; editor de itens com atributos dinâmicos; editor de responsáveis, rateio e dotações; lista de contratos com `DataTable` no servidor, filtros na URL e visões salvas; detalhe com abas de Resumo, Itens, Financeiro, Fiscalização, Rateio, Documentos e Auditoria. **Depende das fases 3–4 e 6 da API.**

### Fase 4 — Linha do tempo e alterações

`Timeline`, `Meter`, formulário de alteração contratual com simulação prévia, abas de Alterações e Linha do tempo. **Depende da fase 5 e 7 da API.**

### Fase 5 — Dashboards

`KpiCard`, `ChartCard`, `recharts`; painel tático e painel estratégico completos; drill-down para lista filtrada; filtros globais persistidos; exibição de "atualizado em". **Depende da fase 7 da API.**

### Fase 6 — Alertas, importação e busca global

Central de alertas com reconhecimento; wizard de importação; `CommandPalette` ativando a busca do header; export CSV/XLSX. **Depende da fase 8 da API.**

### Fase 7 — Autenticação e polimento

Tela de login, `AuthProvider` real, UI sensível a papel e escopo por órgão; auditoria de acessibilidade; medição de bundle e code splitting por feature. **Depende da fase 9 da API.**

---

## 15. Testes

| Tipo | Cobertura |
|---|---|
| Unitário (Vitest) | `format.ts` (centavos, datas, prazos), `masks.ts`, regras de `@painel/domain` reaproveitadas na UI, redutores de estado do wizard |
| Componente (RTL) | `Combobox` (teclado, busca, criar inline), `CurrencyInput` (digitação e colagem), `DataTable` (ordenar/paginar/filtrar), `Stepper` (validação por etapa), `Timeline` (ordem e agrupamento) |
| Integração (RTL + MSW) | wizard completo com mocks; erro 422 de regra legal exibido no campo correto; quick-create inserindo opção; drill-down do dashboard chegando com filtros na lista |
| E2E (Playwright) | fluxo "criar contrato com 2 itens e 1 aditivo → conferir linha do tempo e limites"; fluxo de importação CSV; smoke de responsividade em 375/768/1440 px |
| Acessibilidade | `axe` nas telas principais no CI |
| Visual | snapshot da galeria `/dev/ui` para detectar regressão de token |

---

## 16. Checklist

- [x] `fase0-fundacao` — http client, queryKeys, format/masks, toasts, confirm, zod alinhado, estados de erro reais
- [x] `fase1-design-system` — Select, Combobox, TreeSelect, Modal, Tabs, DataTable, DatePicker, CurrencyInput, FormField, galeria `/dev/ui`
- [x] `fase2-lookups-cadastros` — LookupsProvider, quick-create, órgãos/unidades em árvore, cadastros principais
- [x] `fase3-contrato` — formulário de contrato com itens; lista e detalhe + wizard 8 etapas com rascunho
- [x] `fase4-timeline` — Timeline, Meter de limites, formulário de alteração; ficha do contrato com abas §9
- [x] `fase5-dashboards` — painel tático + estratégico consumindo MVs com drill-down
- [x] `fase6-alertas-importacao` — central de alertas, wizard de importação, CommandPalette, export CSV
- [x] `fase7-auth-polimento` — login JWT, UI sensível a papel, skip-link, tabela→cards mobile, Playwright/axe smoke

## 17. Critério de pronto

- [x] Cliente HTTP centralizado; toasts/confirm no fluxo principal.
- [x] Nenhum KPI calculado no cliente (dashboard via MVs).
- [x] Lookups via cache; combobox/select nos cadastros principais.
- [x] Contrato completo em uma sessão com rascunho salvo (wizard 8 etapas — evolução).
- [x] Linha do tempo e medidor de limite na alteração.
- [x] 16 widgets/filtros 1:1 com as perguntas do plano da API (evolução).
- [x] a11y/mobile completos + Playwright/axe (evolução).
- [x] Tokens de tema em `theme.css` no shell principal.

## 18. Fora deste plano

Aplicativo móvel nativo; edição colaborativa em tempo real; geração de minuta de contrato em PDF; assinatura digital na interface; visualização de mapa por município (o modelo já tem código IBGE para habilitar depois); internacionalização além de pt-BR.
