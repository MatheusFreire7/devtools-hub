import { expect, test } from '@playwright/test';

test.describe('client-side tools', () => {
  test('formats and minifies JSON', async ({ page }) => {
    await page.goto('/tools/json-formatter');

    const input = page.getByLabel('JSON input');
    await input.fill('{"a":1,"b":[1,2]}');
    await page.getByRole('button', { name: /format/i }).click();

    await expect(page.getByLabel('JSON output')).toHaveValue(/{\n {2}"a": 1/);
    await expect(page.getByText(/Valid JSON/i)).toBeVisible();

    await page.getByRole('button', { name: /minify/i }).click();
    await expect(page.getByLabel('JSON output')).toHaveValue('{"a":1,"b":[1,2]}');
  });

  test('encodes and decodes Base64', async ({ page }) => {
    await page.goto('/tools/base64');

    const input = page.getByLabel('Input');
    await input.fill('hello');
    await expect(page.getByLabel('Output')).toHaveValue('aGVsbG8=');

    await page.getByRole('button', { name: 'Swap encode and decode' }).click();
    await expect(page.getByLabel('Output')).toHaveValue('hello');
  });

  test('encodes and decodes a URL component', async ({ page }) => {
    await page.goto('/tools/url-encoder');

    const input = page.getByLabel('Text to encode');
    await input.fill('a b&c');
    await expect(page.getByLabel('Output')).toHaveValue('a%20b%26c');

    await page.getByRole('button', { name: 'Swap encode and decode' }).click();
    await expect(page.getByLabel('Output')).toHaveValue('a b&c');
  });

  test('decodes a JWT header and payload', async ({ page }) => {
    const b64url = (value: string) =>
      btoa(value).replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const header = b64url('{"alg":"HS256","typ":"JWT"}');
    const payload = b64url('{"sub":"1234567890","name":"Jane Doe"}');
    const token = `${header}.${payload}.abc123`;

    await page.goto('/tools/jwt-decoder');
    await page.getByLabel('JWT input').fill(token);
    await page.getByRole('button', { name: /decode/i }).click();

    await expect(page.getByLabel('Header JSON')).toHaveValue(/HS256/);
    await expect(page.getByLabel('Payload JSON')).toHaveValue(/Jane Doe/);
    await expect(page.getByRole('textbox', { name: 'Signature' })).toHaveValue('abc123');
  });

  test('generates a configurable list of UUIDs', async ({ page }) => {
    await page.goto('/tools/uuid-generator');

    await expect(page.getByText(/^[0-9a-f-]{36}$/)).toHaveCount(5);

    const quantity = page.getByLabel('Number of UUIDs');
    await quantity.fill('3');
    await expect(page.getByText(/^[0-9a-f-]{36}$/)).toHaveCount(3);

    await page.getByRole('button', { name: /regenerate/i }).click();
    await expect(page.getByText(/^[0-9a-f-]{36}$/)).toHaveCount(3);
  });

  test('converts JSON to CSV', async ({ page }) => {
    await page.goto('/tools/json-to-csv');

    await page.getByLabel('JSON input').fill('[{"name":"Ada","age":36}]');
    await page.getByRole('button', { name: /convert/i }).click();

    await expect(page.getByLabel('CSV output')).toHaveValue(/name,age/);
    await expect(page.getByLabel('CSV output')).toHaveValue(/Ada,36/);
  });

  test('computes a SHA-256 hash', async ({ page }) => {
    await page.goto('/tools/hash-generator');

    await page.getByLabel('Input').fill('hello world');
    await page.getByRole('button', { name: /generate/i }).click();

    await expect(page.getByLabel('Hash output')).toHaveValue(
      'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
    );
  });

  test('converts a Unix timestamp to ISO', async ({ page }) => {
    await page.goto('/tools/timestamp-converter');

    await page.getByLabel('Timestamp input').fill('1700000000');
    await page.getByRole('button', { name: /convert/i }).click();

    await expect(page.getByText('2023-11-14T22:13:20.000Z')).toBeVisible();
  });

  test('highlights regex matches', async ({ page }) => {
    await page.goto('/tools/regex-tester');

    await page.getByLabel('Regex pattern').fill('l+');
    await page.getByLabel('Test input').fill('hello world');
    await page.getByRole('button', { name: /test/i }).click();

    await expect(page.getByText(/2 matches/i)).toBeVisible();
  });

  test('switches a color representation', async ({ page }) => {
    await page.goto('/tools/color-converter');

    const hex = page.getByLabel('HEX value');
    await hex.fill('#ff0000');

    await expect(page.getByLabel('RGB value')).toHaveValue('rgb(255, 0, 0)');
    await expect(page.getByLabel('HSL value')).toHaveValue(/hsl/);
  });
});
