# Architecture

Current implementation: 14 October 2026. The original planning baseline is retained in [the archive](archive/architecture-planning-baseline.md). [Developer guide](development.md) and [deployment](deployment.md) cover changes and hosting.

## Workspace

```text
apps/web/src/
  routes/              TanStack Router learning/tutor/progress/settings pages
  components/          Mantine compositions, recording and media controls
  lib/                 HTTP clients, translations, voice and saved lessons
  theme.ts             Mantine theme
  styles.css           Global layout and reading styles
apps/api/src/
  index.ts             Server, job services, retention and shutdown
  app.ts               Hono routes, request boundaries and owned responses
  config.ts            Validated server environment and model roles
  services/            Learning, agents, source discovery, jobs and media
packages/shared/src/   Zod contracts, types and interface translations
packages/db/src/       SQLite connection and Drizzle schema
packages/db/drizzle/   Generated migrations and metadata
docs/                 Product, engineering, walkthrough and evidence
scripts/              Source packaging
```

One pnpm workspace and lockfile connect these packages. The server is Node/Hono; the web client is React/Vite with Mantine and CSS modules. TanStack Router owns file routes and TanStack Query owns server-state requests/polling.

## Request and ownership boundaries

Browser → Hono → application service → SQLite/AI/media → validated response → browser.

`app.ts` assembles endpoint groups for session/preferences, journeys/assessments, lessons/practice, Explain Back, conversations/messages, progress, jobs, speech/voice and video. Public DTOs exclude expected answers. Shared Zod contracts validate browser and AI inputs/outputs.

Anonymous sessions use opaque HttpOnly cookies, stored token hashes, expiry and origin checks. Every learning record, job, conversation and media response is scoped to the server-resolved learner. IDs locate records; they do not grant ownership. Another owner's resource returns not found. HTTPS deployment uses secure cookies and one exact `WEB_ORIGIN`.

## Learning and evidence

SQLite/Drizzle stores learners, sessions, preferences, journeys, concept/content versions, assessments, practice attempts, conversations, Explain Back attempts, jobs, narrations/videos and retained usage reservations. JSON content retains source/rubric/language versions alongside relational ownership.

Explain Back saves an independent explanation and neutral follow-up answers before feedback. Findings quote the saved words. Repairs target specific gaps and include sources. A fresh application checks transfer. Demonstrated understanding requires all essential independent-explanation findings and a correct new application. An earlier misconception remains saved; opening content or finishing media does not change understanding.

## AI providers and source discovery

OpenAI through the **OpenAI Agents SDK** is the default. `services/ai.ts` builds typed agents, validates outputs and uses `OpenAIResponsesModel` for direct OpenAI GPT roles. Explicit `AI_PROVIDER=openrouter` selects the SDK Chat Completions adapter with the gateway URL. Role-specific models are environment-configurable; no provider fallback runs after failure. Tracing to a second provider is disabled.

`services/sources.ts` uses reviewed source bundles for photosynthesis/compound interest. Other objectives use the chosen provider. OpenAI uses Responses web search with approved educational domains, bounded tool/output use and validated citation positions/URLs. Its stored source notes are cited answer paragraphs, not claimed verbatim source quotations. OpenRouter retains its Exa web plugin. Later generation/review uses these notes and keeps the source links visible. See [providers](providers.md) for configuration and evidence.

Default GPT roles are `gpt-6-luna`. Dedicated transcription/narration/realtime models are separate from text roles. Provider keys are server-only. The local demo's existing `.env` explicitly selects OpenRouter; fresh configurations select OpenAI.

## Durable jobs and paid-use bounds

`generation.ts` coordinates saved jobs for planning, lessons, localization, feedback, narration and video. Jobs retain owner, immutable input/version, dedupe identity, status, retry counts and outputs. Explicit retries resume bounded work. Startup reconciliation invalidates missing published media and dependent outputs, preserving lessons and requiring explicit retry.

