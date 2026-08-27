import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  IconButton,
  Page,
  Select,
  Skeleton,
  useToast,
} from '@painel/ui';
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCanManage } from '../../../lib/access';
import { useDeleteUnidade, useOrgaos, useUnidadesArvore, useUnidadesList } from '../../../hooks/useOrganizacao';
import { getErrorMessage } from '../../../lib/http';
import { useConfirmDialog } from '../../../lib/useConfirmDialog';
import type { ArvoreOrgaoDTO } from '@painel/schema';

function isUnidade(node: ArvoreOrgaoDTO) {
  return node.kind === 'unidade' || Boolean(node.nivel);
}

function UnitNode({
  node,
  depth,
  canWrite,
  onDelete,
}: {
  node: ArvoreOrgaoDTO;
  depth: number;
  canWrite: boolean;
  onDelete: (id: string, label: string) => void;
}) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const unidade = isUnidade(node);

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <div
        className="flex flex-wrap items-center gap-2 px-3 py-2"
        style={{ paddingLeft: `${0.75 + depth * 1.25}rem` }}
      >
        {hasChildren ? (
          <button
            type="button"
            className="rounded p-0.5 text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
            aria-label={open ? 'Recolher' : 'Expandir'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className="inline-block w-5" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-[var(--text)]">
            {node.sigla}
            {node.nome ? ` — ${node.nome}` : ''}
          </p>
          <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">
            {unidade
              ? node.nivel || 'Subunidade'
              : node.sigla === 'SESP'
                ? 'Mantenedora'
                : 'Força / órgão'}
            {node.municipio ? ` · ${node.municipio.nome}/${node.municipio.uf}` : ''}
          </p>
        </div>
        {unidade && canWrite && (
          <div className="flex flex-wrap items-center justify-end gap-1">
            <Button to={`/unidades/new?parentId=${node.id}`} size="sm" variant="ghost">
              Subunidade
            </Button>
            <IconButton label="Editar" to={`/unidades/${node.id}/edit`}>
              <Pencil size={16} />
            </IconButton>
            <IconButton label="Excluir" variant="danger" onClick={() => onDelete(node.id, node.label)}>
              <Trash2 size={16} />
            </IconButton>
          </div>
        )}
        {!unidade && canWrite && (
          <Button to={`/unidades/new?orgaoId=${node.id}`} size="sm" variant="secondary">
            <Plus size={14} /> Unidade
          </Button>
        )}
      </div>
      {hasChildren && open &&
        node.children.map((child) => (
          <UnitNode
            key={child.id}
            node={child}
            depth={depth + 1}
            canWrite={canWrite}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
}

function findOrgaoBranch(nodes: ArvoreOrgaoDTO[], orgaoId: string): ArvoreOrgaoDTO | null {
  for (const n of nodes) {
    if (n.id === orgaoId && !isUnidade(n)) return n;
    const nested = findOrgaoBranch(n.children, orgaoId);
    if (nested) return nested;
  }
  return null;
}

export default function UnidadesList() {
  const navigate = useNavigate();
  const { data: arvore, isLoading, error, refetch } = useUnidadesArvore();
  const { data: flat } = useUnidadesList();
  const { data: orgaos } = useOrgaos();
  const del = useDeleteUnidade();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const canWrite = useCanManage();
  const [orgaoFiltro, setOrgaoFiltro] = useState('');

  const tree = useMemo(() => {
    const rows = Array.isArray(arvore) ? arvore : [];
    if (!orgaoFiltro) return rows;
    const branch = findOrgaoBranch(rows, orgaoFiltro);
    return branch ? [branch] : [];
  }, [arvore, orgaoFiltro]);

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Unidade excluída.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <Page title="Estrutura organizacional" description="Carregando hierarquia...">
        <Skeleton variant="table" lines={8} />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Estrutura organizacional">
        <ErrorState
          title="Falha ao carregar estrutura"
          message={getErrorMessage(error)}
          code={(error as { code?: string }).code}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Estrutura organizacional"
      description={`${flat?.length ?? 0} subunidades · SESP mantenedora → forças → unidades cadastráveis (opcionais).`}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Select
            className="min-w-[16rem]"
            aria-label="Filtrar órgão"
            placeholder="Toda a hierarquia"
            value={orgaoFiltro || '__all__'}
            onChange={(v) => setOrgaoFiltro(v === '__all__' ? '' : v)}
            options={[
              { id: '__all__', label: 'Toda a hierarquia' },
              ...(orgaos ?? []).map((o) => ({
                id: o.id,
                label: `${o.sigla} — ${o.nome}`,
              })),
            ]}
          />
          {canWrite && (
            <Button to="/unidades/new">
              <Plus size={16} /> Nova unidade
            </Button>
          )}
        </div>
      }
    >
      <Card variant="bordered" className="overflow-hidden">
        {tree.length ? (
          tree.map((org) => (
            <UnitNode
              key={org.id}
              node={org}
              depth={0}
              canWrite={canWrite}
              onDelete={(id, label) =>
                confirm.ask(id, 'Excluir unidade?', `Remover «${label}». Contratos vinculados podem impedir a exclusão.`)
              }
            />
          ))
        ) : (
          <EmptyState
            title="Nenhuma unidade"
            description="Cadastre sedes ou subunidades sob cada força de segurança."
            actionLabel={canWrite ? 'Nova unidade' : undefined}
            onAction={canWrite ? () => navigate('/unidades/new') : undefined}
          />
        )}
      </Card>

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.onOpenChange}
        title={confirm.pending?.title ?? 'Confirmar'}
        description={confirm.pending?.description}
        variant="danger"
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        loading={del.isPending}
      />
    </Page>
  );
}
