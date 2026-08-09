export interface RegexMatch {
  match: string;
  index: number;
  groups: Record<string, string | undefined>;
}

export type RegexTestResult =
  { ok: true; matches: RegexMatch[]; count: number } | { ok: false; error: string };

export const SUPPORTED_FLAGS = ['g', 'i', 'm', 'u'] as const;

export function validateFlags(flags: string): string | undefined {
  for (const flag of flags) {
    if (!(SUPPORTED_FLAGS as readonly string[]).includes(flag)) {
      return `Unsupported flag "${flag}" — use g, i, m or u.`;
    }
  }
  return undefined;
}

export function normalizeFlags(flags: string): string {
  return [...new Set(flags.split(''))].join('');
}

export interface HighlightSegment {
  text: string;
  matched: boolean;
}

export function buildHighlightSegments(input: string, matches: RegexMatch[]): HighlightSegment[] {
  if (matches.length === 0) return [{ text: input, matched: false }];
  const sorted = [...matches].sort((a, b) => a.index - b.index);
  const segments: HighlightSegment[] = [];
  let cursor = 0;
  for (const match of sorted) {
    if (match.index > cursor) {
      segments.push({ text: input.slice(cursor, match.index), matched: false });
    }
    segments.push({ text: match.match, matched: true });
    cursor = match.index + match.match.length;
  }
  if (cursor < input.length) {
    segments.push({ text: input.slice(cursor), matched: false });
  }
  return segments;
}

export function testRegex(pattern: string, flags: string, input: string): RegexTestResult {
  if (pattern.trim() === '') return { ok: false, error: 'Enter a regular expression first.' };
  if (input === '') return { ok: true, matches: [], count: 0 };

  const invalidFlags = validateFlags(flags);
  if (invalidFlags) return { ok: false, error: invalidFlags };

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, normalizeFlags(flags));
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : `Invalid pattern: ${pattern}`,
    };
  }

  const matches: RegexMatch[] = [];
  const hasGlobal = flags.includes('g');

  if (hasGlobal) {
    for (const match of input.matchAll(regex)) {
      const index = match.index ?? 0;
      const groups: Record<string, string | undefined> = {};
      for (let i = 1; i < match.length; i += 1) {
        groups[`group-${i}`] = match[i];
      }
      if (match.groups) {
        for (const [name, value] of Object.entries(match.groups)) {
          groups[name] = value ?? undefined;
        }
      }
      matches.push({ match: match[0], index, groups });
    }
  } else {
    const match = input.match(regex);
    if (match && match.index !== undefined) {
      const groups: Record<string, string | undefined> = {};
      for (let i = 1; i < match.length; i += 1) {
        groups[`group-${i}`] = match[i];
      }
      if (match.groups) {
        for (const [name, value] of Object.entries(match.groups)) {
          groups[name] = value ?? undefined;
        }
      }
      matches.push({ match: match[0], index: match.index, groups });
    }
  }

  return { ok: true, matches, count: matches.length };
}
