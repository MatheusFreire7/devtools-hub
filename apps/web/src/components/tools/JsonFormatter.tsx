import { FileDown, Trash2, WandSparkles } from 'lucide-react';
import { useState } from 'react';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/Textarea';
import { formatJson, minifyJson } from '@/lib/utils/json';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [indentSize, setIndentSize] = useState<2 | 4>(2);
  const [output, setOutput] = useState<{ ok: boolean; value: string; error?: string }>({
    ok: true,
    value: '',
  });

  function apply(result: { ok: boolean; value?: string; error?: string }): void {
    setOutput(
      result.ok
        ? { ok: true, value: result.value ?? '' }
        : { ok: false, value: '', error: result.error },
    );
  }

  function handleFormat() {
    apply(formatJson(input, indentSize));
  }

  function handleMinify() {
    apply(minifyJson(input));
  }

  function handleClear() {
    setInput('');
    setOutput({ ok: true, value: '' });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            Indent
            <select
              value={indentSize}
              onChange={(event) => setIndentSize(Number(event.target.value) === 4 ? 4 : 2)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </label>
          <Button variant="primary" onClick={handleFormat} disabled={input.trim() === ''}>
            <WandSparkles className="h-4 w-4" />
            Format
          </Button>
          <Button variant="secondary" onClick={handleMinify} disabled={input.trim() === ''}>
            <FileDown className="h-4 w-4" />
            Minify
          </Button>
        </div>
        <Button
          variant="ghost"
          onClick={handleClear}
          disabled={input === '' && output.value === ''}
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <Textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder='Paste JSON here, e.g. {"hello":"world"}'
        aria-label="JSON input"
        spellCheck={false}
      />

      {output.ok && output.value ? (
        <Banner variant="success">Valid JSON — formatting applied below.</Banner>
      ) : null}
      {!output.ok ? <Banner variant="error">{output.error}</Banner> : null}

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Output</span>
        <CopyButton value={output.ok && output.value ? output.value : ''} label="Copy output" />
      </div>
      <Textarea
        value={output.ok && output.value ? output.value : (output.error ?? '')}
        readOnly
        aria-label="JSON output"
        className="bg-slate-50 dark:bg-slate-950/40"
        spellCheck={false}
      />
    </div>
  );
}
