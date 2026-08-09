import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DnsLookup } from '@/components/tools/DnsLookup';

import { renderWithQueryClient } from './test-utils';

vi.mock('@/lib/api/client', () => ({
  dnsLookup: vi.fn(async (body: { hostname: string }) => ({
    hostname: body.hostname,
    records: [
      { type: 'A', entry: '93.184.216.34' },
      { type: 'AAAA', entry: '2606:2800:220:1:248:1893:25c8:1946' },
      { type: 'MX', entry: 'mx.example.com', priority: 10 },
      { type: 'TXT', entry: 'v=spf1 -all' },
      { type: 'NS', entry: 'ns1.example.com' },
    ],
    timestamp: '',
  })),
  fetchPing: vi.fn(async () => ({ status: 'ok', timestamp: '', uptimeSeconds: 0, latencyMs: 0 })),
  fetchHttpHeaders: vi.fn(async () => ({
    url: '',
    status: 0,
    statusText: '',
    headers: [],
    timestamp: '',
  })),
}));

describe('DnsLookup', () => {
  it('resolves the hostname and groups records by type', async () => {
    renderWithQueryClient(<DnsLookup />);

    fireEvent.change(screen.getByLabelText('Hostname'), { target: { value: 'example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /lookup/i }));

    expect(await screen.findByText('93.184.216.34')).toBeInTheDocument();
    expect(screen.getByText('mx.example.com')).toBeInTheDocument();
    expect(screen.getByText(/priority 10/i)).toBeInTheDocument();
    expect(screen.getByText(/results for/i)).toBeInTheDocument();
  });

  it('omits the groups whose record type was deselected', async () => {
    renderWithQueryClient(<DnsLookup />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'AAAA' }));
    fireEvent.change(screen.getByLabelText('Hostname'), { target: { value: 'example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /lookup/i }));

    expect(await screen.findByText('93.184.216.34')).toBeInTheDocument();
    expect(screen.queryByText('2606:2800:220:1:248:1893:25c8:1946')).not.toBeInTheDocument();
  });

  it('renders an empty state when no records are returned', async () => {
    vi.mocked((await import('@/lib/api/client')).dnsLookup).mockResolvedValueOnce({
      hostname: 'none.example',
      records: [],
      timestamp: '',
    });

    renderWithQueryClient(<DnsLookup />);

    fireEvent.change(screen.getByLabelText('Hostname'), { target: { value: 'none.example' } });
    fireEvent.click(screen.getByRole('button', { name: /lookup/i }));

    expect(await screen.findByText(/No DNS records of the requested types/i)).toBeInTheDocument();
  });

  it('shows an error banner when the resolution fails', async () => {
    vi.mocked((await import('@/lib/api/client')).dnsLookup).mockRejectedValueOnce(
      new Error('Refusing to connect to an internal address'),
    );

    renderWithQueryClient(<DnsLookup />);

    fireEvent.change(screen.getByLabelText('Hostname'), { target: { value: '127.0.0.1' } });
    fireEvent.click(screen.getByRole('button', { name: /lookup/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Refusing to connect');
  });
});
