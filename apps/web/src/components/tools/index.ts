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

export type ToolComponent = ComponentType<Record<string, never>>;

export const TOOL_COMPONENTS: Record<string, ToolComponent> = {
  'json-formatter': JsonFormatter,
  base64: Base64Tool,
  'url-encoder': UrlEncoder,
  'jwt-decoder': JwtDecoder,
  'uuid-generator': UuidGenerator,
};
