import type { TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  mono?: boolean;
}

export function Textarea({ mono = true, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm',
        'text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2',
        'focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60',
        'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
        mono && 'font-mono',
        className,
      )}
      {...props}
    />
  );
}
