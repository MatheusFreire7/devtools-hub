import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router';

import { CATEGORIES, getToolsByCategory } from '@/config/tools';

import { cn } from '../../lib/cn';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        const opener = document.getElementById('navigation-open-button');
        opener?.focus();
      }
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const focusable = containerRef.current?.querySelector<HTMLElement>(
      'button, a[href], input, select, textarea',
    );
    focusable?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <div
      ref={containerRef}
      role="navigation"
      aria-label="Tool categories"
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white transition-transform duration-200 md:static md:z-auto md:translate-x-0 dark:border-slate-800 dark:bg-slate-950',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      )}
    >
      <div className="flex items-center justify-between px-4 pt-4 md:hidden">
        <span className="font-semibold text-slate-900 dark:text-slate-50">Tools</span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-6 overflow-y-auto px-3 py-4">
        {CATEGORIES.map((category) => {
          const tools = getToolsByCategory(category.id);
          return (
            <div key={category.id}>
              <div className="mb-1 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <category.icon className="h-3.5 w-3.5" />
                {category.title}
              </div>
              <ul className="flex flex-col gap-0.5">
                {tools.map((tool) => (
                  <li key={tool.slug}>
                    <NavLink
                      to={`/tools/${tool.slug}`}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                          isActive &&
                            'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
                        )
                      }
                    >
                      <tool.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{tool.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