`usage.ts` reserves bounded provider/operation counts before paid work. Counts survive clearing learning history and expire after 31 days. The external provider-key allowance remains the dollar cap. Full limits and retention behavior are in [handoff](handoff.md).

## Speech and video

`audio.ts` handles container-limited normalization, transcription and synthesis. Confirmed transcription contexts are bound to owner, language and activity. A spoken objective is limited to 30 seconds and 600 confirmed characters, attached once to an explicit Start-learning request. Editing the objective detaches the receipt.

`speech.ts` independently checks synthesized chunks before publication. A private owner/job cache reuses only approved chunks with matching model, voice, text and checksum; it is removed on successful publication or owner cleanup. Failed audio stays withheld and text stays available. Yoruba narration recognition can use its explicitly configured separate recognizer; jobs snapshot that role, with no expected-script hint or hidden fallback.

`voice.ts` controls owned voice sessions and limits. OpenAI uses the Agents SDK Realtime path for tutor voice; OpenRouter uses the reviewed transcription/tutor/synthesis pipeline. Native replies are buffered until reviews pass. Accepted language/device evidence remains in [languages](languages.md) and [voice plan](voice-plan.md).

`video.ts` renders template slides from the immutable lesson script and approved narration using resvg/FFmpeg. It stores source references, transcript, timing and VTT captions. API routes serve media through ownership checks and bounded HTTP range handling. FFmpeg/FFprobe and suitable fonts are runtime dependencies.

## Offline text and lifecycle

The production web build emits an offline service worker. Saving is explicit: up to ten text lessons, 2 MB and 30 days, with sources and an opaque owner cache scope. Generation, feedback, tutoring and voice are online operations. A new online session invalidates the prior owner's local saved scope.

Anonymous learning expires after 30 days of inactivity. Startup/periodic cleanup aborts owned work, cascades records and removes media. Raw recordings are temporary; confirmed words remain until deletion/expiry. Usage reservations have a separate 31-day policy. Back up SQLite and media together.

## Migrations and deployment

Edit the TypeScript schema, run `pnpm db:generate`, review generated SQL/metadata, then `pnpm db:migrate`. Never hand-edit generated artifacts or use push. Current source packaging includes the complete generated sequence. A changed JSON TypeScript type may need no SQL migration; the generator confirms this.

Run one API process behind a web server serving `apps/web/dist`, proxying `/api` and voice WebSockets under one HTTPS origin. Persistent SQLite/media storage and graceful shutdown support recovery. Multi-process scaling needs shared queue/live-session coordination. See [deployment](deployment.md).

## Walkthrough and presentation assets

The repository-contained [static walkthrough](walkthrough.md) shows actual app screens; `docs/assets/walkthrough/captures.json` records their sources. `pnpm package:source` creates an allowlisted source ZIP and manifest, excluding private runtime state.

Local presentation sources in `.data/demo-production/` and `.data/demo-assets/` produced the finished video in `deliverables/`. The renderer uses Pillow/FFmpeg and real browser captures, with original Yoruba media and a selected presenter voice. It is a recording aid, not an app route or an ownership bypass. [Production notes](demo-production.md) retain the full edit/provenance record.


## Docker local handoff

`Dockerfile` builds from the pinned Node patch and frozen pnpm lockfile. The API image includes native dependencies, FFmpeg/FFprobe and Noto fonts; the web image serves the built Vite output through NGINX. Compose runs a generated-migration job before API health checks and web startup. Both migration/API use `/data` in one named volume, and the API runs as the Node user.

`API_HOST` defaults to loopback for native development and is explicitly `0.0.0.0` inside the container network. Only the web's loopback host port is published. `VIDEO_FONT_FAMILY` defaults to Arial natively and Noto Sans in Docker. `.env.docker` configures the API at runtime and is excluded from build context, images and source packages. Proxying preserves SSE and voice WebSocket upgrades. See [Docker guide](docker.md).
