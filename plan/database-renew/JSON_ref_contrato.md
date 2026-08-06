Modelo Arquitetural de Lançamento e Controle de Contratos Públicos (SESP/PR)1.

Visão Geral do Modelo de Controle Contratual

A estrutura de dados a seguir não é apenas um repositório de informações, mas um instrumento de governança e gestão contratual. Desenhado para refletir o ciclo de vida completo das contratações públicas no âmbito da Secretaria de Estado da Segurança Pública do Paraná (SESP/PR), o modelo visa mitigar riscos operacionais, evitar descontinuidade de serviços e garantir o rigor fiscal exigido pela Lei Federal nº 14.133/2021 (Nova Lei de Licitações) e regulamentado pelo Decreto Estadual nº 10.086/2022.2. Diretrizes de Lançamento (Input de Dados)Para garantir a integridade da base de dados, o lançamento inicial foi segregado em Três Pilares Orçamentários e Operacionais. Essa categorização força o preenchimento de metadados específicos para cada natureza de despesa, eliminando campos genéricos e garantindo que o dado nasça com qualidade:

CUSTEIO: Focado na manutenção da máquina pública (locação de veículos, imóveis e fornecimento contínuo de alimentação). O lançamento exige o detalhamento da destinação e o rateio por Unidades e Subunidades das Forças de Segurança Pública (FSP).

INVESTIMENTO: Direcionado à ampliação do patrimônio do Estado (aquisição de viaturas, armamentos e bens táticos). O lançamento foca na caracterização do bem, tombamento futuro e rastreabilidade da entrega.

SERVIÇOS: Engloba terceirização de mão de obra e serviços eventuais. O lançamento exige a definição clara dos postos de trabalho, endereços de execução e métricas de custo unitário versus custo global.

3. Mecanismos de Controle e RastreabilidadeA modelagem JSON foi construída para atuar como o "motor" de um painel de controle (Dashboard) ou sistema de alertas:

Controle de Vigência e Prazos: Através do cruzamento de DATA_FIM_VIGÊNCIA, DATA_ÚLTIMO_ADITIVO e DIAS_ATÉ_VENCIMENTO, o sistema permite a emissão de alertas precoces (ex: 60, 90 ou 120 dias antes do término), garantindo tempo hábil para a fase preparatória de uma nova licitação ou elaboração de termo aditivo, conforme exige o planejamento da Lei 14.133/21.

Gestão de Alterações Contratuais (O 4º Pilar): O nó ALTERAÇÃO_CONTRATUAL atua como um log histórico e financeiro. Em vez de sobrescrever os dados do contrato original, o modelo registra cada Aditivo ou Apostilamento como um evento relacional. Isso garante o controle estrito dos limites legais de acréscimo (ex: 25% ou 50%) e prorrogações sucessivas.

Segregação de Funções e Responsabilização: A presença obrigatória dos campos GESTOR_INDICADO e FISCAL_INDICADO em todos os nós reflete a exigência legal de fiscalização administrativa, técnica e setorial, permitindo auditorias rápidas sobre quem é o responsável por atestar as notas fiscais e monitorar a execução.

Estrutura de Dados (JSON)

