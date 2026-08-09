import { HeartPulse, Loader2, RefreshCw } from 'lucide-react';
import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { fetchPing } from '@/lib/api/client';
import { formatUptime } from '@/lib/utils/time';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 font-mono text-lg text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

export function Ping() {
  const startedAt = useRef(0);
  const [clientLatencyMs, setClientLatencyMs] = useState<number | undefined>(undefined);

  const { data, isPending, isError, isFetching, error, refetch } = useQuery({
    queryKey: ['ping'],
    queryFn: async () => {
      const result = await fetchPing();
      const measured =
        startedAt.current > 0
          ? Math.max(0, Math.round(performance.now() - startedAt.current))
          : undefined;
      setClientLatencyMs(measured);
      return result;
    },
  });

  function handlePing() {
    startedAt.current = performance.now();
    setClientLatencyMs(undefined);
    void refetch();
  }

  const lastChecked = data ? new Date(data.timestamp).toLocaleTimeString() : undefined;

  return (
    <div className="flex flex-col gap-4">
      <Banner variant="privacy">
        Ping sends a lightweight request to the DevTools Hub API on your network and never sends
        your own data.
      </Banner>

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={handlePing} disabled={isFetching}>
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isFetching ? 'Pinging…' : 'Ping again'}
        </Button>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {data ? `Last checked ${lastChecked}` : 'Pings automatically on load'}
        </span>
      </div>

      {isPending ? (
        <div
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          aria-label="Pinging API"
        >
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          <span className="text-sm text-slate-600 dark:text-slate-300">Contacting the API…</span>
        </div>
      ) : null}

      {isError ? (
        <Banner variant="error">{error?.message ?? 'The API is unreachable.'}</Banner>
      ) : null}

      {data ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Status" value="ok" />
            <Stat label="API latency" value={`${data.latencyMs} ms`} />
            <Stat
              label="Round trip"
              value={clientLatencyMs === undefined ? '—' : `${clientLatencyMs} ms`}
            />
            <Stat label="Uptime" value={formatUptime(data.uptimeSeconds)} />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <HeartPulse className="h-4 w-4 text-emerald-500" />
            Service healthy at{' '}
            <code className="font-mono">{new Date(data.timestamp).toISOString()}</code>
          </div>
        </div>
      ) : null}
    </div>
  );
}
