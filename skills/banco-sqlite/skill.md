🗄️ Modelagem de Banco de Dados: Hub de Inteligência SESP/PR

Esta documentação descreve a arquitetura do banco de dados SQLite projetado para substituir o ecossistema de planilhas, focando em integridade referencial, performance e conformidade com a Lei 14.133/2021.

1. Visão Geral da Arquitetura

Em vez de tabelas isoladas que repetem dados (como Gestor e Município em cada aba), adotamos o modelo Relacional. Criamos tabelas de apoio (dimensões) e tabelas de fatos (contratos e aditivos).

Diagrama Entidade-Relacionamento (Simplificado)

[ UNIDADES_FSP ] --< [ CONTRATOS ] >-- [ EMPRESAS ]
                          |
[ GESTORES_SESP ] --------|--< [ ADITIVOS ]
                          |
[ MUNICÍPIOS ] -----------|--< [ ATRIBUTOS_ESPECÍFICOS ]


2. Esquema de Tabelas (SQL)

2.1. Tabelas de Apoio (Lookups)

Essas tabelas garantem que não existam variações de escrita (ex: "PM" vs "P.M.").

unidades_fsp: Armazena as siglas oficiais (PMPR, PCPR, PPPR, PCP, SESP).

entidades_gestoras: Cadastro de Gestores e Fiscais para controle de carga de trabalho.

empresas: Cadastro de fornecedores (CNPJ e Razão Social).

municipios: Cadastro de cidades para inteligência geográfica.

2.2. Tabela Principal: contratos

Esta tabela contém o "núcleo" comum a qualquer tipo de contratação.

Campo

Tipo

Descrição

id_contrato

TEXT (PK)

Chave Primária (Fórmula: Natureza-GMS/Ano)

num_gms

INTEGER

Número sequencial GMS

ano_gms

INTEGER

Ano do GMS

protocolo_cabeca

TEXT

E-protocolo principal

unidade_fsp_id

INTEGER (FK)

Relacionamento com unidades_fsp

gestor_id

INTEGER (FK)

Relacionamento com entidades_gestoras

fiscal_id

INTEGER (FK)

Relacionamento com entidades_gestoras

empresa_id

INTEGER (FK)

Relacionamento com empresas

modalidade

TEXT

Pregão, Dispensa, etc.

objeto

TEXT

Descrição clara do objeto

valor_anual

REAL

Valor total para 12 meses

data_inicio

DATE

Início da vigência

data_fim_orig

DATE

Fim planejado originalmente

status

TEXT

Vigente, Vencido, etc.

2.3. Tabelas de Atributos Específicos (Extensões)

Para evitar campos nulos em contratos que não são de veículos, usamos tabelas satélites vinculadas ao id_contrato.

detalhes_veiculos: (id_contrato, tipo_veiculo, caracterizada, qtd, valor_unit).

detalhes_imoveis: (id_contrato, endereco, metragem, cep).

detalhes_alimentos: (id_contrato, tipo_alimento, qtd_dia, local_entrega).

detalhes_mao_obra: (id_contrato, nome_posto, qtd_postos, custo_posto).

2.4. Tabela de Histórico: aditivos

Campo

Tipo

Descrição

id_aditivo

INTEGER (PK)

Autoincremento

contrato_id

TEXT (FK)

Relacionamento com contratos

num_aditivo

INTEGER

Sequencial (1º, 2º...)

protocolo_adit

TEXT

E-protocolo do aditivo

novo_fim_vigencia

DATE

Data atualizada

valor_adicional

REAL

Caso haja acréscimo financeiro

3. Justificativas das Escolhas

3.1. Por que SQLite?

Atomicidade: Garante que, se você lançar um contrato e seus aditivos, ou ambos são gravados ou nada é. Isso evita "dados órfãos" comuns em planilhas.

Performance: Consultas que levavam segundos para processar via Apps Script em planilhas levarão milissegundos no SQLite.

Facilidade de Integração: O Dashboard pode ler o arquivo SQLite via API ou ser convertido em um JSON estático de forma muito mais rápida.

3.2. Normalização (Tabelas Satélites)

Escolhemos separar detalhes_veiculos de contratos por uma questão de Atomicidade. Um contrato de alimentação não precisa de campos como "Caracterizada (Sim/Não)". Isso mantém o banco limpo e facilita a criação de formulários dinâmicos.

3.3. Conformidade Jurídica (Lei 14.133)

Segregação de Funções: A tabela entidades_gestoras permite criar gatilhos (triggers) que impedem que um mesmo CPF seja Gestor e Fiscal do mesmo contrato.

Transparência: O histórico na tabela aditivos cria uma trilha de auditoria completa, essencial para o controle externo (TCE-PR).

Próximo Passo Sugerido: Criação do Script de Migração (Python ou Node.js) para converter suas planilhas atuais para este esquema SQL.