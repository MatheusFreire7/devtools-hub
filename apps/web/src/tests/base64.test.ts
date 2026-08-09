import { describe, expect, it } from 'vitest';

import { fromBase64, toBase64 } from '@/lib/utils/base64';

describe('base64 utils', () => {
  it('round-trips ASCII text', () => {
    const encoded = toBase64('hello world');
    expect(encoded.ok).toBe(true);
    expect(encoded.value).toBe('aGVsbG8gd29ybGQ=');
    expect(fromBase64(encoded.value!).value).toBe('hello world');
  });

  it('handles UTF-8 multibyte characters', () => {
    const text = 'Olá, mundo! 🌍';
    const encoded = toBase64(text);
    expect(encoded.ok).toBe(true);
    expect(fromBase64(encoded.value!).value).toBe(text);
  });

  it('rejects invalid base64 input when decoding', () => {
    const result = fromBase64('!!!not-base64!!!');
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns empty for empty input', () => {
    expect(toBase64('').value).toBe('');
    expect(fromBase64('').value).toBe('');
  });

  it('ignores whitespace when decoding', () => {
    const result = fromBase64('aGVs\nbG8g\nd29y\nbGQ=');
    expect(result.value).toBe('hello world');
  });
});
