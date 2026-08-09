export type UrlEncodingMode = 'component' | 'uri';

export interface UrlResult {
  ok: boolean;
  value?: string;
  error?: string;
}

export function encodeUrl(input: string, mode: UrlEncodingMode = 'component'): UrlResult {
  try {
    return { ok: true, value: mode === 'component' ? encodeURIComponent(input) : encodeURI(input) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export function decodeUrl(input: string, mode: UrlEncodingMode = 'component'): UrlResult {
  try {
    return { ok: true, value: mode === 'component' ? decodeURIComponent(input) : decodeURI(input) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
