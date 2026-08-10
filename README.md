# DevTools Hub

[![CI](https://github.com/MatheusFreire7/devtools-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/MatheusFreire7/devtools-hub/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/MatheusFreire7/devtools-hub?v=2)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/MatheusFreire7/devtools-hub?v=2)](https://github.com/MatheusFreire7/devtools-hub/releases)

A curated suite of developer utilities — format, convert, validate and inspect data. Client-side
tools run entirely in your browser; your data never leaves your machine. A small API powers the
network tools (DNS, latency, HTTP headers) with built-in protections.

**Live demo:** <https://devtools-hub-web.onrender.com> (API: <https://devtools-hub-api.onrender.com>)

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

| Variable          | App | Default                 | Description                                  |
| ----------------- | --- | ----------------------- | -------------------------------------------- |
| `PORT`            | API | `4000`                  | Port the API listens on (Render sets its own) |
| `CORS_ORIGIN`     | API | `http://localhost:5173` | Comma-separated list of allowed origins      |
| `VITE_API_BASE_URL` | Web | *(empty)*            | Absolute URL of the deployed API (production build) |

In development the web app proxies `/api` to `http://localhost:4000` (see `apps/web/vite.config.ts`);
the proxy is a dev-only convenience. In a production build the browser talks directly to the API at
`VITE_API_BASE_URL`, so that variable must point to the deployed API (set it as a build-time env var
on Render).

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

## Deployment (Render)

Live demo: <https://devtools-hub-web.onrender.com>. The repository ships a
[`render.yaml`](render.yaml) Blueprint that deploys both services in one click:

| Service     | Type        | Start / build command                                                     | Port / serve |
| ----------- | ----------- | ------------------------------------------------------------------------- | ------------ |
| `devtools-hub-api` | Web Service (free) | `pnpm --filter @devtools-hub/api start`                          | listens on `$PORT` (default `4000`) |
| `devtools-hub-web` | Web Service (free) | `pnpm install --frozen-lockfile && pnpm --filter @devtools-hub/web build` | `pnpm --filter @devtools-hub/web start` serves `apps/web/dist` |

> Running everything on the free tier means both services spin down after ~15 min of inactivity and
> cold-start on the next visit (a few seconds).

### Environment variables (set in the Render dashboard)

| Variable          | Service | Description                                              |
| ----------------- | ------- | -------------------------------------------------------- |
| `PORT`            | API     | Render injects its own port; leave unset to default `4000` |
| `CORS_ORIGIN`     | API     | `https://devtools-hub-web.onrender.com` so the browser can call the API |
| `VITE_API_BASE_URL` | Web   | `https://devtools-hub-api.onrender.com` — required at build time |

Since the web app is served on a different origin than the API, both variables are mandatory for
the network tools to work in production. Do not set `VITE_API_BASE_URL` during local development —
the `/api` dev proxy handles that case.

### Uptime monitoring

The health-check probe is `GET /api/v1/ping` (returns JSON `{ "status": "ok", ... }`). It doubles as
Render's own health check (`healthCheckPath`) and as a target for external uptime monitors such as
UptimeRobot or Better Stack, e.g. `curl https://devtools-hub-api.onrender.com/api/v1/ping`.

### Verify the deployed stack

A dedicated Playwright config runs end-to-end checks (page loads, API probe, and every network tool
through real CORS) against the deployed URLs. These live in `e2e-deployed/` and are intentionally
excluded from the standard `pnpm test:e2e` run:

```bash
E2E_WEB_URL=https://devtools-hub-web.onrender.com \
E2E_API_URL=https://devtools-hub-api.onrender.com \
pnpm exec playwright test --config playwright.deployed.config.ts
```

Or trigger the **Deploy verify** GitHub Actions workflow (manual dispatch) with the same inputs.

## Testing

- **Unit/component** (`pnpm test`): Vitest + Testing Library + User Events, plus Playwright as the
  e2e runner.
- **End-to-end** (`pnpm test:e2e`): Playwright drives real browsers against the running API and web
  app — navigation, command palette, theme persistence, and every tool's primary flow.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

## License

[MIT](LICENSE)
