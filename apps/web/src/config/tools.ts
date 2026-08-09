import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowLeftRight,
  Binary,
  Braces,
  Clock,
  FileJson,
  Fingerprint,
  Globe,
  Hash,
  KeyRound,
  Link,
  Lock,
  Network,
  Palette,
  Regex,
  Server,
  Table,
} from 'lucide-react';

export type ToolCategoryId = 'json' | 'crypto' | 'converters' | 'network';

export type ToolStatus = 'coming-soon' | 'ready';

export interface ToolCategory {
  id: ToolCategoryId;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ToolMeta {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategoryId;
  status: ToolStatus;
  phase: number;
}

export const CATEGORIES: ToolCategory[] = [
  { id: 'json', title: 'JSON', description: 'Format, validate and convert JSON', icon: Braces },
  { id: 'crypto', title: 'Crypto', description: 'Encoding, hashing and tokens', icon: Lock },
  {
    id: 'converters',
    title: 'Converters',
    description: 'Convert between formats and units',
    icon: ArrowLeftRight,
  },
  {
    id: 'network',
    title: 'Network',
    description: 'DNS, latency and header inspection',
    icon: Network,
  },
];

export const TOOLS: ToolMeta[] = [
  {
    slug: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description: 'Format, minify and validate JSON with syntax errors highlighted.',
    icon: FileJson,
    category: 'json',
    status: 'ready',
    phase: 2,
  },
  {
    slug: 'json-to-csv',
    title: 'JSON ↔ CSV Converter',
    description: 'Flatten nested JSON into CSV and download the result.',
    icon: Table,
    category: 'json',
    status: 'coming-soon',
    phase: 3,
  },
  {
    slug: 'base64',
    title: 'Base64 Encoder / Decoder',
    description: 'Encode and decode text in Base64 with UTF-8 support.',
    icon: Binary,
    category: 'crypto',
    status: 'ready',
    phase: 2,
  },
  {
    slug: 'jwt-decoder',
    title: 'JWT Decoder',
    description: 'Decode JSON Web Token header, payload and signature locally.',
    icon: KeyRound,
    category: 'crypto',
    status: 'ready',
    phase: 2,
  },
  {
    slug: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate one or many UUID v4 identifiers instantly.',
    icon: Fingerprint,
    category: 'crypto',
    status: 'ready',
    phase: 2,
  },
  {
    slug: 'hash-generator',
    title: 'Hash Generator',
    description: 'Create MD5, SHA-1, SHA-256 and SHA-512 hashes locally.',
    icon: Hash,
    category: 'crypto',
    status: 'coming-soon',
    phase: 3,
  },
  {
    slug: 'url-encoder',
    title: 'URL Encoder / Decoder',
    description: 'Encode and decode URL components and query parameters.',
    icon: Link,
    category: 'converters',
    status: 'ready',
    phase: 2,
  },
  {
    slug: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Convert Unix timestamps to ISO and local time formats.',
    icon: Clock,
    category: 'converters',
    status: 'coming-soon',
    phase: 3,
  },
  {
    slug: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test regular expressions with live match highlighting.',
    icon: Regex,
    category: 'converters',
    status: 'coming-soon',
    phase: 3,
  },
  {
    slug: 'color-converter',
    title: 'Color Converter',
    description: 'Convert between HEX, RGB and HSL with a live color picker.',
    icon: Palette,
    category: 'converters',
    status: 'coming-soon',
    phase: 3,
  },
  {
    slug: 'ping',
    title: 'Ping / Latency',
    description: 'Measure latency and service health of any endpoint.',
    icon: Activity,
    category: 'network',
    status: 'coming-soon',
    phase: 4,
  },
  {
    slug: 'dns-lookup',
    title: 'DNS Lookup',
    description: 'Resolve A, AAAA, MX, TXT and NS records for a hostname.',
    icon: Globe,
    category: 'network',
    status: 'coming-soon',
    phase: 4,
  },
  {
    slug: 'http-headers',
    title: 'HTTP Headers Inspector',
    description: 'Inspect the HTTP response headers of any public URL.',
    icon: Server,
    category: 'network',
    status: 'coming-soon',
    phase: 4,
  },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(categoryId: ToolCategoryId): ToolMeta[] {
  return TOOLS.filter((tool) => tool.category === categoryId);
}
