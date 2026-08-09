import {
  httpHeadersSchema,
  type HttpHeader,
  type HttpHeadersRequest,
  type HttpHeadersResponse,
} from '@devtools-hub/shared';
import { Router } from 'express';

import { assertPublicHostname, hostnameOfUrl, RestrictedAddressError } from '../lib/ssrf.js';
import { validateBody } from '../middleware/validate.js';

export const httpHeadersRouter = Router();

const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 10_000;

interface SafeFetchResult {
  response: Response;
  url: string;
}

async function fetchWithSafeRedirects(url: string): Promise<SafeFetchResult> {
  let current = url;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const hostname = hostnameOfUrl(current);
    if (!hostname) {
      throw new RestrictedAddressError(`Refusing to fetch a non-HTTP(S) URL: ${current}`);
    }
    await assertPublicHostname(hostname);

    const response = await fetch(current, {
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) return { response, url: current };
      current = new URL(location, current).toString();
      continue;
    }

    return { response, url: current };
  }

  throw new Error('Too many redirects.');
}

httpHeadersRouter.post('/http-headers', validateBody(httpHeadersSchema), async (req, res) => {
  try {
    const { url } = req.body as HttpHeadersRequest;

    const { response, url: finalUrl } = await fetchWithSafeRedirects(url);

    const headers: HttpHeader[] = [...response.headers.entries()].map(([name, value]) => ({
      name,
      value,
    }));

    const body: HttpHeadersResponse = {
      url: finalUrl,
      status: response.status,
      statusText: response.statusText,
      headers,
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
      error: { code: 'HTTP_REQUEST_ERROR', message: 'Failed to fetch the URL.', details: message },
    });
  }
});
