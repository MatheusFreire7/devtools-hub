export type JsonToCsvResult = { ok: true; value: string } | { ok: false; error: string };

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function flattenObject(
  input: Record<string, unknown>,
  prefix = '',
  seen = new Set<unknown>(),
): Record<string, unknown> {
  if (seen.has(input)) return { [prefix || 'root']: '[Circular]' };
  seen.add(input);

  const flattened: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value)) {
      Object.assign(flattened, flattenObject(value, fullKey, seen));
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const itemKey = `${fullKey}[${index}]`;
        if (isPlainObject(item)) {
          Object.assign(flattened, flattenObject(item, itemKey, seen));
        } else if (Array.isArray(item)) {
          flattened[itemKey] = JSON.stringify(item);
        } else {
          flattened[itemKey] = item;
        }
      });
    } else {
      flattened[fullKey] = value;
    }
  }
  seen.delete(input);
  return flattened;
}

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = typeof value === 'string' ? value : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function collectHeaders(rows: Record<string, unknown>[]): string[] {
  const headers: string[] = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!headers.includes(key)) headers.push(key);
    }
  }
  return headers;
}

export function jsonToCsv(input: string): JsonToCsvResult {
  const trimmed = input.trim();
  if (trimmed === '') return { ok: false, error: 'Input is empty — paste some JSON first.' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Invalid JSON.',
    };
  }

  const rows = Array.isArray(parsed) ? parsed : [parsed];
  if (rows.length === 0) return { ok: false, error: 'Cannot convert an empty array to CSV.' };
  if (rows.some((row) => !isPlainObject(row))) {
    return { ok: false, error: 'Every top-level item must be an object to build a CSV table.' };
  }

  const flattenedRows = rows.map((row) => flattenObject(row as Record<string, unknown>));
  const headers = collectHeaders(flattenedRows);
  if (headers.length === 0) return { ok: false, error: 'No keys found to build CSV columns.' };

  const lines = [headers.map((header) => escapeCsvField(header)).join(',')];
  for (const row of flattenedRows) {
    lines.push(headers.map((header) => escapeCsvField(row[header])).join(','));
  }
  return { ok: true, value: lines.join('\n') };
}
