import { ArrowLeftRight, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/cn';
import { decodeUrl, encodeUrl, type UrlEncodingMode } from '@/lib/utils/url';

type Mode = 'encode' | 'decode';

export function UrlEncoder() {
  const [mode, setMode] = useState<Mode>('encode');
  const [type, setType] = useState<UrlEncodingMode>('component');
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const decoded = mode === 'decode' && input.trim() !== '' ? decodeUrl(input, type) : undefined;
  const result =
    mode === 'encode'
      ? (encodeUrl(input, type).value ?? '')
      : decoded?.ok
        ? (decoded.value ?? '')
        : '';

  function handleChange(next: string) {
    setInput(next);
    if (mode === 'decode') {
      const res = decodeUrl(next, type);
      setError(res.ok ? undefined : res.error);
    } else {
      setError(undefined);
    }
  }

  function handleMode(next: Mode) {
    setMode(next);
    setError(undefined);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => handleMode('encode')}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                mode === 'encode'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
              )}
            >
              Encode
            </button>
            <button
              type="button"
              onClick={() => handleMode('decode')}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                mode === 'decode'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
              )}
            >
              Decode
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            Type
            <select
              value={type}
              onChange={(event) => setType(event.target.value as UrlEncodingMode)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              aria-label="URL encoding type"
            >
              <option value="component">Component (encodeURIComponent)</option>
              <option value="uri">Full URI (encodeURI)</option>
            </select>
          </label>
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            setInput('');
            setError(undefined);
          }}
          disabled={input === ''}
          aria-label="Clear"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Textarea
          value={input}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={
            mode === 'encode'
              ? 'Paste text with special characters to encode…'
              : 'Paste a percent-encoded URL to decode…'
          }
          aria-label={mode === 'encode' ? 'Text to encode' : 'URL to decode'}
          spellCheck={false}
        />
        <Button
          variant="ghost"
          onClick={() => {
            const nextMode = mode === 'encode' ? 'decode' : 'encode';
            const nextInput = result !== '' ? result : input;
            setMode(nextMode);
            setInput(nextInput);
            setError(undefined);
          }}
          disabled={input === ''}
          aria-label="Swap encode and decode"
        >
          <ArrowLeftRight className="h-4 w-4" />
          Swap
        </Button>
      </div>

      <CopyButton
        value={result}
        label="Copy result"
        className="self-end"
        disabled={result === ''}
      />
      <Textarea
        value={result}
        readOnly
        aria-label="Output"
        className="bg-slate-50 dark:bg-slate-950/40"
        spellCheck={false}
        placeholder="Result appears here"
      />
      {!error ? null : <Banner variant="error">{error}</Banner>}
    </div>
  );
}
