import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/cn';

describe('cn', () => {
  it('merges class names and resolves tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('bg-red-500 text-white', 'hover:bg-red-600')).toBe(
      'bg-red-500 text-white hover:bg-red-600',
    );
  });

  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, 0, 'b')).toBe('a b');
  });
});
