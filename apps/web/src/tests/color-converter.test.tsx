import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ColorConverter } from '@/components/tools/ColorConverter';

vi.mock('@/lib/utils/clipboard', () => ({
  copyToClipboard: vi.fn(async () => true),
}));

describe('ColorConverter', () => {
  it('renders the default color and derived formats', () => {
    render(<ColorConverter />);
    expect(screen.getByLabelText('HEX value')).toHaveValue('#6366f1');
  });

  it('updates RGB and HSL when HEX changes', () => {
    render(<ColorConverter />);

    fireEvent.change(screen.getByLabelText('HEX value'), { target: { value: '#ff0000' } });

    expect(screen.getByLabelText('RGB value')).toHaveValue('rgb(255, 0, 0)');
    expect(screen.getByLabelText('HSL value')).toHaveValue('hsl(0, 100%, 50%)');
  });

  it('updates HEX and HSL when RGB changes', () => {
    render(<ColorConverter />);

    fireEvent.change(screen.getByLabelText('RGB value'), {
      target: { value: 'rgb(0, 128, 255)' },
    });

    expect(screen.getByLabelText('HEX value')).toHaveValue('#0080ff');
  });

  it('shows an error for an invalid color', () => {
    render(<ColorConverter />);

    fireEvent.change(screen.getByLabelText('HEX value'), { target: { value: 'banana' } });

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
