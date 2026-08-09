import { describe, expect, it } from 'vitest';

import {
  formatHsl,
  formatRgb,
  hslToRgb,
  parseColor,
  parseHexToRgb,
  parseHsl,
  parseRgb,
  rgbToHex,
  rgbToHsl,
} from '@/lib/utils/color';

describe('parseHexToRgb', () => {
  it('parses 3-digit hex', () => {
    expect(parseHexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('parses 6-digit hex', () => {
    expect(parseHexToRgb('#ff8800')).toEqual({ r: 255, g: 136, b: 0 });
  });

  it('parses hex without the hash', () => {
    expect(parseHexToRgb('3366ff')).toEqual({ r: 51, g: 102, b: 255 });
  });

  it('rejects invalid hex', () => {
    expect(parseHexToRgb('#ff80')).toBeUndefined();
    expect(parseHexToRgb('not-a-color')).toBeUndefined();
  });
});

describe('rgbToHex', () => {
  it('converts rgb to hex', () => {
    expect(rgbToHex(255, 136, 0)).toBe('#ff8800');
  });

  it('clamps out-of-range channels', () => {
    expect(rgbToHex(300, -10, 128)).toBe('#ff0080');
  });
});

describe('rgbToHsl / hslToRgb', () => {
  it('converts red to hsl', () => {
    expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
  });

  it('round-trips a known color', () => {
    const { h, s, l } = rgbToHsl(99, 102, 241);
    const rgb = hslToRgb(h, s, l);
    expect(Math.abs(rgb.r - 99)).toBeLessThanOrEqual(2);
    expect(Math.abs(rgb.g - 102)).toBeLessThanOrEqual(2);
    expect(Math.abs(rgb.b - 241)).toBeLessThanOrEqual(2);
  });

  it('converts grayscale to zero saturation', () => {
    expect(rgbToHsl(128, 128, 128)).toEqual({ h: 0, s: 0, l: 50 });
  });
});

describe('parseRgb / parseHsl', () => {
  it('parses rgb()', () => {
    expect(parseRgb('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30 });
  });

  it('parses rgba()', () => {
    expect(parseRgb('rgba(1, 2, 3, 0.5)')).toEqual({ r: 1, g: 2, b: 3 });
  });

  it('rejects rgb with channels above 255', () => {
    expect(parseRgb('rgb(300, 0, 0)')).toBeUndefined();
  });

  it('parses hsl()', () => {
    expect(parseHsl('hsl(120, 50%, 25%)')).toEqual({ h: 120, s: 50, l: 25 });
  });

  it('rejects out-of-range hsl', () => {
    expect(parseHsl('hsl(400, 50%, 25%)')).toBeUndefined();
  });
});

describe('parseColor', () => {
  it('parses hex input end to end', () => {
    const result = parseColor('#ff8800');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.hex).toBe('#ff8800');
      expect(result.rgb).toEqual({ r: 255, g: 136, b: 0 });
      expect(result.hsl).toEqual({ h: 32, s: 100, l: 50 });
    }
  });

  it('parses rgb input', () => {
    const result = parseColor('rgb(51, 102, 255)');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.hex).toBe('#3366ff');
  });

  it('parses hsl input', () => {
    const result = parseColor('hsl(240, 100%, 50%)');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.rgb).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('rejects unrecognized input', () => {
    const result = parseColor('banana');
    expect(result.ok).toBe(false);
  });

  it('rejects empty input', () => {
    const result = parseColor('   ');
    if (result.ok) {
      throw new Error('Expected parseColor to reject empty input');
    }
    expect(result.error).toMatch(/color/i);
  });
});

describe('formatters', () => {
  it('formats rgb and hsl', () => {
    expect(formatRgb({ r: 1, g: 2, b: 3 })).toBe('rgb(1, 2, 3)');
    expect(formatHsl({ h: 120, s: 50, l: 25 })).toBe('hsl(120, 50%, 25%)');
  });
});
