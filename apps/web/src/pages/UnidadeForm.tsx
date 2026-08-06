import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input, Page, useToast } from '@painel/ui';
import {
  NIVEL_UNIDADE_LABELS,
  enumOptions,
} from '@painel/domain';
import {
  useCreateUnidade,
  useMunicipioSearch,
  useOrgaos,
  useUnidade,
  useUnidadesList,
  useUpdateUnidade,
} from '../hooks/useOrganizacao';
import { getErrorMessage } from '../lib/http';

const NIVEIS = enumOptions(NIVEL_UNIDADE_LABELS);

type FormValues = {
  orgaoId: string;
  parentId: string;
  sigla: string;
  nome: string;
  nivel: string;
  municipioId: string;
  ativo: boolean;
};

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
  const parentId = watch('parentId');
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
    const payload = {
      orgaoId: data.orgaoId,
      parentId: data.parentId || null,
      sigla: data.sigla.trim(),
      nome: data.nome.trim(),
      nivel: data.nivel || null,
      municipioId: data.municipioId || null,
      ativo: data.ativo,
    };
    try {
      if (id) {
        await update.mutateAsync({ id, payload });
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
        <div className="app-form__panel">Carregando…</div>
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
          <div className="app-form__grid is-dense">
            <div className="app-form__span-3">
              <span className="field-label" id="label-orgao">
                Órgão / força
              </span>
              <select
                className="select-field"
                aria-labelledby="label-orgao"
                {...register('orgaoId', { required: true })}
              >
                <option value="">Selecione…</option>
                {(orgaos ?? []).map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.sigla} — {o.nome}
                  </option>
                ))}
              </select>
              {errors.orgaoId && <p className="field-error">Obrigatório</p>}
            </div>

            <div className="app-form__span-3">
              <span className="field-label" id="label-parent">
                Unidade superior (opcional)
              </span>
              <select
                className="select-field"
                aria-labelledby="label-parent"
                {...register('parentId')}
                disabled={!orgaoId}
              >
                <option value="">— Sede / sem superior —</option>
                {parentsDoOrgao.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.sigla} — {u.nome}
                    {u.id === parentId ? '' : ''}
                  </option>
                ))}
              </select>
            </div>

            <Input label="Sigla" {...register('sigla', { required: true })} />
            {errors.sigla && <p className="field-error">Obrigatório</p>}
            <div className="app-form__span-2">
              <Input label="Nome" {...register('nome', { required: true })} />
              {errors.nome && <p className="field-error">Obrigatório</p>}
            </div>

            <div>
              <span className="field-label" id="label-nivel">
                Nível (opcional)
              </span>
              <select className="select-field" aria-labelledby="label-nivel" {...register('nivel')}>
                <option value="">Não informado</option>
                {NIVEIS.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="app-form__span-2">
              <Input
                label="Município (busca, opcional)"
                value={municipioQ}
                onChange={(e) => setMunicipioQ(e.target.value)}
                placeholder="Digite ao menos 2 letras…"
              />
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

            <label className="flex items-center gap-2 text-[var(--font-size-sm)]">
              <input type="checkbox" {...register('ativo')} />
              Unidade ativa
            </label>
          </div>

          <div className="app-form__actions">
            <Button type="submit" disabled={create.isPending || update.isPending}>
              {create.isPending || update.isPending ? 'Salvando…' : 'Salvar'}
            </Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/unidades')}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
