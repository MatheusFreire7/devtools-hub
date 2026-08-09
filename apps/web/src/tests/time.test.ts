import { describe, expect, it } from 'vitest';

import { formatUptime } from '@/lib/utils/time';

describe('formatUptime', () => {
  it('formats sub-minute uptime in seconds', () => {
    expect(formatUptime(0)).toBe('0s');
    expect(formatUptime(42)).toBe('42s');
    expect(formatUptime(59.9)).toBe('59s');
  });

  it('formats minute boundaries without a rest', () => {
    expect(formatUptime(60)).toBe('1m');
    expect(formatUptime(120)).toBe('2m');
    expect(formatUptime(3600)).toBe('60m');
  });

  it('formats minutes and seconds together', () => {
    expect(formatUptime(61)).toBe('1m 1s');
    expect(formatUptime(3725)).toBe('62m 5s');
  });

  it('clamps negative input to zero', () => {
    expect(formatUptime(-10)).toBe('0s');
    expect(formatUptime(-0.1)).toBe('0s');
  });

  it('floors fractional seconds', () => {
    expect(formatUptime(30.9)).toBe('30s');
    expect(formatUptime(90.7)).toBe('1m 30s');
  });
});
