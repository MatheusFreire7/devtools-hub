import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { UrlEncoder } from '@/components/tools/UrlEncoder';

vi.mock('@/lib/utils/clipboard', () => ({
  copyToClipboard: vi.fn(async () => true),
}));

describe('UrlEncoder', () => {
  it('encodes special characters as a component by default', () => {
    render(<UrlEncoder />);

    fireEvent.change(screen.getByLabelText('Text to encode'), {
      target: { value: 'a b&c' },
    });

    expect(screen.getByLabelText<HTMLTextAreaElement>('Output').value).toBe('a%20b%26c');
  });

  it('encodes as a full URI when selected', () => {
    render(<UrlEncoder />);

    fireEvent.change(screen.getByLabelText('URL encoding type'), {
      target: { value: 'uri' },
    });
    fireEvent.change(screen.getByLabelText('Text to encode'), {
      target: { value: 'https://x.test/a b' },
    });

    // encodeURI keeps the colon and slashes, encodes the space
    expect(screen.getByLabelText<HTMLTextAreaElement>('Output').value).toBe('https://x.test/a%20b');
  });

  it('decodes a percent-encoded value', () => {
    render(<UrlEncoder />);

    fireEvent.click(screen.getByRole('button', { name: 'Decode' }));
    fireEvent.change(screen.getByLabelText('URL to decode'), {
      target: { value: 'a%20b%26c' },
    });

    expect(screen.getByLabelText<HTMLTextAreaElement>('Output').value).toBe('a b&c');
  });

  it('shows an error when decoding malformed escapes', () => {
    render(<UrlEncoder />);

    fireEvent.click(screen.getByRole('button', { name: 'Decode' }));
    fireEvent.change(screen.getByLabelText('URL to decode'), {
      target: { value: '%zz' },
    });

    expect(screen.getByRole('alert')).toHaveTextContent(/URI/i);
  });

  it('clears the input', () => {
    render(<UrlEncoder />);

    fireEvent.change(screen.getByLabelText('Text to encode'), {
      target: { value: 'abc' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByLabelText<HTMLTextAreaElement>('Text to encode').value).toBe('');
  });
});
