import { FileDown, Trash2, WandSparkles } from 'lucide-react';
import { useState } from 'react';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/Textarea';
import { jsonToCsv } from '@/lib/utils/jsonToCsv';

export function JsonToCsv() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ ok: boolean; value: string; error?: string }>({
    ok: true,
    value: '',
  });

  function handleConvert() {
    const result = jsonToCsv(input);
    if (result.ok) {
      setOutput({ ok: true, value: result.value });
    } else {
      setOutput({ ok: false, value: '', error: result.error });
    }
  }

  function handleDownload() {
    const blob = new Blob([output.value], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'converted.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    setInput('');
    setOutput({ ok: true, value: '' });
  }

  return (
    <div className="flex flex-col gap-4">
      <Banner variant="privacy">
        Conversion happens entirely in your browser. Your JSON is never uploaded anywhere.
      </Banner>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder='Paste an array of objects, e.g. [{"name":"Ada","skills":["math"]}]'
          aria-label="JSON input"
          spellCheck={false}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" onClick={handleConvert} disabled={input.trim() === ''}>
            <WandSparkles className="h-4 w-4" />
            Convert
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownload}
            disabled={!output.ok || output.value === ''}
          >
            <FileDown className="h-4 w-4" />
            Download .csv
          </Button>
          <CopyButton value={output.ok ? output.value : ''} label="Copy CSV" />
          <Button
            variant="ghost"
            onClick={handleClear}
            disabled={input === '' && output.value === ''}
            aria-label="Clear"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {!output.ok ? <Banner variant="error">{output.error}</Banner> : null}

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">CSV output</span>
      </div>
      <Textarea
        value={output.ok ? output.value : ''}
        readOnly
        aria-label="CSV output"
        className="bg-slate-50 dark:bg-slate-950/40"
        spellCheck={false}
        placeholder="Converted CSV appears here"
      />
    </div>
  );
}
