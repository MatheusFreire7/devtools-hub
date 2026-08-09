/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router';

import { AppShell } from '@/components/layout/AppShell';

const HomePage = lazy(() =>
  import('./pages/HomePage').then((module) => ({ default: module.HomePage })),
);

const ToolPage = lazy(() =>
  import('./pages/ToolPage').then((module) => ({ default: module.ToolPage })),
);

const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);

function withSuspense(node: ReactNode): ReactNode {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-24" aria-label="Loading page">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
        </div>
      }
    >
      {node}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: withSuspense(<HomePage />) },
      { path: '/tools/:toolSlug', element: withSuspense(<ToolPage />) },
      { path: '/404', element: withSuspense(<NotFoundPage />) },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
]);
