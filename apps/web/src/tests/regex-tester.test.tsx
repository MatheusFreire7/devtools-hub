import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RegexTester } from '@/components/tools/RegexTester';

describe('RegexTester', () => {
  it('highlights matches and reports the count', () => {
    render(<RegexTester />);

    fireEvent.change(screen.getByLabelText('Regex pattern'), { target: { value: '\\w+' } });
    fireEvent.change(screen.getByLabelText('Test input'), { target: { value: 'foo bar' } });
    fireEvent.click(screen.getByRole('button', { name: /test/i }));

    expect(screen.getByText('2 matches')).toBeInTheDocument();
    expect(screen.getAllByRole('mark')).toHaveLength(2);
  });

  it('toggles the case-insensitive flag', () => {
    render(<RegexTester />);

    fireEvent.click(screen.getByRole('button', { name: 'i' }));
    fireEvent.change(screen.getByLabelText('Regex pattern'), { target: { value: 'abc' } });
    fireEvent.change(screen.getByLabelText('Test input'), { target: { value: 'ABC abc' } });
    fireEvent.click(screen.getByRole('button', { name: /test/i }));

    expect(screen.getByText('2 matches')).toBeInTheDocument();
  });

  it('shows an error for an invalid pattern', () => {
    render(<RegexTester />);

    fireEvent.change(screen.getByLabelText('Regex pattern'), { target: { value: '(' } });
    fireEvent.change(screen.getByLabelText('Test input'), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /test/i }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
