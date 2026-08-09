import { describe, expect, it } from 'vitest';

import { generateUuids, generateUuidV4, isValidUuidV4 } from '@/lib/utils/uuid';

describe('uuid utils', () => {
  it('generates a valid v4 UUID', () => {
    const uuid = generateUuidV4();
    expect(isValidUuidV4(uuid)).toBe(true);
  });

  it('generates the requested quantity', () => {
    expect(generateUuids(10).length).toBe(10);
  });

  it('clamps quantity to a 1–100 range', () => {
    expect(generateUuids(0).length).toBe(1);
    expect(generateUuids(500).length).toBe(100);
  });

  it('produces unique values', () => {
    const uuids = generateUuids(50);
    expect(new Set(uuids).size).toBe(50);
  });

  it('can output uppercase UUIDs', () => {
    const uuids = generateUuids(5, true);
    expect(uuids.every((uuid) => uuid === uuid.toUpperCase())).toBe(true);
  });

  it('validates real v4 UUID shapes', () => {
    expect(isValidUuidV4('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
    expect(isValidUuidV4('not-a-uuid')).toBe(false);
  });
});
