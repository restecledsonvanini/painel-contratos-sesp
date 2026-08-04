erDiagram
    CONTRATO ||--o{ ITEM_CONTRATO : "possui (1:N)"
    CONTRATO ||--o{ ADITIVO : "sofre (1:N)"
    CONTRATO ||--o{ DOTACAO_FINANCEIRA : "consome (1:N)"
    FORNECEDOR ||--o{ CONTRATO : "celebra (1:N)"
    UNIDADE_FSP ||--o{ CONTRATO : "pertence a (1:N)"
    SERVIDOR ||--o{ CONTRATO : "fiscaliza/gere (1:N)"

    CONTRATO {
        uuid id_contrato PK
        string num_gms "UK (Único)"
        string e_protocolo "UK (Único)"
        uuid id_fornecedor FK
        uuid id_unidade_fsp FK
        uuid id_gestor FK
        uuid id_fiscal FK
        string modalidade_licitacao
        date data_inicio_vigencia
        date data_fim_vigencia_atual "Atualizada via triggers de aditivos"
        string status "Ex: VIGENTE, VENCIDO"
        decimal valor_global_atualizado "Calculado"
    }

    ITEM_CONTRATO {
        uuid id_item PK
        uuid id_contrato FK
        string categoria_item "Ex: VEICULO, IMOVEL, ALIMENTO"
        string descricao_detalhada
        decimal quantidade
        string unidade_medida "Ex: UN, M2, DIAS"
        decimal valor_unitario
        decimal valor_total_item
        string destinacao "Ex: Caracterizada, Descaracterizada"
    }

    ADITIVO {
        uuid id_aditivo PK
        uuid id_contrato FK
        string num_aditivo "Ex: 1º Aditivo"
        string tipo_aditivo "PRAZO, VALOR, AMBOS"
        string e_protocolo_aditivo
        date nova_data_fim
        decimal valor_acrescido
        decimal valor_suprimido
        date data_assinatura
    }

    UNIDADE_FSP {
        uuid id_unidade PK
        string orgao "Ex: PMPR, PCPR, DEPPEN"
        string subunidade "Ex: 33º BPM"
        string municipio
    }

    FORNECEDOR {
        uuid id_fornecedor PK
        string cnpj "UK"
        string razao_social
    }

    SERVIDOR {
        uuid id_servidor PK
        string rg_funcional "UK"
        string nome
        string cargo
    }

    DOTACAO_FINANCEIRA {
        uuid id_dotacao PK
        uuid id_contrato FK
        string num_nota_empenho
        string natureza_despesa
        string fonte_recurso
        decimal valor_empenhado
    }

