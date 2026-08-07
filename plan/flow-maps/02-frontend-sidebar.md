# 2 — Mapa do frontend (Sidebar → impacto)

> Documento vivo. Fonte: [`packages/ui/src/components/Sidebar.tsx`](../../packages/ui/src/components/Sidebar.tsx) + [`apps/web/src/App.tsx`](../../apps/web/src/App.tsx) + páginas hub (`PainelPage`, `CadastrosPage`, …).

## Ideia de produto na navegação

A Sidebar não lista “todas as telas”: ela agrupa **cinco atividades** do gestor contratual. Rotas antigas (`/fornecedores`, `/dominios`, `/estrategico`…) **redirecionam** para hubs com `?tab=`.

```mermaid
flowchart TB
  subgraph sidebar [Sidebar]
    Painel[Painel]
    Contratos[Contratos]
    Cadastros[Cadastros]
    Util[Utilitarios]
    Config[Configuracoes]
  end

  Painel --> Tatico["tab=tatico"]
  Painel --> Estrategico["tab=estrategico"]
  Painel --> Alertas["tab=alertas"]

  Contratos --> Lista["/contracts"]
  Lista --> Detalhe["/contracts/:id"]
  Lista --> Novo["/contracts/new ANALISTA"]
  Detalhe --> Edit["/:id/edit ANALISTA"]
  Detalhe --> AltNova["/:id/alteracoes/nova GESTOR"]

  Cadastros --> Forn["tab=fornecedores"]
  Cadastros --> Serv["tab=servidores"]
  Cadastros --> Cat["tab=catalogo"]
  Cadastros --> Dot["tab=dotacoes"]

  Util --> Imp["tab=importacao"]
  Util --> Exp["tab=exportacao"]

  Config --> Org["tab=organizacao"]
  Config --> Listas["tab=listas"]
  Config --> Users["tab=usuarios ADMIN"]
  Config --> Seg["tab=seguranca ADMIN"]
```

## Visibilidade por papel (Sidebar)

`canSeeNav` + `minRole` no item. Com `VITE_AUTH_REQUIRED` **off**, tudo aparece (bypass). Com auth **on**:

| Item Sidebar | `minRole` item | Sub-itens extras |
|--------------|----------------|------------------|
| Painel | — (todos) | — |
| Contratos | — | writes na página, não no menu |
| Cadastros | — | forms `/new` exigem ANALISTA |
| Utilitários | **ANALISTA** | import/export |
| Configurações | **GESTOR** | Usuários / Segurança = **ADMIN** |

```mermaid
flowchart LR
  subgraph roles [ROLE_RANK]
    V[VISITANTE]
    A[ANALISTA]
    G[GESTOR]
    AD[ADMIN]
  end
  V --> A --> G --> AD

  V -.->|ve| PainelC[Painel_Contratos_Cadastros]
  A -.->|ve| UtilU[Utilitarios]
  G -.->|ve| Conf[Configuracoes]
  AD -.->|ve| UsersSeg[Usuarios_e_Seguranca]
```

## Atividade → impacto (o que “acontece de verdade”)

### 1. Painel

| Tab | Página | Impacto de negócio | APIs típicas |
|-----|--------|--------------------|--------------|
| Tático | `Dashboard` | KPIs operacionais, vencimentos | `GET /dashboard/kpis`, `/vencimentos` |
| Estratégico | `DashboardEstrategico` | Visões das “16 perguntas” (órgão, custos, frota…) | `GET /dashboard/por-orgao`, `/custos`, … |
| Alertas | `AlertasList` | Reconhecer / gerar alertas | `GET /alertas`, `POST .../reconhecer`, job ADMIN |

**Capacidade:** leitura rápida para decisão.  
**Limitação:** várias MVs ainda pouco filtradas por órgão; refresh analytics é job **ADMIN**.

### 2. Contratos (coração do sistema)

