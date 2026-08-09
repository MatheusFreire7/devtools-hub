import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TimestampConverter } from '@/components/tools/TimestampConverter';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(1700000000000));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('TimestampConverter', () => {
  it('shows the live clock in seconds and milliseconds', () => {
    render(<TimestampConverter />);
    expect(screen.getAllByText('1700000000').length).toBeGreaterThan(0);
    expect(screen.getByText('2023-11-14T22:13:20.000Z')).toBeInTheDocument();
  });

  it('converts a seconds-based timestamp', () => {
    render(<TimestampConverter />);
    fireEvent.change(screen.getByLabelText('Timestamp input'), {
      target: { value: '1700000000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /convert/i }));

    expect(screen.getAllByText('1700000000000').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2023-11-14T22:13:20.000Z').length).toBeGreaterThan(0);
  });

  it('shows an error banner for invalid input', () => {
    render(<TimestampConverter />);
    fireEvent.change(screen.getByLabelText('Timestamp input'), {
      target: { value: 'hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: /convert/i }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
