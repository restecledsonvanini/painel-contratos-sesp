import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button, FormActions, FormField, Input, Meter, Page, Select, Textarea, useToast } from '@painel/ui';
import {
  TIPO_ALTERACAO_LABELS,
  isAditivoPrazo,
  isAditivoValor,
  isApostilamento,
  type TipoAlteracao,
} from '@painel/domain';
import type { AlteracaoSimulacaoDTO } from '@painel/schema';
import { http, getErrorMessage } from '../../../lib/http';
import { useContract } from '../../../hooks/useContracts';

/** Subconjunto usado no wizard (labels vindos do domínio). */
const TIPOS_FORM: TipoAlteracao[] = [
  'ADITIVO_PRAZO',
  'ADITIVO_PRAZO_VALOR',
  'ADITIVO_ACRESCIMO_QUANTITATIVO',
  'ADITIVO_SUPRESSAO',
  'ADITIVO_QUALITATIVO',
  'APOSTILAMENTO_REAJUSTE',
  'APOSTILAMENTO_REEQUILIBRIO',
  'APOSTILAMENTO_CORRECAO_MATERIAL',
];

function toDay(value?: string | null) {
  if (!value) return null;
  return String(value).slice(0, 10);
}

function addYears(isoDay: string, years: number) {
  const d = new Date(`${isoDay}T12:00:00`);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}

