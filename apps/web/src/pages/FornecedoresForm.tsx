import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input, Page, useToast } from '@painel/ui';
import { useCreateFornecedor, useFornecedor, useUpdateFornecedor } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';

export default function FornecedoresForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: existing } = useFornecedor(id);
  const create = useCreateFornecedor();
  const update = useUpdateFornecedor();
  const toast = useToast();
  const form = useForm({ defaultValues: { nome: '', cnpj: '' } });
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
      setValue('nome', existing.nome);
      setValue('cnpj', existing.cnpj || '');
    }
  }, [existing, setValue]);

  const onSubmit = async (data: any) => {
    try {
      if (id) {
        await update.mutateAsync({ id, payload: data });
        toast.success('Fornecedor atualizado.');
      } else {
        await create.mutateAsync(data);
        toast.success('Fornecedor criado.');
      }
      navigate('/fornecedores');
    } catch (err) {
      toast.error('Erro ao salvar', getErrorMessage(err));
    }
  };

  return (
    <Page title={id ? 'Editar fornecedor' : 'Novo fornecedor'}>
      <form onSubmit={handleSubmit(onSubmit)} className="app-form">
        <div className="app-form__panel">
          <div className="app-form__grid">
            <div className="app-form__span-2">
              <Input label="Nome" {...register('nome', { required: true })} />
              {errors.nome && <p className="field-error">Obrigatório</p>}
            </div>
            <div className="app-form__span-2">
              <Input
                label="CNPJ"
                {...register('cnpj')}
                onBlur={() => setValue('cnpj', formatCNPJ(getValues('cnpj') || ''))}
              />
            </div>
          </div>
          <div className="app-form__actions">
            <Button type="submit">Salvar</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/fornecedores')}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
