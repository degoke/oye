# Running and handing off òye.

[Getting started](getting-started.md) · [Screenshot walkthrough](walkthrough.md) · [Deployment](deployment.md) · [Developer guide](development.md)

## Docker setup

[Docker Compose](docker.md) is the recommended local handoff. It builds the web/API, applies existing generated migrations before startup, and includes Node, pnpm, FFmpeg and fonts. Use `.env.docker` for runtime credentials and keep the named SQLite/media volume across restarts. The native setup below remains available.

## Local setup

Use Node 24 or newer and pnpm 12.11.2. Install FFmpeg and FFprobe with H.264, AAC and MP3 support. Video uses resvg and system fonts. The checked macOS environment provides Arial; a Linux host needs a Unicode sans-serif font with Yoruba, Hausa and Igbo glyphs and a rendered sample check before claiming equivalent output.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
chmod 600 .env
pnpm db:migrate
pnpm dev
```

Configure the selected provider's key in `.env`, never in chat or a browser setting. OpenAI through the OpenAI Agents SDK is the repository default. OpenRouter is an explicit alternate; the recorded local demo used that override. Direct OpenAI paid calls have no live-key acceptance evidence in this workspace. Read [providers](providers.md) before changing model IDs. Restart the API after changing configuration.

Open `http://127.0.0.1:5187`. Use the explicit IPv4 address because another local project may occupy IPv6 localhost. The Hono API listens on loopback port 3187. No login is required.

## Production build preview

```sh
pnpm typecheck
pnpm build
pnpm --filter @oye/api start
```

In a second terminal:

```sh
pnpm --filter @oye/web exec vite preview --host 127.0.0.1 --port 5187 --strictPort
```

The service worker runs only in production builds. Save a lesson while online before checking offline reload. Vite preview is a local acceptance tool, not a deployment server.

## Schema changes

Edit `packages/db/src/schema.ts`, then run:

```sh
pnpm db:generate
pnpm db:migrate
```

Review generated SQL before migration. Keep generated SQL, snapshots and journals together. Never write or edit migrations manually or use `drizzle-kit push`. The current migration sequence is 0000 through 0012. Existing SQLite data and `.data/media` form one deployment dataset; back up both consistently with the API stopped or with SQLite's backup API.

## Data and usage

Anonymous cookies expire after 30 days. Startup and ten-minute sweeps remove expired cookie sessions and owners inactive for 30 days with no remaining session. Cleanup aborts owned work, deletes media and cascades owned learning data. Temporary recording files are removed after processing; confirmed words and evidence remain until deletion or expiry. Missing published media invalidates its cached output at startup and requires an explicit retry. It never starts a paid regeneration automatically.

Clear history removes current-owner learning data and files, the cookie, and local saved text. Usage reservations remain for 31 days to keep the global budget after deletion. They store category, timestamp, random reservation ID and an optional hash of the anonymous owner, without learning text or credentials. Changing identity cannot reset the global limits.

Rolling 24-hour limits are 20 voice sessions globally and 8 per owner, 120 transcriptions globally and 24 per owner, 36 narrations globally and 24 per owner, and 24 videos globally and 12 per owner. Global provider-request bounds are 320 text, 24 search, 96 synthesis, 160 recognition and 24 native-voice calls. Failed calls consume reservations. Provider counts start at their activation; existing operation rows are backfilled. These bounds are not an exact dollar ledger. The provider key's user-set limit is the external spending cap.

At the final local audit, the voice session allowance was already exhausted for the rolling day. Do not increase limits or remove reservations to make a walkthrough pass. Use text and already prepared media, or wait until the reservations expire.

Saved text is an explicit local choice, limited to ten lessons, 2 MB and 30 days. It includes sources, excludes answer keys and learning evidence, and is associated with an opaque owner cache scope. A new online session invalidates the previous owner's local copies. Offline generation, tutoring, assessment and voice are outside scope.

Content-review logs record IDs and categories, without raw learner words or rejection explanations. Provider tracing is disabled. Do not forward `.env`, cookies, SQLite files or private `.data` walkthroughs to an external service.

## Deployment requirements

Publishing is a separate task. Serve the built web files and reverse-proxy `/api` and the voice WebSocket to the API under one HTTPS origin. Configure `WEB_ORIGIN` to that exact origin. Keep the API bound to loopback behind the proxy, preserve upgrade headers and appropriate long-running request timeouts, and deny public access to `.data` and `.env`.

Use a persistent disk for SQLite and owned media, a writable private temp folder, FFmpeg/FFprobe, and a checked font installation. Run one API process because queue and live-session coordination use process-local controllers. Apply generated migrations before starting a new build. Allow graceful shutdown so active jobs can resume on restart. An anonymous demo has no account recovery or cross-device sync.

## Evidence and limitations

See [language capabilities](languages.md), [milestone evidence](README.md), and [M12 audit](evidence/m12.md). Automated educational/source/language reviews do not certify native pronunciation or measured learning outcomes. The recorded retention-check incident and media recovery are retained in the M12 record. Natural microphone conversation, a physical phone with its keyboard, and a real screen-reader walkthrough remain unverified and were explicitly accepted by the user as demo limitations in D037. The demo is complete for that scope; future device verification and publishing are separate work.

## Source handoff

Run `pnpm package:source` to create `deliverables/oye-source.zip` and its SHA-256 checksum. The archive has an `oye/` root, application/workspace sources, generated migrations, docs and walkthrough images, and the current demo video. It excludes `.env`, dependencies, build outputs, SQLite/recordings, private `.data` and Git metadata. Extract it and follow Getting started with your own key. The internal `SOURCE-MANIFEST.json` records each bundled file’s size and checksum.

## GitHub contents

The Git candidate files contain source, generated migrations, one lockfile, container configuration, docs/evidence, the linked walkthrough and one current presentation. Duplicate/old video exports, auditions and preview copies are archived locally under `.data/repo-archive/`. Source ZIPs are generated for download and are excluded from Git. See [repository contents](development.md#repository-contents).
