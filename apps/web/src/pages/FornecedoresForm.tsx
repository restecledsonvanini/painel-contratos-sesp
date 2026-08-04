import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input, Page, useToast } from '@painel/ui';
import { useCreateFornecedor, useFornecedor, useUpdateFornecedor } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';
import { maskCnpj, maskCpf, onlyDigits } from '../lib/masks';

type FormValues = {
  tipoPessoa: 'JURIDICA' | 'FISICA';
  documento: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacao: string;
};

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
    const payload = {
      ...data,
      documento: onlyDigits(data.documento),
      nomeFantasia: data.nomeFantasia || null,
    };
    try {
      if (id) {
        await update.mutateAsync({ id, payload });
        toast.success('Fornecedor atualizado.');
      } else {
        await create.mutateAsync(payload);
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
