import { Link } from 'react-router';

import { ToolCanvas } from '../components/layout/ToolCanvas';

export function NotFoundPage() {
  return (
    <ToolCanvas>
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-6xl font-bold text-slate-300 dark:text-slate-700">404</p>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Page not found</h1>
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Back to home
        </Link>
      </div>
    </ToolCanvas>
  );
}
