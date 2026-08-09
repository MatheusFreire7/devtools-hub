import { describe, expect, it } from 'vitest';

import { flattenObject, jsonToCsv } from '@/lib/utils/jsonToCsv';

describe('flattenObject', () => {
  it('flattens nested objects using dot notation', () => {
    const flattened = flattenObject({ user: { name: 'Ada', address: { city: 'London' } } });
    expect(flattened).toEqual({ 'user.name': 'Ada', 'user.address.city': 'London' });
  });

  it('flattens arrays using index notation', () => {
    const flattened = flattenObject({ tags: ['a', 'b'], nested: [{ n: 1 }] });
    expect(flattened).toEqual({ 'tags[0]': 'a', 'tags[1]': 'b', 'nested[0].n': 1 });
  });

  it('leaves scalars untouched', () => {
    const flattened = flattenObject({ a: 1, b: null, c: true });
    expect(flattened).toEqual({ a: 1, b: null, c: true });
  });
});

describe('jsonToCsv', () => {
  it('converts an array of objects into CSV with a header row', () => {
    const result = jsonToCsv('[{"name":"Ada","age":36},{"name":"Grace","age":45}]');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe('name,age\nAda,36\nGrace,45');
    }
  });

  it('flattens nested keys into dotted column names', () => {
    const result = jsonToCsv('[{"user":{"id":1}}]');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe('user.id\n1');
    }
  });

  it('quotes fields containing commas or quotes', () => {
    const result = jsonToCsv('[{"name":"Ada, Countess","note":"She said \\"hi\\"."}]');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe('name,note\n"Ada, Countess","She said ""hi""."');
    }
  });

  it('rejects invalid JSON with an error', () => {
    const result = jsonToCsv('{"a":');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/JSON/i);
  });

  it('rejects empty input', () => {
    const result = jsonToCsv('   ');
    expect(result.ok).toBe(false);
  });

  it('rejects an empty array', () => {
    const result = jsonToCsv('[]');
    expect(result.ok).toBe(false);
    expect(result).toEqual({ ok: false, error: 'Cannot convert an empty array to CSV.' });
  });

  it('rejects non-object rows', () => {
    const result = jsonToCsv('[1, 2]');
    expect(result.ok).toBe(false);
  });
});
