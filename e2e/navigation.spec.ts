import { expect, test } from '@playwright/test';

import { TOOLS } from './tools-meta';

test('home page lists every registered tool', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Essential tools/i })).toBeVisible();

  const main = page.getByRole('main');
  for (const tool of TOOLS) {
    await expect(main.getByRole('link', { name: new RegExp(tool.title) })).toBeVisible();
  }
});

test('every tool page loads from the home page', async ({ page }) => {
  await page.goto('/');
  const main = page.getByRole('main');

  for (const tool of TOOLS) {
    await main.getByRole('link', { name: new RegExp(tool.title) }).click();
    await expect(page).toHaveURL(new RegExp(`/tools/${tool.slug}$`));
    await expect(page.getByRole('heading', { name: tool.title })).toBeVisible();
    await page.getByRole('link', { name: 'All tools' }).click();
  }
});

test('unknown tool routes land on the 404 page', async ({ page }) => {
  await page.goto('/tools/does-not-exist');
  await expect(page.getByRole('heading', { name: /Page not found/i })).toBeVisible();
});