{
  "CUSTEIO": {
    "locacao_veiculos": [
      {
        "ID_CONTRATO": "LOC_VEICULOS-1313/1313",
        "NUM_GMS": "1313/1313",
        "ANO_NUM_GMS": "1313",
        "PROTOCOLO_CABEÇA": "123.456-32",
        "GESTOR_INDICADO": "CHRIS (G)",
        "FISCAL_INDICADO": "PIETRA (F)",
        "MODALIDADE_LICITAÇÃO": "DISPENSA",
        "NOTA_RESERVA": null,
        "UNIDADE_FSP": "CBPMPR",
        "SUBUNIDADE": "CBPM3",
        "MUNICÍPIO": "SÃO JOSÉ",
        "EMPRESA": "EMPRESA 3",
        "OBJETO_CONTRATO": "Locação de Veículos - Caminhão",
        "DOTAÇÃO_ORÇAMENTÁRIA": "1313213",
        "NUM_NATUREZA_DESPESA": "5445645",
        "ANO_CONTRATAÇÃO": "2025",
        "UNIDADE_TEMPO": "MESES",
        "PERÍODO_CONTRATO": 12,
        "DATA_INÍCIO_VIGÊNCIA": null,
        "STATUS": "VIGENTE",
        "QTD_VEIC_AQUIS": 5,
        "VALOR_UNIT_AQUIS": 3000.00,
        "DATA_FIM_VIGÊNCIA": "2026-04-03",
        "DATA_ÚLTIMO_ADITIVO": null,
        "DIAS_ATÉ_VENCIMENTO": 57
      }
    ],
    "locação_imoveis": [
      {
        "ID_CONTRATO": "LOC_IMOVEIS-1321/2022",
        "NUM_GMS": "1321/2022",
        "ANO_NUM_GMS": "2022",
        "PROTOCOLO_CABEÇA": "1231211123",
        "GESTOR_INDICADO": "CHRIS (G)",
        "FISCAL_INDICADO": "LEANDRO (F)",
        "MODALIDADE_LICITAÇÃO": "DISPENSA",
        "NOTA_RESERVA": null,
        "UNIDADE_FSP": "PCPR",
        "SUBUNIDADE": "PCPR2",
        "MUNICÍPIO": "HIGIENOPOLIS",
        "EMPRESA": "EMPRESA 6",
        "OBJETO_CONTRATO": "Locação de Imóvel - Prédio",
        "DOTAÇÃO_ORÇAMENTÁRIA": "1321321321",
        "NUM_NATUREZA_DESPESA": "132123123",
        "ANO_CONTRATAÇÃO": "2022",
        "UNIDADE_TEMPO": "MESES",
        "PERÍODO_CONTRATO": 48,
        "DATA_INÍCIO_VIGÊNCIA": null,
        "DATA_FIM_VIGÊNCIA": "2026-01-28",
        "DATA_ÚLTIMO_ADITIVO": "2027-02-28",
        "DIAS_ATÉ_VENCIMENTO": 388,
        "STATUS": "VIGENTE-ADITADO",
        "QTD_VEIC_AQUIS": null,
        "VALOR_UNIT_AQUIS": null,
        "TOTAL_CONTRATO_AQUIS": null,
        "CUSTO_TOTAL_ADITADO": 15006.00,
        "DESTINAÇÃO_VEIC_AQUIS": "VENCIDO",
        "TIPO_VEÍCULO_AQUIS": "PRÉDIO",
        "CARACTERIZADA_AQUIS": null
      }
    ],
    "generos_alimenticios": [
      {
        "ID_CONTRATO": "GEN_ALIMENT-123/2024",
        "NUM_GMS": "123/2024",
        "ANO_NUM_GMS": "2024",
        "PROTOCOLO_CABEÇA": "1321321321",
        "GESTOR_INDICADO": "CHRIS (G)",
        "FISCAL_INDICADO": "PIETRA (F)",
        "MODALIDADE_LICITAÇÃO": "PREGÃO_E",
        "NOTA_RESERVA": null,
        "UNIDADE_FSP": "PMPR",
        "SUBUNIDADE": "33º BPM - CURITIBA",
        "MUNICÍPIO": "ADRIANÓPOLIS",
        "EMPRESA": "EMPRESA 3",
        "OBJETO_CONTRATO": "Fornecimento de Gêneros Alimentícios",
        "DOTAÇÃO_ORÇAMENTÁRIA": "231321321",
        "NUM_NATUREZA_DESPESA": "123132132",
        "ANO_CONTRATAÇÃO": "2024",
        "UNIDADE_TEMPO": "MESES",
        "PERÍODO_CONTRATO": 24,
        "DATA_INÍCIO_VIGÊNCIA": null,
        "DATA_FIM_VIGÊNCIA": "2026-04-15",
        "DATA_ÚLTIMO_ADITIVO": "2026-01-28",
        "DIAS_ATÉ_VENCIMENTO": -8,
        "STATUS": "VENCIDO-ADITADO",
        "CUSTO_MENSAL_ALIMENT": 15000.00,
        "CUSTO_ANUAL_ALIMENT": 180000.00,
        "CUSTO_TOTAL_ALIMENT": 180000.00,
        "CUSTO_TOTAL_ADITADO": null,
        "QTDE_DIA_ALIMENT": 1313,
        "TIPO_ALIMENT": "FEIJÃO",
        "LOCAL_ENTREGA_ALIMENT": "RUAS DAS ARAUCARIAS, 456A NOVA VILHA"
      }
    ]
  },
  "INVESTIMENTO": {
    "aquisicao_veiculos": [
      {
        "ID_CONTRATO": "AQUIS_VEICULOS-123/2025",
        "NUM_GMS": "123/2025",
        "ANO_NUM_GMS": "2025",
        "PROTOCOLO_CABEÇA": "20.250.00-1",
        "GESTOR_INDICADO": "CHRIS (G)",
        "FISCAL_INDICADO": "PIETRA (F)",
        "MODALIDADE_LICITAÇÃO": "INEXIGIBILIDADE",
        "NOTA_RESERVA": null,
        "UNIDADE_FSP": "CBPMPR",
        "SUBUNIDADE": "CBPM3",
        "MUNICÍPIO": "ITAMBÉ",
        "EMPRESA": "EMPRESA 3",
        "OBJETO_CONTRATO": "Aquisição de Veículos - SUV",
        "DOTAÇÃO_ORÇAMENTÁRIA": "34345453",
        "NUM_NATUREZA_DESPESA": "34545456456",
        "ANO_CONTRATAÇÃO": "2025",
        "UNIDADE_TEMPO": "MESES",
        "PERÍODO_CONTRATO": 12,
        "DATA_INÍCIO_VIGÊNCIA": null,
        "DATA_FIM_VIGÊNCIA": "2026-04-02",
        "DATA_ÚLTIMO_ADITIVO": "2027-11-23",
        "DIAS_ATÉ_VENCIMENTO": 657,
        "STATUS": "VIGENTE-ADITADO",
        "QTD_VEIC_AQUIS": 35,
        "VALOR_UNIT_AQUIS": 3000.00,
        "TOTAL_CONTRATO_AQUIS": 105000.00,
        "CUSTO_TOTAL_ADITADO": 2689.00,
        "DESTINAÇÃO_VEIC_AQUIS": null,
        "TIPO_VEÍCULO_AQUIS": "SUV",
        "CARACTERIZADA_AQUIS": "CARACTERIZADA"
      }
    ],
    "aquisicao_bens_tatico_oper": [
      {
        "ID_CONTRATO": "AQUIS_BENS_TATICO_OP-124/2023",
        "NUM_GMS": "124/2023",
        "ANO_NUM_GMS": "2023",
        "PROTOCOLO_CABEÇA": "20.250.00-2",
        "GESTOR_INDICADO": "ROCK (G)",
        "FISCAL_INDICADO": "MARIA DOS ANJOS (F)",
        "MODALIDADE_LICITAÇÃO": "INEXIGIBILIDADE",
        "NOTA_RESERVA": null,
        "UNIDADE_FSP": "DEPPEN",
        "SUBUNIDADE": "DEPPEN2",
        "MUNICÍPIO": "CURITIBA",
        "EMPRESA": "EMPRESA 6",
        "OBJETO_CONTRATO": "Aquisição de Armamento",
        "DOTAÇÃO_ORÇAMENTÁRIA": "23132151",
        "NUM_NATUREZA_DESPESA": "1321313",
        "ANO_CONTRATAÇÃO": "2023",
        "UNIDADE_TEMPO": "MESES",
        "PERÍODO_CONTRATO": 24,
        "DATA_INÍCIO_VIGÊNCIA": null,
        "DATA_FIM_VIGÊNCIA": "2025-10-29",
        "DATA_ÚLTIMO_ADITIVO": "2026-03-02",
        "DIAS_ATÉ_VENCIMENTO": 26,
        "STATUS": "VIGENTE-ADITADO",
        "CLASSE_ITEM_TATIC": "ARMAMENTO",
        "NOME_ITEM_TATIC": "FUZIL RQK2A",
        "DESCRIÇÃO_ITEM_TATIC": null,
        "QTD_BENS_TATIC": 55,
        "VALOR_UNIT_TATIC": 242.00,
        "TOTAL_CONTRATO_TATIC": 13310.00,
        "CUSTO_TOTAL_ADITADO": 15006.00
      }
    ]
  },
  "SERVICOS": {
    "locacao_mao_de_obra": [
      {
        "ID_CONTRATO": "LOC_MAO_DE_OBRA-124/2023",
        "NUM_GMS": "124/2023",
        "ANO_NUM_GMS": "2023",
        "PROTOCOLO_CABEÇA": "20.250.00-2",
        "GESTOR_INDICADO": "CHRIS (G)",
        "FISCAL_INDICADO": "MARIANA (F)",
        "MODALIDADE_LICITAÇÃO": "PREGÃO_E",
        "NOTA_RESERVA": null,
        "UNIDADE_FSP": "CBPMPR",
        "SUBUNIDADE": "CBPM3",
        "MUNICÍPIO": "ITAMBÉ",
        "EMPRESA": "EMPRESA 3",
        "OBJETO_CONTRATO": "Terceirização de Mão de Obra",
        "DOTAÇÃO_ORÇAMENTÁRIA": "123AS1DF32AS1D",
        "NUM_NATUREZA_DESPESA": "4545645654",
        "UNIDADE_TEMPO": "ANOS",
        "PERÍODO_CONTRATO": 1,
        "DATA_INÍCIO_VIGÊNCIA": null,
        "DATA_FIM_VIGÊNCIA": "2023-04-25",
        "DATA_ÚLTIMO_ADITIVO": "2026-06-23",
        "DIAS_ATÉ_VENCIMENTO": 139,
        "STATUS": "VIGENTE-ADITADO",
        "NOME_POSTO": "PEDREIRO",
        "DESC_POSTO": "DESC PREDREIRO",
        "ENDEREÇO_EXEC_POSTO": null,
        "QTD_POSTOS": 25,
        "CUSTO_POSTO": 55.00,
        "CUSTO_MENSAL_POSTO": 1375.00,
        "CUSTO_ANUAL_POSTO": 16500.00,
        "CUSTO_TOTAL_MAO_OBRA": 82500.00,
        "CUSTO_TOTAL_ADITADO": 50.00
      }
    ],
    "serviço_eventual": [
      {
        "ID_CONTRATO": "SERV_EVENTUAL-123/2025",
        "NUM_GMS": "123/2025",
        "ANO_NUM_GMS": "2025",
        "PROTOCOLO_CABEÇA": "20.250.00-1",
        "GESTOR_INDICADO": "ROCK (G)",
        "FISCAL_INDICADO": "PIETRA (F)",
        "MODALIDADE_LICITAÇÃO": "PREGÃO_E",
        "NOTA_RESERVA": null,
        "UNIDADE_FSP": "PCPR",
        "SUBUNIDADE": "PCPR3",
        "MUNICÍPIO": "SÃO JOSÉ",
        "OBJETO_CONTRATO": "Manutenção Predial",
        "DOTAÇÃO_ORÇAMENTÁRIA": "DOTAÇÃO_ORÇAMENTÁRIA 07",
        "NUM_NATUREZA_DESPESA": "132312312",
        "UNIDADE_TEMPO": "MESES",
        "PERÍODO_CONTRATO": 12,
        "DATA_INÍCIO_VIGÊNCIA": null,
        "DATA_FIM_VIGÊNCIA": "2025-04-02",
        "DATA_ÚLTIMO_ADITIVO": "2026-05-05",
        "DIAS_ATÉ_VENCIMENTO": 90,
        "STATUS": "VIGENTE-ADITADO",
        "NOME_SERV": "PINTURA",
        "DESCRIÇÃO_SERV": "MANUTENÇÃO PREDIAL",
        "CUSTO_UNIT_SERV": 450.00,
        "TOTAL_CONTRATO_SERV": null,
        "CUSTO_TOTAL_ADITADO": 1500.00,
        "LOCAL_SERV": null
      }
    ],
    "fornec_refeição": [
      {
        "ID_CONTRATO": "FORNEC_REFEIC-112/2023",
        "NUM_GMS": "112/2023",
        "ANO_NUM_GMS": "2023",
        "PROTOCOLO_CABEÇA": "20250002",
        "GESTOR_INDICADO": "ROCK (G)",
        "FISCAL_INDICADO": "LEANDRO (F)",
        "MODALIDADE_LICITAÇÃO": "PREGÃO_E",
        "NOTA_RESERVA": null,
        "UNIDADE_FSP": "CBPMPR",
        "SUBUNIDADE": "CBPM2",
        "MUNICÍPIO": "SÃO JOSÉ",
        "OBJETO_CONTRATO": "Fornecimento de Refeição",
        "DOTAÇÃO_ORÇAMENTÁRIA": "A1DS21F31 23D1",
        "NUM_NATUREZA_DESPESA": "213132",
        "ANO_CONTRATAÇÃO": "2023",
        "UNIDADE_TEMPO": "MESES",
        "PERÍODO_CONTRATO": 12,
        "DATA_INÍCIO_VIGÊNCIA": null,
        "DATA_FIM_VIGÊNCIA": "2025-12-31",
        "DATA_ÚLTIMO_ADITIVO": "2026-09-23",
        "DIAS_ATÉ_VENCIMENTO": 231,
        "STATUS": "VIGENTE-ADITADO",
        "TIPO_REFEIC": "ÓLEO",
        "QTD_DIA_REFEIC": 120,
        "VALOR_UNIT_REFEIC": 25.00,
        "CUSTO_MENSAL_REFEIC": 3000.00,
        "CUSTO_ANUAL_REFEIC": 36000.00,
        "TOTAL_CONTRATO_REFEIC": 864000.00,
        "CUSTO_TOTAL_ADITADO": 257.00,
        "LOCAL_ENTREGA_REFEIC": null
      }
    ]
  },
  "ALTERAÇÃO_CONTRATUAL": {
    "termo_aditivo": [
      {
        "ID_ADITIVO": "ADIT-1233/2025",
        "NATUREZA_CONTRATO_ADIT": "SERVICOS",
        "NUM_GMS_ADIT": "1233/2025",
        "ANO_GMS_ADIT": "2025",
        "ID_CONTRATO_ORIGINAL": "FORNEC_REFEIC-112/2023",
        "OBJETO_DO_ADITIVO": "Prorrogação de Prazo / Acréscimo de Valor",
        "ANO_CONTRAT_ADIT": "1905",
        "PROTOCOLO_ADIT": "13213132",
        "NUM_DE_ADIT": "1º ADITIVO",
        "UNID_TEMPO_ADIT": "MESES",
        "PERÍODO_ADIT": 5,
        "NOVA_VIGÊNCIA_ADIT": "2026-09-23",
        "VALOR_ADITAMENTO": 257.00,
        "STATUS_SYNC": "SINCRONIZADO"
      },
      {
        "ID_ADITIVO": "ADIT-12313/2025",
        "NATUREZA_CONTRATO_ADIT": "CUSTEIO",
        "NUM_GMS_ADIT": "12313/2025",
        "ANO_GMS_ADIT": "2025",
        "ID_CONTRATO_ORIGINAL": "LOC_IMOVEIS-1321/2022",
        "OBJETO_DO_ADITIVO": "Prorrogação Contratual",
        "ANO_CONTRAT_ADIT": "1905",
        "PROTOCOLO_ADIT": "13213132",
        "NUM_DE_ADIT": "3º ADITIVO",
        "UNID_TEMPO_ADIT": "MESES",
        "PERÍODO_ADIT": 5,
        "NOVA_VIGÊNCIA_ADIT": "2028-02-28",
        "VALOR_ADITAMENTO": 15006.00,
        "STATUS_SYNC": "SINCRONIZADO"
      }
    ],
    "termo_apostilamento": []
  }
}

