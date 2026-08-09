import { describe, expect, it } from 'vitest';

import { decodeJwt, formatTimestamp, jwtExpiresAt } from '@/lib/utils/jwt';

function base64url(value: unknown): string {
  const json = typeof value === 'string' ? value : JSON.stringify(value);
  return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function buildToken(payload: Record<string, unknown>, signature = 'sig123'): string {
  return `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url(payload)}.${signature}`;
}

describe('jwt utils', () => {
  it('decodes header, payload and signature', () => {
    const token = buildToken({ sub: '123', name: 'Jane', exp: 4102444800 });
    const result = decodeJwt(token);

    expect(result.ok).toBe(true);
    expect(result.token?.header).toEqual({ alg: 'HS256', typ: 'JWT' });
    expect(result.token?.payload).toEqual({ sub: '123', name: 'Jane', exp: 4102444800 });
    expect(result.token?.signature).toBe('sig123');
  });

  it('rejects a token without 3 segments', () => {
    const result = decodeJwt('only.two');
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/3 dot-separated/i);
  });

  it('rejects malformed base64url segments', () => {
    const result = decodeJwt('!!not-base64.!!not-base64.signature');
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/decode/i);
  });

  it('rejects empty input', () => {
    expect(decodeJwt('   ').ok).toBe(false);
  });

  it('describes an expiration in the past as expired', () => {
    const now = Date.now();
    expect(jwtExpiresAt(Math.floor(now / 1000) - 120, now)).toMatch(/Expired/i);
  });

  it('describes a future expiration as valid', () => {
    const now = Date.now();
    expect(jwtExpiresAt(Math.floor(now / 1000) + 3600, now)).toMatch(/Valid for/i);
  });

  it('formats a unix timestamp as a readable locale string', () => {
    const formatted = formatTimestamp(Math.floor(Date.now() / 1000));
    expect(formatted).toContain(String(new Date().getFullYear()));
  });
});
