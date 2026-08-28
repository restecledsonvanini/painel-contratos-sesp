import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Button, FormActions, FormField, Input, Page, Select, Skeleton, useToast } from '@painel/ui';
import {
  NIVEL_UNIDADE_LABELS,
  enumOptions,
} from '@painel/domain';
import type {
  UnidadeOrganizacionalCreateInput,
  UnidadeOrganizacionalUpdateInput,
} from '@painel/schema';
import {
  useCreateUnidade,
  useMunicipioSearch,
  useOrgaos,
  useUnidade,
  useUnidadesList,
  useUpdateUnidade,
} from '../../../hooks/useOrganizacao';
import { getErrorMessage } from '../../../lib/http';

const NIVEIS = enumOptions(NIVEL_UNIDADE_LABELS);

/** UI com selects vazios; payload = Create/Update Input. */
type FormValues = {
  orgaoId: string;
  parentId: string;
  sigla: string;
  nome: string;
  nivel: string;
  municipioId: string;
  ativo: boolean;
};

function toCreateBody(data: FormValues): UnidadeOrganizacionalCreateInput {
  return {
    orgaoId: data.orgaoId,
    parentId: data.parentId || null,
    sigla: data.sigla.trim(),
    nome: data.nome.trim(),
    nivel: (data.nivel || null) as UnidadeOrganizacionalCreateInput['nivel'],
    municipioId: data.municipioId || null,
    ativo: data.ativo,
  };
}

