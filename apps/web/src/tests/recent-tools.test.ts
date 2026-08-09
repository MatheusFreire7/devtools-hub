import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useRecentToolsStore } from '@/store/recent-tools';

describe('recent tools store', () => {
  beforeEach(() => {
    useRecentToolsStore.setState({ recent: [] });
  });

  it('adds a tool and moves it to the front', () => {
    const { result } = renderHook(() => useRecentToolsStore());

    act(() => result.current.addRecent('base64'));
    act(() => result.current.addRecent('json-formatter'));
    act(() => result.current.addRecent('base64'));

    expect(result.current.recent).toEqual(['base64', 'json-formatter']);
  });

  it('caps the recent list at five entries', () => {
    const { result } = renderHook(() => useRecentToolsStore());

    for (const slug of ['a', 'b', 'c', 'd', 'e', 'f']) {
      act(() => result.current.addRecent(slug));
    }

    expect(result.current.recent).toEqual(['f', 'e', 'd', 'c', 'b']);
  });

  it('removes a single tool', () => {
    const { result } = renderHook(() => useRecentToolsStore());

    act(() => result.current.addRecent('base64'));
    act(() => result.current.addRecent('hash-generator'));
    act(() => result.current.removeRecent('base64'));

    expect(result.current.recent).toEqual(['hash-generator']);
  });

  it('clears all recent tools', () => {
    const { result } = renderHook(() => useRecentToolsStore());

    act(() => result.current.addRecent('base64'));
    act(() => result.current.clearRecent());

    expect(result.current.recent).toEqual([]);
  });
});
