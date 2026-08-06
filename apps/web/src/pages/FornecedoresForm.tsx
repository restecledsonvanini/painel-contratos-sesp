import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, ConfirmDialog, Input, Page, useToast } from '@painel/ui';
import {
  useCreateFornecedor,
  useCreateFornecedorContato,
  useCreateFornecedorSancao,
  useDeleteFornecedorContato,
  useDeleteFornecedorSancao,
  useFornecedor,
  useUpdateFornecedor,
  useUpdateFornecedorContato,
  type FornecedorContato,
  type FornecedorSancao,
} from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';
import { maskCnpj, maskCpf, onlyDigits } from '../lib/masks';
import { useConfirmDialog } from '../lib/useConfirmDialog';

type FormValues = {
  tipoPessoa: 'JURIDICA' | 'FISICA';
  documento: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacao: string;
  contatoNome: string;
  contatoCargo: string;
  contatoEmail: string;
  contatoTelefone: string;
};

const TIPOS_SANCAO = [
  { value: 'ADVERTENCIA', label: 'Advertência' },
  { value: 'MULTA', label: 'Multa' },
  { value: 'IMPEDIMENTO_LICITAR', label: 'Impedimento de licitar' },
  { value: 'DECLARACAO_INIDONEIDADE', label: 'Declaração de inidoneidade' },
] as const;

function ContatosSection({ fornecedorId, contatos }: { fornecedorId: string; contatos: FornecedorContato[] }) {
  const toast = useToast();
  const create = useCreateFornecedorContato(fornecedorId);
  const update = useUpdateFornecedorContato(fornecedorId);
  const del = useDeleteFornecedorContato(fornecedorId);
  const confirm = useConfirmDialog<string>();
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [principal, setPrincipal] = useState(false);

  const reset = () => {
    setNome('');
    setCargo('');
    setEmail('');
    setTelefone('');
    setPrincipal(false);
  };

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error('Informe o nome do contato');
      return;
    }
    try {
      await create.mutateAsync({
        nome: nome.trim(),
        cargo: cargo || null,
        email: email || null,
        telefone: telefone || null,
        principal,
      });
      toast.success('Contato adicionado.');
      reset();
    } catch (err) {
      toast.error('Falha ao adicionar contato', getErrorMessage(err));
    }
  };

  const onDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Contato removido.');
    } catch (err) {
      toast.error('Falha ao remover contato', getErrorMessage(err));
    }
  };

  return (
    <div className="app-form__panel">
      <h2 className="text-base font-semibold mb-3">Contatos</h2>
      <ul className="mb-4 space-y-2">
        {contatos.length === 0 && (
          <li className="text-sm text-[var(--muted)]">Nenhum contato cadastrado.</li>
        )}
        {contatos.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded border border-[var(--border)] px-3 py-2"
          >
            <div className="min-w-0">
              <p className="font-medium">
                {c.nome}
                {c.principal ? (
                  <span className="ml-2 text-xs text-[var(--muted)]">principal</span>
                ) : null}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {[c.cargo, c.email, c.telefone].filter(Boolean).join(' · ') || '—'}
              </p>
            </div>
            <div className="flex gap-2">
              {!c.principal && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={async () => {
                    try {
                      await update.mutateAsync({ contatoId: c.id, payload: { principal: true } });
                      toast.success('Contato marcado como principal.');
                    } catch (err) {
                      toast.error('Falha ao atualizar', getErrorMessage(err));
                    }
                  }}
                >
                  Principal
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => confirm.ask(c.id, 'Remover contato?', c.nome)}
              >
                Remover
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={onAdd} className="app-form__grid">
        <div className="app-form__span-2">
          <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div>
          <Input label="Cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} />
        </div>
        <div>
          <Input label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </div>
        <div className="app-form__span-2">
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm app-form__span-2">
          <input type="checkbox" checked={principal} onChange={(e) => setPrincipal(e.target.checked)} />
          Contato principal
        </label>
        <div className="app-form__actions app-form__span-2">
          <Button type="submit" size="sm" disabled={create.isPending}>
            Adicionar contato
          </Button>
        </div>
      </form>
      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.onOpenChange}
        title={confirm.pending?.title || 'Confirmar'}
        description={confirm.pending?.description}
        confirmLabel="Remover"
        onConfirm={onDelete}
      />
    </div>
  );
}

