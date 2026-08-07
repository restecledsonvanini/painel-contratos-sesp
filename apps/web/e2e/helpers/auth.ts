import type { Page } from '@playwright/test';

export async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel(/E-mail/i).fill(email);
  await page.getByLabel(/Senha/i).fill(password);
  await page.getByRole('button', { name: /Entrar/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15_000 });
}
