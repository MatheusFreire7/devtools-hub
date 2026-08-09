import { Command } from 'cmdk';
import { Moon, RotateCcw, Sun } from 'lucide-react';
import { useNavigate } from 'react-router';

import { CATEGORIES, TOOLS, getToolBySlug } from '@/config/tools';
import { usePaletteStore } from '@/store/palette';
import { useRecentToolsStore } from '@/store/recent-tools';
import { useThemeStore } from '@/store/theme';

import { cn } from '../../lib/cn';

function ToolItem({ slug, onSelect }: { slug: string; onSelect: () => void }) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;
  return (
    <Command.Item
      value={`${tool.title} ${tool.description}`}
      keywords={[tool.description, tool.slug]}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-900 dark:text-slate-300 dark:data-[selected=true]:bg-indigo-500/10 dark:data-[selected=true]:text-indigo-100"
    >
      <tool.icon className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
      <span className="min-w-0 flex-1 truncate">{tool.title}</span>
      <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{tool.category}</span>
    </Command.Item>
  );
}

export function CommandPalette() {
  const navigate = useNavigate();
  const { open, setOpen } = usePaletteStore();
  const { recent, clearRecent } = useRecentToolsStore();
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const theme = useThemeStore((state) => state.theme);

  const goToTool = (slug: string) => {
    setOpen(false);
    navigate(`/tools/${slug}`);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search tools"
      overlayClassName="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm"
      contentClassName="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[16vh]"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <Command.Input
          autoFocus
          placeholder="Search tools, commands…"
          className="h-12 w-full border-b border-slate-200 bg-transparent px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <Command.List className="max-h-[50vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-sm text-slate-500 dark:text-slate-400">
            No tool found.
          </Command.Empty>

          {recent.length > 0 ? (
            <Command.Group
              heading={
                <span className="flex items-center gap-2 px-2 pb-1.5 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Recent
                </span>
              }
            >
              {recent.map((slug) => (
                <ToolItem key={slug} slug={slug} onSelect={() => goToTool(slug)} />
              ))}
            </Command.Group>
          ) : null}

          {CATEGORIES.map((category) => {
            const tools = TOOLS.filter((tool) => tool.category === category.id);
            if (tools.length === 0) return null;
            return (
              <Command.Group
                key={category.id}
                heading={
                  <span className="flex items-center gap-2 px-2 pb-1.5 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <category.icon className="h-3.5 w-3.5" />
                    {category.title}
                  </span>
                }
              >
                {tools.map((tool) => (
                  <ToolItem key={tool.slug} slug={tool.slug} onSelect={() => goToTool(tool.slug)} />
                ))}
              </Command.Group>
            );
          })}

          <Command.Group
            heading={
              <span className="block px-2 pb-1.5 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Commands
              </span>
            }
          >
            <Command.Item
              onSelect={() => {
                toggleTheme();
                setOpen(false);
              }}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-900 dark:text-slate-300 dark:data-[selected=true]:bg-indigo-500/10 dark:data-[selected=true]:text-indigo-100"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
              ) : (
                <Moon className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
              )}
              {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            </Command.Item>
            <Command.Item
              onSelect={() => {
                clearRecent();
                setOpen(false);
              }}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-900 dark:text-slate-300 dark:data-[selected=true]:bg-indigo-500/10 dark:data-[selected=true]:text-indigo-100',
                recent.length === 0 && 'hidden',
              )}
            >
              <RotateCcw className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
              Clear recent tools
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
