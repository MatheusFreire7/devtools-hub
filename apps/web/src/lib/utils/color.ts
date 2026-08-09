export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export type ColorResult =
  { ok: true; rgb: RgbColor; hsl: HslColor; hex: string } | { ok: false; error: string };

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function parseHexToRgb(hex: string): RgbColor | undefined {
  const cleaned = hex.trim().replace(/^#/, '');
  let expanded = cleaned;
  if (/^[0-9a-f]{3}$/i.test(expanded)) {
    expanded = expanded
      .split('')
      .map((char) => char + char)
      .join('');
  }
  if (!/^[0-9a-f]{6}$/i.test(expanded)) return undefined;
  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const parts = [r, g, b].map((value) =>
    clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0'),
  );
  return `#${parts.join('')}`;
}

export function rgbToHsl(r: number, g: number, b: number): HslColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6;
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb(h: number, s: number, l: number): RgbColor {
  const hn = ((h % 360) + 360) % 360;
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = ln - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;
  if (hn < 60) [r, g, b] = [c, x, 0];
  else if (hn < 120) [r, g, b] = [x, c, 0];
  else if (hn < 180) [r, g, b] = [0, c, x];
  else if (hn < 240) [r, g, b] = [0, x, c];
  else if (hn < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function parseRgb(value: string): RgbColor | undefined {
  const match = value
    .trim()
    .match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)$/i);
  if (!match) return undefined;
  const [r, g, b] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if ([r, g, b].some((channel) => channel > 255)) return undefined;
  return { r, g, b };
}

export function parseHsl(value: string): HslColor | undefined {
  const match = value
    .trim()
    .match(/^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%(?:\s*,\s*[\d.]+)?\s*\)$/i);
  if (!match) return undefined;
  const [h, s, l] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (h > 360 || s > 100 || l > 100) return undefined;
  return { h, s, l };
}

export function parseColor(input: string): ColorResult {
  const trimmed = input.trim();
  if (trimmed === '') return { ok: false, error: 'Enter a color value first.' };

  const rgbFromHex = parseHexToRgb(trimmed);
  if (rgbFromHex) {
    const hex = trimmed.startsWith('#') ? trimmed.toLowerCase() : `#${trimmed.toLowerCase()}`;
    return {
      ok: true,
      rgb: rgbFromHex,
      hsl: rgbToHsl(rgbFromHex.r, rgbFromHex.g, rgbFromHex.b),
      hex,
    };
  }

  const rgb = parseRgb(trimmed);
  if (rgb) {
    return {
      ok: true,
      rgb,
      hsl: rgbToHsl(rgb.r, rgb.g, rgb.b),
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    };
  }

  const hsl = parseHsl(trimmed);
  if (hsl) {
    const rgbFromHsl = hslToRgb(hsl.h, hsl.s, hsl.l);
    return {
      ok: true,
      rgb: rgbFromHsl,
      hsl,
      hex: rgbToHex(rgbFromHsl.r, rgbFromHsl.g, rgbFromHsl.b),
    };
  }

  return { ok: false, error: `Could not parse "${trimmed}" — use HEX (#ff8800), rgb() or hsl().` };
}

export function formatRgb(rgb: RgbColor): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function formatHsl(hsl: HslColor): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}
