# Run òye. with Docker Compose

[← Project home](../README.md) · [Screenshot walkthrough](walkthrough.md) · [Native setup](getting-started.md)

Docker Compose packages Node, pnpm, native SQLite dependencies, FFmpeg/FFprobe and fonts. You only need Docker with Compose 2.24+ running on the host, and your own provider key for AI features. The first build downloads images and pinned dependencies; later builds reuse the cache.

## First run

From the project root:

```sh
cp .env.docker.example .env.docker
chmod 600 .env.docker
```

Set `OPENAI_API_KEY` in `.env.docker`, then:

```sh
docker compose up --build -d
```

Open **http://127.0.0.1:5187**. Use that exact address for the app's origin checks. There is no login. OpenAI through the OpenAI Agents SDK is the default. Without a key, the interface/preferences work; new AI learning needs configuration. The [screenshot tour](walkthrough.md) needs no key.

`.env.docker` is separate from a native developer's `.env`. It is ignored by Git and excluded from image builds/source packages. Permanent keys only enter the API container at runtime; the browser and migration job receive no provider keys. Avoid sharing full container/environment inspection output because it can contain credentials.

## What starts

| Service | Purpose |
| --- | --- |
| `migrate` | Applies existing generated Drizzle migrations, then exits |
| `api` | One Node/Hono process, agent workflows, jobs, speech and media |
| `web` | Built React app, SPA route fallback and same-origin API/SSE/WebSocket proxy |

Compose waits for migration success before starting the API, then for API health before starting the web server. SQLite needs no separate database container. Only the web port is published, bound to the host's loopback interface. The API binds to the container network internally.

One named volume, `oye-data`, stores `/data/oye.sqlite`, owned media and private temporary audio. The API and migration job run as the unprivileged Node user. No existing `.data` folder is copied into this volume. Containers render video with bundled Noto Sans; native setup retains its configurable Arial default.

## Check and manage

```sh
docker compose ps -a
docker compose logs --tail=100 migrate api web
docker compose down
docker compose up -d
```

`down` stops/removes this Compose project's containers and network. Its named data volume stays, so the same browser can resume after startup. Keep the browser's anonymous cookie. `migrate` exiting with code 0 is expected.

After changing `.env.docker`, recreate the API so it loads the new configuration:

```sh
docker compose up -d --force-recreate api web
```

To use OpenRouter, explicitly set `AI_PROVIDER=openrouter` and `OPENROUTER_API_KEY` in `.env.docker`. Role-specific model variables from [providers](providers.md) can be added to that file. There is no automatic provider fallback.

## Use another port

If the native demo already uses 5187:

```sh
OYE_DOCKER_PORT=5193 docker compose up --build -d
```

Open http://127.0.0.1:5193. Use the same `OYE_DOCKER_PORT` for subsequent Compose commands so the rendered configuration stays consistent. Compose sets `WEB_ORIGIN` to match automatically. An alternate `OYE_ENV_FILE` can select a different runtime environment file; it is never a Docker build argument.

Commands here use a POSIX shell. In PowerShell, set `$env:OYE_DOCKER_PORT = "5193"` before running Compose.

## Updates and migrations

```sh
docker compose down
docker compose up --build -d
```

The existing volume is reused and the migration job applies only pending generated migrations. Back up data before updating a stored database. Startup applies migrations; it never writes them. For schema changes, use the normal [Drizzle generator workflow](development.md#schema-changes), review SQL/metadata, then rebuild. Never use `drizzle-kit push`.

## Back up and restore

Stop the API before making a coherent SQLite/media backup:

```sh
docker compose stop api web
mkdir -p backups
docker compose run --rm --no-deps -T migrate tar -C /data -czf - . > backups/oye-data.tar.gz
docker compose up -d
```

Keep backups private because they contain learner data. To restore that dataset into a compatible release, stop API/web and use a new Compose project name so its volume is empty. This example uses `oye-restored`:

```sh
docker compose -p oye-restored build
docker compose -p oye-restored run --rm --no-deps -T migrate tar -C /data -xzf - < backups/oye-data.tar.gz
docker compose -p oye-restored up -d
```

Use `-p oye-restored` for subsequent management commands. An empty destination avoids leaving old unrelated files beside the restored dataset. Keep the database and media together. Avoid `down -v` during normal use: it deletes the stored learning volume. Use explicit volume management only when intentionally resetting the demo.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Cannot connect to Docker | Start Docker Desktop or the host's Docker daemon. |
| Port 5187 is occupied | Use `OYE_DOCKER_PORT` as above. |
| API/web never become healthy | Read `migrate` and API logs; a failed migration prevents startup. |
| Provider not configured | Check `.env.docker`, then recreate API/web. Native `.env` is not the API runtime file. |
| Browser POST returns origin error | Open the exact IPv4 URL and port configured by Compose. |
| Lesson/media missing after switching setup | Docker and native setup use separate storage; existing native data is not imported. |

This is a local runnable handoff. A hosted pilot still needs HTTPS, a reviewed public origin, private runtime configuration and persistent backups. See [deployment](deployment.md) and [capability evidence](languages.md). Container startup does not certify live OpenAI quality or native-language pronunciation.

The service ordering follows [Docker's Compose guidance](https://docs.docker.com/compose/how-tos/startup-order/). The proxy follows [NGINX's WebSocket guidance](https://nginx.org/en/docs/http/websocket.html), with buffering disabled for tutor SSE streams.
