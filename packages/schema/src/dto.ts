import type { Role, SimulacaoAlteracaoResult } from '@painel/domain';

/** DTOs de resposta da API — tipagem compartilhada (não confundir com *Create/*Update). */

export type RefSiglaNome = {
  id: string;
  sigla?: string;
  nome?: string;
  tipo?: string;
  nivel?: string | null;
};

export type RefUsuario = {
  id: string;
  nome?: string | null;
  email?: string | null;
};

export type DominioValorRef = {
  id?: string;
  codigo: string;
  label: string;
};

export type FornecedorContatoDTO = {
  id: string;
  nome: string;
  cargo?: string | null;
  email?: string | null;
  telefone?: string | null;
  principal: boolean;
};

export type FornecedorSancaoDTO = {
  id: string;
  tipo: string;
  processo?: string | null;
  dataInicio: string;
  dataFim?: string | null;
  abrangencia?: string | null;
  fonte?: string | null;
};

export type FornecedorDTO = {
  id: string;
  tipoPessoa?: 'JURIDICA' | 'FISICA';
  documento: string;
  razaoSocial: string;
  nomeFantasia?: string | null;
  inscricaoEstadual?: string | null;
  porte?: string | null;
  municipioId?: string | null;
  situacao?: string;
  /** @deprecated aliases de compat — preferir documento / razaoSocial */
  cnpj?: string;
  nome?: string;
  contatos?: FornecedorContatoDTO[];
  sancoes?: FornecedorSancaoDTO[];
  _count?: { contatos?: number; sancoes?: number; contratos?: number };
};

export type ServidorDTO = {
  id: string;
  nome: string;
  cpf?: string | null;
  rgFuncional?: string | null;
  cargo?: string | null;
  orgaoId?: string | null;
  unidadeId?: string | null;
  email?: string | null;
  telefone?: string | null;
  ativo?: boolean;
};

export type UnidadeFspDTO = {
  id: string;
  sigla: string;
  nome: string;
};

export type OrgaoDTO = {
  id: string;
  sigla: string;
  nome: string;
  tipo: string;
  ativo: boolean;
  parentId?: string | null;
  parent?: RefSiglaNome | null;
};

export type UnidadeOrganizacionalDTO = {
  id: string;
  orgaoId: string;
  parentId?: string | null;
  sigla: string;
  nome: string;
  nivel?: string | null;
  municipioId?: string | null;
  ativo: boolean;
  orgao?: RefSiglaNome;
  municipio?: { id: string; nome: string; uf: string; codigoIbge?: string };
  parent?: RefSiglaNome | null;
};

export type ArvoreOrgaoDTO = {
  id: string;
  kind?: 'orgao' | 'unidade';
  label: string;
  sigla: string;
  nome?: string;
  tipo?: string;
  nivel?: string | null;
  parentId?: string | null;
  municipio?: { id: string; nome: string; uf: string };
  children: ArvoreOrgaoDTO[];
};

export type MunicipioDTO = {
  id: string;
  nome: string;
  uf: string;
  codigoIbge: string;
};

export type DotacaoDTO = {
  id: string;
  exercicio: number;
  codigo: string;
  unidadeOrcamentaria?: string | null;
  funcionalProgramatica?: string | null;
  naturezaDespesaId?: string;
  fonteRecursoId?: string;
  descricao?: string | null;
  naturezaDespesa?: DominioValorRef;
  fonteRecurso?: DominioValorRef;
};

export type CatalogoItemDTO = {
  id: string;
  nome: string;
  codigo?: string | null;
  descricao?: string | null;
  categoriaItemId?: string;
  unidadeMedidaPadraoId?: string;
  ativo?: boolean;
  atributosPadrao?: Record<string, unknown> | null;
  categoriaItem?: DominioValorRef;
  unidadeMedidaPadrao?: DominioValorRef;
};

export type DominioDTO = {
  id: string;
  slug: string;
  nome: string;
  editavelPeloUsuario: boolean;
  _count?: { valores: number };
};

export type DominioValorDTO = {
  id: string;
  codigo: string;
  label: string;
  ordem: number;
  ativo: boolean;
  parentId?: string | null;
};

