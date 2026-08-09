import { describe, expect, it } from 'vitest';

import { buildHighlightSegments, testRegex, validateFlags } from '@/lib/utils/regex';

describe('testRegex', () => {
  it('finds all matches with the global flag', () => {
    const result = testRegex('\\w+', 'g', 'foo bar baz');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.count).toBe(3);
      expect(result.matches.map((m) => m.match)).toEqual(['foo', 'bar', 'baz']);
    }
  });

  it('captures group matches', () => {
    const result = testRegex('(\\w+)@(\\w+)', 'g', 'a@b c@d');
    if (!result.ok) {
      throw new Error('Expected a successful regex test');
    }
    expect(result.matches[0]?.groups).toEqual({ 'group-1': 'a', 'group-2': 'b' });
  });

  it('respects the case-insensitive flag', () => {
    const result = testRegex('abc', 'gi', 'ABC abc');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.count).toBe(2);
  });

  it('returns no matches when the pattern does not match', () => {
    const result = testRegex('xyz', 'g', 'abc');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.count).toBe(0);
  });

  it('rejects an invalid pattern', () => {
    const result = testRegex('(', 'g', 'abc');
    expect(result.ok).toBe(false);
  });

  it('rejects unsupported flags', () => {
    const result = testRegex('a', 'y', 'abc');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/flag/i);
  });

  it('rejects an empty pattern', () => {
    const result = testRegex('', 'g', 'abc');
    expect(result.ok).toBe(false);
  });
});

describe('validateFlags', () => {
  it('accepts supported flags', () => {
    expect(validateFlags('gim')).toBeUndefined();
  });

  it('rejects unsupported flags', () => {
    expect(validateFlags('gv')).toMatch(/Unsupported flag "v"/);
  });
});

describe('buildHighlightSegments', () => {
  it('marks matches and keeps surrounding text', () => {
    const matches = [
      { match: 'foo', index: 0, groups: {} },
      { match: 'baz', index: 8, groups: {} },
    ];
    const segments = buildHighlightSegments('foo bar baz', matches);
    expect(segments).toEqual([
      { text: 'foo', matched: true },
      { text: ' bar ', matched: false },
      { text: 'baz', matched: true },
    ]);
  });

  it('returns a single plain segment when there are no matches', () => {
    const segments = buildHighlightSegments('hello', []);
    expect(segments).toEqual([{ text: 'hello', matched: false }]);
  });
});
