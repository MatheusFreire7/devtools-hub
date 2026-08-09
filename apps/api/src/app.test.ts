import type { LookupAddress } from 'node:dns';
import { lookup, resolve } from 'node:dns/promises';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { app } from './app.js';

function mockLookup(addresses: Array<{ address: string; family: 4 | 6 }>): void {
  vi.mocked(lookup).mockResolvedValue(addresses as unknown as LookupAddress);
}

vi.mock('node:dns/promises', () => ({
  lookup: vi.fn(async () => [{ address: '93.184.216.34', family: 4 }]),
  resolve: vi.fn(async (_hostname: string, rrtype: string) => {
    switch (rrtype) {
      case 'A':
        return ['93.184.216.34'];
      case 'AAAA':
        return ['2606:2800:220:1:248:1893:25c8:1946'];
      case 'MX':
        return [{ exchange: 'mx.example.com', priority: 10 }];
      case 'TXT':
        return [['v=spf1 -all']];
      case 'NS':
        return ['ns1.example.com'];
      default:
        return [];
    }
  }),
}));

const fetchMock = vi.fn();

describe('GET /api/v1/ping', () => {
  it('returns service health with latency and uptime', async () => {
    const response = await request(app).get('/api/v1/ping');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(typeof response.body.latencyMs).toBe('number');
    expect(typeof response.body.uptimeSeconds).toBe('number');
    expect(typeof response.body.timestamp).toBe('string');
  });
});

describe('POST /api/v1/dns-lookup', () => {
  beforeEach(() => {
    mockLookup([{ address: '93.184.216.34', family: 4 }]);
  });

  it('resolves every requested record type', async () => {
    const response = await request(app)
      .post('/api/v1/dns-lookup')
      .send({ hostname: 'example.com', recordTypes: ['A', 'AAAA', 'MX', 'TXT', 'NS'] });

    expect(response.status).toBe(200);
    expect(response.body.hostname).toBe('example.com');
    expect(response.body.records).toHaveLength(5);
    expect(response.body.records).toContainEqual({ type: 'A', entry: '93.184.216.34' });
    expect(response.body.records).toContainEqual({
      type: 'MX',
      entry: 'mx.example.com',
      priority: 10,
    });
  });

  it('skips record types with no data instead of failing', async () => {
    vi.mocked(resolve).mockImplementationOnce(async () => {
      const error = new Error('no such record') as Error & { code?: string };
      error.code = 'ENODATA';
      throw error;
    });

    const response = await request(app)
      .post('/api/v1/dns-lookup')
      .send({ hostname: 'example.com', recordTypes: ['A'] });

    expect(response.status).toBe(200);
    expect(response.body.records).toHaveLength(0);
  });

  it('rejects an empty recordTypes list', async () => {
    const response = await request(app)
      .post('/api/v1/dns-lookup')
      .send({ hostname: 'example.com', recordTypes: [] });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a malformed hostname', async () => {
    const response = await request(app)
      .post('/api/v1/dns-lookup')
      .send({ hostname: 'x', recordTypes: ['A'] });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('blocks hostnames that resolve to private addresses', async () => {
    mockLookup([{ address: '127.0.0.1', family: 4 }]);

    const response = await request(app)
      .post('/api/v1/dns-lookup')
      .send({ hostname: 'localhost', recordTypes: ['A'] });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('RESTRICTED_ADDRESS');
  });
});

describe('POST /api/v1/http-headers', () => {
  beforeEach(() => {
    mockLookup([{ address: '93.184.216.34', family: 4 }]);
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response('', { status: 200, headers: { 'x-example': 'yes' } }));
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the response headers of a public URL', async () => {
    const response = await request(app)
      .post('/api/v1/http-headers')
      .send({ url: 'https://example.com' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(response.body.headers).toEqual(
      expect.arrayContaining([{ name: 'x-example', value: 'yes' }]),
    );
  });

  it('follows redirects while re-validating each hop', async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response('', {
          status: 302,
          headers: { location: 'https://example.com/final' },
        }),
      )
      .mockResolvedValueOnce(new Response('', { status: 200, headers: { 'x-final': 'true' } }));

    const response = await request(app)
      .post('/api/v1/http-headers')
      .send({ url: 'https://example.com/start' });

    expect(response.status).toBe(200);
    expect(response.body.url).toBe('https://example.com/final');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(response.body.headers).toEqual(
      expect.arrayContaining([{ name: 'x-final', value: 'true' }]),
    );
  });

  it('rejects non-HTTP(S) URLs', async () => {
    const response = await request(app)
      .post('/api/v1/http-headers')
      .send({ url: 'ftp://example.com/file' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects URL credentials', async () => {
    const response = await request(app)
      .post('/api/v1/http-headers')
      .send({ url: 'https://user:pass@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('blocks URLs that resolve to private addresses', async () => {
    mockLookup([{ address: '10.0.0.1', family: 4 }]);

    const response = await request(app)
      .post('/api/v1/http-headers')
      .send({ url: 'http://internal.example' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('RESTRICTED_ADDRESS');
  });

  it('rejects an unparseable URL', async () => {
    const response = await request(app).post('/api/v1/http-headers').send({ url: 'not a url' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('unknown /api/v1 route', () => {
  it('returns a structured 404', async () => {
    const response = await request(app).post('/api/v1/nope');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
