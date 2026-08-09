import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { JwtDecoder } from '@/components/tools/JwtDecoder';

vi.mock('@/lib/utils/clipboard', () => ({
  copyToClipboard: vi.fn(async () => true),
}));

function b64url(value: string): string {
  return btoa(value).replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

const validJwt = `${b64url('{"alg":"HS256","typ":"JWT"}')}.${b64url(
  '{"sub":"1234567890","name":"Jane Doe","exp":1800000000}',
)}.signature-part`;

describe('JwtDecoder', () => {
  it('decodes header, payload and signature', () => {
    render(<JwtDecoder />);

    fireEvent.change(screen.getByLabelText('JWT input'), { target: { value: validJwt } });
    fireEvent.click(screen.getByRole('button', { name: /decode/i }));

    expect(screen.getByTestId('jwt-header')).toHaveTextContent('HS256');
    expect(screen.getByTestId('jwt-payload')).toHaveTextContent('Jane Doe');
    expect(screen.getByText('signature-part')).toBeInTheDocument();
  });

  it('rejects tokens without three segments', () => {
    render(<JwtDecoder />);

    fireEvent.change(screen.getByLabelText('JWT input'), { target: { value: 'only.two' } });
    fireEvent.click(screen.getByRole('button', { name: /decode/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/3 dot-separated segments/i);
  });

  it('disables the decode button for empty input', () => {
    render(<JwtDecoder />);

    expect(screen.getByRole('button', { name: /decode/i })).toBeDisabled();
  });

  it('clears the token and the result', async () => {
    const user = (await import('@testing-library/user-event')).default;
    user.setup();
    render(<JwtDecoder />);

    fireEvent.change(screen.getByLabelText('JWT input'), { target: { value: validJwt } });
    fireEvent.click(screen.getByRole('button', { name: /decode/i }));

    expect(screen.getByTestId('jwt-payload')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByLabelText('JWT input')).toHaveValue('');
    expect(screen.queryByTestId('jwt-payload')).not.toBeInTheDocument();
  });
});
