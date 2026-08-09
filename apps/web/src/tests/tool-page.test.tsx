import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { NotFoundPage } from '@/pages/NotFoundPage';
import { ToolPage } from '@/pages/ToolPage';

function renderTool(slug: string) {
  const router = createMemoryRouter(
    [
      { path: '/tools/:toolSlug', element: <ToolPage /> },
      { path: '/404', element: <NotFoundPage /> },
    ],
    { initialEntries: [`/tools/${slug}`] },
  );
  return render(<RouterProvider router={router} />);
}

describe('ToolPage', () => {
  it('renders a ready tool component for a phase 2 tool', async () => {
    renderTool('json-formatter');

    expect(
      await screen.findByRole('heading', { name: 'JSON Formatter & Validator' }),
    ).toBeInTheDocument();
    expect(await screen.findByLabelText('JSON input')).toBeInTheDocument();
  });

  it('renders a ready tool component for a phase 3 tool', async () => {
    renderTool('regex-tester');

    expect(await screen.findByRole('heading', { name: 'Regex Tester' })).toBeInTheDocument();
    expect(await screen.findByLabelText('Regex pattern')).toBeInTheDocument();
  });

  it('renders the coming-soon placeholder for a phase 4 tool', async () => {
    renderTool('ping');

    expect(await screen.findByText(/Coming soon — Phase 4/i)).toBeInTheDocument();
  });

  it('redirects to 404 for an unknown tool', async () => {
    renderTool('does-not-exist');

    expect(await screen.findByText(/Page not found/i)).toBeInTheDocument();
  });
});
