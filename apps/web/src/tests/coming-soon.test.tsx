import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ComingSoon } from '@/components/tools/ComingSoon';
import { getToolBySlug } from '@/config/tools';

describe('ComingSoon', () => {
  it('renders the tool title and phase badge', () => {
    const tool = getToolBySlug('json-to-csv');
    expect(tool).toBeDefined();

    render(<ComingSoon tool={tool!} />);

    expect(screen.getByRole('heading', { name: 'JSON ↔ CSV Converter' })).toBeInTheDocument();
    expect(screen.getByText(/Phase 3/i)).toBeInTheDocument();
  });
});