function dayAfter(isoDay: string) {
  const d = new Date(`${isoDay}T12:00:00`);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function AlteracaoForm() {
  const { id: contratoId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: contract } = useContract(contratoId);

  const [tipo, setTipo] = useState<TipoAlteracao>('ADITIVO_PRAZO');
  const [eProtocolo, setEProtocolo] = useState('');
  const [objetoDescricao, setObjetoDescricao] = useState('');
  const [dataAssinatura, setDataAssinatura] = useState(new Date().toISOString().slice(0, 10));
  const [novaDataFimVigencia, setNovaDataFim] = useState('');
  const [valorAcrescido, setValorAcrescido] = useState(0);
  const [valorSuprimido, setValorSuprimido] = useState(0);
  const [justificativaExcepcional, setJustificativaExcepcional] = useState('');
  const [situacao, setSituacao] = useState('ASSINADO');
  const [simulacao, setSimulacao] = useState<AlteracaoSimulacaoDTO | null>(null);

  const precisaPrazo = isAditivoPrazo(tipo);
  const precisaValor = isAditivoValor(tipo);
  const apostila = isApostilamento(tipo);

  const fimVigenciaAtual = useMemo(() => {
    const orig = toDay(contract?.dataFimVigenciaOriginal ?? contract?.dataFimOrig);
    const fromAlts = (contract?.alteracoes ?? [])
      .map((a: { novaDataFimVigencia?: string | null; novoFimVigencia?: string | null }) =>
        toDay(a.novaDataFimVigencia ?? a.novoFimVigencia),
      )
      .filter((d): d is string => Boolean(d))
      .sort();
    return fromAlts.at(-1) ?? orig;
  }, [contract]);

  // Prefill: +1 ano após o fim atual quando o tipo exige prazo.
  useEffect(() => {
    if (!precisaPrazo || !fimVigenciaAtual) return;
    setNovaDataFim((prev) => {
      if (prev && prev > fimVigenciaAtual) return prev;
      return addYears(fimVigenciaAtual, 1);
    });
  }, [precisaPrazo, fimVigenciaAtual, tipo]);

  useEffect(() => {
    if (apostila) setNovaDataFim('');
  }, [apostila]);

  const payload = () => ({
    tipo,
    eProtocolo: eProtocolo || null,
    objetoDescricao: objetoDescricao || `Alteração ${tipo}`,
    dataAssinatura,
    novaDataFimVigencia: precisaPrazo ? novaDataFimVigencia || null : null,
    valorAcrescido: precisaValor ? valorAcrescido : 0,
    valorSuprimido: precisaValor ? valorSuprimido : 0,
    justificativaExcepcional: justificativaExcepcional || null,
    situacao,
  });

  function validateLocal(): string | null {
    if (precisaPrazo) {
      if (!novaDataFimVigencia) {
        return 'Informe a nova data fim de vigência.';
      }
      if (fimVigenciaAtual && novaDataFimVigencia <= fimVigenciaAtual) {
        return `A nova data deve ser posterior à vigência atual (${fimVigenciaAtual}).`;
      }
    }
    if (apostila && (valorAcrescido > 0 || valorSuprimido > 0)) {
      return 'Apostilamento não pode alterar valor global.';
    }
    return null;
  }

  const simular = useMutation({
    mutationFn: async () => {
      const local = validateLocal();
      if (local) throw new Error(local);
      const res = await http.post<AlteracaoSimulacaoDTO>(
        `/contracts/${contratoId}/alteracoes/simular`,
        payload(),
      );
      return res.data;
    },
    onSuccess: (data) => setSimulacao(data),
    onError: (err) => toast.error('Falha ao simular', getErrorMessage(err)),
  });

  const salvar = useMutation({
    mutationFn: async () => {
      const local = validateLocal();
      if (local) throw new Error(local);
      const res = await http.post(`/contracts/${contratoId}/alteracoes`, payload());
      return res.data;
    },
    onSuccess: () => {
      toast.success('Alteração registrada.');
      navigate(`/contracts/${contratoId}`);
    },
    onError: (err) => toast.error('Erro ao salvar alteração', getErrorMessage(err)),
  });

  return (
    <Page
      title="Nova alteração contratual"
      description={
        contract
          ? `Contrato GMS ${contract.numGms}/${contract.anoGms} — simule limites antes de gravar.`
          : 'Aditivos e apostilamentos com simulação legal.'
      }
      actions={
        <Button to={contratoId ? `/contracts/${contratoId}` : '/contracts'} variant="ghost">
          Voltar
        </Button>
      }
    >
      <form
        className="app-form"
        onSubmit={(e) => {
          e.preventDefault();
          salvar.mutate();
        }}
      >
        <div className="app-form__panel">
          <div className="app-form__grid">
            <FormField
              label="Tipo"
              hint="Aditivo altera prazo/valor; apostilamento não altera valor global."
              className="app-form__col-12"
            >
              <Select
                options={TIPOS_FORM.map((value) => ({
                  id: value,
                  label: TIPO_ALTERACAO_LABELS[value],
                }))}
                value={tipo}
                onChange={(v) => {
                  setTipo(v as TipoAlteracao);
                  setSimulacao(null);
                }}
              />
            </FormField>

            <FormField label="Protocolo" className="app-form__col-4">
              <Input value={eProtocolo} onChange={(e) => setEProtocolo(e.target.value)} />
            </FormField>
            <FormField label="Assinatura" className="app-form__col-4">
              <Input
                type="date"
                value={dataAssinatura}
                onChange={(e) => setDataAssinatura(e.target.value)}
              />
            </FormField>
            <FormField label="Situação" className="app-form__col-4">
              <Select
                options={[
                  { id: 'MINUTA', label: 'Minuta' },
                  { id: 'ASSINADO', label: 'Assinado' },
                  { id: 'PUBLICADO', label: 'Publicado' },
                ]}
                value={situacao}
                onChange={setSituacao}
              />
            </FormField>

            {precisaPrazo && (
              <FormField
                label="Nova fim vigência"
                required
                className="app-form__col-6"
                hint={
                  fimVigenciaAtual
                    ? `Atual: ${fimVigenciaAtual} — escolha data posterior.`
                    : 'Obrigatória para aditivo de prazo.'
                }
              >
                <Input
                  type="date"
                  min={fimVigenciaAtual ? dayAfter(fimVigenciaAtual) : undefined}
                  value={novaDataFimVigencia}
                  onChange={(e) => setNovaDataFim(e.target.value)}
                />
              </FormField>
            )}
            {precisaValor && (
              <>
                <FormField label="Acréscimo" hint="Reais" className="app-form__col-3">
                  <Input
                    type="number"
                    step="0.01"
                    value={valorAcrescido}
                    onChange={(e) => setValorAcrescido(Number(e.target.value))}
                  />
                </FormField>
                <FormField label="Supressão" hint="Reais" className="app-form__col-3">
                  <Input
                    type="number"
                    step="0.01"
                    value={valorSuprimido}
                    onChange={(e) => setValorSuprimido(Number(e.target.value))}
                  />
                </FormField>
              </>
            )}

            <FormField label="Objeto" className="app-form__col-12">
              <Textarea
                rows={2}
                className="app-form__textarea"
                value={objetoDescricao}
                onChange={(e) => setObjetoDescricao(e.target.value)}
              />
            </FormField>
            <FormField
              label="Justificativa"
              hint="Obrigatória se exceder 25%/50% ou prazo máximo."
              className="app-form__col-12"
            >
              <Textarea
                rows={2}
                className="app-form__textarea"
                value={justificativaExcepcional}
                onChange={(e) => setJustificativaExcepcional(e.target.value)}
              />
            </FormField>
          </div>

          {simulacao && (
            <div className="mt-[var(--space-lg)] space-y-[var(--space-md)] rounded-[var(--radius-md)] border border-[var(--border)] p-[var(--space-md)]">
              <Meter
                label={`Acréscimo acumulado (limite ${simulacao.acrescimo.limitePercent}%)`}
                value={Number(simulacao.acrescimo.percentualAcrescido.toFixed(2))}
                max={simulacao.acrescimo.limitePercent}
                thresholds={{ amber: 80, red: 100 }}
              />
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
                Vigência atual: {simulacao.dataFimVigenciaAtual}
                {simulacao.dataFimVigenciaProjetada
                  ? ` → projetada ${simulacao.dataFimVigenciaProjetada}`
                  : ''}
                {' · '}
                {simulacao.mesesProrrogados} meses prorrogados
              </p>
              {simulacao.avisos.map((a) => (
                <p key={a} className="text-[var(--font-size-sm)]" style={{ color: 'var(--warning)' }}>
                  {a}
                </p>
              ))}
              {simulacao.erros.map((a) => (
                <p key={a} className="text-[var(--font-size-sm)]" style={{ color: 'var(--danger)' }}>
                  {a}
                </p>
              ))}
              {simulacao.ok && (
                <p className="text-[var(--font-size-sm)]" style={{ color: 'var(--success)' }}>
                  Simulação ok — pode gravar.
                </p>
              )}
            </div>
          )}

          <FormActions align="between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => simular.mutate()}
              disabled={simular.isPending}
            >
              {simular.isPending ? 'Simulando…' : 'Simular'}
            </Button>
            <Button type="submit" disabled={salvar.isPending || Boolean(simulacao && !simulacao.ok)}>
              {salvar.isPending ? 'Salvando…' : 'Salvar'}
            </Button>
          </FormActions>
        </div>
      </form>
    </Page>
  );
}
