import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { UuidGenerator } from '@/components/tools/UuidGenerator';
import { isValidUuidV4 } from '@/lib/utils/uuid';

vi.mock('@/lib/utils/clipboard', () => ({
  copyToClipboard: vi.fn(async () => true),
}));

describe('UuidGenerator', () => {
  it('generates valid UUIDs on mount with the default quantity', () => {
    render(<UuidGenerator />);

    const rows = screen.getAllByRole('button', { name: 'Copy to clipboard' });
    expect(rows).toHaveLength(5);
  });

  it('updates the list when the quantity changes', async () => {
    const user = userEvent.setup();
    render(<UuidGenerator />);

    const quantity = screen.getByLabelText('Number of UUIDs');
    await user.clear(quantity);
    await user.type(quantity, '3');

    expect(screen.getAllByRole('button', { name: 'Copy to clipboard' })).toHaveLength(3);
  });

  it('generates valid v4 UUIDs', async () => {
    const user = userEvent.setup();
    render(<UuidGenerator />);

    const uuids = screen.getAllByText(/^[0-9a-f-]{36}$/);
    uuids.forEach((element) => {
      expect(isValidUuidV4(element.textContent ?? '')).toBe(true);
    });

    await user.click(screen.getByRole('button', { name: /regenerate/i }));
    const next = screen.getAllByText(/^[0-9a-f-]{36}$/);
    next.forEach((element) => {
      expect(isValidUuidV4(element.textContent ?? '')).toBe(true);
    });
  });
});
