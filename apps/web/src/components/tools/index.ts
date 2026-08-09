import { lazy, type ComponentType } from 'react';

const JsonFormatter = lazy(() =>
  import('./JsonFormatter').then((module) => ({ default: module.JsonFormatter })),
);
const Base64Tool = lazy(() =>
  import('./Base64Tool').then((module) => ({ default: module.Base64Tool })),
);
const UrlEncoder = lazy(() =>
  import('./UrlEncoder').then((module) => ({ default: module.UrlEncoder })),
);
const JwtDecoder = lazy(() =>
  import('./JwtDecoder').then((module) => ({ default: module.JwtDecoder })),
);
const UuidGenerator = lazy(() =>
  import('./UuidGenerator').then((module) => ({ default: module.UuidGenerator })),
);
const JsonToCsv = lazy(() =>
  import('./JsonToCsv').then((module) => ({ default: module.JsonToCsv })),
);
const HashGenerator = lazy(() =>
  import('./HashGenerator').then((module) => ({ default: module.HashGenerator })),
);
const TimestampConverter = lazy(() =>
  import('./TimestampConverter').then((module) => ({ default: module.TimestampConverter })),
);
const RegexTester = lazy(() =>
  import('./RegexTester').then((module) => ({ default: module.RegexTester })),
);
const ColorConverter = lazy(() =>
  import('./ColorConverter').then((module) => ({ default: module.ColorConverter })),
);
const Ping = lazy(() => import('./Ping').then((module) => ({ default: module.Ping })));
const DnsLookup = lazy(() =>
  import('./DnsLookup').then((module) => ({ default: module.DnsLookup })),
);
const HttpHeaders = lazy(() =>
  import('./HttpHeaders').then((module) => ({ default: module.HttpHeaders })),
);

export type ToolComponent = ComponentType<Record<string, never>>;

export const TOOL_COMPONENTS: Record<string, ToolComponent> = {
  'json-formatter': JsonFormatter,
  base64: Base64Tool,
  'url-encoder': UrlEncoder,
  'jwt-decoder': JwtDecoder,
  'uuid-generator': UuidGenerator,
  'json-to-csv': JsonToCsv,
  'hash-generator': HashGenerator,
  'timestamp-converter': TimestampConverter,
  'regex-tester': RegexTester,
  'color-converter': ColorConverter,
  ping: Ping,
  'dns-lookup': DnsLookup,
  'http-headers': HttpHeaders,
};
