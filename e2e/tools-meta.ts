export interface E2eTool {
  slug: string;
  title: string;
}

export const TOOLS: E2eTool[] = [
  { slug: 'json-formatter', title: 'JSON Formatter & Validator' },
  { slug: 'json-to-csv', title: 'JSON ↔ CSV Converter' },
  { slug: 'base64', title: 'Base64 Encoder / Decoder' },
  { slug: 'jwt-decoder', title: 'JWT Decoder' },
  { slug: 'uuid-generator', title: 'UUID Generator' },
  { slug: 'hash-generator', title: 'Hash Generator' },
  { slug: 'url-encoder', title: 'URL Encoder / Decoder' },
  { slug: 'timestamp-converter', title: 'Timestamp Converter' },
  { slug: 'regex-tester', title: 'Regex Tester' },
  { slug: 'color-converter', title: 'Color Converter' },
  { slug: 'ping', title: 'Ping / Latency' },
  { slug: 'dns-lookup', title: 'DNS Lookup' },
  { slug: 'http-headers', title: 'HTTP Headers Inspector' },
];
