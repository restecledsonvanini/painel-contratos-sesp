# Desenvolvimento local — Windows e GitHub Codespaces

Guia único para subir o monorepo **painel-contratos-sesp** em qualquer máquina com **Node 20+** e **Docker**.

## Pré-requisitos

| Ferramenta | Windows | Codespaces |
|------------|---------|------------|
| Node.js | 20 ou 22 LTS (Prisma 7 pede 18.18+) | incluído no devcontainer |
| Docker | Docker Desktop | Docker-in-Docker (devcontainer) |
| Git | sim | sim |

## Setup rápido (ambos os ambientes)

Na **raiz** do repositório:

```bash
npm run setup
```

Isso:

1. Cria `.env` a partir de `.env.example` (se não existir)
2. Instala dependências (`npm install`)
3. Sobe Postgres em Docker (`localhost:5434`)
4. Roda `prisma generate`, `migrate deploy` e `seed`

Depois:

```bash
npm run dev
```

| Serviço | URL |
|---------|-----|
| Web (Vite) | http://localhost:5173 |
| API | http://localhost:8888 |
| API health | http://localhost:8888/api/v1/health |
| Postgres | `postgresql://painel:pass@localhost:5434/painel_db` |

## GitHub Codespaces

1. Abra o repo no GitHub → **Code** → **Codespaces** → **Create codespace**.
2. O `.devcontainer` roda `npm run setup` na criação e `npm run db:up` ao retomar.
3. Quando terminar, no terminal: `npm run dev`.
4. A aba **Ports** encaminha **5173** (web) e **8888** (API). Abra a URL do 5173 — é a única que você precisa: o front chama `/api/v1` e o próprio Vite faz o proxy para a API dentro do container.

O `vite.config.ts` detecta a variável `CODESPACES` e ajusta o dev server sozinho: bind em `0.0.0.0`, host `*.app.github.dev` liberado (sem isso o Vite responde `Blocked request`) e HMR pela porta 443. Em Windows nada disso é aplicado.

Não deixe a porta **8888** pública: a API confia no `AUTH_DEV_BYPASS` que o devcontainer injeta e responderia como ADMIN a qualquer um com a URL.

**Nota:** na primeira criação o setup pode levar alguns minutos (Docker build + seed).

## Windows (local)

