export interface TimestampResult {
  ok: boolean;
  seconds?: number;
  milliseconds?: number;
  iso?: string;
  local?: string;
  error?: string;
}

const SECONDS_MS_THRESHOLD = 1_000_000_000_000;

export function isTimestamp(value: number): value is number {
  if (!Number.isFinite(value)) return false;
  // Accept plausible Unix timestamps on the seconds (1e9–1e11) or ms (1e12–1e14) scale.
  return value >= 0 && value < 1e15;
}

export function parseTimestamp(input: string): TimestampResult {
  const trimmed = input.trim();
  if (trimmed === '') return { ok: false, error: 'Enter a Unix timestamp first.' };

  if (!/^[+-]?\d+(\.\d+)?$/.test(trimmed)) {
    return { ok: false, error: `Could not parse "${trimmed}" as a number.` };
  }
  const raw = Number(trimmed);
  if (!Number.isFinite(raw)) return { ok: false, error: 'That is not a valid number.' };

  const milliseconds = Math.abs(raw) >= SECONDS_MS_THRESHOLD ? raw : raw * 1000;
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: 'That timestamp is out of range.' };
  }

  return {
    ok: true,
    seconds: milliseconds / 1000,
    milliseconds,
    iso: date.toISOString(),
    local: date.toLocaleString(),
  };
}

export function toUnixSeconds(date = new Date()): number {
  return Math.floor(date.getTime() / 1000);
}

export function toUnixMilliseconds(date = new Date()): number {
  return date.getTime();
}
