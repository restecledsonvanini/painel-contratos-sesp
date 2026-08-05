import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Input, Meter, Page, Textarea, useToast } from '@painel/ui';
import { http, getErrorMessage } from '../lib/http';
import { useContract } from '../hooks/useContracts';

type Simulacao = {
  ok: boolean;
  erros: string[];
  avisos: string[];
  acrescimo: {
    percentualAcrescido: number;
    limitePercent: number;
    disponivelCents: number;
    excedeu: boolean;
  };
  mesesProrrogados: number;
  dataFimVigenciaAtual: string;
  dataFimVigenciaProjetada: string | null;
  exigeJustificativaExcepcional: boolean;
};

const TIPOS = [
  { value: 'ADITIVO_PRAZO', label: 'Aditivo de prazo' },
  { value: 'ADITIVO_PRAZO_VALOR', label: 'Aditivo de prazo e valor' },
  { value: 'ADITIVO_ACRESCIMO_QUANTITATIVO', label: 'Aditivo de acréscimo' },
  { value: 'ADITIVO_SUPRESSAO', label: 'Aditivo de supressão' },
  { value: 'ADITIVO_QUALITATIVO', label: 'Aditivo qualitativo' },
  { value: 'APOSTILAMENTO_REAJUSTE', label: 'Apostilamento — reajuste' },
  { value: 'APOSTILAMENTO_REEQUILIBRIO', label: 'Apostilamento — reequilíbrio' },
  { value: 'APOSTILAMENTO_CORRECAO_MATERIAL', label: 'Apostilamento — correção material' },
];

export default function AlteracaoForm() {
  const { id: contratoId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: contract } = useContract(contratoId);

  const [tipo, setTipo] = useState('ADITIVO_PRAZO');
  const [eProtocolo, setEProtocolo] = useState('');
  const [objetoDescricao, setObjetoDescricao] = useState('');
  const [dataAssinatura, setDataAssinatura] = useState(new Date().toISOString().slice(0, 10));
  const [novaDataFimVigencia, setNovaDataFim] = useState('');
  const [valorAcrescido, setValorAcrescido] = useState(0);
  const [valorSuprimido, setValorSuprimido] = useState(0);
  const [justificativaExcepcional, setJustificativaExcepcional] = useState('');
  const [situacao, setSituacao] = useState('ASSINADO');
  const [simulacao, setSimulacao] = useState<Simulacao | null>(null);

  const payload = () => ({
    tipo,
    eProtocolo: eProtocolo || null,
    objetoDescricao: objetoDescricao || `Alteração ${tipo}`,
    dataAssinatura,
    novaDataFimVigencia: novaDataFimVigencia || null,
    valorAcrescido,
    valorSuprimido,
    justificativaExcepcional: justificativaExcepcional || null,
    situacao,
  });

  const simular = useMutation({
    mutationFn: async () => {
      const res = await http.post<Simulacao>(
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
        <Link to={contratoId ? `/contracts/${contratoId}` : '/contracts'}>
          <Button variant="ghost">Voltar</Button>
        </Link>
      }
    >
      <form
        className="app-form"
        onSubmit={(e) => {
          e.preventDefault();
          void salvar.mutateAsync();
        }}
      >
        <div className="app-form__panel">
          <div className="app-form__grid is-dense">
            <div className="app-form__span-3">
              <span className="field-label">Tipo</span>
              <select className="select-field" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[var(--font-size-xs)] text-[var(--text-muted)]">
                Aditivo altera prazo/valor; apostilamento não pode alterar valor global nem prazo.
              </p>
            </div>

            <Input label="e-Protocolo" value={eProtocolo} onChange={(e) => setEProtocolo(e.target.value)} />
            <Input
              label="Data de assinatura"
              type="date"
              value={dataAssinatura}
              onChange={(e) => setDataAssinatura(e.target.value)}
            />
            <div>
              <span className="field-label">Situação</span>
              <select
                className="select-field"
                value={situacao}
                onChange={(e) => setSituacao(e.target.value)}
              >
                <option value="MINUTA">Minuta</option>
                <option value="ASSINADO">Assinado</option>
                <option value="PUBLICADO">Publicado</option>
              </select>
            </div>

            <Input
              label="Nova data fim vigência"
              type="date"
              value={novaDataFimVigencia}
              onChange={(e) => setNovaDataFim(e.target.value)}
            />
            <Input
              label="Valor acrescido (R$)"
              type="number"
              step="0.01"
              value={valorAcrescido}
              onChange={(e) => setValorAcrescido(Number(e.target.value))}
            />
            <Input
              label="Valor suprimido (R$)"
              type="number"
              step="0.01"
              value={valorSuprimido}
              onChange={(e) => setValorSuprimido(Number(e.target.value))}
            />

            <div className="app-form__span-3">
              <Textarea
                label="Descrição do objeto"
                rows={3}
                value={objetoDescricao}
                onChange={(e) => setObjetoDescricao(e.target.value)}
              />
            </div>
            <div className="app-form__span-3">
              <Textarea
                label="Justificativa excepcional"
                rows={2}
                value={justificativaExcepcional}
                onChange={(e) => setJustificativaExcepcional(e.target.value)}
              />
              <p className="mt-1 text-[var(--font-size-xs)] text-[var(--text-muted)]">
                Obrigatória se exceder 25%/50% ou prazo máximo.
              </p>
            </div>
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

          <div className="app-form__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => void simular.mutateAsync()}
              disabled={simular.isPending}
            >
              {simular.isPending ? 'Simulando…' : 'Simular limites'}
            </Button>
            <Button type="submit" disabled={salvar.isPending}>
              {salvar.isPending ? 'Salvando…' : 'Salvar alteração'}
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
