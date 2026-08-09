import { KeyRound, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/Textarea';
import { decodeJwt, formatTimestamp, jwtExpiresAt, type DecodedJwt } from '@/lib/utils/jwt';

export function JwtDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<DecodedJwt | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  function handleDecode() {
    const result = decodeJwt(input);
    if (result.ok) {
      setDecoded(result.token);
      setError(undefined);
    } else {
      setDecoded(undefined);
      setError(result.error);
    }
  }

  function renderJson(record: Record<string, unknown>, label: string, testId: string) {
    return (
      <section aria-label={label}>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</h2>
          <CopyButton value={JSON.stringify(record, null, 2)} label="Copy" />
        </div>
        <Textarea
          value={JSON.stringify(record, null, 2)}
          readOnly
          aria-label={`${label} JSON`}
          data-testid={testId}
          className="bg-slate-50 dark:bg-slate-950/40"
          spellCheck={false}
        />
      </section>
    );
  }

  const now = Date.now();
  const exp = decoded?.payload.exp;
  const expSeconds = typeof exp === 'number' ? exp : undefined;
  const iat = decoded?.payload.iat;

  return (
    <div className="flex flex-col gap-4">
      <Banner variant="privacy">
        Your token is decoded entirely in your browser. The payload is never sent anywhere.
      </Banner>

      <div className="flex items-center justify-between gap-3">
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste a JWT (eyJhbGciOi…)…"
          aria-label="JWT input"
          className="grow"
          spellCheck={false}
        />
        <Button
          variant="ghost"
          onClick={() => {
            setInput('');
            setDecoded(undefined);
            setError(undefined);
          }}
          disabled={input === ''}
          aria-label="Clear"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <Button
        variant="primary"
        onClick={handleDecode}
        disabled={input.trim() === ''}
        className="self-start"
      >
        <KeyRound className="h-4 w-4" />
        Decode
      </Button>

      {error ? <Banner variant="error">{error}</Banner> : null}

      {decoded ? (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {renderJson(decoded.header, 'Header', 'jwt-header')}
            {renderJson(decoded.payload, 'Payload', 'jwt-payload')}
          </div>

          <section aria-label="Signature">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Signature
              </h2>
              <CopyButton value={decoded.signature} label="Copy" variant="ghost" />
            </div>
            <Textarea
              value={decoded.signature}
              readOnly
              aria-label="Signature"
              className="bg-slate-50 dark:bg-slate-950/40"
              spellCheck={false}
            />
          </section>

          {expSeconds !== undefined ? (
            <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <dl className="flex flex-wrap items-center gap-x-8 gap-y-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Expires at
                  </dt>
                  <dd className="mt-0.5 text-sm text-slate-900 dark:text-slate-100">
                    {formatTimestamp(expSeconds)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Status
                  </dt>
                  <dd className="mt-0.5 text-sm text-slate-900 dark:text-slate-100">
                    {jwtExpiresAt(expSeconds, now)}
                  </dd>
                </div>
                {typeof iat === 'number' ? (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Issued at
                    </dt>
                    <dd className="mt-0.5 text-sm text-slate-900 dark:text-slate-100">
                      {formatTimestamp(iat)}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
