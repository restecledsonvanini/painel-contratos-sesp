import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Button, ConfirmDialog, FormField, Input, Page, Select, useToast } from '@painel/ui';
import { TIPO_SANCAO_LABELS, enumOptions, type TipoSancao } from '@painel/domain';
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
} from '../../../hooks/useReferences';
import { getErrorMessage } from '../../../lib/http';
import { maskCnpj, maskCpf, onlyDigits } from '../../../lib/masks';
import { useConfirmDialog } from '../../../lib/useConfirmDialog';

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

const TIPOS_SANCAO = enumOptions(TIPO_SANCAO_LABELS);

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
        <FormField label="Nome" className="app-form__span-2">
          <Input value={nome} onChange={(e) => setNome(e.target.value)} />
        </FormField>
        <FormField label="Cargo">
          <Input value={cargo} onChange={(e) => setCargo(e.target.value)} />
        </FormField>
        <FormField label="Telefone">
          <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </FormField>
        <FormField label="E-mail" className="app-form__span-2">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormField>
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
  const [tipo, setTipo] = useState<TipoSancao>('ADVERTENCIA');
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
        <FormField label="Tipo">
          <Select
            options={TIPOS_SANCAO.map((t) => ({ id: t.value, label: t.label }))}
            value={tipo}
            onChange={(v) => setTipo(v as TipoSancao)}
          />
        </FormField>
        <FormField label="Processo">
          <Input value={processo} onChange={(e) => setProcesso(e.target.value)} />
        </FormField>
        <FormField label="Início">
          <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </FormField>
        <FormField label="Fim">
          <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </FormField>
        <FormField label="Abrangência">
          <Input value={abrangencia} onChange={(e) => setAbrangencia(e.target.value)} />
        </FormField>
        <FormField label="Fonte">
          <Input value={fonte} onChange={(e) => setFonte(e.target.value)} />
        </FormField>
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
      setValue('documento', existing.documento || '');
      setValue('razaoSocial', existing.razaoSocial || '');
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
            <Controller
              name="tipoPessoa"
              control={form.control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormField label="Tipo">
                  <Select
                    options={[
                      { id: 'JURIDICA', label: 'Pessoa jurídica' },
                      { id: 'FISICA', label: 'Pessoa física' },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormField>
              )}
            />
            <Controller
              name="situacao"
              control={form.control}
              render={({ field }) => (
                <FormField label="Situação">
                  <Select
                    options={[
                      { id: 'ATIVO', label: 'Ativo' },
                      { id: 'INATIVO', label: 'Inativo' },
                      { id: 'IMPEDIDO', label: 'Impedido' },
                      { id: 'INIDONEO', label: 'Inidôneo' },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormField>
              )}
            />
            <FormField
              label="Razão social"
              error={errors.razaoSocial ? 'Obrigatório' : undefined}
              className="app-form__span-2"
            >
              <Input {...register('razaoSocial', { required: true })} />
            </FormField>
            <FormField label="Nome fantasia">
              <Input {...register('nomeFantasia')} />
            </FormField>
            <FormField
              label={tipoPessoa === 'FISICA' ? 'CPF' : 'CNPJ'}
              error={errors.documento ? 'Obrigatório' : undefined}
            >
              <Input
                {...register('documento', { required: true })}
                onBlur={() => {
                  const raw = getValues('documento') || '';
                  setValue('documento', tipoPessoa === 'FISICA' ? maskCpf(raw) : maskCnpj(raw));
                }}
              />
            </FormField>
          </div>

          {!id && (
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              <h2 className="text-base font-semibold mb-3">Contato principal (opcional)</h2>
              <div className="app-form__grid">
                <FormField label="Nome" className="app-form__span-2">
                  <Input {...register('contatoNome')} />
                </FormField>
                <FormField label="Cargo">
                  <Input {...register('contatoCargo')} />
                </FormField>
                <FormField label="Telefone">
                  <Input {...register('contatoTelefone')} />
                </FormField>
                <FormField label="E-mail" className="app-form__span-2">
                  <Input type="email" {...register('contatoEmail')} />
                </FormField>
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
