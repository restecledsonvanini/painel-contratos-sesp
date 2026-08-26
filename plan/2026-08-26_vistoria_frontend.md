# 2026-08-26 — Vistoria e plano de refatoração do frontend

Auditoria de leitura sobre `apps/web/src` (59 arquivos TS/TSX) e `packages/ui/src` (52 arquivos), com apoio de `packages/schema` e `packages/domain`.
Stack auditada: React 18.3 + Vite 8 + React Router 6 + TanStack Query 5 + Axios + Zod 3 + `@painel/ui` (Radix).

**Nenhum arquivo de código foi alterado neste documento.** É o equivalente frontend da vistoria de 26/08 no backend: diagnóstico + ondas de remediação.

Planos anteriores (`apps/web/plan/2026-08-04_frontend_refatoracao_contratual.md`, `tech_debt_2026-08-03.md`) descrevem o produto *antes* de HTTP unificado, wizard, lookups e design system. Vários itens dali **já foram feitos**. Este texto parte do estado atual, pós-ondas 1–6 da API.

Critérios (os mesmos da vistoria do backend):

| Eixo | O que se pergunta |
|---|---|
| Arquitetura | Camadas coerentes, um jeito só de buscar/mutar, zero UI falando com Prisma/SQL |
| Segurança | Auth fechada, RBAC na rota *e* no botão, token, XSS, credencial de demo |
| Performance | Listagens paginadas, lookups sem baixar o mundo, code-split que funciona |
| Qualidade | Tipagem, código morto, duplicação, god files, ESLint |
| Testes | Unidade + e2e cobrindo o que a onda mudar |
| A11y / mobile | Teclado, axe, viewport 375 px como critério de pronto, não polish |

---

## 0. Veredito

O front **já não é o cadastro plano de julho**. Tem shell DEST, `@painel/ui` decente, wizard de contrato com Zod compartilhado, paleta Ctrl+K, dashboards que consomem `/dashboard/*`, abas na URL, lazy nas rotas e e2e Playwright com axe.

O que ainda compromete o conjunto:

1. **Auth no UI é opt-in e fura.** Sem `VITE_AUTH_REQUIRED=1`, `useCanAct` libera tudo. Com a flag, `/contracts`, `/cadastros` e `/painel` **não** passam por `RequireRole` — só os `*/new` e `*/edit`. Qualquer um com a URL lê a lista. O interceptor HTTP **não trata 401** (não limpa token, não manda ao login).
2. **A pasta `pages/` é um saco de 30 arquivos**, com dois god components (`ContractForm` ~890 linhas, `ContractDetail` ~770). Só `features/dominios` segue o layout-alvo do plano de 04/08.
3. **Cadastros ainda baixam a tabela inteira** (`?flat=true`). Contratos paginam no servidor; o resto não. Lookups sobem o dicionário completo no boot.
4. **Não há teste de unidade** no web nem no `packages/ui`. ESLint está no `package.json` e **não existe config**. `tsconfig` desliga `noUnusedLocals`, então código morto não grita.

| Eixo | Situação |
|---|---|
| Arquitetura | **Meio caminho** — lib/http e queryKeys ok; pages/ sem módulo |
| Autenticação | **Fura** — bypass por env; rotas de leitura sem guarda; 401 mudo |
| RBAC de escrita | **Bom** — `RequireRole` nos new/edit; botões via `useCanAct` |
| Performance | **Listagens de cadastro e lookups** são o gargalo atual |
| Padrão de código | **Coerente no ds, irregular no app** |
| Testes | **Só e2e** (smoke + rbac); zero Vitest |
| Código morto | **Médio** — `useCreate` morto, `matchVencimento` órfão, redirects legados |

---

## 1. O que já está feito (não refazer)

Marcar para não reabrir plano velho:

