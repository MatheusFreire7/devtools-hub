import { expect, test } from '@playwright/test';

const API_URL = process.env.E2E_API_URL ?? 'https://devtools-hub-api.onrender.com';

test.describe('deployed stack', () => {
  test('web app is reachable', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('API health probe responds', async ({ request }) => {
    test.setTimeout(60_000);
    const response = await request.get(`${API_URL}/api/v1/ping`);
    expect(response.ok()).toBeTruthy();
    expect(await response.json()).toEqual(expect.objectContaining({ status: 'ok' }));
  });

  test('ping works end-to-end through CORS', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/tools/ping');

    await page.getByRole('button', { name: /ping again/i }).click();
    await expect(page.getByText('Service healthy')).toBeVisible();
    await expect(page.getByText(/^ok$/)).toBeVisible();
  });

  test('DNS lookup works end-to-end through CORS', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/tools/dns-lookup');

    await page.getByLabel('Hostname').fill('example.com');
    await page.getByRole('button', { name: /lookup/i }).click();

    await expect(page.getByText(/results for/i)).toBeVisible();
  });

  test('HTTP headers inspection works end-to-end through CORS', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/tools/http-headers');

    await page.getByLabel('URL').fill('https://example.com');
    await page.getByRole('button', { name: /inspect/i }).click();

    await expect(page.getByText(/HTTP 200/i)).toBeVisible();
  });
});
