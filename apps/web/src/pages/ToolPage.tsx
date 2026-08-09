import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router';

import { ComingSoon } from '@/components/tools/ComingSoon';
import { getToolBySlug } from '@/config/tools';

import { ToolCanvas } from '../components/layout/ToolCanvas';

export function ToolPage() {
  const { toolSlug } = useParams<'toolSlug'>();
  const tool = toolSlug ? getToolBySlug(toolSlug) : undefined;

  if (!tool) {
    return <Navigate to="/404" replace />;
  }

  return (
    <ToolCanvas>
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        All tools
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tool.icon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{tool.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{tool.description}</p>
        </div>
      </div>

      {tool.status === 'coming-soon' ? <ComingSoon tool={tool} /> : null}
    </ToolCanvas>
  );
}
