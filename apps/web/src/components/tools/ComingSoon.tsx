import { Construction } from 'lucide-react';

import type { ToolMeta } from '@/config/tools';

import { cn } from '../../lib/cn';

interface ComingSoonProps {
  tool: ToolMeta;
  className?: string;
}

export function ComingSoon({ tool, className }: ComingSoonProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900',
        className,
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
        <tool.icon className="h-7 w-7" />
      </span>
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{tool.title}</h2>
        <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {tool.description}
        </p>
      </div>
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
        <Construction className="h-3.5 w-3.5" />
        Coming soon — Phase {tool.phase}
      </span>
    </div>
  );
}