1. Instale [Node LTS](https://nodejs.org/) e [Docker Desktop](https://www.docker.com/products/docker-desktop/) (WSL2 recomendado).
2. Clone o repo e abra PowerShell ou Git Bash na raiz.
3. `npm run setup` → `npm run dev`.

### Windows — dicas

- **Prisma / testes:** pare a API (`Ctrl+C` no terminal do `npm run dev`) antes de `npm run db:generate` ou `npm run api:test` se aparecer erro de DLL bloqueada (`query_engine-windows.dll.node`).
- **Prisma 7:** o client usa `@prisma/adapter-pg` (pool `pg`). URL e pastas de migrate estão em `packages/db/prisma.config.ts`, não no schema. `npm run setup` roda `prisma generate`. Não pule o generate depois do clone.
- **Portas ocupadas:** `npm run db:down` para parar Postgres; mate processos em 8888/5173 se necessário.
- **PowerShell:** os scripts npm funcionam nativamente; prefira `npm run …` em vez de comandos bash.

## Variáveis de ambiente (`.env` na raiz)

Copie `.env.example` → `.env`. Mínimo:

```env
DATABASE_URL="postgresql://painel:pass@localhost:5434/painel_db"
```

Para trabalhar sem login (padrão do `.env.example`):

```env
AUTH_DEV_BYPASS=1
```

Opcional (auth ligada — API e web **devem casar**):

```env
AUTH_REQUIRED=1
VITE_AUTH_REQUIRED=1
JWT_SECRET=altere-me-em-producao
AUTH_EMAIL_DOMAINS=sesp.pr.gov.br
```

| Flag | Onde | Efeito |
|------|------|--------|
| `DATABASE_URL` | API + Prisma + seed | Conexão Postgres |
| `AUTH_DEV_BYPASS` | API | Sem header → usuário sistema **ADMIN**. Opt-in; ignorado em produção |
| `AUTH_REQUIRED` | API | Sem token → 401 (exceto login/health). Prevalece sobre o bypass |
| `VITE_AUTH_REQUIRED` | Web | Shell exige login (`RequireAuth`). Deve casar com `AUTH_REQUIRED` |
| `VITE_API_URL` | Web | Default `/api/v1` (proxy Vite); só mude se API estiver em outro host |
| `JWT_SECRET` | API | **Obrigatório em produção** (32+ caracteres); a API não sobe sem ele |
| `CORS_ORIGINS` | API | Origens liberadas no CORS. Vazio = nenhum header (padrão) |
| `TRUST_PROXY` | API | Nº de proxies à frente. Default: desligado em dev, `1` em produção |
| `AUTH_LOGIN_RATE_MAX` | API | Logins falhos por IP+e-mail a cada 15 min (default 10) |

Com `AUTH_DEV_BYPASS=1` a API responde como **ADMIN** sem header e a UI libera ações — ideal para estudar o código. Sem a flag e sem token, toda rota protegida devolve 401.

Os tokens sintéticos (`Authorization: Bearer admin|gestor|analista|visitante`) funcionam **apenas** na suíte de testes; em `npm run dev` eles resultam em 401.

## Escopo de órgão

ADMIN enxerga todos os órgãos. Os demais papéis ficam restritos ao órgão do próprio usuário (`Usuario.orgaoId`), tanto nas listagens quanto no acesso por ID: pedir um contrato de outro órgão — ou qualquer recurso pendurado nele, como alterações, empenhos, publicações, analítico e export — devolve **403**.

Um usuário não-ADMIN **sem órgão vinculado** é negado, não liberado. Se um login demo passar a responder 403 em tudo, é isso: rode `npx tsx scripts/ensure-demo-users.ts` para revincular. A migration `20260826100000_usuario_orgao_backfill` já faz esse ajuste em bancos existentes.

O usuário do `AUTH_DEV_BYPASS` é ADMIN, então o bypass local continua vendo tudo.

## Listagem de contratos

`GET /api/v1/contracts` devolve `{ data, meta }` (página padrão 25, teto 100). Filtros de query (`situacao`, `vencimento`, `orgaoId`, `fornecedorId`, `modalidade`, `pilar`, `responsavelId`, `q`) são aplicados no banco. O detalhe `GET /contracts/:id` continua com o grafo completo. Export CSV/XLSX usa a mesma projeção enxuta, sem paginar.

## Endurecimento HTTP

A API aplica `helmet`, `compression` e rate limit de login. Rotas públicas são exatamente três: `/auth/login`, `/health` e `/health/db` — qualquer outra exige token.

`/metrics` e `/docs` passaram a exigir **ADMIN** (expunham latência por rota e a superfície OpenAPI inteira). Com `AUTH_DEV_BYPASS=1` você continua abrindo os dois normalmente.

O rate limit de login conta por **IP + e-mail** e só registra tentativa **falha**. Contar só por IP tiraria do ar uma rede com NAT inteira, e contar acerto atrapalharia uso legítimo.

## Login demo (após seed)

| E-mail | Senha | Papel |
|--------|-------|-------|
| admin@sesp.pr.gov.br | admin123 | ADMIN |
| gestor@sesp.pr.gov.br | gestor123 | GESTOR |
| analista@sesp.pr.gov.br | analista123 | ANALISTA |
| visitante@sesp.pr.gov.br | visitante123 | VISITANTE |

Se o seed estiver desatualizado: `npx tsx scripts/ensure-demo-users.ts`

## Scripts úteis

```bash
npm run dev          # API :8888 + Web :5173
npm run setup        # install + docker + migrate + seed
npm run db:up        # só Postgres
npm run db:down      # para Postgres
npm run db:seed      # reaplica seed
npm run api:test     # Vitest API (78 testes)
npm run domain:test  # Vitest domain
npm run web:e2e      # Playwright (AUTH ligada; sobe servidores sozinho)
```

## Testes

```bash
# API + domain (Postgres deve estar up)
npm run db:up
npm run api:test
npm run domain:test
npm run web:test
npm run ui:test
npm run web:lint

# e2e (pare `npm run dev` — o Playwright sobe API+web com AUTH ligada.
# Para reusar servidores locais: PW_REUSE=1)
npm run web:e2e
```

## Arquitetura dev (resumo)

```text
Browser → Vite :5173 → proxy /api/v1 → Express :8888 → Prisma 7 + pg → Postgres :5434
```

Mapas detalhados: [`plan/flow-maps/`](../plan/flow-maps/README.md)

## Problemas comuns

| Sintoma | Solução |
|---------|---------|
| `ECONNREFUSED` na API | `npm run db:up`; confira `DATABASE_URL` |
| 404 contrato | ID inexistente ou já excluído |
| 403 alteração | Login como **GESTOR+** |
| Select / React estranho | Hard refresh; confirme React 18 único (`npm ls react`) |
| 401 em tudo, sem ter ligado auth | Falta `AUTH_DEV_BYPASS=1` no `.env` (ou `AUTH_REQUIRED=1` está ligado) |
| `Bearer admin` devolve 401 | Esperado: tokens sintéticos só valem em teste. Use `POST /auth/login` |
| 403 em contrato que existe | Contrato é de outro órgão; só ADMIN atravessa o escopo |
| Lista de contratos vazia / `.map is not a function` | `GET /contracts` agora devolve `{ data, meta }`; o front já trata isso |
| 403 em tudo após login | Usuário sem `orgaoId`: `npx tsx scripts/ensure-demo-users.ts` |
| 403 em `/docs` ou `/metrics` | Passaram a exigir ADMIN; use `AUTH_DEV_BYPASS=1` ou logue como admin |
| e2e RBAC vê botão que não deveria | O Playwright **não** reusa `:8888`/`:5173` (a menos de `PW_REUSE=1`). Pare o `npm run dev` e rode `npm run web:e2e`. |
| 429 no login | Rate limit após 10 senhas erradas para o mesmo e-mail; espere 15 min |
| E2E: `Executable doesn't exist` | Falta o browser do Playwright: `npx playwright install chromium` |
| API não sobe: "JWT_SECRET é obrigatório" | `NODE_ENV=production` sem `JWT_SECRET` de 32+ caracteres |
| Codespaces: `Blocked request` no 5173 | Container antigo, sem o `allowedHosts`; rebuild para pegar o `vite.config.ts` atual |
| Codespaces: HMR não recarrega | Confirme que a porta 5173 está encaminhada e que `CODESPACES=true` no terminal |
| Codespaces: Docker falhou | Rebuild container; verifique se Docker-in-Docker iniciou |
| `port already in use` | `npm run db:down`; pare `npm run dev` |
