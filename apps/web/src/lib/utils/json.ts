export interface JsonParseResult {
  ok: boolean;
  value?: unknown;
  error?: string;
}

export type JsonFormatResult = { ok: true; value: string } | { ok: false; error: string };

export function parseJson(input: string): JsonParseResult {
  if (input.trim() === '') {
    return { ok: false, error: 'Input is empty — paste some JSON to validate.' };
  }
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}

export function formatJson(input: string, indentSize: 2 | 4): JsonFormatResult {
  const parsed = parseJson(input);
  if (!parsed.ok) return { ok: false, error: parsed.error ?? 'Invalid JSON.' };
  return { ok: true, value: JSON.stringify(parsed.value, null, indentSize) };
}

export function minifyJson(input: string): JsonFormatResult {
  const parsed = parseJson(input);
  if (!parsed.ok) return { ok: false, error: parsed.error ?? 'Invalid JSON.' };
  return { ok: true, value: JSON.stringify(parsed.value) };
}
