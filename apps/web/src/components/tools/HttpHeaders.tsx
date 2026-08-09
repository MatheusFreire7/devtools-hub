import type { HttpHeadersRequest } from '@devtools-hub/shared';
import { Globe, Loader2, Server } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { fetchHttpHeaders } from '@/lib/api/client';

function toRawHeaders(headers: Array<{ name: string; value: string }>): string {
  return headers.map(({ name, value }) => `${name}: ${value}`).join('\n');
}

export function HttpHeaders() {
  const [url, setUrl] = useState('https://example.com');

  const mutation = useMutation({
    mutationFn: (body: HttpHeadersRequest) => fetchHttpHeaders(body),
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = url.trim();
    if (trimmed === '') return;
    mutation.mutate({ url: trimmed });
  }

  const data = mutation.data;

  return (
    <div className="flex flex-col gap-4">
      <Banner variant="privacy">
        Only the URL and the response headers are sent to the DevTools Hub API. The response body is
        never inspected or stored.
      </Banner>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
        <Input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          aria-label="URL"
          mono
          className="grow basis-72"
          spellCheck={false}
        />
        <Button variant="primary" type="submit" disabled={url.trim() === '' || mutation.isPending}>
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          {mutation.isPending ? 'Inspecting…' : 'Inspect'}
        </Button>
      </form>

      {mutation.isPending ? (
        <div
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          aria-label="Fetching headers"
        >
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          <span className="text-sm text-slate-600 dark:text-slate-300">Fetching {url.trim()}…</span>
        </div>
      ) : null}

      {mutation.isError ? (
        <Banner variant="error">{mutation.error?.message ?? 'Failed to fetch the URL.'}</Banner>
      ) : null}

      {data ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                HTTP {data.status} {data.statusText}
              </span>
            </div>
            <p className="truncate font-mono text-xs text-slate-500 dark:text-slate-400">
              {data.url}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {data.headers.length} header{data.headers.length === 1 ? '' : 's'}
            </span>
            <CopyButton
              value={toRawHeaders(data.headers)}
              label="Copy raw"
              disabled={data.headers.length === 0}
            />
          </div>

          {data.headers.length === 0 ? (
            <Banner variant="info">The response contained no headers.</Banner>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Header
                    </th>
                    <th className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.headers.map(({ name, value }) => (
                    <tr key={`${name}:${value}`}>
                      <td className="whitespace-nowrap px-3.5 py-2 align-top font-mono text-xs text-slate-600 dark:text-slate-300">
                        {name}
                      </td>
                      <td className="px-3.5 py-2 font-mono text-xs text-slate-900 break-all dark:text-slate-100">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
