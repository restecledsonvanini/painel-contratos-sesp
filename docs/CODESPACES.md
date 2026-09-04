# GitHub Codespaces — Painel Contratos SESP

Guia curto para subir o monorepo no Codespaces. O guia completo (Windows + variáveis + troubleshooting) está em [`DEV.md`](./DEV.md).

Este projeto usa **npm workspaces** (não pnpm).

## Fluxo em 2 comandos

```bash
npm run bootstrap   # 1ª vez (ou quando a base estiver vazia)
npm run dev         # dia a dia — API :8888 + Web :5173
```

`bootstrap` chama, em ordem:

1. Cria `.env` a partir de `.env.example` (se faltar)
2. `npm ci` (ou `npm install`)
3. `db:bootstrap` → Docker Postgres → `migrate deploy` → seed (se vazio)

## Criar o codespace

1. No GitHub: **Code** → **Codespaces** → **Create codespace**.
2. O `.devcontainer` já faz:
   - **postCreate:** `npm run bootstrap` (install + banco)
   - **postStart:** `npm run db:bootstrap` (sobe Postgres + migrate; seed só se vazio)
3. Quando o terminal estiver pronto: `npm run dev`.
4. Aba **Ports** → abra a URL do **5173** (web). O Vite faz proxy de `/api/v1` para a API em **8888**.

Na primeira criação o bootstrap pode levar alguns minutos (Docker + seed).

## Docker no ar, mas lista vazia?

Só subir o container **não** aplica schema nem seed. Rode:

```bash
npm run bootstrap
# ou só o banco:
npm run db:bootstrap
npm run db:bootstrap -- --force-seed   # reaplicar seed
```

Depois: `npm run dev`.

## Portas

| Porta | Serviço |
|------:|---------|
| 5173 | Web (Vite) — use esta no browser |
| 8888 | API (Express) — **não** deixe pública (bypass de auth no codespace) |
| 5434 | Postgres (Docker) |

O `vite.config.ts` detecta `CODESPACES=true` e ajusta bind/`allowedHosts`/HMR sozinho.

## Login demo (após seed)

| E-mail | Senha | Papel |
|--------|-------|-------|
| admin@sesp.pr.gov.br | admin123 | ADMIN |
| gestor@sesp.pr.gov.br | gestor123 | GESTOR |
| analista@sesp.pr.gov.br | analista123 | ANALISTA |
| visitante@sesp.pr.gov.br | visitante123 | VISITANTE |

Com `AUTH_DEV_BYPASS=1` (padrão do `.env.example` / `remoteEnv`), a API libera sem login.

## Problemas comuns

| Sintoma | Solução |
|---------|---------|
| Docker sobe, base vazia | `npm run db:bootstrap` |
| `Postgres não respondeu` | Espere o DinD; `npm run db:logs`; depois `npm run bootstrap` |
| `Blocked request` no 5173 | Rebuild do container (precisa do `vite.config` atual) |
| HMR não recarrega | Porta 5173 encaminhada + `CODESPACES=true` |
| Docker falhou | Rebuild Container; confira Docker-in-Docker |

Mais detalhes: [`DEV.md`](./DEV.md).