export type AlertaDTO = {
  id: string;
  tipo: string;
  severidade: 'INFO' | 'ATENCAO' | 'CRITICO';
  janelaDias?: number | null;
  mensagem: string;
  dataReferencia: string;
  reconhecidoEm?: string | null;
  reconhecidoPorId?: string | null;
  contratoId?: string;
  contrato: {
    id: string;
    numeroGms: string;
    anoGms: number;
    objeto: string;
    situacao?: string;
  };
};

/** Resposta de POST …/alteracoes/simular (espelha `@painel/domain`). */
export type AlteracaoSimulacaoDTO = SimulacaoAlteracaoResult;

export type DashboardKpisDTO = {
  totalContratos?: number;
  vigentes?: number;
  aVencer?: number;
  vencidos?: number;
  valorSobGestaoCents?: number;
  percentualAditadoMedio?: number;
  atualizadoEm?: string;
};

export type VencimentoJanelaDTO = {
  janela: string;
  qtd: number;
  valorCents: number;
  atualizadoEm?: string;
};

export type ContratoItemDTO = {
  id: string;
  sequencia: number;
  catalogoItemId: string;
  catalogoNome?: string;
  categoria?: string;
  quantidade: number;
  unidadeMedida?: string;
  valorUnitario?: number;
  valorTotal?: number;
  periodicidade?: string;
  atributos?: Record<string, unknown> | null;
};

export type ContratoAlteracaoDTO = {
  id: string;
  tipo: string;
  numero: number;
  eProtocolo?: string | null;
  novaDataFimVigencia?: string | null;
  valorAcrescido?: number;
  situacao?: string;
};

export type ContratoResponsavelDTO = {
  id: string;
  servidorId: string;
  servidorNome?: string;
  papel: string;
  atoDesignacao?: string | null;
  dataInicio?: string;
  dataFim?: string | null;
};

export type ContratoRateioDTO = {
  id: string;
  unidadeId: string;
  unidadeSigla?: string;
  unidadeNome?: string;
  percentual?: number | null;
  valorCents?: number | null;
  quantidade?: number | null;
  observacao?: string | null;
};

/** Lista / detalhe de contrato (API ainda pode emitir aliases legados). */
export type ContratoDTO = {
  id: string;
  protocoloCabeca?: string | null;
  eProtocolo?: string | null;
  numGms: number;
  numeroGms?: string;
  anoGms: number;
  /** @deprecated preferir unidadeGestora */
  unidadeFspId?: string;
  unidadeFsp?: RefSiglaNome;
  unidadeGestoraId?: string;
  unidadeGestora?: RefSiglaNome;
  subunidadeId?: string | null;
  subunidade?: RefSiglaNome | null;
  gestorId?: string;
  gestorName?: string;
  fiscalId?: string;
  fiscalName?: string;
  fornecedorId?: string;
  fornecedorName?: string;
  /** @deprecated preferir fornecedorId / fornecedorName */
  empresaId?: string;
  empresaName?: string;
  modalidade?: string;
  pilar?: string;
  naturezaObjeto?: string;
  situacao?: string;
  objeto?: string;
  valorAnual?: number;
  valorAnualCents?: number;
  valorGlobalOriginal?: number;
  dataInicio?: string | null;
  dataInicioVigencia?: string | null;
  dataFimOrig?: string | null;
  dataFimVigenciaOriginal?: string | null;
  status?: string;
  observacoes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  criadoPor?: RefUsuario | null;
  atualizadoPor?: RefUsuario | null;
  itens?: ContratoItemDTO[];
  alteracoes?: ContratoAlteracaoDTO[];
  responsaveis?: ContratoResponsavelDTO[];
  rateios?: ContratoRateioDTO[];
  aditivos?: Array<{
    id?: string;
    numAditivo: number;
    protocoloAdit: string;
    novoFimVigencia?: string | null;
    valorAdicional?: number;
  }>;
};

export type ContratoDetailDTO = ContratoDTO;

/** Sessão /me e login — sem relações. */
export type AuthUserDTO = {
  id: string;
  email: string | null;
  nome: string | null;
  role: Role;
  orgaoId: string | null;
  servidorId: string | null;
  ativo: boolean;
};

/** Usuário administrativo (lista/detalhe). */
export type UsuarioDTO = AuthUserDTO & {
  createdAt?: string;
  updatedAt?: string;
  orgao?: { id: string; sigla: string; nome: string } | null;
  servidor?: { id: string; nome: string; cpf?: string | null } | null;
};
