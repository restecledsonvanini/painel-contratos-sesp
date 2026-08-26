import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Input, Page, Textarea, useToast } from '@painel/ui';
import type {
  CatalogoItemCreateInput,
  CatalogoItemDTO,
  CatalogoItemUpdateInput,
} from '@painel/schema';
import { http, getErrorMessage } from '../../../lib/http';
import { LookupSelect } from '../../../components/LookupSelect';
import { Controller } from 'react-hook-form';

/** UI com strings vazias; API usa Create/Update Input. */
type FormValues = {
  nome: string;
  descricao: string;
  categoriaItemId: string;
  unidadeMedidaPadraoId: string;
  codigo: string;
};

function toCreateBody(payload: FormValues): CatalogoItemCreateInput {
  return {
    nome: payload.nome,
    categoriaItemId: payload.categoriaItemId,
    unidadeMedidaPadraoId: payload.unidadeMedidaPadraoId,
    codigo: payload.codigo || null,
    descricao: payload.descricao || null,
  };
}

export default function CatalogoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const form = useForm<FormValues>({
    defaultValues: {
      nome: '',
      descricao: '',
      categoriaItemId: '',
      unidadeMedidaPadraoId: '',
      codigo: '',
    },
  });
  const { register, handleSubmit, setValue, control, formState: { errors } } = form;

  const { data: existing } = useQuery({
    queryKey: id ? ['catalogo-itens', id] : ['catalogo-itens', 'empty'],
    queryFn: async () => (await http.get<CatalogoItemDTO>(`/catalogo-itens/${id}`)).data,
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (existing) {
      setValue('nome', existing.nome);
      setValue('descricao', existing.descricao || '');
      setValue('categoriaItemId', existing.categoriaItemId || '');
      setValue('unidadeMedidaPadraoId', existing.unidadeMedidaPadraoId || '');
      setValue('codigo', existing.codigo || '');
    }
  }, [existing, setValue]);

  const save = useMutation({
    mutationFn: async (payload: FormValues) => {
      const body = toCreateBody(payload);
      if (id) {
        const updateBody: CatalogoItemUpdateInput = body;
        return (await http.put<CatalogoItemDTO>(`/catalogo-itens/${id}`, updateBody)).data;
      }
      return (await http.post<CatalogoItemDTO>('/catalogo-itens', body)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalogo-itens'] });
      qc.invalidateQueries({ queryKey: ['lookups'] });
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await save.mutateAsync(data);
      toast.success(id ? 'Item atualizado.' : 'Item criado.');
      navigate('/catalogo-itens');
    } catch (err) {
      toast.error('Erro ao salvar', getErrorMessage(err));
    }
  };

  return (
    <Page title={id ? 'Editar item do catálogo' : 'Novo item do catálogo'}>
      <form onSubmit={handleSubmit(onSubmit)} className="app-form">
        <div className="app-form__panel">
          <div className="app-form__grid">
            <div className="app-form__span-2">
              <Input label="Nome" {...register('nome', { required: true })} />
              {errors.nome && <p className="field-error">Obrigatório</p>}
            </div>
            <div>
              <Input label="Código (CATMAT/CATSER)" {...register('codigo')} />
            </div>
            <div>
              <Controller
                name="categoriaItemId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <LookupSelect
                    slug="categoria-item"
                    label="Categoria"
                    valueMode="id"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.categoriaItemId ? 'Obrigatório' : undefined}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="unidadeMedidaPadraoId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <LookupSelect
                    slug="unidade-medida"
                    label="Unidade de medida"
                    valueMode="id"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.unidadeMedidaPadraoId ? 'Obrigatório' : undefined}
                  />
                )}
              />
            </div>
            <div className="app-form__span-2">
              <Textarea label="Descrição" rows={3} {...register('descricao')} />
            </div>
          </div>
          <div className="app-form__actions">
            <Button type="submit">Salvar</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/catalogo-itens')}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
