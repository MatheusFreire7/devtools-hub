import { describe, expect, it } from 'vitest';

import { formatJson, minifyJson, parseJson } from '@/lib/utils/json';

describe('json utils', () => {
  describe('parseJson', () => {
    it('parses valid JSON', () => {
      const result = parseJson('{"a":1}');
      expect(result.ok).toBe(true);
      expect(result.value).toEqual({ a: 1 });
    });

    it('rejects empty input', () => {
      const result = parseJson('   ');
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/empty/i);
    });

    it('reports malformed JSON with a message', () => {
      const result = parseJson('{"a":}');
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/JSON/i);
    });
  });

  describe('formatJson', () => {
    it('pretty prints with the requested indent', () => {
      const result = formatJson('{"a":1,"b":2}', 2);
      if (!result.ok) {
        throw new Error('expected formatting to succeed');
      }
      expect(result.value).toMatch(/\{\n {2}"a": 1,/);
    });

    it('propagates parse errors', () => {
      const result = formatJson('nope', 2);
      if (result.ok) {
        throw new Error('expected formatting to fail');
      }
      expect(result.error).toBeDefined();
    });
  });

  describe('minifyJson', () => {
    it('removes whitespace', () => {
      const result = minifyJson('{ "a" : 1 ,\n "b": [1, 2] }');
      if (!result.ok) {
        throw new Error('expected minifying to succeed');
      }
      expect(result.value).toBe('{"a":1,"b":[1,2]}');
    });
  });
});
