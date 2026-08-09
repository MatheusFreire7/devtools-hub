import { z } from 'zod';

export const DNSRecordType = z.enum(['A', 'AAAA', 'MX', 'TXT', 'NS']);
export type DnsRecordType = z.infer<typeof DNSRecordType>;

export const dnsLookupSchema = z.object({
  hostname: z.string().trim().min(3, 'Hostname must have at least 3 characters').max(253),
  recordTypes: z.array(DNSRecordType).min(1).max(5),
});

export type DnsLookupRequest = z.infer<typeof dnsLookupSchema>;

export const httpHeadersSchema = z.object({
  url: z.string().trim().url('A valid absolute URL is required').max(2048),
});

export type HttpHeadersRequest = z.infer<typeof httpHeadersSchema>;

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