| Item do plano 04/08 | Estado em 26/08 |
|---|---|
| Instância HTTP + `ApiError` + `x-request-id` | Feito (`lib/http.ts`) |
| `queryKeys.ts` central | Feito |
| Wizard de contrato + Zod `@painel/schema` | Feito (`ContractForm` + stepper) |
| LookupsProvider | Feito (payload único `/lookups`) |
| Toast / ConfirmDialog no lugar de `alert` | Feito |
| Dashboards via `/dashboard/*` | Feito (`useDashboard.ts`) |
| Paleta Ctrl+K | Feito (`CommandPalette`) |
| Skip-link, axe no smoke, tabela-como-card | Parcial (smoke cobre tático/lista/login/wizard) |
| Paginação de contratos no servidor | Feito (onda 4 da API + `ContractsList`) |
| Design system em `packages/ui` | Feito (Radix + DataTable, DatePicker, etc.) |

---

## 2. P0 — Segurança e auth no cliente

### 2.1 Rotas de leitura sem guarda

`App.tsx` envolve com `RequireRole` apenas mutações (`/contracts/new`, `*/edit`, utilitários, configurações). Continuam **abertas**:

- `/painel`, `/contracts`, `/contracts/:id`
- `/cadastros` (todas as abas)
- `/login` está *dentro* do `DashboardLayout` — sidebar aparece na tela de entrar

Com `VITE_AUTH_REQUIRED=1`, um visitante sem token ainda carrega a lista se souber a URL. A API agora responde 401 sem bypass; o UI não redireciona.

**Correção:** um `RequireAuth` no layout autenticado (tudo menos `/login`). `RequireRole` só para o mínimo de papel. Login **fora** do shell (rota irmã, sem Sidebar/Header).

### 2.2 Bypass espelhado no botão

`lib/access.ts` + `isAuthRequired()`:

```ts
if (!isAuthRequired()) return true;
```

É o par do `AUTH_DEV_BYPASS` da API. Depois da onda 1 do backend o bypass da API é opt-in. O do front continua **opt-out**: sem a env, todo mundo “pode”. Dev local com `.env` desatualizado mostra “Novo contrato” para visitante — é exatamente o que quebrou o e2e RBAC quando o Playwright reusou o `npm run dev`.

**Correção:** mesma regra da API. Produção: auth ligada. Dev: `VITE_AUTH_REQUIRED=1` no `.env.example` e no playwright `webServer.env` (já está no Playwright). Não reutilizar servidor de dev no e2e (`reuseExistingServer: false` no CI e documentado no local).

### 2.3 401 invisível

`http.ts` mapeia timeout, rede e 503. **401/403 não limpam sessão.** Token podre fica no `localStorage` até o próximo `GET /auth/me`.

**Correção:** interceptor: 401 → `logout()` + redirect `/login?from=`. 403 de escopo (órgão) vira toast, não logout.

### 2.4 Token no `localStorage`

Chave `auth_token`. Qualquer XSS lê o JWT (12 h de vida na API).

Não dá para httpOnly sem o backend emitir cookie. **Onda conjunta** com a API: cookie `Secure; HttpOnly; SameSite=Lax` no login, front só guarda `user` em memória. Até lá: CSP no `index.html` / Netlify headers e sanitizar qualquer `dangerouslySetInnerHTML` (hoje não há).

### 2.5 Credenciais de demo na UI

`LoginPage.tsx` pré-preenche `admin@sesp.pr.gov.br` / `admin123` e lista as senhas no rodapé.

**Correção:** só em `import.meta.env.DEV`. Build de produção: campos vazios, zero dica de senha.

---

## 3. P1 — Arquitetura

### 3.1 `pages/` plano vs um módulo de verdade

```
apps/web/src/pages/     ~30 arquivos (listas, forms, shells de aba)
apps/web/src/features/  só dominios/
```

Alvo (o mesmo do plano de 04/08, agora realista):

