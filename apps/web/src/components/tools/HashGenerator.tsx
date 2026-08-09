import { Hash as HashIcon, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/Textarea';
import {
  HASH_ALGORITHMS,
  hashText,
  formatBytesLength,
  type HashAlgorithm,
} from '@/lib/utils/hashes';

export function HashGenerator() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('sha256');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isHashing, setIsHashing] = useState(false);

  async function handleGenerate() {
    if (input.trim() === '') return;
    setIsHashing(true);
    setError(undefined);
    try {
      const digest = await hashText(input, algorithm);
      setOutput(digest);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Failed to compute the hash.';
      setOutput('');
      setError(message);
    } finally {
      setIsHashing(false);
    }
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setError(undefined);
  }

  return (
    <div className="flex flex-col gap-4">
      <Banner variant="privacy">
        Hashing is computed locally with the Web Crypto API. Your text never leaves this browser.
      </Banner>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          Algorithm
          <select
            value={algorithm}
            onChange={(event) => setAlgorithm(event.target.value as HashAlgorithm)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {HASH_ALGORITHMS.map((name) => (
              <option key={name} value={name}>
                {name.toUpperCase()} ({formatBytesLength(name)} chars)
              </option>
            ))}
          </select>
        </label>

        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={input.trim() === '' || isHashing}
        >
          {isHashing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <HashIcon className="h-4 w-4" />
          )}
          {isHashing ? 'Hashing…' : 'Generate'}
        </Button>

        <Button variant="ghost" onClick={handleClear} disabled={input === '' && output === ''}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <Textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Type or paste text to hash locally…"
        aria-label="Input"
        spellCheck={false}
      />

      {error ? <Banner variant="error">{error}</Banner> : null}

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {algorithm.toUpperCase()} digest
        </span>
        <CopyButton value={output} label="Copy digest" disabled={output === ''} />
      </div>
      <Textarea
        value={output}
        readOnly
        aria-label="Hash output"
        className="bg-slate-50 dark:bg-slate-950/40"
        spellCheck={false}
        placeholder="Hash appears here as lowercase hex"
      />
    </div>
  );
}
