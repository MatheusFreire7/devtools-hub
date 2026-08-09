import { describe, expect, it } from 'vitest';

import { parseTimestamp, toUnixMilliseconds, toUnixSeconds } from '@/lib/utils/timestamps';

describe('parseTimestamp', () => {
  it('parses a seconds-based timestamp', () => {
    const result = parseTimestamp('1700000000');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.seconds).toBe(1700000000);
      expect(result.milliseconds).toBe(1700000000000);
      expect(result.iso).toBe('2023-11-14T22:13:20.000Z');
    }
  });

  it('parses a milliseconds-based timestamp', () => {
    const result = parseTimestamp('1700000000000');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.seconds).toBe(1700000000);
      expect(result.milliseconds).toBe(1700000000000);
    }
  });

  it('returns local time', () => {
    const result = parseTimestamp('1700000000');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.local).toBeTruthy();
  });

  it('rejects non-numeric input', () => {
    const result = parseTimestamp('not-a-number');
    expect(result.ok).toBe(false);
  });

  it('rejects empty input', () => {
    const result = parseTimestamp('   ');
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/timestamp/i);
  });

  it('rejects out-of-range values', () => {
    const result = parseTimestamp('99999999999999999999');
    expect(result.ok).toBe(false);
  });
});

describe('toUnixSeconds / toUnixMilliseconds', () => {
  it('converts a date to seconds and milliseconds', () => {
    const date = new Date(1700000000000);
    expect(toUnixSeconds(date)).toBe(1700000000);
    expect(toUnixMilliseconds(date)).toBe(1700000000000);
  });

  it('defaults to the current time', () => {
    const now = Date.now();
    expect(Math.abs(toUnixMilliseconds() - now)).toBeLessThan(10);
  });
});
