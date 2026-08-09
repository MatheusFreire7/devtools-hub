import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { CommandPalette } from '@/components/layout/CommandPalette';
import { usePaletteStore } from '@/store/palette';
import { useRecentToolsStore } from '@/store/recent-tools';

function renderPalette(slug: string | undefined, onNavigate: (path: string) => void) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <CommandPalette />,
        children: [],
      },
      {
        path: '/tools/:toolSlug',
        element: (
          <div>
            <h1>tool</h1>
          </div>
        ),
      },
    ],
    { initialEntries: ['/'] },
  );
  router.subscribe((state) => {
    if (state.location.pathname !== '/') onNavigate(state.location.pathname);
  });
  if (slug) useRecentToolsStore.getState().addRecent(slug);
  return render(<RouterProvider router={router} />);
}

describe('CommandPalette', () => {
  beforeEach(() => {
    usePaletteStore.setState({ open: true });
    useRecentToolsStore.setState({ recent: [] });
  });

  afterEach(() => {
    usePaletteStore.setState({ open: false });
  });

  it('shows all tool categories when opened', async () => {
    renderPalette(undefined, () => {});

    expect(await screen.findByText('JSON Formatter & Validator')).toBeInTheDocument();
    expect(screen.getByText('Base64 Encoder / Decoder')).toBeInTheDocument();
    expect(screen.getByText('DNS Lookup')).toBeInTheDocument();
  });

  it('filters tools while typing', async () => {
    const user = userEvent.setup();
    renderPalette(undefined, () => {});

    const input = screen.getByPlaceholderText('Search tools, commands…');
    await user.type(input, 'uuid');

    expect(screen.getByText('UUID Generator')).toBeInTheDocument();
    expect(screen.queryByText('Base64 Encoder / Decoder')).not.toBeInTheDocument();
  });

  it('navigates to the selected tool and closes', async () => {
    const user = userEvent.setup();
    const paths: string[] = [];
    renderPalette(undefined, (path) => paths.push(path));

    await user.click(await screen.findByText('UUID Generator'));

    expect(paths).toContain('/tools/uuid-generator');
    expect(usePaletteStore.getState().open).toBe(false);
  });

  it('lists recent tools first', async () => {
    renderPalette('base64', () => {});

    const recentGroup = await screen.findByRole('group', { name: 'Recent' });
    expect(within(recentGroup).getByText('Base64 Encoder / Decoder')).toBeInTheDocument();
  });
});
