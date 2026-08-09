import { md5 } from 'hash-wasm';

export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

export const HASH_ALGORITHMS: HashAlgorithm[] = ['md5', 'sha1', 'sha256', 'sha512'];

const SUBTLE_ALGORITHMS: Record<string, string> = {
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  sha512: 'SHA-512',
};

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function hashText(input: string, algorithm: HashAlgorithm): Promise<string> {
  if (input === '') return '';

  if (algorithm === 'md5') {
    return md5(input);
  }

  const subtleName = SUBTLE_ALGORITHMS[algorithm] as AlgorithmIdentifier;
  const bytes = await crypto.subtle.digest(subtleName, new TextEncoder().encode(input));
  return toHex(new Uint8Array(bytes));
}

export function formatBytesLength(algorithm: HashAlgorithm): number {
  switch (algorithm) {
    case 'md5':
      return 32;
    case 'sha1':
      return 40;
    case 'sha256':
      return 64;
    case 'sha512':
      return 128;
  }
}
