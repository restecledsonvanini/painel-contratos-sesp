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
