import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

import { usePaletteStore } from '@/store/palette';
import { useRecentToolsStore } from '@/store/recent-tools';

import { CommandPalette } from './CommandPalette';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useCommandPaletteShortcut } from './useCommandPaletteShortcut';

const TOOL_PATH_PATTERN = /^\/tools\/([^/]+)$/;

export function AppShell() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const addRecent = useRecentToolsStore((state) => state.addRecent);
  const setPaletteOpen = usePaletteStore((state) => state.setOpen);
  const location = useLocation();

  useCommandPaletteShortcut();

  useEffect(() => {
    const match = TOOL_PATH_PATTERN.exec(location.pathname);
    if (match?.[1]) addRecent(match[1]);
  }, [location.pathname, addRecent]);

  return (
    <div className="flex min-h-full flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <Header
        onOpenNavigation={() => setNavigationOpen(true)}
        onOpenPalette={() => setPaletteOpen(true)}
      />
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
        <div className="flex min-w-0 flex-1 flex-col" id="main-content">
          <Outlet />
        </div>
      </div>

      <CommandPalette />
    </div>
  );
}
