import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input, Page, Textarea, useToast } from '@painel/ui';
import { useCreateServico, useServico, useUpdateServico } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';

export default function ServicosForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: existing } = useServico(id);
  const create = useCreateServico();
  const update = useUpdateServico();
  const toast = useToast();
  const form = useForm({ defaultValues: { titulo: '', descricao: '' } });
  const { register, handleSubmit, setValue, formState: { errors } } = form;

  useEffect(() => {
    if (existing) {
      setValue('titulo', existing.titulo);
      setValue('descricao', existing.descricao || '');
    }
  }, [existing, setValue]);

  const onSubmit = async (data: any) => {
    try {
      if (id) {
        await update.mutateAsync({ id, payload: data });
        toast.success('Serviço atualizado.');
      } else {
        await create.mutateAsync(data);
        toast.success('Serviço criado.');
      }
      navigate('/servicos');
    } catch (err) {
      toast.error('Erro ao salvar', getErrorMessage(err));
    }
  };

  return (
    <Page title={id ? 'Editar serviço' : 'Novo serviço'}>
      <form onSubmit={handleSubmit(onSubmit)} className="app-form">
        <div className="app-form__panel">
          <div className="app-form__grid">
            <div className="app-form__span-2">
              <Input label="Título" {...register('titulo', { required: true })} />
              {errors.titulo && <p className="field-error">Obrigatório</p>}
            </div>
            <div className="app-form__span-2">
              <Textarea label="Descrição" rows={4} {...register('descricao')} />
            </div>
          </div>
          <div className="app-form__actions">
            <Button type="submit">Salvar</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/servicos')}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
