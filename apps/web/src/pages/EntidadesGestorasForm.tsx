import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input, Page, useToast } from '@painel/ui';
import { useCreateEntidadeGestora, useEntidadeGestora, useUpdateEntidadeGestora } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';

export default function EntidadesGestorasForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: existing } = useEntidadeGestora(id);
  const create = useCreateEntidadeGestora();
  const update = useUpdateEntidadeGestora();
  const toast = useToast();
  const form = useForm({ defaultValues: { nome: '', cpf: '' } });
  const { register, handleSubmit, setValue, formState: { errors }, getValues } = form;

  const formatCPF = (val: string) => {
    const digits = (val || '').replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})?/, (_m, a, b, c, d) =>
      d ? `${a}.${b}.${c}-${d}` : `${a}.${b}.${c}`,
    );
  };

  useEffect(() => {
    if (existing) {
      setValue('nome', existing.nome);
      setValue('cpf', existing.cpf);
    }
  }, [existing, setValue]);

  const onSubmit = async (data: any) => {
    try {
      if (id) {
        await update.mutateAsync({ id, payload: data });
        toast.success('Entidade atualizada.');
      } else {
        await create.mutateAsync(data);
        toast.success('Entidade criada.');
      }
      navigate('/entidades-gestoras');
    } catch (err) {
      toast.error('Erro ao salvar', getErrorMessage(err));
    }
  };

  return (
    <Page title={id ? 'Editar entidade' : 'Nova entidade gestora'}>
      <form onSubmit={handleSubmit(onSubmit)} className="app-form">
        <div className="app-form__panel">
          <div className="app-form__grid">
            <div className="app-form__span-2">
              <Input label="Nome" {...register('nome', { required: true })} />
              {errors.nome && <p className="field-error">Obrigatório</p>}
            </div>
            <div className="app-form__span-2">
              <Input
                label="CPF"
                {...register('cpf', { required: true })}
                onBlur={() => setValue('cpf', formatCPF(getValues('cpf') || ''))}
              />
              {errors.cpf && <p className="field-error">Obrigatório</p>}
            </div>
          </div>
          <div className="app-form__actions">
            <Button type="submit">Salvar</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/entidades-gestoras')}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
