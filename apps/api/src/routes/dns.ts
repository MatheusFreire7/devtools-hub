import {
  dnsLookupSchema,
  type DnsLookupRequest,
  type DnsLookupResponse,
  type DnsRecord,
  type DnsRecordType,
} from '@devtools-hub/shared';
import { resolve } from 'node:dns/promises';
import { Router } from 'express';

import { assertPublicHostname, RestrictedAddressError } from '../lib/ssrf.js';
import { validateBody } from '../middleware/validate.js';

export const dnsRouter = Router();

const NO_RECORD_CODES = new Set(['ENODATA', 'ENOTFOUND', 'ENOTIMP', 'EAI_NONAME']);

function isNoRecordError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as NodeJS.ErrnoException).code;
  return typeof code === 'string' && NO_RECORD_CODES.has(code);
}

async function resolveRecords(hostname: string, type: DnsRecordType): Promise<DnsRecord[]> {
  switch (type) {
    case 'A': {
      const records = await resolve(hostname, 'A');
      return records.map((entry) => ({ type: 'A', entry }));
    }
    case 'AAAA': {
      const records = await resolve(hostname, 'AAAA');
      return records.map((entry) => ({ type: 'AAAA', entry }));
    }
    case 'MX': {
      const records = await resolve(hostname, 'MX');
      return records.map(({ exchange, priority }) => ({ type: 'MX', entry: exchange, priority }));
    }
    case 'TXT': {
      const records = await resolve(hostname, 'TXT');
      return records.map((chunks) => ({ type: 'TXT', entry: chunks.join(' ') }));
    }
    case 'NS': {
      const records = await resolve(hostname, 'NS');
      return records.map((entry) => ({ type: 'NS', entry }));
    }
  }
}

dnsRouter.post('/dns-lookup', validateBody(dnsLookupSchema), async (req, res) => {
  try {
    const { hostname, recordTypes } = req.body as DnsLookupRequest;

    await assertPublicHostname(hostname);

    const resolved: DnsRecord[] = [];
    for (const type of recordTypes) {
      try {
        resolved.push(...(await resolveRecords(hostname, type)));
      } catch (error) {
        if (!isNoRecordError(error)) throw error;
      }
    }

    const body: DnsLookupResponse = {
      hostname,
      records: resolved,
      timestamp: new Date().toISOString(),
    };

    res.json(body);
  } catch (error) {
    if (error instanceof RestrictedAddressError) {
      res.status(400).json({ error: { code: 'RESTRICTED_ADDRESS', message: error.message } });
      return;
    }
    const message = error instanceof Error ? error.message : undefined;
    res.status(502).json({
      error: { code: 'DNS_ERROR', message: 'Failed to resolve the hostname.', details: message },
    });
  }
});
