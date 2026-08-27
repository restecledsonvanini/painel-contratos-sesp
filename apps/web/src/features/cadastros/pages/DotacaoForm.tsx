import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, FormField, Input, Page, Textarea, useToast } from '@painel/ui';
import type { DotacaoCreateInput, DotacaoDTO, DotacaoUpdateInput } from '@painel/schema';
import { http, getErrorMessage } from '../../../lib/http';
import { LookupSelect } from '../../../components/LookupSelect';
import { invalidateDotacoes } from '../../../lib/invalidate';

/** Campos de formulário (strings vazias); payload API = Create/Update Input. */
type FormValues = {
  exercicio: number;
  codigo: string;
  unidadeOrcamentaria: string;
  funcionalProgramatica: string;
  naturezaDespesaId: string;
  fonteRecursoId: string;
  descricao: string;
};

function toCreateBody(payload: FormValues): DotacaoCreateInput {
  return {
    exercicio: Number(payload.exercicio),
    codigo: payload.codigo.trim(),
    unidadeOrcamentaria: payload.unidadeOrcamentaria.trim() || null,
    funcionalProgramatica: payload.funcionalProgramatica.trim() || null,
    naturezaDespesaId: payload.naturezaDespesaId,
    fonteRecursoId: payload.fonteRecursoId,
    descricao: payload.descricao.trim() || null,
  };
}

export default function DotacaoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const form = useForm<FormValues>({
    defaultValues: {
      exercicio: new Date().getFullYear(),
      codigo: '',
      unidadeOrcamentaria: '',
      funcionalProgramatica: '',
      naturezaDespesaId: '',
      fonteRecursoId: '',
      descricao: '',
    },
  });
  const { register, handleSubmit, setValue, control, formState: { errors } } = form;

  const { data: existing } = useQuery({
    queryKey: id ? ['dotacoes', id] : ['dotacoes', 'empty'],
    queryFn: async () => (await http.get<DotacaoDTO>(`/dotacoes/${id}`)).data,
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!existing) return;
    setValue('exercicio', existing.exercicio);
    setValue('codigo', existing.codigo);
    setValue('unidadeOrcamentaria', existing.unidadeOrcamentaria || '');
    setValue('funcionalProgramatica', existing.funcionalProgramatica || '');
    setValue('naturezaDespesaId', existing.naturezaDespesaId || '');
    setValue('fonteRecursoId', existing.fonteRecursoId || '');
    setValue('descricao', existing.descricao || '');
  }, [existing, setValue]);

  const save = useMutation({
    mutationFn: async (payload: FormValues) => {
      const body = toCreateBody(payload);
      if (id) {
        const updateBody: DotacaoUpdateInput = body;
        return (await http.put<DotacaoDTO>(`/dotacoes/${id}`, updateBody)).data;
      }
      return (await http.post<DotacaoDTO>('/dotacoes', body)).data;
    },
    onSuccess: () => invalidateDotacoes(qc),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await save.mutateAsync(data);
      toast.success(id ? 'Dotação atualizada.' : 'Dotação criada.');
      navigate('/cadastros?tab=dotacoes');
    } catch (err) {
      toast.error('Erro ao salvar', getErrorMessage(err));
    }
  };

  return (
    <Page title={id ? 'Editar dotação' : 'Nova dotação'}>
      <form onSubmit={handleSubmit(onSubmit)} className="app-form">
        <div className="app-form__panel">
          <div className="app-form__grid">
            <FormField label="Exercício" error={errors.exercicio ? 'Obrigatório (≥ 2000)' : undefined}>
              <Input
                type="number"
                {...register('exercicio', { required: true, valueAsNumber: true, min: 2000 })}
              />
            </FormField>
            <FormField label="Código" error={errors.codigo ? 'Obrigatório' : undefined}>
              <Input {...register('codigo', { required: true })} />
            </FormField>
            <FormField label="Unidade orçamentária">
              <Input {...register('unidadeOrcamentaria')} />
            </FormField>
            <FormField label="Funcional programática">
              <Input {...register('funcionalProgramatica')} />
            </FormField>
            <Controller
              name="naturezaDespesaId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormField label="Natureza" error={errors.naturezaDespesaId ? 'Obrigatório' : undefined}>
                  <LookupSelect
                    hideLabel
                    slug="natureza-despesa"
                    valueMode="id"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormField>
              )}
            />
            <Controller
              name="fonteRecursoId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormField label="Fonte" error={errors.fonteRecursoId ? 'Obrigatório' : undefined}>
                  <LookupSelect
                    hideLabel
                    slug="fonte-recurso"
                    valueMode="id"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormField>
              )}
            />
            <FormField label="Descrição" className="app-form__span-2">
              <Textarea rows={3} {...register('descricao')} />
            </FormField>
          </div>
          <div className="app-form__actions">
            <Button type="button" variant="ghost" onClick={() => navigate('/cadastros?tab=dotacoes')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
