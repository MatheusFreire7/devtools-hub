import { describe, expect, it } from 'vitest';

import { TOOLS, getToolBySlug, getToolsByCategory } from '@/config/tools';

describe('tools registry', () => {
  it('exposes a non-empty collection of tools', () => {
    expect(TOOLS.length).toBeGreaterThan(0);
  });

  it('has unique slugs', () => {
    const slugs = TOOLS.map((tool) => tool.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('resolves tools by slug', () => {
    for (const tool of TOOLS) {
      expect(getToolBySlug(tool.slug)?.slug).toBe(tool.slug);
    }
    expect(getToolBySlug('does-not-exist')).toBeUndefined();
  });

  it('groups tools by category without losing any', () => {
    const categories = new Set(TOOLS.map((tool) => tool.category));
    const groupedCount = [...categories].reduce(
      (sum, categoryId) => sum + getToolsByCategory(categoryId).length,
      0,
    );
    expect(groupedCount).toBe(TOOLS.length);
  });
});
