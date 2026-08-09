import { describe, expect, it } from 'vitest';

import { decodeUrl, encodeUrl } from '@/lib/utils/url';

describe('url utils', () => {
  it('encodes URL components', () => {
    expect(encodeUrl('a b&c=1').value).toBe('a%20b%26c%3D1');
  });

  it('decodes URL components', () => {
    expect(decodeUrl('a%20b%26c%3D1').value).toBe('a b&c=1');
  });

  it('keeps the full URI method distinct', () => {
    expect(encodeUrl('https://example.com/a b', 'uri').value).toBe('https://example.com/a%20b');
    expect(encodeUrl('a b', 'component').value).toBe('a%20b');
  });

  it('round-trips with the same mode', () => {
    const input = 'café?x=hello world';
    for (const mode of ['component', 'uri'] as const) {
      expect(decodeUrl(encodeUrl(input, mode).value!, mode).value).toBe(input);
    }
  });

  it('reports malformed percent sequences on decode', () => {
    const result = decodeUrl('%ZZ');
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });
});