```
apps/web/src/
  app/                 rotas, layout, providers, error boundary
  lib/                 http, queryKeys, format, masks, access
  features/
    auth/
    painel/
    contratos/         list, wizard, detail, alteracao
    cadastros/         fornecedores, servidores, catalogo, dotacoes
    utilitarios/       importacao, exportacao
    configuracoes/     organizacao, dominios, usuarios, seguranca
```

Cada feature: `api.ts` (só paths), `hooks.ts`, `components/`, `pages/`. `packages/ui` continua sem `http`.

Migração **feature a feature**, uma onda por domínio. Não um PR de mover 30 arquivos.

### 3.2 God components

| Arquivo | ~linhas | Problema |
|---|---|---|
| `pages/ContractForm.tsx` | 890 | Wizard + 4 schemas + field arrays + lookups inline + `http.get` de catálogo |
| `pages/ContractDetail.tsx` | 770 | 8 abas, queries soltas, delete, export |
| `lib/createCrudHooks.ts` | 165 | `useCreate` morto + `useCreateFixed`; `onSuccess` espalhado duas vezes |
| `pages/Dashboard.tsx` | 350 | OK se extraísse `KpiStrip` / `VencimentosChart` |
| `pages/FornecedoresForm.tsx` | ~450 | Contatos + sanções no mesmo form |

**Correção:** ContractForm → `steps/IdentificacaoStep.tsx` etc. + hook `useContractWizard`. Detail → uma pasta `detail/` por aba. `createCrudHooks` → uma implementação, paginação opcional.

### 3.3 Dois jeitos de listar

Contratos: `{ data, meta }` + query string. Cadastros: `createCrudHooks.useList` assume `TEntity[]` e pede `?flat=true`.

Quando a API paginar fornecedores/servidores (dívida da onda 4 da API), o factory **quebra**.

**Correção:** `useList` receber `page/pageSize/q` e entender `{ data, meta }`. `flat` só para selects. Listas de tela nunca `flat`.

### 3.4 Lookups no boot

`LookupsProvider` busca `/lookups` inteiro, `staleTime` 30 min. Combobox de fornecedor/servidor deveria ser **async paginado**; o dicionário de domínio (modalidade, situação) pode continuar no boot.

**Correção:** `/lookups` só enums. Combobox grandes → `GET /fornecedores?q=&pageSize=20` (já existe na API).

### 3.5 HTTP solto no meio da página

`ContractForm` chama `http.get` de catálogo. `DominiosPage` monta `useQuery` na página. `ImportacaoWizard` idem.

**Regra:** página não conhece path. Hook ou `features/*/api.ts`.

---

## 4. P1 — Performance

### 4.1 Gargalo atual: cadastros `flat`

`useFornecedores` → `/fornecedores?flat=true`. Mesma coisa servidores, catálogo, dotações, unidades. Com seed pequeno passa. Com base real, a aba Cadastros congela.

**Correção:** igual contratos. URL `?page=&q=`. `DataTable` do `@painel/ui` já tem paginação manual — as listas atuais **não usam** (`Table` cru).

### 4.2 Lookups + wizard

Abrir `/contracts/new` dispara: lookups globais + listas de fornecedores, servidores, órgãos, unidades, catálogo. O wizard só precisa da etapa 1.

**Correção:** fetch da etapa visível; `enabled: step === 'partes'` nos hooks.

### 4.3 Code split incompleto

Rotas são `lazy()`. Shells de aba (`PainelPage`, `CadastrosPage`) também. Falta:

- Error boundary por `lazy` (hoje um chunk 404 derruba a árvore)
- Fallback decente (hoje `"Loading..."` no `App`, Skeleton só nas abas)
- `@source` do Tailwind v4 não inclui todos os globs se o arquivo mudar de pasta na onda 2 — atualizar no mesmo PR

### 4.4 Bundle

