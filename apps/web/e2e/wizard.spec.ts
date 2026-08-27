import { expect, test } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('wizard — lookups preguiçosos', () => {
  test('etapa 1 não dispara GET /fornecedores', async ({ page }) => {
    await loginAs(page, 'analista@sesp.pr.gov.br', 'analista123');

    const fornecedorGets: string[] = [];
    page.on('request', (req) => {
      if (req.method() !== 'GET') return;
      const url = req.url();
      if (/\/fornecedores(\?|$)/.test(url) && !url.includes('/lookups/')) {
        fornecedorGets.push(url);
      }
    });

    await page.goto('/contracts/new');
    await expect(page.getByRole('heading', { name: /Novo contrato/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByLabel(/^Protocolo$/i)).toBeVisible();
    await page.waitForTimeout(400);

    expect(fornecedorGets, fornecedorGets.join('\n')).toEqual([]);
  });
});
