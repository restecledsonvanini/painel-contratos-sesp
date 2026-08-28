import { expect, test } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('cadastros — busca paginada', () => {
  test('busca q= reduz linhas na lista de fornecedores', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'tabela desktop');
    await loginAs(page, 'admin@sesp.pr.gov.br', 'admin123');
    await page.goto('/cadastros');
    await expect(page.getByRole('heading', { name: /Fornecedores/i })).toBeVisible({
      timeout: 15_000,
    });

    await expect(page.getByText('Nenhum fornecedor.').or(page.getByRole('table'))).toBeVisible();

    const rowsBefore = await page.locator('table tbody tr').count();

    await page.getByRole('textbox', { name: 'Buscar na lista' }).fill('__zzz_inexistente__');
    await page.getByRole('button', { name: /^Buscar$/i }).click();

    await expect(page).toHaveURL(/[?&]q=/);
    await expect(page.getByText('Nenhum fornecedor.').first()).toBeVisible({ timeout: 15_000 });

    const rowsAfter = await page.locator('table tbody tr').count();
    if (rowsBefore > 0) {
      expect(rowsAfter).toBeLessThan(rowsBefore);
    }
  });
});

test.describe('cadastros — formulários FormField', () => {
  test('fornecedor, servidor, catálogo, dotação e unidade usam rótulos curtos', async ({
    page,
  }) => {
    await loginAs(page, 'admin@sesp.pr.gov.br', 'admin123');

    await page.goto('/fornecedores/new');
    await expect(page.getByRole('heading', { name: /Novo fornecedor/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText('Tipo', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Situação', { exact: true })).toBeVisible();
    await expect(page.getByLabel(/^Razão social$/i)).toBeVisible();
    await expect(page.locator('select.select-field')).toHaveCount(0);

    await page.goto('/servidores/new');
    await expect(page.getByRole('heading', { name: /Novo servidor/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByLabel(/^Nome$/i)).toBeVisible();
    await expect(page.getByLabel(/^CPF$/i)).toBeVisible();

    await page.goto('/catalogo-itens/new');
    await expect(page.getByRole('heading', { name: /Novo item do catálogo/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByLabel(/^Nome$/i)).toBeVisible();
    await expect(page.getByText('Categoria', { exact: true })).toBeVisible();

    await page.goto('/dotacoes/new');
    await expect(page.getByRole('heading', { name: /Nova dotação/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByLabel(/^Exercício$/i)).toBeVisible();
    await expect(page.getByText('Natureza', { exact: true })).toBeVisible();

    await page.goto('/unidades/new');
    await expect(page.getByRole('heading', { name: /Nova unidade/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText('Órgão', { exact: true })).toBeVisible();
    await expect(page.getByLabel(/^Sigla$/i)).toBeVisible();
    await expect(page.locator('select.select-field')).toHaveCount(0);
  });
});

test.describe('cadastros — mobile', () => {
  test('formulário de fornecedor carrega em viewport estreita', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'somente projeto mobile');
    await loginAs(page, 'admin@sesp.pr.gov.br', 'admin123');
    await page.goto('/fornecedores/new');
    await expect(page.getByRole('heading', { name: /Novo fornecedor/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByLabel(/^Razão social$/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /^Criar$/i })).toBeVisible();
    await expect(page.locator('select.select-field')).toHaveCount(0);
  });
});

test.describe('filtros e telas auxiliares — Select do DS', () => {
  test('órgão, pilar, entidade e usuários não usam select nativo', async ({ page }) => {
    await loginAs(page, 'admin@sesp.pr.gov.br', 'admin123');

    await page.goto('/configuracoes?tab=organizacao');
    await expect(page.getByLabel(/Filtrar órgão/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('select.select-field')).toHaveCount(0);

    await page.goto('/estrategico');
    await expect(page.getByRole('heading', { name: /Painel estratégico/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByLabel(/Filtrar pilar/i)).toBeVisible();
    await expect(page.locator('select.select-field')).toHaveCount(0);

    await page.goto('/utilitarios?tab=importacao');
    await expect(page.getByLabel(/^Entidade$/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('select.select-field')).toHaveCount(0);

    await page.goto('/configuracoes?tab=usuarios');
    await expect(page.getByRole('heading', { name: /Usuários/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator('select.select-field')).toHaveCount(0);
  });
});