function SancoesSection({ fornecedorId, sancoes }: { fornecedorId: string; sancoes: FornecedorSancao[] }) {
  const toast = useToast();
  const create = useCreateFornecedorSancao(fornecedorId);
  const del = useDeleteFornecedorSancao(fornecedorId);
  const confirm = useConfirmDialog<string>();
  const [tipo, setTipo] = useState<string>('ADVERTENCIA');
  const [processo, setProcesso] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [abrangencia, setAbrangencia] = useState('');
  const [fonte, setFonte] = useState('');

  const reset = () => {
    setTipo('ADVERTENCIA');
    setProcesso('');
    setDataInicio('');
    setDataFim('');
    setAbrangencia('');
    setFonte('');
  };

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataInicio) {
      toast.error('Informe a data de início da sanção');
      return;
    }
    try {
      await create.mutateAsync({
        tipo,
        processo: processo || null,
        dataInicio,
        dataFim: dataFim || null,
        abrangencia: abrangencia || null,
        fonte: fonte || null,
      });
      toast.success('Sanção registrada.');
      reset();
    } catch (err) {
      toast.error('Falha ao registrar sanção', getErrorMessage(err));
    }
  };

  const onDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Sanção removida.');
    } catch (err) {
      toast.error('Falha ao remover sanção', getErrorMessage(err));
    }
  };

  const labelTipo = (t: string) => TIPOS_SANCAO.find((x) => x.value === t)?.label || t;

  return (
    <div className="app-form__panel">
      <h2 className="text-base font-semibold mb-3">Sanções</h2>
      <ul className="mb-4 space-y-2">
        {sancoes.length === 0 && (
          <li className="text-sm text-[var(--muted)]">Nenhuma sanção registrada.</li>
        )}
        {sancoes.map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded border border-[var(--border)] px-3 py-2"
          >
            <div className="min-w-0">
              <p className="font-medium">{labelTipo(s.tipo)}</p>
              <p className="text-sm text-[var(--muted)]">
                {[
                  s.processo && `Proc. ${s.processo}`,
                  s.dataInicio?.slice?.(0, 10) || s.dataInicio,
                  s.dataFim ? `até ${String(s.dataFim).slice(0, 10)}` : null,
                  s.abrangencia,
                  s.fonte,
                ]
                  .filter(Boolean)
                  .join(' · ') || '—'}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => confirm.ask(s.id, 'Remover sanção?', labelTipo(s.tipo))}
            >
              Remover
            </Button>
          </li>
        ))}
      </ul>
      <form onSubmit={onAdd} className="app-form__grid">
        <div>
          <span className="field-label">Tipo</span>
          <select className="select-field" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPOS_SANCAO.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Input label="Processo" value={processo} onChange={(e) => setProcesso(e.target.value)} />
        </div>
        <div>
          <Input
            label="Início"
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>
        <div>
          <Input label="Fim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </div>
        <div>
          <Input
            label="Abrangência"
            value={abrangencia}
            onChange={(e) => setAbrangencia(e.target.value)}
          />
        </div>
        <div>
          <Input label="Fonte" value={fonte} onChange={(e) => setFonte(e.target.value)} />
        </div>
        <div className="app-form__actions app-form__span-2">
          <Button type="submit" size="sm" disabled={create.isPending}>
            Registrar sanção
          </Button>
        </div>
      </form>
      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.onOpenChange}
        title={confirm.pending?.title || 'Confirmar'}
        description={confirm.pending?.description}
        confirmLabel="Remover"
        onConfirm={onDelete}
      />
    </div>
  );
}