export default function UnidadeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const presetOrgaoId = searchParams.get('orgaoId') || '';
  const presetParentId = searchParams.get('parentId') || '';

  const { data: existing, isLoading } = useUnidade(id);
  const { data: orgaos } = useOrgaos();
  const { data: unidades } = useUnidadesList();
  const create = useCreateUnidade();
  const update = useUpdateUnidade();
  const toast = useToast();

  const [municipioQ, setMunicipioQ] = useState('');
  const { data: municipios } = useMunicipioSearch(municipioQ);
  const [municipioLabel, setMunicipioLabel] = useState('');

  const form = useForm<FormValues>({
    defaultValues: {
      orgaoId: presetOrgaoId,
      parentId: presetParentId,
      sigla: '',
      nome: '',
      nivel: presetParentId ? 'BATALHAO' : 'COMANDO_GERAL',
      municipioId: '',
      ativo: true,
    },
  });
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const orgaoId = watch('orgaoId');
  const municipioId = watch('municipioId');

  useEffect(() => {
    if (!existing) return;
    setValue('orgaoId', existing.orgaoId);
    setValue('parentId', existing.parentId || '');
    setValue('sigla', existing.sigla);
    setValue('nome', existing.nome);
    setValue('nivel', existing.nivel || '');
    setValue('municipioId', existing.municipioId || '');
    setValue('ativo', existing.ativo);
    if (existing.municipio) {
      setMunicipioLabel(`${existing.municipio.nome}/${existing.municipio.uf}`);
      setMunicipioQ(existing.municipio.nome);
    }
  }, [existing, setValue]);

  useEffect(() => {
    if (id || !presetParentId || !unidades?.length) return;
    const parent = unidades.find((u) => u.id === presetParentId);
    if (!parent) return;
    setValue('orgaoId', parent.orgaoId);
    setValue('parentId', parent.id);
    if (parent.municipioId) {
      setValue('municipioId', parent.municipioId);
      if (parent.municipio) {
        setMunicipioLabel(`${parent.municipio.nome}/${parent.municipio.uf}`);
        setMunicipioQ(parent.municipio.nome);
      }
    }
  }, [id, presetParentId, unidades, setValue]);

  const parentsDoOrgao = useMemo(
    () => (unidades ?? []).filter((u) => u.orgaoId === orgaoId && u.id !== id),
    [unidades, orgaoId, id],
  );

  const onSubmit = async (data: FormValues) => {
    const payload = toCreateBody(data);
    try {
      if (id) {
        const updatePayload: UnidadeOrganizacionalUpdateInput = payload;
        await update.mutateAsync({ id, payload: updatePayload });
        toast.success('Unidade atualizada.');
      } else {
        await create.mutateAsync(payload);
        toast.success('Unidade cadastrada.');
      }
      navigate('/unidades');
    } catch (err) {
      toast.error('Erro ao salvar', getErrorMessage(err));
    }
  };

  if (id && isLoading) {
    return (
      <Page title="Editar unidade">
        <Skeleton variant="card" lines={4} />
      </Page>
    );
  }

  return (
    <Page
      title={id ? 'Editar unidade' : 'Nova unidade / subunidade'}
      description="Cada força tem sede; subunidades (batalhões, companhias, delegacias…) são cadastradas aqui pelo usuário."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="app-form">
        <div className="app-form__panel">
          <div className="app-form__grid">
            <Controller
              name="orgaoId"
              control={form.control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormField label="Órgão" hint="Força" className="app-form__col-6" error={errors.orgaoId ? 'Obrigatório' : undefined}>
                  <Select
                    options={(orgaos ?? []).map((o) => ({
                      id: o.id,
                      label: `${o.sigla} — ${o.nome}`,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Selecione"
                  />
                </FormField>
              )}
            />
            <Controller
              name="parentId"
              control={form.control}
              render={({ field }) => (
                <FormField label="Superior" hint="Sede se vazio" className="app-form__col-6">
                  <Select
                    options={[
                      { id: '__none__', label: 'Nenhuma (sede)' },
                      ...parentsDoOrgao.map((u) => ({
                        id: u.id,
                        label: `${u.sigla} — ${u.nome}`,
                      })),
                    ]}
                    value={field.value || '__none__'}
                    onChange={(v) => field.onChange(v === '__none__' ? '' : v)}
                    disabled={!orgaoId}
                    placeholder="Nenhuma"
                  />
                </FormField>
              )}
            />
            <FormField label="Sigla" className="app-form__col-3" error={errors.sigla ? 'Obrigatório' : undefined}>
              <Input {...register('sigla', { required: true })} />
            </FormField>
            <FormField label="Nome" className="app-form__col-9" error={errors.nome ? 'Obrigatório' : undefined}>
              <Input {...register('nome', { required: true })} />
            </FormField>
            <Controller
              name="nivel"
              control={form.control}
              render={({ field }) => (
                <FormField label="Nível" className="app-form__col-4">
                  <Select
                    options={[
                      { id: '__none__', label: 'Não informado' },
                      ...NIVEIS.map((n) => ({ id: n.value, label: n.label })),
                    ]}
                    value={field.value || '__none__'}
                    onChange={(v) => field.onChange(v === '__none__' ? '' : v)}
                    placeholder="Não informado"
                  />
                </FormField>
              )}
            />
            <FormField label="Município" hint="Busca, opcional" className="app-form__col-8">
              <Input
                value={municipioQ}
                onChange={(e) => setMunicipioQ(e.target.value)}
                placeholder="Digite ao menos 2 letras…"
              />
            </FormField>
            <div className="app-form__col-12">
              <input type="hidden" {...register('municipioId')} />
              {municipioLabel && municipioId && (
                <p className="mt-1 text-[var(--font-size-sm)] text-[var(--text-muted)]">
                  Selecionado: {municipioLabel}{' '}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => {
                      setValue('municipioId', '');
                      setMunicipioLabel('');
                    }}
                  >
                    limpar
                  </button>
                </p>
              )}
              {municipioQ.trim().length >= 2 && (municipios?.length ?? 0) > 0 && (
                <ul className="mt-2 max-h-40 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border)]">
                  {municipios!.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-[var(--font-size-sm)] hover:bg-[var(--surface-muted)]"
                        onClick={() => {
                          setValue('municipioId', m.id, { shouldValidate: true });
                          setMunicipioLabel(`${m.nome}/${m.uf}`);
                          setMunicipioQ(m.nome);
                        }}
                      >
                        {m.nome}/{m.uf} · IBGE {m.codigoIbge}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <FormField label="Situação" className="app-form__col-4">
              <label className="flex min-h-[2.5rem] items-center gap-2 text-[var(--font-size-sm)]">
                <input type="checkbox" className="shrink-0" {...register('ativo')} />
                Ativa
              </label>
            </FormField>
          </div>

          <FormActions>
            <Button variant="ghost" type="button" onClick={() => navigate('/unidades')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={create.isPending || update.isPending}>
              {create.isPending || update.isPending ? 'Salvando…' : 'Salvar'}
            </Button>
          </FormActions>
        </div>
      </form>
    </Page>
  );
}
