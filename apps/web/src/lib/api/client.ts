import type {
  DnsLookupRequest,
  DnsLookupResponse,
  HttpHeadersRequest,
  HttpHeadersResponse,
  PingResponse,
} from '@devtools-hub/shared';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ?? '';

function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body.error?.message) message = body.error.message;
    } catch {
      // keep the fallback message
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function fetchPing(signal?: AbortSignal): Promise<PingResponse> {
  return request<PingResponse>('/api/v1/ping', { method: 'GET', signal });
}

export function dnsLookup(body: DnsLookupRequest): Promise<DnsLookupResponse> {
  return request<DnsLookupResponse>('/api/v1/dns-lookup', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function fetchHttpHeaders(body: HttpHeadersRequest): Promise<HttpHeadersResponse> {
  return request<HttpHeadersResponse>('/api/v1/http-headers', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
