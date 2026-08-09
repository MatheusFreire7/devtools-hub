import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

import { CATEGORIES, getToolsByCategory } from '@/config/tools';
import { cn } from '@/lib/cn';

import { ToolCanvas } from '../components/layout/ToolCanvas';

export function HomePage() {
  return (
    <ToolCanvas>
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
          Essential tools for developers
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
          Format, convert, validate and inspect — all running locally in your browser. Your data
          never leaves your machine.
        </p>
      </section>

      <div className="flex flex-col gap-8">
        {CATEGORIES.map((category) => {
          const tools = getToolsByCategory(category.id);
          if (tools.length === 0) return null;
          return (
            <section key={category.id} aria-label={category.title}>
              <div className="mb-3 flex items-center gap-2">
                <category.icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {category.title}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    to={`/tools/${tool.slug}`}
                    className={cn(
                      'group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors',
                      'hover:border-indigo-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50',
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400">
                      <tool.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1 font-medium text-slate-900 dark:text-slate-100">
                        <span className="truncate">{tool.title}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" />
                      </span>
                      <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">
                        {tool.description}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </ToolCanvas>
  );
}
