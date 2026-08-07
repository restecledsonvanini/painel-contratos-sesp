import React, { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Badge,
  Breadcrumbs,
  Button,
  ChartCard,
  Combobox,
  ConfirmDialog,
  CurrencyInput,
  DataTable,
  DatePicker,
  DescriptionList,
  EmptyState,
  ErrorState,
  FieldArrayList,
  FormActions,
  FormField,
  FormSection,
  Input,
  KpiCard,
  MaskedInput,
  Meter,
  Modal,
  MultiSelect,
  NumberInput,
  Page,
  Pagination,
  Popover,
  Progress,
  Select,
  Skeleton,
  Stepper,
  Tabs,
  Timeline,
  Toaster,
  Tooltip,
  TooltipProvider,
  TreeSelect,
  useToast,
} from '@painel/ui';
import { FileText, TrendingUp } from 'lucide-react';
import { formatCents } from '../lib/format';

type DemoRow = { id: string; nome: string; valor: number };

export default function DevUi() {
  const toast = useToast();
  const [selectValue, setSelectValue] = useState('a');
  const [comboValue, setComboValue] = useState<string | undefined>();
  const [multiValue, setMultiValue] = useState<string[]>(['1']);
  const [treeValue, setTreeValue] = useState<string | undefined>();
  const [currency, setCurrency] = useState(123456);
  const [number, setNumber] = useState<number | null>(12.5);
  const [masked, setMasked] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [fieldRows, setFieldRows] = useState([{ nome: 'Item 1' }]);

  const columns = useMemo<ColumnDef<DemoRow>[]>(
    () => [
      { accessorKey: 'nome', header: 'Nome' },
      {
        accessorKey: 'valor',
        header: 'Valor',
        cell: ({ getValue }) => formatCents(getValue<number>()),
      },
    ],
    [],
  );

  const tableData: DemoRow[] = [
    { id: '1', nome: 'Contrato A', valor: 15000000 },
    { id: '2', nome: 'Contrato B', valor: 8200000 },
  ];

  return (
    <TooltipProvider>
      <Toaster />
      <Page title="Galeria UI — Fase 1" description="Componentes do design system @painel/ui">
        <div className="space-y-8 pb-12">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">Navegação</h2>
            <Breadcrumbs
              items={[
                { label: 'Início', href: '/' },
                { label: 'Dev', href: '/dev/ui' },
                { label: 'Galeria UI' },
              ]}
            />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">Badges e feedback</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Padrão</Badge>
              <Badge variant="success">Vigente</Badge>
              <Badge variant="warning">Pendente</Badge>
              <Badge variant="danger">Vencido</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => toast.success('Salvo com sucesso')}>Toast sucesso</Button>
              <Button variant="secondary" onClick={() => toast.error('Erro', 'Detalhe opcional')}>
                Toast erro
              </Button>
              <Button variant="ghost" onClick={() => setConfirmOpen(true)}>
                ConfirmDialog
              </Button>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">Formulário</h2>
            <FormSection title="Campos" description="Select, combobox, inputs mascarados e monetários.">
              <FormField label="Select" className="app-form__span-2">
                <Select
                  options={[
                    { id: 'a', label: 'Opção A' },
                    { id: 'b', label: 'Opção B' },
                  ]}
                  value={selectValue}
                  onChange={setSelectValue}
                />
              </FormField>
              <FormField label="Combobox">
                <Combobox
                  options={[
                    { id: '1', label: 'Fornecedor Alpha' },
                    { id: '2', label: 'Fornecedor Beta' },
                  ]}
                  value={comboValue}
                  onChange={setComboValue}
                  onCreate={(q) => toast.info(`Criar: ${q}`)}
                />
              </FormField>
              <FormField label="MultiSelect">
                <MultiSelect
                  options={[
                    { id: '1', label: 'Atributo 1' },
                    { id: '2', label: 'Atributo 2' },
                    { id: '3', label: 'Atributo 3' },
                  ]}
                  value={multiValue}
                  onChange={setMultiValue}
                />
              </FormField>
              <FormField label="TreeSelect">
                <TreeSelect
                  nodes={[
                    {
                      id: 'org1',
                      label: 'SESP',
                      children: [
                        { id: 'u1', label: 'Diretoria A' },
                        { id: 'u2', label: 'Diretoria B' },
                      ],
                    },
                  ]}
                  value={treeValue}
                  onChange={setTreeValue}
                />
              </FormField>
              <CurrencyInput label="Valor" value={currency} onChange={setCurrency} />
              <NumberInput label="Quantidade" value={number} onChange={setNumber} />
              <MaskedInput mask="cnpj" label="CNPJ" value={masked} onChange={setMasked} />
              <DatePicker label="Data" value={date} onChange={setDate} />
            </FormSection>
            <FormActions className="mt-4">
              <Button variant="secondary">Cancelar</Button>
              <Button>Salvar</Button>
            </FormActions>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">Stepper e Tabs</h2>
            <Stepper
              steps={[
                { id: '1', label: 'Identificação', status: 'completed' },
                { id: '2', label: 'Partes', status: 'current' },
                { id: '3', label: 'Objeto', status: 'pending' },
                { id: '4', label: 'Revisão', status: 'pending' },
              ]}
              onStepClick={(id) => toast.info(`Etapa ${id}`)}
            />
            <div className="mt-6">
              <Tabs
                items={[
                  { id: 'resumo', label: 'Resumo', content: <p className="text-sm text-[var(--text-muted)]">Conteúdo do resumo.</p> },
                  { id: 'itens', label: 'Itens', content: <p className="text-sm text-[var(--text-muted)]">Lista de itens.</p> },
                ]}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">Timeline</h2>
            <Timeline
              events={[
                { id: '1', date: '2026-03-15', title: 'Assinatura', tipo: 'Contrato', detail: 'Valor original R$ 1,2 mi' },
                { id: '2', date: '2026-06-01', title: 'Aditivo nº 1', tipo: 'Aditivo' },
              ]}
            />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">Tabela e paginação</h2>
            <DataTable
              columns={columns}
              data={tableData}
              pageCount={3}
              pagination={{ pageIndex, pageSize: 10 }}
              onPaginationChange={(updater) => {
                const next = typeof updater === 'function' ? updater({ pageIndex, pageSize: 10 }) : updater;
                setPageIndex(next.pageIndex);
              }}
              totalRows={25}
            />
            <div className="mt-4">
              <Pagination pageIndex={0} pageSize={10} pageCount={5} onPageChange={() => undefined} />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">Cards e medidores</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <KpiCard title="Contratos vigentes" value="128" variation={4.2} icon={<TrendingUp className="h-5 w-5" />} />
              <ChartCard title="Vencimentos" subtitle="Por janela" atualizadoEm={new Date()}>
                <div className="flex h-32 items-center justify-center text-[var(--text-muted)]">Área do gráfico</div>
              </ChartCard>
            </div>
            <div className="mt-4 space-y-4">
              <Meter label="Limite de acréscimo (25%)" value={18} max={25} />
              <Progress label="Importação CSV" value={65} showValue />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">Estados</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <Skeleton variant="table" lines={4} />
              <EmptyState title="Nenhum contrato" description="Cadastre o primeiro contrato." actionLabel="Novo contrato" onAction={() => setModalOpen(true)} />
            </div>
            <div className="mt-4">
              <ErrorState code="NETWORK_ERROR" message="Falha ao conectar com a API." onRetry={() => toast.info('Retry')} />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">Descrição e field array</h2>
            <DescriptionList
              columns={2}
              items={[
                { term: 'GMS', detail: '2026/12345' },
                { term: 'Fornecedor', detail: 'Empresa Exemplo LTDA' },
                { term: 'Situação', detail: 'Vigente' },
                { term: 'Valor', detail: 'R$ 1.234.567,89' },
              ]}
            />
            <div className="mt-4">
              <FieldArrayList
                items={fieldRows}
                onAdd={() => setFieldRows((r) => [...r, { nome: `Item ${r.length + 1}` }])}
                onRemove={(i) => setFieldRows((r) => r.filter((_, idx) => idx !== i))}
                renderItem={(item) => <Input label="Nome" defaultValue={item.nome} />}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">Popover e Tooltip</h2>
            <div className="flex gap-4">
              <Popover
                trigger={<Button variant="secondary">Abrir popover</Button>}
              >
                <p className="text-sm text-[var(--text)]">Conteúdo auxiliar do campo.</p>
              </Popover>
              <Tooltip content="Art. 124 — Lei 14.133/2021">
                <Button variant="ghost">
                  <FileText className="h-4 w-4" />
                  Ajuda legal
                </Button>
              </Tooltip>
            </div>
          </section>
        </div>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Excluir contrato?"
          description="Esta ação não pode ser desfeita."
          variant="danger"
          requireText="12345"
          onConfirm={() => toast.success('Excluído')}
        />

        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="Modal de exemplo"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Fechar
              </Button>
              <Button onClick={() => setModalOpen(false)}>OK</Button>
            </>
          }
        >
          <p className="text-sm text-[var(--text-muted)]">Conteúdo do modal para quick-create.</p>
        </Modal>
      </Page>
    </TooltipProvider>
  );
}
