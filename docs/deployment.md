# Deploying a hosted pilot

[← Project home](../README.md) · [Local setup](getting-started.md) · [Operational handoff](handoff.md)

This is the deployment path for the current single-server prototype. No hosted deployment is claimed here.

## Container packaging

The [Docker setup](docker.md) provides built web/API images, same-origin proxying, a migration job and persistent SQLite/media storage. Its default Compose port is loopback HTTP for local use. A hosted pilot still needs an HTTPS reverse proxy and the exact public `WEB_ORIGIN`, reviewed persistent backups and private runtime configuration. Container images include Node, pnpm, FFmpeg and fonts; those tools need not be installed separately on the Docker host.

## Host requirements

Use Node.js 24+, pnpm 12.11.2, FFmpeg/FFprobe and target-language fonts. Run one long-running Hono process because job/live-voice coordination is process-local. Provide persistent storage for SQLite, media and temporary audio, and a web server serving/proxying one HTTPS origin.

## Build and configure

```sh
pnpm install --frozen-lockfile
cp .env.example .env
```

Set `OPENAI_API_KEY`, `AI_PROVIDER=openai`, and `WEB_ORIGIN` to the public HTTPS origin. Use persistent absolute `DATABASE_PATH` and `MEDIA_PATH` if releases replace the checkout. Keep `.env` private. OpenRouter is an explicit alternative.

```sh
pnpm db:migrate
pnpm typecheck
pnpm build
pnpm --filter @oye/api start
```

Use the host's service manager to restart the API after failure and deliver SIGTERM for graceful shutdown. It binds to `127.0.0.1` on `API_PORT`, default 3187. Install from the root; the compiled API still needs installed runtime dependencies.

## Serve one origin

| Request | Destination |
| --- | --- |
| `/api` and `/api/*` | Proxy to `127.0.0.1:3187`, preserving origin/request headers |
| Voice WebSocket under `/api` | Same target, preserving upgrade headers |
| Built files | Serve `apps/web/dist` |
| Client routes such as `/learn/...` | Return `index.html` when no static file matches |

Use HTTPS, an exact `WEB_ORIGIN` match, and timeouts suitable for bounded generation/speech. Deny public access to `.env`, `.data` and private media folders. Media is served through owned API routes. Vite preview is not the production server.

## Release and recovery

1. Stop the API gracefully before a release or coherent backup.
2. Back up SQLite and media as one dataset.
3. Install frozen dependencies, apply generated migrations and build.
4. Start one API process. Check `/api/health`, `/api/capabilities` and a client deep link.
5. Check an owned lesson and media download.

Do not restore SQLite while leaving unrelated media. Startup invalidates missing media without erasing lessons. Paid regeneration requires explicit retry. Keep migration backups rather than editing generated SQL for rollback.

## Beyond the prototype

A hosted pilot can use the existing anonymous sessions. Evaluate account recovery/cross-device learning, teacher workflows, curriculum alignment, language review and measured learning outcomes with participants. Multiple API processes need shared queue/voice coordination and a reviewed storage design. Add those changes as milestones through the normal workflow.

[Handoff](handoff.md), [language capabilities](languages.md) and [status](status.md) maintain the exact retention, spending and capability evidence.
