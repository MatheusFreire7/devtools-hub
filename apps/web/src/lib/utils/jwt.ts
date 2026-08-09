export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export interface JwtResult {
  ok: boolean;
  token?: DecodedJwt;
  error?: string;
}

function decodeSegment(segment: string): unknown {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(segment.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function decodeJwt(token: string): JwtResult {
  if (!token.trim()) {
    return { ok: false, error: 'Paste a JWT to decode it.' };
  }

  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return {
      ok: false,
      error: 'Invalid JWT — expected 3 dot-separated segments (header.payload.signature).',
    };
  }

  const [headerSegment, payloadSegment, signature] = parts;
  if (!headerSegment || !payloadSegment || !signature) {
    return { ok: false, error: 'Malformed JWT — missing header or payload segment.' };
  }

  try {
    const header = decodeSegment(headerSegment) as Record<string, unknown>;
    const payload = decodeSegment(payloadSegment) as Record<string, unknown>;
    return { ok: true, token: { header, payload, signature } };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? `Failed to decode segments: ${error.message}` : String(error),
    };
  }
}

export function jwtExpiresAt(seconds: number, now: number = Date.now()): string {
  const date = new Date(seconds * 1000);
  if (Number.isNaN(date.getTime())) return 'Invalid expiration timestamp.';
  const relative = date.getTime() - now;
  if (relative <= 0) {
    return `Expired ${formatDuration(seconds * 1000 < now ? now - seconds * 1000 : 0)} ago`;
  }
  return `Valid for ${formatDuration(relative)}`;
}

function formatDuration(milliseconds: number): string {
  const seconds = Math.round(milliseconds / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

export function formatTimestamp(seconds: number): string {
  const date = new Date(seconds * 1000);
  if (Number.isNaN(date.getTime())) return 'Invalid timestamp.';
  return date.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'long' });
}
