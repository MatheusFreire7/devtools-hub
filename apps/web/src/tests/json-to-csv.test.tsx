import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { JsonToCsv } from '@/components/tools/JsonToCsv';

vi.mock('@/lib/utils/clipboard', () => ({
  copyToClipboard: vi.fn(async () => true),
}));

describe('JsonToCsv', () => {
  it('converts JSON to CSV on click', () => {
    render(<JsonToCsv />);

    fireEvent.change(screen.getByLabelText('JSON input'), {
      target: { value: '[{"name":"Ada","age":36}]' },
    });
    fireEvent.click(screen.getByRole('button', { name: /convert/i }));

    const output = screen.getByLabelText<HTMLTextAreaElement>('CSV output');
    expect(output.value).toBe('name,age\nAda,36');
  });

  it('shows an error banner for invalid JSON', () => {
    render(<JsonToCsv />);

    fireEvent.change(screen.getByLabelText('JSON input'), {
      target: { value: '{invalid' },
    });
    fireEvent.click(screen.getByRole('button', { name: /convert/i }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('disables the download button until there is output', () => {
    render(<JsonToCsv />);
    const download = screen.getByRole('button', { name: /download \.csv/i });
    expect(download).toBeDisabled();
  });
});
