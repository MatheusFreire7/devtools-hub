import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Base64Tool } from '@/components/tools/Base64Tool';

vi.mock('@/lib/utils/clipboard', () => ({
  copyToClipboard: vi.fn(async () => true),
}));

describe('Base64Tool', () => {
  it('encodes text into Base64 as it is typed', () => {
    render(<Base64Tool />);

    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'hello' } });

    expect(screen.getByLabelText<HTMLTextAreaElement>('Output').value).toBe('aGVsbG8=');
  });

  it('decodes Base64 back to text when switching modes', async () => {
    const user = (await import('@testing-library/user-event')).default;
    user.setup();
    render(<Base64Tool />);

    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'aGVsbG8=' } });
    fireEvent.click(screen.getByRole('button', { name: 'Decode' }));

    expect(screen.getByLabelText<HTMLTextAreaElement>('Output').value).toBe('hello');
  });

  it('swaps input and output to round-trip a value', () => {
    render(<Base64Tool />);

    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'devtools' } });

    const encoded = screen.getByLabelText<HTMLTextAreaElement>('Output').value;
    expect(encoded).not.toBe('');

    fireEvent.click(screen.getByRole('button', { name: 'Swap encode and decode' }));

    expect(screen.getByLabelText<HTMLTextAreaElement>('Input').value).toBe(encoded);
    expect(screen.getByLabelText<HTMLTextAreaElement>('Output').value).toBe('devtools');
  });

  it('reports invalid Base64 when decoding malformed input', () => {
    render(<Base64Tool />);

    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'not-valid' } });
    fireEvent.click(screen.getByRole('button', { name: 'Decode' }));

    expect(screen.getByRole('alert')).toHaveTextContent(/Base64/i);
  });

  it('clears both panes', () => {
    render(<Base64Tool />);

    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByLabelText<HTMLTextAreaElement>('Input').value).toBe('');
    expect(screen.getByLabelText<HTMLTextAreaElement>('Output').value).toBe('');
  });
});
