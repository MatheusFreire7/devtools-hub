import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HashGenerator } from '@/components/tools/HashGenerator';

vi.mock('@/lib/utils/clipboard', () => ({
  copyToClipboard: vi.fn(async () => true),
}));

describe('HashGenerator', () => {
  it('computes a SHA-256 digest on click', async () => {
    render(<HashGenerator />);

    fireEvent.change(screen.getByLabelText('Input'), {
      target: { value: 'hello world' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() => {
      expect(screen.getByLabelText<HTMLTextAreaElement>('Hash output').value).toBe(
        'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
      );
    });
  });

  it('switches algorithm and recomputes', async () => {
    render(<HashGenerator />);

    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText(/algorithm/i), { target: { value: 'sha1' } });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() => {
      expect(screen.getByLabelText<HTMLTextAreaElement>('Hash output').value).toBe(
        'a9993e364706816aba3e25717850c26c9cd0d89d',
      );
    });
  });

  it('does not generate when input is empty', () => {
    render(<HashGenerator />);
    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled();
  });
});
