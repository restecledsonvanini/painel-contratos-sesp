import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input, Page, useToast } from '@painel/ui';
import { useCreateEmpresa, useEmpresa, useUpdateEmpresa } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';

export default function EmpresasForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: existing } = useEmpresa(id);
  const create = useCreateEmpresa();
  const update = useUpdateEmpresa();
  const toast = useToast();
  const form = useForm({ defaultValues: { razaoSocial: '', cnpj: '' } });
  const { register, handleSubmit, setValue, formState: { errors }, getValues } = form;

  const formatCNPJ = (val: string) => {
    const digits = (val || '').replace(/\D/g, '').slice(0, 14);
    if (!digits) return '';
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})?/, (_m, p1, p2, p3, p4, p5) =>
      p5 ? `${p1}.${p2}.${p3}/${p4}-${p5}` : `${p1}.${p2}.${p3}/${p4}`,
    );
  };

  useEffect(() => {
    if (existing) {
      setValue('razaoSocial', existing.razaoSocial);
      setValue('cnpj', existing.cnpj);
    }
  }, [existing, setValue]);

  const onSubmit = async (data: any) => {
    try {
      if (id) {
        await update.mutateAsync({ id, payload: data });
        toast.success('Empresa atualizada.');
      } else {
        await create.mutateAsync(data);
        toast.success('Empresa criada.');
      }
      navigate('/empresas');
    } catch (err) {
      toast.error('Erro ao salvar', getErrorMessage(err));
    }
  };

  return (
    <Page title={id ? 'Editar empresa' : 'Nova empresa'} description="Dados cadastrais da contratada.">
      <form onSubmit={handleSubmit(onSubmit)} className="app-form">
        <div className="app-form__panel">
          <div className="app-form__grid">
            <div className="app-form__span-2">
              <Input label="Razão social" {...register('razaoSocial', { required: true })} />
              {errors.razaoSocial && <p className="field-error">Obrigatório</p>}
            </div>
            <div className="app-form__span-2">
              <Input
                label="CNPJ"
                {...register('cnpj', { required: true })}
                onBlur={() => setValue('cnpj', formatCNPJ(getValues('cnpj') || ''))}
              />
              {errors.cnpj && <p className="field-error">Obrigatório</p>}
            </div>
          </div>
          <div className="app-form__actions">
            <Button type="submit">Salvar</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/empresas')}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
