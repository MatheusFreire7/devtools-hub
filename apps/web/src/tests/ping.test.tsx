import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Ping } from '@/components/tools/Ping';

import { renderWithQueryClient } from './test-utils';

vi.mock('@/lib/api/client', () => ({
  fetchPing: vi.fn(async () => ({
    status: 'ok',
    timestamp: '2026-01-01T00:00:00.000Z',
    uptimeSeconds: 125,
    latencyMs: 0.6,
  })),
  dnsLookup: vi.fn(async () => ({ hostname: '', records: [], timestamp: '' })),
  fetchHttpHeaders: vi.fn(async () => ({
    url: '',
    status: 0,
    statusText: '',
    headers: [],
    timestamp: '',
  })),
}));

describe('Ping', () => {
  it('queries the API on mount and shows service health', async () => {
    renderWithQueryClient(<Ping />);

    expect(await screen.findByText('ok')).toBeInTheDocument();
    expect(screen.getByText('0.6 ms')).toBeInTheDocument();
    expect(screen.getByText('2m 5s')).toBeInTheDocument();
  });

  it('renders an error banner when the API is unreachable', async () => {
    vi.mocked((await import('@/lib/api/client')).fetchPing).mockRejectedValueOnce(
      new Error('API connection refused'),
    );

    renderWithQueryClient(<Ping />);

    expect(await screen.findByRole('alert')).toHaveTextContent('API connection refused');
  });

  it('re-queries when the user clicks ping again', async () => {
    renderWithQueryClient(<Ping />);
    await screen.findByText('ok');

    const { fetchPing } = await import('@/lib/api/client');
    vi.mocked(fetchPing).mockResolvedValue({
      status: 'ok',
      timestamp: '2026-01-01T00:01:00.000Z',
      uptimeSeconds: 185,
      latencyMs: 0.9,
    });

    const button = screen.getByRole('button', { name: /ping again/i });
    button.click();

    await waitFor(() => expect(screen.getByText('0.9 ms')).toBeInTheDocument());
  });
});
