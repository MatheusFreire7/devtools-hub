import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';
import { copyToClipboard } from '@/lib/utils/clipboard';

import { Button, type ButtonVariant } from './Button';

interface CopyButtonProps {
  value: string;
  label?: string;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

export function CopyButton({
  value,
  label = 'Copy',
  variant = 'secondary',
  className,
  disabled,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      if (timeoutRef.current !== undefined) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      className={cn('shrink-0', className)}
      onClick={handleCopy}
      disabled={disabled || value === ''}
      aria-label={`${label} to clipboard`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : label}
    </Button>
  );
}
