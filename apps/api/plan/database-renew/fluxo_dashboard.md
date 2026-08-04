Este fluxograma explica a arquitetura de dados (Data Pipeline).

Ele mostra como o dado sai da mão do operador (que hoje usa planilhas ou sistemas legados) e chega mastigado, seguro e rápido na tela do Secretário de Segurança.

flowchart TD
    subgraph Fontes_de_Dados ["1. Lançamento e Fontes (Input)"]
        A1["Sistemas do Estado<br/>GMS / e-Protocolo"]
        A2["Formulários Web / App<br/>Input dos Fiscais"]
        A3["Planilhas Legadas<br/>Histórico SESP"]
        A1 -->|API / Export| B
        A2 -->|JSON| B
        A3 -->|CSV| B
    end

    subgraph Ingestao_ETL ["2. Camada de Ingestão e Tratamento (ETL)"]
        B["Apache Airflow / Python Scripts"]
        B -->|Limpeza, Padronização e<br/>Validação de Regras Lei 14.133| C
    end

    subgraph Armazenamento ["3. Data Warehouse (PostgreSQL)"]
        C[("Banco de Dados Relacional<br/>PostgreSQL")]
        C -->|Gera| D1[("Materialized View:<br/>Alertas de Vencimento")]
        C -->|Gera| D2[("Materialized View:<br/>Custos Consolidados por FSP")]
        C -->|Gera| D3[("Materialized View:<br/>Evolução de Aditivos")]
    end

    subgraph BI_Analytics ["4. Camada Semântica e Visualização"]
        D1 --> E
        D2 --> E
        D3 --> E
        E["Ferramenta de BI<br/>Power BI / Metabase / Looker"]
    end

    subgraph Alta_Gestao ["5. Consumo (Alta Gestão)"]
        E --> F1{"Painel Tático:<br/>Fiscais e Gestores"}
        E --> F2{"Painel Estratégico:<br/>Secretário e Diretores"}
        F1 -.->|Ação:| G1["Iniciar novo processo licitatório<br/>ou pedir Aditivo"]
        F2 -.->|Ação:| G2["Realocar Orçamento,<br/>Cobrar eficiência"]
    end

    style C fill:#336791,stroke:#fff,stroke-width:2px,color:#fff
    style E fill:#F2C811,stroke:#333,stroke-width:2px,color:#333
    style B fill:#8E44AD,stroke:#fff,stroke-width:2px,color:#fff

Explicação Estratégica do Fluxo para a Alta Gestão:

Lançamento (Input): O dado nasce nos sistemas oficiais (GMS) ou em formulários web controlados. Acaba o "copia e cola" livre em planilhas.

ETL (Tratamento): Antes de entrar no banco, o dado é validado. Exemplo: O sistema barra um aditivo que ultrapasse os 25% legais estabelecidos na Lei 14.133/21 sem a devida justificativa técnica.

Materialized Views (O Segredo da Performance): No PostgreSQL, não fazemos o BI calcular as métricas complexas toda hora. Criamos Materialized Views (tabelas pré-calculadas que atualizam de madrugada). Quando o Diretor abre o Dashboard às 08h da manhã, o painel carrega instantaneamente.

Painéis Segregados: O painel do Fiscal foca na operação (ex: "Contrato vence em 60 dias"). O painel do Secretário foca no dinheiro e estratégia (ex: "A PM gasta 40% a mais com frota locada do que a Polícia Civil").