`recharts` no tático. `lucide-react` no app **e** no ui. `date-fns` no ui. Conferir duplicata com `npm run build -- --report` (plugin rollup-visualizer) numa onda, não no escuro.

---

## 5. P2 — Qualidade

### 5.1 Tipagem

Quase não há `any` explícito no web (melhor que a API). Buracos reais:

- `createCrudHooks` trata lista como array; resposta paginada é `unknown` na prática
- `tsconfig`: `noUnusedLocals: false`, `noUnusedParameters: false`
- `skipLibCheck: true` (aceitável)

**Correção:** ligar unused no web; tipo `Paginated<T>` compartilhado com `@painel/schema`.

### 5.2 Código morto

| Local | Item |
|---|---|
| `createCrudHooks.ts` | `useCreate` (não exportado; só `useCreateFixed`) |
| `ContractsList.tsx` | `diasAteFim` / `matchVencimento` — filtro foi para a API na onda 4 |
| `App.tsx` | ~15 redirects `/empresas`, `/entidades-gestoras`, `/servicos`, `/unidades-fsp` — manter **um** mapa `legado.ts`, não 15 `<Route>` |
| `package.json` | `tailwindcss@3` + `autoprefixer` **e** `@tailwindcss/vite@4` + `tailwind.config.cjs`. O CSS usa `@import "tailwindcss"` (v4). A v3 é lastro |
| `lint` script | sem `eslint.config` |

### 5.3 Duplicação

- Máscaras: `lib/masks.ts` e `packages/ui/src/lib/masks.ts`
- Tab na URL: `useTabParam` vs `useTabParam` (um só)
- Invalidação: `invalidate.ts` vs `invalidateKeys` dentro do factory

### 5.4 Login no shell

`DashboardLayout` envolve `/login`. Visitante vê nav de Contratos/Cadastros sem sessão (e os links funcionam se a API estiver em bypass).

### 5.5 Sem 404 e sem ErrorBoundary

Rota desconhecida cai no layout vazio. Exceção de render derruba a árvore.

---

## 6. Testes (hoje)

| Camada | O que existe |
|---|---|
| Vitest web | **Zero** |
| Vitest `packages/ui` | **Zero** |
| Playwright | `e2e/smoke.spec.ts` (tático, lista, login, wizard, mobile) + `e2e/rbac.spec.ts` |
| Axe | só no smoke, `color-contrast` desligado por causa do Recharts |

Buracos óbvios: cadastros, importação, detalhe de contrato (abas), 401, paginação, paleta. RBAC depende de **não** reusar API com `AUTH_DEV_BYPASS`.

**Regra das ondas:** igual ao backend. Onda não fecha com `npm run web:e2e` vermelho. Toda onda de lógica ganha Vitest (hook ou função pura). Toda onda de UI ganha um spec Playwright no caminho feliz + um axe na página tocada.

---

## 7. A11y e mobile (critério de pronto)

Já há skip-link, `main` focável, tabela-como-card, axe no smoke. Ainda:

- Fallback `"Loading..."` sem `aria-busy`
- Combobox/select do wizard: teclado e anúncio de opção (Radix ajuda se não customizar demais)
- Gráficos: `color-contrast` está muteado — reativar com padrão de cor DEST
- 375 px: menu hamburger testado; forms longos (contrato, fornecedor) não têm spec mobile próprio
- Foco após navegação de aba (`useTabParam`) — mandar foco ao heading da aba

---

## 8. Ondas de remediação

Mesma disciplina da API: uma onda, um tema, testes verdes, commit, `pushed` para a próxima. Não misturar “mover pasta” com “mudar contrato HTTP”.

### Onda F1 — Auth e shell (P0)

- `RequireAuth` no layout autenticado; `/login` rota irmã, sem sidebar
- Interceptor 401 → logout + redirect; 403 de órgão → toast
- Credenciais de demo só em `import.meta.env.DEV`
- Playwright: `reuseExistingServer: false` no CI; documentar no `DEV.md` (já há nota — reforçar)
- `VITE_AUTH_REQUIRED` no `.env.example` alinhado a `AUTH_REQUIRED` da API

