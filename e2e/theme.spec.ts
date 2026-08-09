import { expect, test } from '@playwright/test';

test('toggles the theme and persists the choice', async ({ page }) => {
  await page.goto('/');

  const before = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await page.getByRole('button', { name: /switch to dark mode|switch to light mode/i }).click();
  const after = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  expect(after).not.toBe(before);

  await page.reload();
  const persisted = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  expect(persisted).toBe(after);
});

test('switches theme from the command palette', async ({ page }) => {
  await page.goto('/');

  const before = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await page.keyboard.press('Control+K');
  const dialog = page.getByRole('dialog', { name: /search tools/i });
  await dialog.getByText(/switch to (dark|light) mode/i).click();

  const after = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  expect(after).not.toBe(before);
});