export default function FornecedoresForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: existing } = useFornecedor(id);
  const create = useCreateFornecedor();
  const update = useUpdateFornecedor();
  const toast = useToast();
  const form = useForm<FormValues>({
    defaultValues: {
      tipoPessoa: 'JURIDICA',
      documento: '',
      razaoSocial: '',
      nomeFantasia: '',
      situacao: 'ATIVO',
      contatoNome: '',
      contatoCargo: '',
      contatoEmail: '',
      contatoTelefone: '',
    },
  });
  const { register, handleSubmit, setValue, watch, formState: { errors }, getValues } = form;
  const tipoPessoa = watch('tipoPessoa');

  useEffect(() => {
    if (existing) {
      setValue('tipoPessoa', existing.tipoPessoa || 'JURIDICA');
      setValue('documento', existing.documento || existing.cnpj || '');
      setValue('razaoSocial', existing.razaoSocial || existing.nome || '');
      setValue('nomeFantasia', existing.nomeFantasia || '');
      setValue('situacao', existing.situacao || 'ATIVO');
    }
  }, [existing, setValue]);

  const onSubmit = async (data: FormValues) => {
    const { contatoNome, contatoCargo, contatoEmail, contatoTelefone, ...rest } = data;
    const payload: Record<string, unknown> = {
      ...rest,
      documento: onlyDigits(data.documento),
      nomeFantasia: data.nomeFantasia || null,
    };
    if (!id && contatoNome.trim()) {
      payload.contatos = [
        {
          nome: contatoNome.trim(),
          cargo: contatoCargo || null,
          email: contatoEmail || null,
          telefone: contatoTelefone || null,
          principal: true,
        },
      ];
    }
    try {
      if (id) {
        await update.mutateAsync({ id, payload });
        toast.success('Fornecedor atualizado.');
        navigate('/fornecedores');
      } else {
        const created = (await create.mutateAsync(payload as never)) as { id: string };
        toast.success('Fornecedor criado.');
        navigate(`/fornecedores/${created.id}/edit`);
      }
    } catch (err) {
      toast.error('Erro ao salvar', getErrorMessage(err));
    }
  };

  return (
    <Page title={id ? 'Editar fornecedor' : 'Novo fornecedor'}>
      <form onSubmit={handleSubmit(onSubmit)} className="app-form space-y-4">
        <div className="app-form__panel">
          <div className="app-form__grid">
            <div>
              <span className="field-label">Tipo de pessoa</span>
              <select className="select-field" {...register('tipoPessoa', { required: true })}>
                <option value="JURIDICA">Pessoa jurídica</option>
                <option value="FISICA">Pessoa física</option>
              </select>
            </div>
            <div>
              <span className="field-label">Situação</span>
              <select className="select-field" {...register('situacao')}>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="IMPEDIDO">Impedido</option>
                <option value="INIDONEO">Inidôneo</option>
              </select>
            </div>
            <div className="app-form__span-2">
              <Input label="Razão social / Nome" {...register('razaoSocial', { required: true })} />
              {errors.razaoSocial && <p className="field-error">Obrigatório</p>}
            </div>
            <div className="app-form__span-2">
              <Input label="Nome fantasia" {...register('nomeFantasia')} />
            </div>
            <div className="app-form__span-2">
              <Input
                label={tipoPessoa === 'FISICA' ? 'CPF' : 'CNPJ'}
                {...register('documento', { required: true })}
                onBlur={() => {
                  const raw = getValues('documento') || '';
                  setValue(
                    'documento',
                    tipoPessoa === 'FISICA' ? maskCpf(raw) : maskCnpj(raw),
                  );
                }}
              />
              {errors.documento && <p className="field-error">Obrigatório</p>}
            </div>
          </div>

          {!id && (
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              <h2 className="text-base font-semibold mb-3">Contato principal (opcional)</h2>
              <div className="app-form__grid">
                <div className="app-form__span-2">
                  <Input label="Nome" {...register('contatoNome')} />
                </div>
                <div>
                  <Input label="Cargo" {...register('contatoCargo')} />
                </div>
                <div>
                  <Input label="Telefone" {...register('contatoTelefone')} />
                </div>
                <div className="app-form__span-2">
                  <Input label="E-mail" type="email" {...register('contatoEmail')} />
                </div>
              </div>
            </div>
          )}

          <div className="app-form__actions">
            <Button type="submit">{id ? 'Salvar identidade' : 'Criar fornecedor'}</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/fornecedores')}>
              {id ? 'Voltar à lista' : 'Cancelar'}
            </Button>
          </div>
        </div>
      </form>

      {id && (
        <div className="app-form space-y-4 mt-4">
          <ContatosSection fornecedorId={id} contatos={existing?.contatos || []} />
          <SancoesSection fornecedorId={id} sancoes={existing?.sancoes || []} />
        </div>
      )}
    </Page>
  );
}
