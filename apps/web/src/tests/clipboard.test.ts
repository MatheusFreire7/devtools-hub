import { afterEach, describe, expect, it, vi } from 'vitest';

import { copyToClipboard } from '@/lib/utils/clipboard';

describe('copyToClipboard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a boolean and never throws', async () => {
    expect(await copyToClipboard('hello')).toBeTypeOf('boolean');
  });

  it('cleans up its fallback textarea after copying', async () => {
    const originalExec = document.execCommand;
    document.execCommand = vi.fn(() => false) as unknown as typeof document.execCommand;
    const spy = vi.spyOn(document.body, 'removeChild');

    const result = await copyToClipboard('fallback test');
    expect(result).toBe(false);
    expect(spy).toHaveBeenCalled();

    document.execCommand = originalExec;
  });
});
