import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HttpHeaders } from '@/components/tools/HttpHeaders';

import { renderWithQueryClient } from './test-utils';

vi.mock('@/lib/api/client', () => ({
  fetchHttpHeaders: vi.fn(async () => ({
    url: 'https://example.com',
    status: 200,
    statusText: 'OK',
    headers: [
      { name: 'content-type', value: 'text/html' },
      { name: 'server', value: 'nginx' },
    ],
    timestamp: '',
  })),
  fetchPing: vi.fn(async () => ({ status: 'ok', timestamp: '', uptimeSeconds: 0, latencyMs: 0 })),
  dnsLookup: vi.fn(async () => ({ hostname: '', records: [], timestamp: '' })),
}));

describe('HttpHeaders', () => {
  it('renders the status line and headers table after inspection', async () => {
    renderWithQueryClient(<HttpHeaders />);

    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /inspect/i }));

    expect(await screen.findByText('HTTP 200 OK')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'content-type' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'nginx' })).toBeInTheDocument();
  });

  it('renders an empty state when no headers are returned', async () => {
    vi.mocked((await import('@/lib/api/client')).fetchHttpHeaders).mockResolvedValueOnce({
      url: 'https://example.com',
      status: 204,
      statusText: 'No Content',
      headers: [],
      timestamp: '',
    });

    renderWithQueryClient(<HttpHeaders />);

    fireEvent.click(screen.getByRole('button', { name: /inspect/i }));

    expect(await screen.findByText(/contained no headers/i)).toBeInTheDocument();
    expect(screen.getByText('HTTP 204 No Content')).toBeInTheDocument();
  });

  it('shows an error banner when the fetch fails', async () => {
    vi.mocked((await import('@/lib/api/client')).fetchHttpHeaders).mockRejectedValueOnce(
      new Error('Too many requests, please try again later.'),
    );

    renderWithQueryClient(<HttpHeaders />);

    fireEvent.click(screen.getByRole('button', { name: /inspect/i }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Too many requests, please try again later.',
      ),
    );
  });
});
