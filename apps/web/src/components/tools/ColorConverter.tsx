import { Paintbrush, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { formatHsl, formatRgb, parseColor, rgbToHex, hslToRgb } from '@/lib/utils/color';

export function ColorConverter() {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');
  const [hsl, setHsl] = useState('hsl(239, 84%, 67%)');
  const [error, setError] = useState<string | undefined>(undefined);

  const parsed = useMemo(() => parseColor(hex), [hex]);
  const pickerValue = parsed.ok ? parsed.hex : '#000000';
  const preview = parsed.ok ? rgbToHex(parsed.rgb.r, parsed.rgb.g, parsed.rgb.b) : '#000000';

  function applyParsed(
    result: ReturnType<typeof parseColor>,
    source: { hex?: string; rgb?: string; hsl?: string } = {},
  ) {
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(undefined);
    if (source.hex !== undefined) setHex(source.hex);
    else setHex(result.hex);
    if (source.rgb !== undefined) setRgb(source.rgb);
    else setRgb(formatRgb(result.rgb));
    if (source.hsl !== undefined) setHsl(source.hsl);
    else setHsl(formatHsl(result.hsl));
  }

  function handlePickerChange(value: string) {
    setHex(value);
    const result = parseColor(value);
    applyParsed(result, { hex: value });
  }

  function handleHex(value: string) {
    setHex(value);
    applyParsed(parseColor(value), { hex: value });
  }

  function handleRgb(value: string) {
    setRgb(value);
    applyParsed(parseColor(value), { rgb: value });
  }

  function handleHsl(value: string) {
    setHsl(value);
    applyParsed(parseColor(value), { hsl: value });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <label
          className="flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-slate-200 shadow-inner dark:border-slate-700"
          style={{ backgroundColor: preview }}
        >
          <input
            type="color"
            value={pickerValue}
            onChange={(event) => handlePickerChange(event.target.value)}
            aria-label="Color picker"
            className="opacity-0"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            HEX
            <Input
              value={hex}
              onChange={(event) => handleHex(event.target.value)}
              aria-label="HEX value"
              className="w-36 font-mono"
              spellCheck={false}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            RGB
            <Input
              value={rgb}
              onChange={(event) => handleRgb(event.target.value)}
              aria-label="RGB value"
              className="w-48 font-mono"
              spellCheck={false}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            HSL
            <Input
              value={hsl}
              onChange={(event) => handleHsl(event.target.value)}
              aria-label="HSL value"
              className="w-48 font-mono"
              spellCheck={false}
            />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const random = hslToRgb(Math.floor(Math.random() * 360), 84, 65);
              const nextHex = rgbToHex(random.r, random.g, random.b);
              handleHex(nextHex);
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Random
          </Button>
          <CopyButton value={preview} label="Copy HEX" variant="secondary" className="w-full" />
        </div>
      </div>

      {error ? <Banner variant="error">{error}</Banner> : null}

      {parsed.ok ? (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span
            className="h-10 w-10 shrink-0 rounded-md border border-slate-200 dark:border-slate-700"
            style={{ backgroundColor: preview }}
            aria-hidden="true"
          />
          <dl className="flex flex-wrap gap-x-8 gap-y-1">
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                HEX
              </dt>
              <dd className="font-mono text-sm text-slate-900 dark:text-slate-100">{preview}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                RGB
              </dt>
              <dd className="font-mono text-sm text-slate-900 dark:text-slate-100">
                {formatRgb(parsed.rgb)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                HSL
              </dt>
              <dd className="font-mono text-sm text-slate-900 dark:text-slate-100">
                {formatHsl(parsed.hsl)}
              </dd>
            </div>
            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
              <Paintbrush className="h-4 w-4" />
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
