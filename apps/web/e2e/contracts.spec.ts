import { expect, test } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('contratos — paginação na URL', () => {
  test('Próxima atualiza ?page= quando há mais de uma página', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'paginação desktop');
    await loginAs(page, 'admin@sesp.pr.gov.br', 'admin123');
    await page.goto('/contracts');
    await expect(page.getByRole('heading', { name: /Contratos/i })).toBeVisible({
      timeout: 15_000,
    });

    const next = page.getByRole('button', { name: /^Próxima$/i });
    await expect(next).toBeVisible({ timeout: 15_000 });
    test.skip(await next.isDisabled(), 'acervo cabe em uma página');

    await next.click();
    await expect(page).toHaveURL(/[?&]page=2/);
    await expect(page.getByRole('button', { name: /^Anterior$/i })).toBeEnabled();

    await page.getByRole('button', { name: /^Anterior$/i }).click();
    await expect(page).toHaveURL(/(?:[?&]page=1(?:&|$)|^(?!.*page=))/);
  });
});
