# Contributing to DevTools Hub

Thanks for taking the time to contribute! This guide covers how to set up the project, follow the
conventions, and ship a new tool.

## Development workflow

1. **Fork** the repository and create a branch from `main`.
2. **Install dependencies** with `pnpm install`.
3. **Make your changes** — see [Adding a new tool](#adding-a-new-tool) below.
4. Run the full quality gate locally:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm exec playwright install chromium  # first time only
   pnpm test:e2e
   pnpm build
   ```
5. **Commit** with a [Conventional Commits](https://www.conventionalcommits.org) style message, then
   open a pull request.

The CI pipeline runs the same checks, so passing the local quality gate is a strong signal.

## Code style

- **Formatting:** Prettier (single quotes, semicolons, 100-char lines). `pnpm format` writes,
  `pnpm format:check` verifies.
- **Linting:** ESLint with the shared config at the repo root. `pnpm lint` checks everything.
- **Type safety:** strict TypeScript everywhere; `pnpm typecheck` must pass.
- **Tests:** new or changed behavior must be covered by Vitest unit/component tests and, for
  user-facing flows, a Playwright spec.
- **No secrets:** never commit API keys, tokens, or credentials. Keep anything sensitive out of the
  repo.

## Adding a new tool

Tools follow a predictable pattern. To add one:

1. **Create the component** in `apps/web/src/components/tools/<ToolName>.tsx`. Pure logic belongs in
   `apps/web/src/lib/utils/` and must not depend on React.
2. **Register the tool** by appending an entry to `TOOLS` in
   `apps/web/src/config/tools.ts` with its `slug`, `title`, `description`, `icon`, `category` and
   `phase`. Pick a `LucideIcon` consistent with the category.
3. **Wire up routing** if the slug is new — routes render by slug lookup (see
   `apps/web/src/pages/ToolPage.tsx`), so registering it in the config is usually enough.
4. **Add tests** in `apps/web/src/tests/`:
   - unit tests for the `lib/utils` logic;
   - a component test using Testing Library + User Events;
   - add the tool to `e2e/tools-meta.ts` and a Playwright spec covering its primary flow.
5. **Run the quality gate** listed above.

Patterns worth reusing: `Banner` for privacy/error notices, `Button`/`CopyButton`/`Input`/`Textarea`
UI primitives, and the `cn` helper for conditional classes.

## Network tools

Tools that need a server live on the API in `apps/api/src/routes/`. Validate all inputs with Zod
schemas (in `packages/shared`) and follow the existing SSRF protections in `ssrf.ts`. Every new
endpoint needs API tests (`*.test.ts`) reflecting both success and error paths.

## Commit conventions

- Use Conventional Commits, e.g. `feat: add HTML validator tool`, `fix: handle empty regex flags`,
  `test: cover color converter`, `docs: document API rate limits`.
- Keep commits focused on one concern. The repo history uses short lowercase summaries.

## Questions?

Open an issue or start a discussion — happy to help you land your first contribution.