**Teste:** e2e login falha (já existe) + e2e “sem token em `/contracts` redireciona”; rbac visitante sem botão Novo, **sem** API de bypass no ar.

### Onda F2 — Listas de cadastro paginadas

- `createCrudHooks.useList` → `{ data, meta }` + `page/q`
- Fornecedores, servidores, catálogo, dotações, unidades usam `DataTable` + URL
- Combobox de fornecedor/servidor no wizard deixa de usar `flat`

Depende da API expor paginação nesses recursos (hoje só contratos paginam de verdade; o factory já manda `flat`). Se o endpoint ainda devolver array, o hook aceita os dois formatos **um release**.

**Teste:** Vitest do parser de lista; e2e cadastros: busca `q=` reduz linhas.

### Onda F3 — Lookups magros + wizard preguiçoso

- `/lookups` só enums
- Hooks da etapa 2/3 do contrato com `enabled: step === …`
- Command palette já chama `/search` — não mudar contrato

**Teste:** abrir `/contracts/new` e assertar (MSW ou spy) que `/fornecedores` não dispara na etapa 1.

### Onda F4 — Quebrar ContractForm e ContractDetail

- `features/contratos/wizard/*`
- `features/contratos/detail/*` (uma aba = um arquivo)
- Zero `http.get` na página

**Teste:** e2e wizard (já existe) + detalhe: troca de aba na URL (`?tab=timeline`) e axe na aba resumo.

### Onda F5 — Módulos de pasta (sem mudar comportamento)

Mover cadastros, painel, utilitários, configurações para `features/*` no molde de `dominios`. Um PR por feature se o diff passar de ~15 arquivos. Atualizar `@source` do CSS.

**Teste:** e2e smoke intacto (é refactor puro).

### Onda F6 — Higiene, testes de unidade, ESLint

- ESLint flat config (typescript-eslint + react-hooks + jsx-a11y)
- `noUnusedLocals: true`
- Vitest no web: `access.test.ts`, parser de paginação, `prazo.ts`, máscaras
- Vitest mínimo no `packages/ui`: `cn`, máscara, um componente de form
- Remover `tailwindcss@3` / `autoprefixer` se o Vite já usa v4
- Error boundary + rota `*` 404
- Apagar `useCreate` morto e `matchVencimento` órfão

### Onda F7 — Cookie de sessão (com a API)

Só com endpoint de login setando cookie httpOnly. Front para de persistir JWT. É a única onda que **exige** mudança coordenada no backend.

---

## 9. Fora de escopo (não misturar)

- Prisma 8 / adapter rewrite (backend)
- Redesign visual DEST (tokens já existem; não é hora de Figma novo)
- Trocar Axios por `fetch` / ky
- Trocar React Router 6 por 7 (o `future` flags já estão no `BrowserRouter`)
- Microfrontends

---

## 10. Ordem sugerida e dependências

```
F1 auth/shell
  → F2 listas paginadas  (pode em paralelo com F6 higiene, se F6 não mover pastas)
  → F3 lookups magros
  → F4 quebrar god files
  → F5 mover para features/
  → F7 cookie (quando a API estiver pronta)
```

F6 pode fatiar: ESLint+dead code primeiro; Vitest em seguida.

**Regra herdada:** nenhuma onda fecha com `npm run web:e2e` vermelho. F2/F3/F4 ainda exigem `npm run api:test` verde se tocarem contrato HTTP.

---

## 11. Mensagem de commit da primeira onda (quando for implementar)

```
fix(web): fecha o shell autenticado e o 401

RequireAuth no layout; login fora da sidebar; interceptor 401 limpa
sessão. Credenciais de demo só em DEV. e2e deixa de reusar API com
bypass no CI.
```
