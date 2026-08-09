import type { DnsLookupRequest, DnsRecord, DnsRecordType } from '@devtools-hub/shared';
import { Globe, Loader2, Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/cn';
import { dnsLookup } from '@/lib/api/client';

const RECORD_TYPES: DnsRecordType[] = ['A', 'AAAA', 'MX', 'TXT', 'NS'];

function groupRecords(records: DnsRecord[]): Record<DnsRecordType, DnsRecord[]> {
  const empty: Record<DnsRecordType, DnsRecord[]> = { A: [], AAAA: [], MX: [], TXT: [], NS: [] };
  return records.reduce((groups, record) => {
    groups[record.type].push(record);
    return groups;
  }, empty);
}

export function DnsLookup() {
  const [hostname, setHostname] = useState('');
  const [recordTypes, setRecordTypes] = useState<DnsRecordType[]>(RECORD_TYPES);

  const mutation = useMutation({
    mutationFn: (body: DnsLookupRequest) => dnsLookup(body),
  });

  const canSubmit = hostname.trim() !== '' && recordTypes.length > 0;

  function toggleRecordType(type: DnsRecordType) {
    setRecordTypes((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = hostname.trim();
    if (trimmed === '' || recordTypes.length === 0) return;
    mutation.mutate({ hostname: trimmed, recordTypes });
  }

  const data = mutation.data;

  return (
    <div className="flex flex-col gap-4">
      <Banner variant="privacy">
        DNS records are resolved by the DevTools Hub API over a secure connection. Hostnames that
        resolve to private or reserved addresses are blocked.
      </Banner>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={hostname}
            onChange={(event) => setHostname(event.target.value)}
            placeholder="e.g. example.com"
            aria-label="Hostname"
            mono
            className="grow basis-64"
          />
          <Button variant="primary" type="submit" disabled={!canSubmit || mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {mutation.isPending ? 'Resolving…' : 'Lookup'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Record types">
          {RECORD_TYPES.map((type) => {
            const active = recordTypes.includes(type);
            return (
              <label
                key={type}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors',
                  active
                    ? 'border-indigo-300 bg-indigo-50 font-medium text-indigo-700 dark:border-indigo-500/50 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600',
                )}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleRecordType(type)}
                  className="size-3.5 accent-indigo-600"
                />
                {type}
              </label>
            );
          })}
        </div>
      </form>

      {mutation.isPending ? (
        <div
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          aria-label="Resolving DNS"
        >
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Resolving {hostname.trim()}…
          </span>
        </div>
      ) : null}

      {mutation.isError ? (
        <Banner variant="error">
          {mutation.error?.message ?? 'Failed to resolve the hostname.'}
        </Banner>
      ) : null}

      {data ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Globe className="h-4 w-4 text-slate-400" />
            Results for <span className="font-mono">{data.hostname}</span>
          </div>

          {data.records.length === 0 ? (
            <Banner variant="info">
              No DNS records of the requested types were found for {data.hostname}.
            </Banner>
          ) : null}

          {recordTypes.map((type) => {
            const entries = groupRecords(data.records)[type];
            return (
              <section key={type} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {type} records
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {entries.length}
                  </span>
                </div>
                {entries.length === 0 ? (
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    No {type} records found.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                    {entries.map((record, index) => (
                      <li
                        key={`${type}-${index}`}
                        className="flex items-center justify-between gap-3 px-3.5 py-2.5"
                      >
                        <span className="truncate font-mono text-sm text-slate-800 dark:text-slate-200">
                          {record.entry}
                          {record.priority !== undefined ? (
                            <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">
                              priority {record.priority}
                            </span>
                          ) : null}
                        </span>
                        <CopyButton value={record.entry} label="Copy" />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
