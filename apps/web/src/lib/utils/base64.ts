const CHUNK_SIZE = 0x8000;

export interface Base64Result {
  ok: boolean;
  value?: string;
  error?: string;
}

export function toBase64(input: string): Base64Result {
  if (input === '') return { ok: true, value: '' };
  try {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
    }
    return { ok: true, value: btoa(binary) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export function fromBase64(input: string): Base64Result {
  if (input.trim() === '') return { ok: true, value: '' };
  try {
    const cleaned = input.replace(/\s+/g, '');
    if (cleaned.length % 4 !== 0) {
      return { ok: false, error: 'Invalid Base64 — length must be a multiple of 4.' };
    }
    const binary = atob(cleaned);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return { ok: true, value: new TextDecoder().decode(bytes) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
