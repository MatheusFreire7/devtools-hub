import { useState } from 'react';
import { Outlet } from 'react-router';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppShell() {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-col">
      <Header onOpenNavigation={() => setNavigationOpen(true)} />
      <div className="flex min-h-0 flex-1">
        {navigationOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
            onClick={() => setNavigationOpen(false)}
            aria-label="Close navigation overlay"
          />
        )}
        <Sidebar open={navigationOpen} onClose={() => setNavigationOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
