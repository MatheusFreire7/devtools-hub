import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { JsonFormatter } from '@/components/tools/JsonFormatter';

function typeJson(value: string) {
  fireEvent.change(screen.getByLabelText('JSON input'), { target: { value } });
}

describe('JsonFormatter', () => {
  it('formats valid JSON with two-space indent', async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);

    typeJson('{"a":1,"b":[1,2]}');
    await user.click(screen.getByRole('button', { name: /format/i }));

    const output = screen.getByLabelText<HTMLTextAreaElement>('JSON output');
    expect(output.value).toContain('{\n  "a": 1');
    expect(screen.getByText(/Valid JSON/i)).toBeInTheDocument();
  });

  it('shows an error banner for invalid JSON', async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);

    typeJson('{"a":}');
    await user.click(screen.getByRole('button', { name: /format/i }));

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toMatch(/JSON/i);
  });

  it('minifies JSON', async () => {
    const user = userEvent.setup();
    render(<JsonFormatter />);

    typeJson('{ "a" : 1 }');
    await user.click(screen.getByRole('button', { name: /minify/i }));

    const output = screen.getByLabelText<HTMLTextAreaElement>('JSON output');
    expect(output.value).toBe('{"a":1}');
  });
});
