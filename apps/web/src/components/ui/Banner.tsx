import { AlertCircle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type BannerVariant = 'info' | 'success' | 'error' | 'privacy';

const variantStyles: Record<BannerVariant, { wrap: string; icon: ReactNode }> = {
  info: {
    wrap: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
    icon: <Info className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />,
  },
  success: {
    wrap: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
    icon: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />,
  },
  error: {
    wrap: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300',
    icon: <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />,
  },
  privacy: {
    wrap: 'border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300',
    icon: <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-500" />,
  },
};

interface BannerProps {
  variant?: BannerVariant;
  children: ReactNode;
  className?: string;
}

export function Banner({ variant = 'info', children, className }: BannerProps) {
  const { wrap, icon } = variantStyles[variant];
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm',
        wrap,
        className,
      )}
      role={variant === 'error' ? 'alert' : undefined}
    >
      {icon}
      <span className="min-w-0 grow">{children}</span>
    </div>
  );
}
