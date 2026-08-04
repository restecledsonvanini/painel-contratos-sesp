import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input, Page } from '@painel/ui';
import { useCreateUnidadeFsp, useUnidadeFspById, useUpdateUnidadeFsp } from '../hooks/useReferences';

export default function UnidadesFspForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: existing } = useUnidadeFspById(id);
  const create = useCreateUnidadeFsp();
  const update = useUpdateUnidadeFsp();
  const form = useForm({ defaultValues: { sigla: '', nome: '' } });
  const { register, handleSubmit, setValue, formState: { errors } } = form;

  useEffect(() => {
    if (existing) {
      setValue('sigla', existing.sigla);
      setValue('nome', existing.nome);
    }
  }, [existing, setValue]);

  const onSubmit = async (data: any) => {
    try {
      if (id) await update.mutateAsync({ id, payload: data });
      else await create.mutateAsync(data);
      navigate('/unidades-fsp');
    } catch {
      alert('Erro ao salvar');
    }
  };

  return (
    <Page title={id ? 'Editar unidade FSP' : 'Nova unidade FSP'}>
      <form onSubmit={handleSubmit(onSubmit)} className="app-form">
        <div className="app-form__panel">
          <div className="app-form__grid">
            <Input label="Sigla" {...register('sigla', { required: true })} />
            {errors.sigla && <p className="field-error">Obrigatório</p>}
            <Input label="Nome" {...register('nome', { required: true })} />
            {errors.nome && <p className="field-error">Obrigatório</p>}
          </div>
          <div className="app-form__actions">
            <Button type="submit">Salvar</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/unidades-fsp')}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
