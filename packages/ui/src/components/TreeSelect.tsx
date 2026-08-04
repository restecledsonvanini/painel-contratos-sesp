import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import { inputBaseClass } from '../lib/inputStyles';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface TreeSelectProps {
  nodes: TreeNode[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
}

function flattenNodes(nodes: TreeNode[], depth = 0): Array<TreeNode & { depth: number }> {
  const result: Array<TreeNode & { depth: number }> = [];
  for (const node of nodes) {
    result.push({ ...node, depth });
    if (node.children?.length) {
      result.push(...flattenNodes(node.children, depth + 1));
    }
  }
  return result;
}

function findLabel(nodes: TreeNode[], id?: string): string | undefined {
  if (!id) return undefined;
  for (const node of nodes) {
    if (node.id === id) return node.label;
    const child = node.children && findLabel(node.children, id);
    if (child) return child;
  }
  return undefined;
}

function TreeNodeRow({
  node,
  depth,
  expanded,
  onToggle,
  selectedId,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = expanded.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-1 rounded-[var(--radius-sm)] py-1 pr-2',
          isSelected && 'bg-[var(--primary-light)] text-[var(--primary-dark)]',
        )}
        style={{ paddingLeft: `calc(${depth} * var(--space-md) + var(--space-xs))` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            className="rounded-[var(--radius-sm)] p-0.5 text-[var(--text-muted)] hover:text-[var(--text)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
            aria-label={isExpanded ? 'Recolher' : 'Expandir'}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className={cn(
            'flex-1 truncate text-left text-[var(--font-size-sm)]',
            'rounded-[var(--radius-sm)] px-1 py-0.5 hover:bg-[var(--surface-muted)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none',
          )}
        >
          {node.label}
        </button>
      </div>
      {hasChildren &&
        isExpanded &&
        node.children!.map((child) => (
          <TreeNodeRow
            key={child.id}
            node={child}
            depth={depth + 1}
            expanded={expanded}
            onToggle={onToggle}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
    </>
  );
}

export function TreeSelect({
  nodes,
  value,
  onChange,
  placeholder = 'Selecione…',
  disabled,
  label,
  hint,
  error,
  className,
}: TreeSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const selectedLabel = findLabel(nodes, value);
  const flat = useMemo(() => flattenNodes(nodes), [nodes]);
  const filteredFlat = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return flat.filter((n) => n.label.toLowerCase().includes(q));
  }, [flat, query]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const select = (id: string) => {
    onChange?.(id);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className={cn('relative block text-[var(--font-size-sm)]', className)}>
      {label && <span className="mb-1.5 block font-semibold text-[var(--label-color)]">{label}</span>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          inputBaseClass,
          'inline-flex w-full items-center justify-between gap-2 text-left',
          !selectedLabel && 'text-[var(--text-muted)]',
        )}
        aria-expanded={open}
        aria-haspopup="tree"
      >
        <span className="truncate">{selectedLabel ?? placeholder}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
      </button>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-full rounded-[var(--radius-md)] border border-[var(--border)]',
            'bg-[var(--surface)] p-[var(--space-sm)] shadow-[var(--shadow)]',
          )}
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar…"
            className={cn(inputBaseClass, 'mb-2')}
          />
          <div className="max-h-60 overflow-y-auto" role="tree">
            {filteredFlat
              ? filteredFlat.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => select(node.id)}
                    className={cn(
                      'block w-full truncate rounded-[var(--radius-sm)] px-[var(--space-sm)] py-1.5 text-left',
                      'text-[var(--font-size-sm)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-dark)]',
                      value === node.id && 'bg-[var(--primary-light)] text-[var(--primary-dark)]',
                    )}
                    style={{ paddingLeft: `calc(${node.depth} * var(--space-md) + var(--space-sm))` }}
                  >
                    {node.label}
                  </button>
                ))
              : nodes.map((node) => (
                  <TreeNodeRow
                    key={node.id}
                    node={node}
                    depth={0}
                    expanded={expanded}
                    onToggle={toggle}
                    selectedId={value}
                    onSelect={select}
                  />
                ))}
          </div>
        </div>
      )}
      {hint && !error && (
        <span className="mt-1 block text-[var(--font-size-xs)] text-[var(--text-muted)]">{hint}</span>
      )}
      {error && (
        <span className="mt-1 block text-[var(--font-size-xs)] text-[var(--danger)]" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
