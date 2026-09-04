# Centro de Inteligência Contratual — SESP/PR

**📊 Planejamento e Monitoramento Estratégico de Contratos (Lei 14.133/2021)**

Um Hub de Inteligência Contratual para centralizar a gestão de dados de segurança pública, eliminando silos, garantindo previsibilidade contratual, segregação de funções e transparência.

---

## 🧭 Visão Geral
- Consolida Planilhas Mestre em uma **View Consolidada** que alimenta o **Dashboard Executivo** (KPIs e gráficos).
- Objetivos: previsibilidade contratual, visibilidade orçamentária, prevenção de riscos administrativos e apoio à tomada de decisão.

> **Fundamentação Legal:** Lei Federal 14.133/2021 • Decreto Estadual 10.086/2022

---

## 🗂️ Estrutura de Dados (Pilares)
- 🟢 **CUSTEIO (Manutenção & Operação)** — `TF_LOCAÇÃO_VEÍCULOS`, `TF_LOCAÇÃO_IMÓVEIS`, `TF_GÊNERO_ALIMENTÍCIO_FSP`
- 🔵 **INVESTIMENTO (Patrimônio & Tático)** — `TF_AQUISIÇÃO_VEÍCULOS`, `TF_BENS_TÁTICO_OPERACIONAIS`
- 🟡 **SERVIÇOS CONTINUADOS (Logística Humana)** — `TF_LOCAÇÃO_MÃO_DE_OBRA`, `TF_SERVIÇO_EVENTUAL`, `TF_FORNEC_REFEIÇÃO_FSP`
- 🔴 **ADITIVOS (Gestão do Ciclo de Vida)** — `ADITIVOS_PRAZO` (vínculo `ID_CONTRATO_ORIGINAL` → novos prazos/valores)

---

## 🔄 Fluxo Tecnológico (ETL)
Arquitetura: **Planilhas Mestre** → **Google Apps Script (ETL / Join de Aditivos)** → **View Consolidada** → **Memória Operacional (Cache)** → **Dashboard Executivo**.

- Automação leve via Google Apps Script para refinamentos e joins. Cache para responsividade e estabilidade.

---

## 📈 Dashboard Executivo — Dimensões de Decisão
1. **Viaturômetro**: mapa de calor por município e força de segurança (frota locada vs própria).
2. **Saúde Contratual**: monitoramento de dias até vencimento e gestão de aditivos.
3. **Radar de Fiscalização**: controle de carga por gestor/fiscal e prevenção de riscos.
4. **Estratégia Orçamentária**: visão por natureza de despesa, fornecedores (CNPJ) e impacto por unidade (PM, PC, CB).

---

## ✅ Benefícios & Governança
- **Segurança:** controle por papéis (RBAC).
- **Performance:** cache para visualização instantânea.
- **Auditabilidade:** histórico e sincronização rastreáveis.
- **Conformidade:** aderente à Lei 14.133/21.

---

## 🛠️ Stack & Boas Práticas (resumo)
- Frontend: **React 18**, **TypeScript**, **Vite**, **Tailwind**, **@painel/ui**
- Backend: **Express**, **Prisma**, **Postgres** (Docker)
- Tests: **Vitest** (API/domain), **Playwright** (e2e)

**Rodar local (Windows ou Codespaces):** [`docs/DEV.md`](docs/DEV.md) · Codespaces: [`docs/CODESPACES.md`](docs/CODESPACES.md)

```bash
npm run bootstrap   # 1ª vez
npm run dev         # dia a dia
```

(Este monorepo usa **npm** workspaces, não pnpm.)

---

## 📚 Skills & Guia de Boas Práticas
As práticas detalhadas e guias de skills estão na pasta `skills/` deste repositório — veja `skills/README.md`.

---

## 🤝 Contribuições
Contribuições são bem-vindas. Abra issues para bugs, features ou dúvidas. Para contribuições técnicas, siga o padrão de PR com testes e descrições claras.

---

## 📌 Contato & Personalização
Quer que eu personalize este `README` com seu **nome, profissão, links sociais e projetos favoritos**? Responda com os detalhes (nome, título, top skills, projetos, contatos) e eu atualizo.

---

> Documento gerado pelo Especialista SESP — Hub de Inteligência Contratual.
