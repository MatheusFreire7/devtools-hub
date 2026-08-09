import { expect, test } from '@playwright/test';

test.describe('network tools', () => {
  test('ping reports service health', async ({ page }) => {
    test.setTimeout(30_000);
    await page.goto('/tools/ping');

    await page.getByRole('button', { name: /ping again/i }).click();
    await expect(page.getByText('Service healthy')).toBeVisible();
    await expect(page.getByText(/^ok$/)).toBeVisible();
  });

  test('resolves DNS records for a public hostname', async ({ page }) => {
    test.setTimeout(30_000);
    await page.goto('/tools/dns-lookup');

    await page.getByLabel('Hostname').fill('example.com');
    await page.getByRole('button', { name: /lookup/i }).click();

    await expect(page.getByText(/results for/i)).toBeVisible();
  });

  test('inspects the HTTP headers of a public URL', async ({ page }) => {
    test.setTimeout(30_000);
    await page.goto('/tools/http-headers');

    await page.getByLabel('URL').fill('https://example.com');
    await page.getByRole('button', { name: /inspect/i }).click();

    await expect(page.getByText(/HTTP 200/i)).toBeVisible();
  });
});
