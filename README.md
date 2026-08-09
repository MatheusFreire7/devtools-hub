# DevTools Hub

[![CI](https://github.com/MatheusFreire7/devtools-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/MatheusFreire7/devtools-hub/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/MatheusFreire7/devtools-hub)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/MatheusFreire7/devtools-hub)](https://github.com/MatheusFreire7/devtools-hub/releases)

A curated suite of developer utilities — format, convert, validate and inspect data. Client-side
tools run entirely in your browser; your data never leaves your machine. A small API powers the
network tools (DNS, latency, HTTP headers) with built-in protections.

## Features

- **13 ready tools** across four categories:
  - **JSON** — formatter & validator, JSON ↔ CSV converter
  - **Crypto** — Base64, JWT decoder, UUID generator, hash generator
  - **Converters** — URL encoder/decoder, timestamp converter, regex tester, color converter
  - **Network** — ping/latency, DNS lookup, HTTP headers inspector
- A **command palette** (`Ctrl/Cmd + K`) to jump straight to any tool, with your recent tools
  persisted locally.
- **Light/dark theme** that remembers your choice.
- Privacy-first: local utilities never send your data to a server.
- Keyboard-friendly and accessible (skip link, focus management, ARIA landmarks).

## Tech stack

| Layer    | Tools                                                           |
| -------- | --------------------------------------------------------------- |
| Frontend | React 19, React Router, Tailwind CSS 4, Zustand, TanStack Query |
| Backend  | Node.js, Express 5, Zod, Helmet, CORS, rate limiting            |
| Build    | TypeScript, Vite, pnpm workspaces, Turborepo                    |
| Quality  | Vitest, Testing Library, Playwright, ESLint, Prettier, Husky    |

## Monorepo layout

```
apps/
  web/     React web app (Vite)
  api/     Express backend for network tools
packages/
  shared/  Shared TypeScript types and schemas
e2e/       Playwright end-to-end tests
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 22
- [pnpm](https://pnpm.io/) ≥ 9

### Install

```bash
pnpm install
```

### Run the development environment

```bash
pnpm dev
```

This starts both the API (`http://localhost:4000`) and the web app
(`http://localhost:5173`). Open the web app in your browser.

### Commands

| Command                 | Description                               |
| ----------------------- | ----------------------------------------- |
| `pnpm dev`              | Run the API and web app in watch mode     |
| `pnpm build`            | Build all packages                        |
| `pnpm lint`             | Lint the whole workspace                  |
| `pnpm typecheck`        | Type-check all packages                   |
| `pnpm test`             | Run unit and component tests              |
| `pnpm test:e2e`         | Run Playwright end-to-end tests           |
| `pnpm test:e2e -- --ui` | Run end-to-end tests in the Playwright UI |
| `pnpm format`           | Format the whole workspace with Prettier  |

For end-to-end tests you need the Playwright browser binaries first:

```bash
pnpm exec playwright install chromium
```

### Environment variables

| Variable      | App | Default                 | Description                             |
| ------------- | --- | ----------------------- | --------------------------------------- |
| `PORT`        | API | `4000`                  | Port the API listens on                 |
| `CORS_ORIGIN` | API | `http://localhost:5173` | Comma-separated list of allowed origins |

In development the web app proxies `/api` to `http://localhost:4000` (see `apps/web/vite.config.ts`).

## API reference

All routes are prefixed with `/api/v1` and rate-limited (60 requests/minute).

| Method | Path                   | Body                               | Description              |
| ------ | ---------------------- | ---------------------------------- | ------------------------ |
| `GET`  | `/`                    | —                                  | Service metadata         |
| `GET`  | `/api/v1/ping`         | —                                  | Health/latency check     |
| `POST` | `/api/v1/dns-lookup`   | `{ "hostname": "example.com" }`    | Resolve DNS records      |
| `POST` | `/api/v1/http-headers` | `{ "url": "https://example.com" }` | Inspect HTTP headers[^1] |

[^1]:
    The HTTP headers endpoint validates the URL to prevent server-side request forgery (SSRF)
    and only returns the status line and headers — never the response body.

## Testing

- **Unit/component** (`pnpm test`): Vitest + Testing Library + User Events, plus Playwright as the
  e2e runner.
- **End-to-end** (`pnpm test:e2e`): Playwright drives real browsers against the running API and web
  app — navigation, command palette, theme persistence, and every tool's primary flow.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

## License

[MIT](LICENSE)
