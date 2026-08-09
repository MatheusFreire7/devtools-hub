import { ArrowDownUp, FileUp, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/cn';
import { fromBase64, toBase64 } from '@/lib/utils/base64';

type Mode = 'encode' | 'decode';

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ ok: boolean; value: string; error?: string }>({
    ok: true,
    value: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateOutput(source: string, nextMode: Mode): void {
    if (source.trim() === '') {
      setOutput({ ok: true, value: '' });
      return;
    }
    const result = nextMode === 'encode' ? toBase64(source) : fromBase64(source);
    if (result.ok) {
      setOutput({ ok: true, value: result.value ?? '' });
    } else {
      setOutput({ ok: false, value: '', error: result.error });
    }
  }

  function handleToggleMode() {
    const nextMode: Mode = mode === 'encode' ? 'decode' : 'encode';
    const nextInput = output.ok && output.value !== '' ? output.value : input;
    setMode(nextMode);
    setInput(nextInput);
    updateOutput(nextInput, nextMode);
  }

  function handleFileUpload(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      setInput(text);
      updateOutput(text, mode);
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('encode');
              updateOutput(input, 'encode');
            }}
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
            onClick={() => {
              setMode('decode');
              updateOutput(input, 'decode');
            }}
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

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleToggleMode} aria-label="Swap encode and decode">
            <ArrowDownUp className="h-4 w-4" />
            Swap
          </Button>
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload a text file"
          >
            <FileUp className="h-4 w-4" />
            Upload file
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.json,.csv,.log,.md,.html,text/plain,application/json"
            className="hidden"
            onChange={(event) => handleFileUpload(event.target.files?.[0])}
          />
          <Button
            variant="ghost"
            onClick={() => {
              setInput('');
              setOutput({ ok: true, value: '' });
            }}
            disabled={input === '' && output.value === ''}
            aria-label="Clear"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <Textarea
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          updateOutput(event.target.value, mode);
        }}
        placeholder={
          mode === 'encode'
            ? 'Type or paste text to encode into Base64…'
            : 'Type or paste Base64 to decode…'
        }
        aria-label="Input"
        spellCheck={false}
      />
      <CopyButton
        value={output.value}
        label="Copy result"
        className="self-end"
        disabled={output.value === ''}
      />
      <Textarea
        value={output.ok ? output.value : ''}
        readOnly
        aria-label="Output"
        className="bg-slate-50 dark:bg-slate-950/40"
        spellCheck={false}
        placeholder="Result appears here"
      />
      {!output.ok ? <Banner variant="error">{output.error}</Banner> : null}
    </div>
  );
}
