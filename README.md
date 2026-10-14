# òye.

> Learning that understands you.
>
> Learn anything. In your language. In your way.

## Start here

**[Walk through the app with screenshots →](docs/walkthrough.md)**

[See the video explainer](docs/walkthrough.md#4-watch-the-video-explainer) · [Watch it in Yoruba](docs/walkthrough.md#11-watch-photosynthesis-in-yoruba)

[Run with Docker](docs/docker.md) · [Native setup](docs/getting-started.md) · [Developer guide](docs/development.md) · [Architecture](docs/architecture.md) · [Deploy a pilot](docs/deployment.md) · [Documentation index](docs/README.md)

òye. is an adaptive learning companion. A learner asks a question, gets a sourced lesson, explains it back, and receives teaching targeted to the gaps in that explanation. A fresh application checks whether the idea transfers to a new situation.

English, Yoruba, Hausa and Igbo text are supported. Learners can read, listen, watch, ask the tutor, and save text for intermittent connectivity. No signup is required for the demo.

## Run with Docker Compose

Recommended for a quick local handoff. Docker includes Node, pnpm, FFmpeg and fonts.

```sh
cp .env.docker.example .env.docker
```

Set `OPENAI_API_KEY` in `.env.docker`, then:

```sh
docker compose up --build -d
```

Open **http://127.0.0.1:5187**. Compose applies generated migrations automatically and preserves learning/media in a named volume. [Docker guide](docs/docker.md) covers ports, configuration, logs, backups and updates.

## Run locally without Docker

Use Node.js 24+, pnpm 12.11.2, FFmpeg/FFprobe for media, and fonts covering the target languages. Full setup and troubleshooting are in [Getting started](docs/getting-started.md).

```sh
pnpm install --frozen-lockfile
cp .env.example .env
```

Set `OPENAI_API_KEY` in `.env`, then:

```sh
pnpm db:migrate
pnpm dev
```

Open **http://127.0.0.1:5187**. The Hono API runs on port 3187. Without a provider key, the shell and preferences work; new AI lessons and media require a configured provider.

## OpenAI by default

The default is **OpenAI through the OpenAI Agents SDK**. The server uses Responses for GPT text roles, dedicated speech APIs for audio, and the SDK Realtime integration for direct voice. Credentials stay on the server.

```dotenv
AI_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_TEXT_MODEL=gpt-6-luna
```

**OpenRouter is optional.** Select it explicitly with `AI_PROVIDER=openrouter` and `OPENROUTER_API_KEY`. Both providers use the OpenAI Agents SDK for agent workflows. There is no automatic provider fallback. Restart the API after configuration changes. See [provider configuration](docs/providers.md) for role-specific models and source discovery.

## Project structure

| Location | Responsibility |
| --- | --- |
| `apps/web` | React, Vite, TanStack Router and Mantine learning interface |
| `apps/api` | Hono routes, anonymous ownership, agent workflows, jobs and media |
| `packages/shared` | Zod contracts, domain types and translated interface messages |
| `packages/db` | SQLite, Drizzle schema and generated migrations |
| `docs` | Walkthrough, setup, architecture, decisions and evidence |
| `scripts` | Reproducible source packaging |
| `Dockerfile`, `compose.yaml`, `docker` | Container build, local services and web proxy |
| `AGENTS.md` | Codex working rules and documentation map |

One pnpm workspace and one lockfile keep installation reproducible.

## Development commands

```sh
pnpm typecheck
pnpm build
pnpm test
pnpm exec playwright install chromium
pnpm check:browser
```

For schema changes, edit the TypeScript schema, run `pnpm db:generate`, review the output, then run `pnpm db:migrate`. Never handwrite migration SQL or use `drizzle-kit push`.

See [Contributing](CONTRIBUTING.md), [the developer guide](docs/development.md) and [handoff](docs/handoff.md) for the working conventions, operational limits and retention.

## Demo and reuse

The [4:10 pitch](docs/pitch.md) covers the problem, learning change, Yoruba voice/video, Codex's role and the proposed pilot. [Watch the demo](deliverables/oye-demo-v2.mp4).

```sh
pnpm package:source
```

This creates `deliverables/oye-source.zip` with source, generated migrations, documentation, walkthrough images and the current demo. It excludes credentials, saved learner data, dependencies and build outputs. Extract it and follow the same setup above.

The project is a working prototype with a documented path to a hosted pilot. [Deployment](docs/deployment.md) covers one-origin serving, persistent storage, backups and growth beyond the prototype. [Language capabilities](docs/languages.md) and [status](docs/status.md) record the accepted demo scope and evidence.
