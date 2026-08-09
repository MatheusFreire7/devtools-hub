import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { generateUuids } from '@/lib/utils/uuid';

export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState(() => generateUuids(count, uppercase));

  function regenerate() {
    setUuids(generateUuids(count, uppercase));
  }

  function handleCount(raw: string) {
    const next = Number(raw);
    const value = Number.isNaN(next) ? 1 : next;
    setCount(value);
    setUuids(generateUuids(value, uppercase));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          Quantity
          <Input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) => handleCount(event.target.value)}
            className="w-24"
            aria-label="Number of UUIDs"
          />
        </label>

        <button
          type="button"
          onClick={() => {
            const next = !uppercase;
            setUppercase(next);
            setUuids(generateUuids(count, next));
          }}
          className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          role="switch"
          aria-checked={uppercase}
          aria-label="Toggle uppercase UUIDs"
        >
          <span
            className={
              uppercase
                ? 'flex w-7 items-center rounded-full bg-indigo-600 p-0.5 transition-colors'
                : 'flex w-7 items-center rounded-full bg-slate-300 p-0.5 transition-colors dark:bg-slate-600'
            }
          >
            <span
              className={
                uppercase
                  ? 'ml-auto block h-4 w-4 rounded-full bg-white'
                  : 'block h-4 w-4 rounded-full bg-white'
              }
            />
          </span>
          Uppercase
        </button>

        <Button variant="primary" onClick={regenerate}>
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </Button>

        <CopyButton
          value={uuids.join('\n')}
          label="Copy all"
          variant="secondary"
          className="ml-auto"
          disabled={uuids.length === 0}
        />
      </div>

      <div className="flex flex-col gap-2">
        {uuids.map((uuid) => (
          <div
            key={uuid}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
          >
            <code className="break-all font-mono text-sm text-slate-800 dark:text-slate-200">
              {uuid}
            </code>
            <CopyButton value={uuid} label="Copy" variant="ghost" className="ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
