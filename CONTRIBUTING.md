# Contributing to òye.

Start with [AGENTS.md](AGENTS.md), [status](docs/status.md), [Getting started](docs/getting-started.md) and the [developer guide](docs/development.md).

Use [Docker Compose](docs/docker.md) for a packaged local run, or the native setup for development. Keep `.env.docker` and private backups out of source control and image builds.

- Use pnpm, the root lockfile and the existing TypeScript/Hono/React/Vite/TanStack/Mantine structure.
- OpenAI and the OpenAI Agents SDK are defaults. Select OpenRouter explicitly when needed. Keep keys in a local `.env`.
- Tie focused changes to documented milestones. Preserve user changes and learning evidence.
- Validate contracts and ownership on the server. Preserve sources, attempts and text fallback.
- Generate migrations through Drizzle; include generated SQL and metadata together.
- Update documentation when changing behavior, models, data or setup.

Run the relevant type/build and focused acceptance checks. Run existing tests when requested or required by the task. Identify paid API, native-language and actual-device checks separately. Describe what changed, why, the evidence checked and remaining work.

Use `codex/` as the default branch prefix for Codex work. Keep credentials, dependencies, private recordings and local SQLite data out of commits. `pnpm package:source` creates a ZIP handoff from an allowlist. Hosting or publishing is a separate action.

Keep presentation exports curated: one current pitch and the linked walkthrough assets. Archive experiments locally under `.data`; source ZIPs, caches, recordings and backups stay ignored. See [repository contents](docs/development.md#repository-contents).
