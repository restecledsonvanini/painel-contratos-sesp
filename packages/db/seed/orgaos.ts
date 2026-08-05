import type { NivelUnidade, TipoOrgao } from '../generated/client';

/** Forças / órgãos da SESP — mantidos como cadastrados. */
export const ORGAOS_SEED: Array<{ sigla: string; nome: string; tipo: TipoOrgao }> = [
  { sigla: 'PMPR', nome: 'Polícia Militar do Paraná', tipo: 'POLICIA_MILITAR' },
  { sigla: 'PCPR', nome: 'Polícia Civil do Paraná', tipo: 'POLICIA_CIVIL' },
  { sigla: 'CBMPR', nome: 'Corpo de Bombeiros Militar do Paraná', tipo: 'BOMBEIROS' },
  { sigla: 'DEPPEN', nome: 'Departamento Penitenciário do Paraná', tipo: 'POLICIA_PENAL' },
  { sigla: 'PCP', nome: 'Polícia Científica do Paraná', tipo: 'POLICIA_CIENTIFICA' },
  { sigla: 'DETRAN', nome: 'Departamento de Trânsito do Paraná', tipo: 'TRANSITO' },
  { sigla: 'SESP', nome: 'Secretaria de Estado da Segurança Pública', tipo: 'ADMINISTRACAO_DIRETA' },
];

/**
 * Apenas a sede/comando de cada órgão.
 * Subunidades (batalhões, delegacias, etc.) são cadastradas pelo usuário.
 */
export const UNIDADES_SEDE: Array<{
  orgaoSigla: string;
  sigla: string;
  nome: string;
  nivel: NivelUnidade;
}> = [
  { orgaoSigla: 'PMPR', sigla: 'CG-PMPR', nome: 'Comando Geral da PMPR', nivel: 'COMANDO_GERAL' },
  { orgaoSigla: 'PCPR', sigla: 'DG-PCPR', nome: 'Diretoria Geral da PCPR', nivel: 'DIRETORIA' },
  { orgaoSigla: 'CBMPR', sigla: 'CG-CBMPR', nome: 'Comando Geral do CBMPR', nivel: 'COMANDO_GERAL' },
  { orgaoSigla: 'DEPPEN', sigla: 'DIR-DEPPEN', nome: 'Diretoria do DEPPEN', nivel: 'DIRETORIA' },
  { orgaoSigla: 'PCP', sigla: 'DIR-PCP', nome: 'Diretoria da Polícia Científica', nivel: 'DIRETORIA' },
  { orgaoSigla: 'DETRAN', sigla: 'DIR-DETRAN', nome: 'Diretoria do DETRAN', nivel: 'DIRETORIA' },
  { orgaoSigla: 'SESP', sigla: 'GAB-SESP', nome: 'Gabinete da SESP', nivel: 'DIRETORIA' },
];

/** @deprecated use UNIDADES_SEDE */
export const UNIDADES_DEMO = UNIDADES_SEDE;
