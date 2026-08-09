import { Clock3, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  parseTimestamp,
  toUnixMilliseconds,
  toUnixSeconds,
  type TimestampResult,
} from '@/lib/utils/timestamps';

export function TimestampConverter() {
  const [input, setInput] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [result, setResult] = useState<TimestampResult>({ ok: false, error: undefined });

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  function handleParse() {
    const parsed = parseTimestamp(input);
    setResult(parsed);
  }

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-label="Current timestamp"
        className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10"
      >
        <p className="flex items-center gap-2 text-sm font-medium text-indigo-800 dark:text-indigo-300">
          <Clock3 className="h-4 w-4" />
          Now
        </p>
        <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
              Seconds
            </dt>
            <dd className="font-mono text-lg text-indigo-900 dark:text-indigo-100">
              {toUnixSeconds(new Date(now))}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
              Milliseconds
            </dt>
            <dd className="font-mono text-lg text-indigo-900 dark:text-indigo-100">
              {toUnixMilliseconds(new Date(now))}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
              ISO 8601
            </dt>
            <dd className="font-mono text-lg text-indigo-900 dark:text-indigo-100">
              {new Date(now).toISOString()}
            </dd>
          </div>
        </dl>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <label className="grow basis-64">
          <span className="sr-only">Timestamp to convert</span>
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Paste a timestamp (seconds or milliseconds)…"
            aria-label="Timestamp input"
            className="font-mono"
          />
        </label>
        <Button variant="primary" onClick={handleParse} disabled={input.trim() === ''}>
          Convert
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setInput('');
            setResult({ ok: false });
          }}
          disabled={input === ''}
          aria-label="Clear"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {result.ok ? (
        <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Converted date
          </span>
          <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Unix seconds
              </dt>
              <dd className="font-mono text-sm text-slate-900 dark:text-slate-100">
                {result.seconds}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Unix milliseconds
              </dt>
              <dd className="font-mono text-sm text-slate-900 dark:text-slate-100">
                {result.milliseconds}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                ISO 8601
              </dt>
              <dd className="font-mono text-sm text-slate-900 dark:text-slate-100">{result.iso}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Local time
              </dt>
              <dd className="text-sm text-slate-900 dark:text-slate-100">{result.local}</dd>
            </div>
          </dl>
        </div>
      ) : null}
      {!result.ok && result.error ? <Banner variant="error">{result.error}</Banner> : null}
    </div>
  );
}
