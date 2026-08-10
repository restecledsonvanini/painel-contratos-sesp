# Desenvolvimento local — Windows e GitHub Codespaces

Guia único para subir o monorepo **painel-contratos-sesp** em qualquer máquina com **Node 20+** e **Docker**.

## Pré-requisitos

| Ferramenta | Windows | Codespaces |
|------------|---------|------------|
| Node.js | 20 ou 22 LTS | incluído no devcontainer |
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
4. A aba **Ports** encaminha **5173** (web) e **8888** (API). Abra a URL pública do 5173 se quiser testar fora do IDE.

**Nota:** na primeira criação o setup pode levar alguns minutos (Docker build + seed).

## Windows (local)

1. Instale [Node LTS](https://nodejs.org/) e [Docker Desktop](https://www.docker.com/products/docker-desktop/) (WSL2 recomendado).
2. Clone o repo e abra PowerShell ou Git Bash na raiz.
3. `npm run setup` → `npm run dev`.

### Windows — dicas

- **Prisma / testes:** pare a API (`Ctrl+C` no terminal do `npm run dev`) antes de `npm run db:generate` ou `npm run api:test` se aparecer erro de DLL bloqueada (`query_engine-windows.dll.node`).
- **Portas ocupadas:** `npm run db:down` para parar Postgres; mate processos em 8888/5173 se necessário.
- **PowerShell:** os scripts npm funcionam nativamente; prefira `npm run …` em vez de comandos bash.

## Variáveis de ambiente (`.env` na raiz)

Copie `.env.example` → `.env`. Mínimo:

```env
DATABASE_URL="postgresql://painel:pass@localhost:5434/painel_db"
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
| `AUTH_REQUIRED` | API | Sem token → 401 (exceto login/health) |
| `VITE_AUTH_REQUIRED` | Web | Sidebar/guards exigem login |
| `VITE_API_URL` | Web | Default `/api/v1` (proxy Vite); só mude se API estiver em outro host |

Com auth **desligada** (padrão do `.env.example`), a API usa usuário sistema **ADMIN** e a UI libera ações — ideal para estudar o código.

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
npm run api:test     # Vitest API (55 testes)
npm run domain:test  # Vitest domain
npm run web:e2e      # Playwright (AUTH ligada; sobe servidores sozinho)
```

## Testes

```bash
# API + domain (Postgres deve estar up)
npm run db:up
npm run api:test
npm run domain:test

# e2e (Windows: libere portas 8888/5173 antes)
npm run web:e2e
```

## Arquitetura dev (resumo)

```text
Browser → Vite :5173 → proxy /api/v1 → Express :8888 → Prisma → Postgres :5434
```

Mapas detalhados: [`plan/flow-maps/`](../plan/flow-maps/README.md)

## Problemas comuns

| Sintoma | Solução |
|---------|---------|
| `ECONNREFUSED` na API | `npm run db:up`; confira `DATABASE_URL` |
| 404 contrato | ID inexistente ou já excluído |
| 403 alteração | Login como **GESTOR+** |
| Select / React estranho | Hard refresh; confirme React 18 único (`npm ls react`) |
| Codespaces: Docker falhou | Rebuild container; verifique se Docker-in-Docker iniciou |
| `port already in use` | `npm run db:down`; pare `npm run dev` |
