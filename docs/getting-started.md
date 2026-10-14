# Run òye. locally

[← Project home](../README.md) · [Screenshot walkthrough](walkthrough.md)

## Choose your setup

For the simplest local run, use [Docker Compose](docker.md). It packages the runtime, media tools and fonts, and applies generated migrations on startup. The steps below are for native development without Docker.

## Prerequisites

Use Node.js 24+, pnpm 12.11.2, FFmpeg/FFprobe with MP3/AAC/H.264 support, and fonts covering Yoruba, Hausa and Igbo. The recorded macOS environment uses Arial. Install a suitable Unicode font on other hosts and inspect rendered language samples. Commands below use a POSIX shell.

The repository includes `.nvmrc` for Node 24. If you use nvm, run `nvm install` and `nvm use` in the project root before installing dependencies. Check `node --version` in that directory; a shell's directory hook can otherwise select an older Node release.

## Install

From the extracted project or repository root:

```sh
node --version
pnpm --version
pnpm install --frozen-lockfile
cp .env.example .env
chmod 600 .env
```

Use the one root lockfile. Do not install each workspace package separately or copy another developer's `node_modules`.

## Configure OpenAI

Fill in `OPENAI_API_KEY` locally in `.env`. The template selects `AI_PROVIDER=openai`; GPT roles default to `gpt-6-luna`. The [official Agents SDK quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart?lang=javascript) describes API-key setup. Keep keys out of the browser and source control.

Separate variables configure planning, lessons, tutoring, evaluation, source search, transcription, narration and realtime voice. See [providers](providers.md). To use the optional gateway, explicitly set `AI_PROVIDER=openrouter` and `OPENROUTER_API_KEY`. No provider fallback occurs automatically. Local `.env` and process variables override repository defaults.

Without a key, the interface and preferences work; new AI learning and media need configuration. The [screenshot tour](walkthrough.md) shows the full flow without API calls.

## Migrate and start

```sh
pnpm db:migrate
pnpm dev
```

Open http://127.0.0.1:5187. The API runs at http://127.0.0.1:3187. Vite proxies `/api` and voice WebSockets. Use the explicit IPv4 address. Migrations create a fresh local database without an AI key.

- `/api/health` returns `status: ok`.
- `/api/capabilities` reports the provider/model, key readiness and fixture setting, without exposing credentials.

No login is required. An anonymous session resumes learning in the same browser.

## First learning request

1. Enter "Teach me photosynthesis" and start learning.
2. Answer or skip the starting questions, then open the lesson.
3. Explain which inputs are materials and what role light plays in Explain Back.
4. Answer the actual follow-up, read feedback and any repair, then explain again.
5. Apply the idea to the new scenario. Opening a lesson or finishing a video does not award understanding.
6. Choose media on demand, or save text for later.

## Build and preview

```sh
pnpm typecheck
pnpm build
pnpm --filter @oye/api start
```

In another terminal:

```sh
pnpm --filter @oye/web exec vite preview --host 127.0.0.1 --port 5187 --strictPort
```

The offline service worker runs in production builds. Save text online before opening it offline. Vite preview is for local inspection; see [deployment](deployment.md) for a hosted server.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Port already in use | Stop the conflicting process, or change `API_PORT`. A different web port requires matching `WEB_ORIGIN` and Vite settings. |
| Provider not configured | Check the key for the selected provider and restart the API. |
| Model rejected | Check the role-specific model and account access. No model/provider switch happens automatically. |
| Database table missing | Run `pnpm db:migrate` from the root and check `DATABASE_PATH`. |
| Media cannot render | Check FFmpeg/FFprobe, codecs and fonts. Text remains available. |
| Microphone unavailable | Upload a recording, review and confirm the recognized words, or type. |
| Text does not open offline | Use a production build and explicitly save it online first. |

See [handoff](handoff.md) for retention, quotas, recovery and evidence.
