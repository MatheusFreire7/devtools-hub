import { Menu, Moon, Search, Sun, Wrench } from 'lucide-react';

import { useThemeStore } from '@/store/theme';

import { cn } from '../../lib/cn';

interface HeaderProps {
  onOpenNavigation: () => void;
  className?: string;
}

export function Header({ onOpenNavigation, className }: HeaderProps) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80',
        className,
      )}
    >
      <button
        type="button"
        onClick={onOpenNavigation}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden dark:text-slate-400 dark:hover:bg-slate-800"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <a
        href="/"
        className="flex shrink-0 items-center gap-2 font-semibold text-slate-900 dark:text-slate-50"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <Wrench className="h-4 w-4" />
        </span>
        <span className="hidden sm:inline">DevTools Hub</span>
      </a>

      <button
        type="button"
        className="ml-auto flex h-10 max-w-xs flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 hover:border-slate-300 hover:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:hover:border-slate-600"
        aria-label="Search tools (coming soon)"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search tools…</span>
        <kbd className="ml-auto hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 md:inline dark:border-slate-700 dark:bg-slate-800">
          Ctrl K
        </kbd>
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </header>
  );
}
