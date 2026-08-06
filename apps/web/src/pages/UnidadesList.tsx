import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Page,
  Skeleton,
  useToast,
} from '@painel/ui';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { useDeleteUnidade, useOrgaos, useUnidadesArvore, useUnidadesList } from '../hooks/useOrganizacao';
import { getErrorMessage } from '../lib/http';
import { useConfirmDialog } from '../lib/useConfirmDialog';
import { useAuth } from '../providers/AuthProvider';

type TreeNode = {
  id: string;
  label: string;
  sigla: string;
  nome?: string;
  nivel?: string;
  municipio?: { nome: string; uf: string };
  children: TreeNode[];
};

function UnitNode({
  node,
  depth,
  canWrite,
  onDelete,
}: {
  node: TreeNode;
  depth: number;
  canWrite: boolean;
  onDelete: (id: string, label: string) => void;
}) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = node.children.length > 0;

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
            {node.nivel || 'Órgão'}
            {node.municipio ? ` · ${node.municipio.nome}/${node.municipio.uf}` : ''}
          </p>
        </div>
        {node.nivel && canWrite && (
          <div className="flex flex-wrap gap-2">
            <Link to={`/unidades/new?parentId=${node.id}`}>
              <Button size="sm" variant="ghost">
                Subunidade
              </Button>
            </Link>
            <Link to={`/unidades/${node.id}/edit`}>
              <Button size="sm" variant="secondary">
                Editar
              </Button>
            </Link>
            <Button size="sm" variant="danger" onClick={() => onDelete(node.id, node.label)}>
              Excluir
            </Button>
          </div>
        )}
        {!node.nivel && canWrite && (
          <Link to={`/unidades/new?orgaoId=${node.id}`}>
            <Button size="sm" variant="secondary">
              <Plus size={14} /> Unidade
            </Button>
          </Link>
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

export default function UnidadesList() {
  const navigate = useNavigate();
  const { data: arvore, isLoading, error, refetch } = useUnidadesArvore();
  const { data: flat } = useUnidadesList();
  const { data: orgaos } = useOrgaos();
  const del = useDeleteUnidade();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const { hasMinRole, token } = useAuth();
  const canWrite = !token || hasMinRole('COLABORADOR');
  const [orgaoFiltro, setOrgaoFiltro] = useState('');

  const tree = useMemo(() => {
    const rows = Array.isArray(arvore) ? arvore : [];
    return orgaoFiltro ? rows.filter((o) => o.id === orgaoFiltro) : rows;
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
      <Page title="Órgãos e unidades" description="Carregando hierarquia...">
        <Skeleton variant="table" lines={8} />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Órgãos e unidades">
        <ErrorState
          title="Falha ao carregar unidades"
          message={getErrorMessage(error)}
          code={(error as { code?: string }).code}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Órgãos e unidades"
      description={`${flat?.length ?? 0} unidades · cadastre subunidades sob a sede de cada força (não pré-cadastramos todas).`}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="select-field"
            aria-label="Filtrar órgão"
            value={orgaoFiltro}
            onChange={(e) => setOrgaoFiltro(e.target.value)}
          >
            <option value="">Todos os órgãos</option>
            {(orgaos ?? []).map((o) => (
              <option key={o.id} value={o.id}>
                {o.sigla} — {o.nome}
              </option>
            ))}
          </select>
          {canWrite && (
            <Link to="/unidades/new">
              <Button>
                <Plus size={16} /> Nova unidade
              </Button>
            </Link>
          )}
        </div>
      }
    >
      <Card variant="bordered" className="overflow-hidden">
        {tree.length ? (
          tree.map((org) => (
            <UnitNode
              key={org.id}
              node={org as TreeNode}
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
            description="Cadastre a sede ou subunidades a partir dos órgãos de segurança."
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
