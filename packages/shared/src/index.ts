import { z } from 'zod';

export const DNSRecordType = z.enum(['A', 'AAAA', 'MX', 'TXT', 'NS']);
export type DnsRecordType = z.infer<typeof DNSRecordType>;

const HOSTNAME_PATTERN = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/i;

export const dnsLookupSchema = z.object({
  hostname: z
    .string()
    .trim()
    .min(3, 'Hostname must have at least 3 characters')
    .max(253, 'Hostname must have at most 253 characters')
    .regex(HOSTNAME_PATTERN, 'Invalid hostname'),
  recordTypes: z.array(DNSRecordType).min(1).max(5),
});

export type DnsLookupRequest = z.infer<typeof dnsLookupSchema>;

export const httpHeadersSchema = z
  .object({
    url: z.string().trim().max(2048),
  })
  .superRefine((value, ctx) => {
    let parsed: URL;
    try {
      parsed = new URL(value.url);
    } catch {
      ctx.addIssue({ code: 'custom', message: 'A valid absolute URL is required' });
      return;
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      ctx.addIssue({ code: 'custom', message: 'Only HTTP and HTTPS URLs are supported' });
      return;
    }
    if (parsed.username !== '' || parsed.password !== '') {
      ctx.addIssue({ code: 'custom', message: 'URL credentials are not allowed' });
    }
  });

export type HttpHeadersRequest = z.infer<typeof httpHeadersSchema>;

export interface PingResponse {
  status: 'ok';
  timestamp: string;
  uptimeSeconds: number;
  latencyMs: number;
}

export interface DnsRecord {
  type: DnsRecordType;
  entry: string;
  priority?: number;
}

export interface DnsLookupResponse {
  hostname: string;
  records: DnsRecord[];
  timestamp: string;
}

export interface HttpHeader {
  name: string;
  value: string;
}

export interface HttpHeadersResponse {
  url: string;
  status: number;
  statusText: string;
  headers: HttpHeader[];
  timestamp: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
