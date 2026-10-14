# Developer guide

[← Project home](../README.md) · [Architecture](architecture.md) · [Contributing](../CONTRIBUTING.md)

## Where to work

| Change | Start here |
| --- | --- |
| Learning, tutor, progress or preferences UI | `apps/web/src/routes/` |
| Reusable interface/media controls | `apps/web/src/components/` |
| Theme/layout | `apps/web/src/theme.ts`, `styles.css` and CSS modules |
| HTTP routes/validation | `apps/api/src/app.ts` |
| Learning, ownership, jobs, speech/media | `apps/api/src/services/` |
| Provider/agent execution | `apps/api/src/config.ts`, `services/ai.ts` |
| Source discovery | `apps/api/src/services/sources.ts` |
| Contracts and translations | `packages/shared/src/` |
| Schema and generated migrations | `packages/db/src/schema.ts`, `packages/db/drizzle/` |

TanStack Router generates the route tree. Keep generated output under its generator's control.

## Learning and ownership

The API owns learning progress. Explain Back saves an independent explanation, asks neutral follow-ups, reviews source/rubric findings, then offers a repair and fresh application. A demonstrated state requires essential ideas in the independent explanation and a correct fresh application. A corrected application alone does not erase an earlier misconception. Preserve attempts and the source/rubric versions used.

Use shared Zod contracts at browser/API and AI boundaries. Learner text and generated content are untrusted. Public responses exclude answer keys. Ownership comes from the server's anonymous session, not a browser-supplied owner ID.

## AI and media

OpenAI is the default. Planning, lessons, tutoring and evaluation use the OpenAI Agents SDK. OpenRouter is an optional Chat Completions gateway through the same SDK. Credentials stay on the API server.

Source discovery follows the selected provider. OpenAI uses Responses web search and validated cited source notes; OpenRouter uses its web plugin. Photosynthesis/compound interest use reviewed source bundles. Keep note derivation documented and sources visible.

Jobs retain input versions, ownership, status and retry counts. Narration is published after fidelity checks; video uses reviewed narration. Text remains available when media fails. Usage counts survive clearing learning history. See [provider notes](providers.md) and [handoff](handoff.md).

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run API and web development servers |
| `pnpm check` | Typecheck, package tests and production build, stopping on failure |
| `pnpm typecheck` | Type-check the workspace |
| `pnpm build` | Compile the API and web client |
| `pnpm test` | Existing package test suites |
| `pnpm check:browser` | Existing Playwright suites after browser installation |
| `pnpm db:generate` | Generate migration SQL and metadata |
| `pnpm db:migrate` | Apply generated migrations |
| `pnpm package:source` | Source handoff ZIP and checksum |

Record the scope of each check. Keyless startup/type checks do not prove paid provider quality. Live checks should identify provider, model and language.

## Schema changes

Edit the TypeScript schema, run `pnpm db:generate`, review the output, then `pnpm db:migrate`. Include SQL and metadata together. Never hand-edit generated migrations or use `drizzle-kit push`. Document a generator problem before choosing another approach. A JSON TypeScript change may need no SQL change; confirm with the generator.

## Documentation

Read `AGENTS.md`, the docs index and status first. Work through the current milestone. Record choices in decisions and update the affected spec/architecture. Keep current instructions distinct from dated evidence. Refresh the screenshot walkthrough after behavior changes; capture provenance is in `docs/assets/walkthrough/captures.json`. Keep credentials, cookies and learner databases out of docs and packages.


## Repository contents

Commit app/package source, existing tests, generated Drizzle migrations/metadata, the root lockfile, container configuration and current docs. Keep the fourteen walkthrough images, its reviewed Yoruba explainer/captions, and the current pitch/captions/script/poster because the README tour links to them.

`deliverables/` uses an explicit Git allowlist for those current presentation files. Local archives, trial media, cached production frames/audio, `.env` files, learner databases, backup archives, dependencies, builds, coverage, logs and source ZIPs are excluded. The source packager follows the same curated presentation list and skips generated caches. Its ZIP is a local handoff, not a file to commit.

Before staging, inspect `git status --short` and `git ls-files --cached --others --exclude-standard`. Review changes and the files included; do not add ignored runtime folders with force. Keep dated verification and failed-review records in docs.


## Continuous integration

[GitHub CI](https://github.com/degoke/oye/actions/workflows/ci.yml), configured in `.github/workflows/ci.yml`, runs the same `pnpm check` used locally. It runs on pushes to `main`, pull requests and manual dispatch. The job uses Node from `.nvmrc`, pnpm from `packageManager`, dependency-store caching and frozen lockfile installation. Action versions are pinned to immutable commits and the job has read-only repository access.

The package test phase runs existing Vitest API/session and microphone-helper tests. They use temporary databases and generated migrations, require no provider keys, and make no paid AI calls. Browser checks, paid provider quality and device/native-language verification retain their separate procedures. CI neither generates migrations nor uses live learner storage.
