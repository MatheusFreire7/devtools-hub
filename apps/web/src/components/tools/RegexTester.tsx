import { Braces } from 'lucide-react';
import { useState } from 'react';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/cn';
import {
  SUPPORTED_FLAGS,
  buildHighlightSegments,
  testRegex,
  type RegexTestResult,
} from '@/lib/utils/regex';

const FLAG_LABELS: Record<string, string> = {
  g: 'g',
  i: 'i',
  m: 'm',
  u: 'u',
};

export function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<RegexTestResult>({ ok: true, matches: [], count: 0 });

  function handleRun() {
    setResult(testRegex(pattern, flags, input));
  }

  function toggleFlag(flag: string) {
    setFlags((current) => {
      const has = current.includes(flag);
      const next = has ? current.replace(flag, '') : current + flag;
      // Keep the global flag when highlighting matches.
      return next.includes('g') ? next : `g${next}`;
    });
  }

  const segments = result.ok && input !== '' ? buildHighlightSegments(input, result.matches) : [];

  return (
    <div className="flex flex-col gap-4">
      <Banner variant="privacy">
        Regular expressions are evaluated locally in your browser. Nothing is sent to a server.
      </Banner>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Braces className="h-4 w-4" />
          Pattern
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            placeholder="e.g. (\w+)@(\w+)\.com"
            aria-label="Regex pattern"
            className="grow basis-64 font-mono"
          />
          <div
            className="flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800"
            role="group"
            aria-label="Regex flags"
          >
            {SUPPORTED_FLAGS.map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => toggleFlag(flag)}
                aria-pressed={flags.includes(flag)}
                title={
                  flag === 'u'
                    ? 'Unicode'
                    : flag === 'i'
                      ? 'Case insensitive'
                      : flag === 'm'
                        ? 'Multiline'
                        : 'Global'
                }
                className={cn(
                  'rounded-md px-2.5 py-1 font-mono text-sm transition-colors',
                  flags.includes(flag)
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300',
                )}
              >
                {FLAG_LABELS[flag]}
              </button>
            ))}
          </div>
          <Button variant="primary" onClick={handleRun}>
            Test
          </Button>
        </div>
      </div>

      <Textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Type or paste the text to test against the pattern…"
        aria-label="Test input"
        className="font-mono"
        spellCheck={false}
      />

      {!result.ok ? <Banner variant="error">{result.error}</Banner> : null}

      {result.ok && pattern.trim() !== '' && input !== '' ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {result.count === 1 ? '1 match' : `${result.count} matches`}
            </span>
          </div>
          <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm leading-6 text-slate-800 whitespace-pre-wrap dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            {segments.map((segment, index) =>
              segment.matched ? (
                <mark
                  key={`${index}-${segment.text}`}
                  className="rounded bg-amber-200/70 px-0.5 text-slate-900 dark:bg-amber-400/30 dark:text-amber-100"
                >
                  {segment.text}
                </mark>
              ) : (
                <span key={`${index}-${segment.text}`}>{segment.text}</span>
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
