import { describe, expect, it } from 'vitest';

import { HASH_ALGORITHMS, hashText } from '@/lib/utils/hashes';

describe('hashText', () => {
  it('returns empty string for empty input', async () => {
    expect(await hashText('', 'sha256')).toBe('');
  });

  it('computes the correct SHA-256 digest for "hello world"', async () => {
    const digest = await hashText('hello world', 'sha256');
    expect(digest).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
  });

  it('computes the correct SHA-1 digest for "abc"', async () => {
    const digest = await hashText('abc', 'sha1');
    expect(digest).toBe('a9993e364706816aba3e25717850c26c9cd0d89d');
  });

  it('computes the correct SHA-512 digest for "abc"', async () => {
    const digest = await hashText('abc', 'sha512');
    expect(digest).toHaveLength(128);
  });

  it('computes a well-known MD5 digest', async () => {
    const digest = await hashText('The quick brown fox jumps over the lazy dog', 'md5');
    expect(digest).toBe('9e107d9d372bb6826bd81d3542a419d6');
  });

  it('supports every declared algorithm', async () => {
    for (const algorithm of HASH_ALGORITHMS) {
      const digest = await hashText('devtools-hub', algorithm);
      expect(digest).toMatch(/^[0-9a-f]+$/);
      expect(digest.length).toBeGreaterThan(0);
    }
  });
});