```mermaid
flowchart TB
  List[ContractsList]
  List -->|Abrir| Detail[ContractDetail abas]
  List -->|Novo ANALISTA| Form[ContractForm wizard]
  Detail -->|Editar| Form
  Detail -->|Nova alteracao GESTOR| Alt[AlteracaoForm]
  Alt -->|simular| Sim["POST .../alteracoes/simular"]
  Alt -->|salvar| CreateAlt["POST .../alteracoes"]
  Detail -->|Exportar| Ficha["GET .../export.csv|xlsx|pdf"]
  Detail -->|Excluir ANALISTA| Del["DELETE /contracts/:id"]
```

Abas do detalhe (resumo, timeline, itens, alterações, financeiro, fiscalização, rateio, publicidade, documentos, auditoria) **puxam endpoints nested** sob o mesmo contrato.

**Capacidade:** ciclo de vida + aditivos com simulação legal.  
**Limitação:** aditivo de prazo exige data **posterior** à vigência atual; DISPENSA exige `fundamentoLegalId` (trigger PG → 422).

### 3. Cadastros

Hub `CadastrosPage` com tabs; CRUD real nas rotas `/fornecedores|servidores|catalogo-itens|dotacoes/...`.

| Tab | Impacto | Write |
|-----|---------|-------|
| Fornecedores | Parte contratual (CNPJ/CPF), contatos, sanções | ANALISTA |
| Servidores | Gestores/fiscais (pessoas), não “entidade gestora” | ANALISTA |
| Catálogo | Itens padronizados → itens do contrato | ANALISTA |
| Dotações | Orçamento vinculado a contratos | ANALISTA |

**Didática:** “Cadastros” alimentam lookups e FKs do contrato. Sem fornecedor/servidor/órgão bons, o wizard de contrato trava.

### 4. Utilitários (ANALISTA+)

| Tab | Impacto |
|-----|---------|
| Importação | CSV → staging → aplicar (`/importacoes`) |
| Exportação | Extração em massa (`/exports/contratos.csv|.xlsx`) |

**Limitação:** import é caminho poderoso — papel mínimo ANALISTA de propósito.

### 5. Configurações (GESTOR+)

| Tab | Impacto | Write |
|-----|---------|-------|
| Estrutura | Órgãos / unidades (organograma SESP) | GESTOR |
| Listas suspensas | Domínios (modalidade, fundamento…) | **ADMIN** escreve valores |
| Usuários | Papel, órgão, servidor vinculados | ADMIN |
| Segurança | Allowlist de e-mail de login | ADMIN |

## Shell da aplicação

```mermaid
flowchart TB
  Main[main.tsx]
  Main --> Theme[ThemeProvider]
  Theme --> SideCtx[SidebarProvider]
  SideCtx --> RQ[QueryClientProvider]
  RQ --> AuthP[AuthProvider]
  AuthP --> Look[LookupsProvider]
  Look --> Router[BrowserRouter]
  Router --> Layout[DashboardLayout + Sidebar]
  Layout --> AppRoutes[App Routes lazy]
```

- **LookupsProvider**: cache ~30 min de `GET /lookups` — Select/LookupSelect dependem disso.
- **AuthProvider**: `localStorage.auth_token` + `/auth/me`.
- **Lazy routes**: code-split por página.

## Rotas legadas → hub

Redirecionamentos em `App.tsx` evitam bookmarks quebrados:

| Antiga | Nova |
|--------|------|
| `/estrategico`, `/alertas` | `/painel?tab=...` |
| `/fornecedores`, `/servidores`, `/catalogo-itens`, `/dotacoes` | `/cadastros?tab=...` |
| `/importacao` | `/utilitarios?tab=importacao` |
| `/unidades`, `/dominios` | `/configuracoes?tab=...` |
| `/empresas`, `/entidades-gestoras`, `/servicos` | cadastros unificados |

## Como estudar na prática

1. Suba API + web; login `visitante@` / `analista@` / `gestor@` / `admin@` (seed).
2. Com `VITE_AUTH_REQUIRED=1`, observe itens sumindo na Sidebar.
3. Em Contratos → detalhe, abra Network: cada aba ≈ um recurso nested da API (#1).
