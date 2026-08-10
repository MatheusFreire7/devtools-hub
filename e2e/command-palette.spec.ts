import { expect, test } from '@playwright/test';

test('opens the palette with Ctrl+K and navigates to a tool', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Control+K');
  const dialog = page.getByRole('dialog', { name: /search tools/i });
  await expect(dialog).toBeVisible();

  await dialog.getByPlaceholder(/search tools/i).fill('uuid');
  await dialog.getByText('UUID Generator').click();

  await expect(page).toHaveURL(/\/tools\/uuid-generator$/);
  await expect(page.getByRole('heading', { name: 'UUID Generator' })).toBeVisible();
});

test('closes the palette with Escape', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Control+K');
  const dialog = page.getByRole('dialog', { name: /search tools/i });
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('opens the palette from the header search button', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Search tools' }).click();
  await expect(page.getByRole('dialog', { name: /search tools/i })).toBeVisible();
});

test('shows an empty state for unknown queries', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Control+K');
  const dialog = page.getByRole('dialog', { name: /search tools/i });
  await dialog.getByPlaceholder(/search tools/i).fill('zzzzzznope');
  await expect(dialog.getByText('No tool found.')).toBeVisible();
});

test('persists visited tools as recent entries', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Base64 Encoder/ }).click();
  await expect(page).toHaveURL(/\/tools\/base64$/);

  await page.waitForFunction(() => {
    const raw = localStorage.getItem('devtools-hub:recent');
    if (!raw) return false;
    return raw.includes('base64');
  });

  await page.goto('/');
  await page.keyboard.press('Control+K');

  const recent = page.getByRole('group', { name: 'Recent' });
  await expect(recent).toBeVisible();
  await expect(recent.getByText('Base64 Encoder / Decoder')).toBeVisible();
});
