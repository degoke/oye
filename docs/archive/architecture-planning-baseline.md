# Architecture

Date: 13 October 2026. Status: proposed implementation baseline.

## Stack and boundaries

| Area | Choice | Responsibility |
| --- | --- | --- |
| Workspace | pnpm, TypeScript | One lockfile, shared scripts, strict types |
| Client | React and Vite | Responsive learning experience |
| Navigation | TanStack Router | Typed routes, search parameters, loading and error boundaries |
| Server state | TanStack Query | Queries, mutations, invalidation, job polling |
| Components | Mantine UI and CSS modules | Inputs, navigation, overlays, typography, and theme |
| API | Hono on Node.js | Session ownership, validation, workflow orchestration, streaming |
| Persistence | SQLite with Drizzle ORM | Learners, journeys, attempts, conversations, jobs, media metadata |
| Migrations | Drizzle Kit | Generate SQL from schema, then apply generated migrations |
| AI | OpenRouter/OpenAI and TypeScript Agents SDK | Structured generation, tools, tutoring, and evaluation |
| Voice | OpenAI speech APIs and Agents SDK realtime | Transcription, narration, and live conversation |
| Video | Generated storyboard, narration, simple renderer | Short visual explainer with captions and transcript |

Hono has an official [Node adapter](https://hono.dev/docs/getting-started/nodejs). Mantine documents its [Vite setup](https://mantine.dev/guides/vite/), including its provider, styles, and PostCSS configuration. Follow [TanStack's Vite integration](https://tanstack.com/router/latest/docs/installation/with-vite) for generated routes.

Use compatible supported releases when implementing, and pin them through pnpm and the lockfile. Record runtime and package versions in M01. This plan does not select a model based on an unverified claim about cost or language support.

## Proposed workspace

```text
apps/
  web/src/
    routes/                 # TanStack Router pages
    features/               # learning, tutor, progress, preferences
    components/             # shared Mantine compositions
    theme/                  # theme tokens and global styles
    lib/                    # API client, local saved lessons, media helpers
  api/src/
    routes/                 # Hono endpoints
    middleware/             # sessions, validation, request limits
    services/               # application workflows and ownership checks
    agents/                 # role instructions, tools, structured outputs
    jobs/                   # generation and media job runner
    adapters/               # OpenAI, retrieval, storage, rendering
packages/
  shared/src/               # Zod schemas, DTOs, language and domain types
  db/
    src/                    # Drizzle schema, database client, repositories
    drizzle/                # generator-owned migrations and metadata
    drizzle.config.ts
docs/
AGENTS.md
pnpm-workspace.yaml
```

The workspace packages and base routes exist. Feature services and adapters are added in their milestones. Keep agents and orchestration inside the API until a real reuse case justifies extracting them.

## Request flow

React → Hono → application service → database and AI adapter → validated response → React.

The API is the source of truth for learner state. The browser never decides its session owner, grades itself, or updates understanding directly. Shared schemas validate request bodies and structured AI output; internal database records stay behind response DTOs.

Use a Vite development proxy for `/api`. Prefer one origin for the deployed client and API. Serve browser route fallbacks correctly so reloading a lesson URL works. The local demo binds to loopback by default.

## Anonymous persistence

Issue an opaque random session token in an HttpOnly cookie. Store a hash of that token with its learner association and expiry. Use SameSite protection, origin checks on mutations, and Secure cookies over HTTPS.

This is anonymous session continuity, with no authenticated account. Scope all reads, writes, jobs, media, and conversation context to the server-resolved learner. IDs are locators, not ownership proof. Return the same not-found response for another visitor's resources.

A proposed 30-day inactivity expiry is a demo retention choice, subject to the final deployment plan. A fresh anonymous session is created after expiry. Clearing history removes database records, job outputs, media, and the browser's local text cache; diagnostic retention must be documented separately.

## Domain model

| Entity | Data and relationships |
| --- | --- |
| Learner | Anonymous owner and timestamps |
| Session | Hashed token, learner, expiry |
| Preferences | Learner language, format, reading support, session length, low-data choice |
| Journey | Learner, original request, goal/topic/concept classification, objective, status |
| Topic and concept | Journey structure, prerequisites, position, rubric and content versions |
| Source bundle | Retrieved URLs, titles, relevant excerpts, retrieval time, source IDs |
| Lesson version | Concept, language, presentation needs, sections, examples, source references |
| Assessment and attempt | Baseline/practice/follow-up, questions, choices, confirmed answers, rubric version |
| Conversation and message | Owner, optional lesson context, tutor/Explain Back mode, stream status |
| Explain Back result | Attempt, correct ideas, gaps, cited learner evidence, follow-up state |
| Understanding evidence | Concept, attempt, validated findings, timestamp, versioned rule outcome |
| Generation job | Owner, type, input version, idempotency key, state, retries, error, output ID |
| Media asset | Lesson version, language, format, storage key, duration, transcript, captions, status |

Use foreign keys and owner-scoped repositories. Normalize ownership and attempts; validated JSON is reasonable for versioned lesson sections and rubric payloads. Persist the source and rubric versions used for feedback rather than reevaluating old attempts against a changed lesson silently.

## API surface

These are proposed contracts. Create the detailed Zod schemas in the milestone that implements each endpoint.

| Endpoint group | Operations |
| --- | --- |
| `/api/health` | Server readiness without secrets |
| `/api/session` | Create/resume anonymous session; clear its history |
| `/api/preferences` | Read/update learner preferences |
| `/api/journeys` | Create/list journeys; get one and its pathway |
| `/api/journeys/:id/assessment` | Retrieve baseline questions; submit an attempt |
| `/api/concepts/:id/lessons` | Request/retrieve a content version; request repair content |
| `/api/assessments/:id/attempts` | Submit practice and follow-up answers |
| `/api/conversations` | Start standalone/contextual tutor or Explain Back conversation |
| `/api/conversations/:id/messages` | Persist learner turn; stream reply and final status |
| `/api/conversations/:id/feedback` | Request structured Explain Back feedback |
| `/api/progress` | Evidence, unresolved gaps, and recommended next action |
| `/api/jobs/:id` | Poll job state, cancel, or request an explicit retry |
| `/api/lessons/:id/media` | Request narration/video; read owned output |
| `/api/speech` | Transcription/narration operations with bounded uploads |
| `/api/realtime/session` | Create short-lived voice connection credentials for this session |

Use standard error bodies with a code, safe message, and retryability. Mutations that may call paid APIs take an idempotency key. Use POST-based fetch streaming for chat; finalize the stored assistant message after success and mark interrupted output separately.

## AI workflows

The [official Agents SDK quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart) supports TypeScript agents, application tools, and conversation state. Use the SDK for focused roles; application code controls their sequence.

| Role | Input | Validated output |
| --- | --- | --- |
| Intake/planner | Request, preferences, baseline evidence | Scope, objective, bounded topics/concepts, prerequisites |
| Lesson author | Source bundle, concept rubric, learner evidence, language | Grounded sections, example, visual specification, practice |
| Tutor | Confirmed history, lesson and sources, preferences | Helpful streamed answer; tools request server-owned actions |
| Explain Back evaluator | Independent explanation, follow-ups, versioned rubric | Correct ideas, misconceptions, missing ideas, supporting learner evidence |
| Repair author | Specific gap, earlier attempt, existing sources | Focused repair and a fresh application check |

Add roles when their milestones need them. Tutor mode teaches; Explain Back mode elicits evidence before supplying answers. AI tools read authorized context or return proposals. Tools do not bypass server ownership checks or directly mark understanding as demonstrated.

Use structured output schemas, bounded turns, timeouts, and explicit handling for refusals or malformed results. Allow one bounded repair retry where appropriate; never retry indefinitely. Configure text, search, transcription, speech, and realtime model IDs through server settings.

## Sources and grounding

Use curated, reviewed source bundles for repeatable demo tracks, then add hosted web search for fresh objectives. The [OpenAI web search guide](https://developers.openai.com/api/docs/guides/tools-web-search) documents source metadata and visible citations. Keep returned citations linked to stored sources, and allowlist preferred educational domains where appropriate.

Retrieve the source bundle before authoring a lesson and its rubric. Preserve source IDs through translations, examples, and storyboards. Validate that every source reference exists, and review whether the important teaching claims follow from its evidence. Matching a URL alone does not establish accuracy.

Treat retrieved material as data, including any instructions inside it. Avoid arbitrary server URL fetching in the first demo. If added later, limit protocols, redirects, payloads, and private-network access. If retrieval is unavailable, use a reviewed bundle with a visible provenance label or tell the learner the requested lesson needs sources.

## Generation jobs

Lesson and media generation run as durable SQLite jobs. Return a job ID, show meaningful stages, and poll until ready or failed. The initial runner lives in the Node process; a separate queue service is unnecessary for the demo.

States are `queued`, `running`, `succeeded`, `failed`, and `cancelled`. Use atomic claiming, a lease/heartbeat, bounded concurrency, and recovery for stale jobs on restart. Idempotency prevents duplicate active work for the same owner and input version. Cancellation prevents publication of a stale result; an upstream provider may still bill work already accepted.

Persist generated output before marking a job succeeded. Reuse matching ready output unless the learner explicitly regenerates. Long media work must not block normal API requests. If rendering needs an external executable or worker, document that dependency in M11.

## Audio, voice, and video

First add transcription → existing text workflow → speech generation, with a learner-confirmed transcript. This gives Explain Back a reviewable record. Speech settings and text language are related but remain distinct capabilities.

Then add natural conversation through `RealtimeAgent` and `RealtimeSession`, described in the [official voice agents guide](https://developers.openai.com/api/docs/guides/voice-agents). Browser connections use WebRTC and server-issued short-lived credentials. Keep the permanent API key and session policy on the API. Validate exact credential and session APIs against current SDK documentation in M10.

Persist confirmed voice turns and lesson context. Treat realtime transcripts as evidence to confirm, not automatically reliable grading input. Pass Explain Back evaluation through the same server workflow as text. Muting, interruption, disconnection, and denied microphone permission need explicit UI states.

The proposed video approach generates a short storyboard from the grounded lesson, simple diagram/slide visuals, narration, timed captions, and a rendered playable file. Use a template renderer rather than requiring a cinematic video model. Evaluate the renderer in M11, record its runtime needs, and retain a transcript if rendering fails. Request media on demand and cache it by lesson version, language, and format.

## Drizzle workflow

Schema lives in `packages/db/src/`; generator-owned output lives in `packages/db/drizzle/`. Configure the schema path, SQLite dialect, database path, and output directory in `packages/db/drizzle.config.ts`.

Root scripts expose:

```sh
pnpm db:generate
pnpm db:migrate
```

They must call `drizzle-kit generate` and `drizzle-kit migrate` from the configured database package. [Generate](https://orm.drizzle.team/docs/drizzle-kit-generate) creates migrations from the schema; [migrate](https://orm.drizzle.team/docs/drizzle-kit-migrate) applies them.

Edit schema → generate → review the SQL and metadata → migrate a disposable local database → check application behavior. Commit generator output with its schema change when Git is available. Never manually create or modify migration SQL, snapshots, or journals; do not use `push` to bypass the migration history. The initial learner/session/preferences migration was generated and applied in M02. Further schema changes follow this same workflow.

## Operating limits and deployment

Keep keys, database files, media outputs, and private diagnostic records out of version control. Apply request-size limits, per-session/IP rate limits, generation budgets, and server-controlled realtime duration limits. Avoid logging API keys or raw learning conversations by default; configure tracing with explicit content-retention choices.

The baseline deployment is one Node instance with a persistent disk for SQLite and owned media. Ephemeral filesystems and multiple independent database writers require another documented storage choice. A hosting target and public release are not selected or authorized by this plan.

## Provider update

Text supports OpenRouter and direct OpenAI through the OpenAI Agents SDK. The server selects the provider and model using environment settings. See [providers](../providers.md) for the default inexpensive model and secret handling. Media provider choice remains a separate capability decision.

## Implemented text tutoring

`services/tutor.ts` owns conversation and stream state. Hono sends typed SSE events from Agents SDK text streams. Conversations and turns use generator-owned migration `0004_omniscient_morph.sql`. Context uses public lesson DTOs, source excerpts, and at most ten completed turns. Interrupted streams remain visible with retry; they do not enter later context or learning evidence. Source retrieval for a standalone first factual turn happens before the agent runs.

## Implemented Explain Back

`services/explain.ts` owns attempts and deterministic understanding rules. Generator-owned migration `0005_nice_nebula.sql` adds independent explanations, follow-up answers, private evaluations, rubric/source/language snapshots, revision numbers, fresh application evidence, and job references. The durable runner handles `explain` jobs with separate elicitation and application phases. Outputs publish with the attempt and job in one transaction.

The implemented endpoints are `GET/POST /api/concepts/:id/explanations`, `GET /api/explanations/:id`, `POST /api/explanations/:id/responses`, and `GET /api/progress`. Ownership comes from the anonymous cookie. A response commits before generation starts; duplicate IDs reuse it and stale revisions return 409. Public DTOs omit the expected application answer and hide feedback during elicitation. Quotes must match the saved explanation or identified follow-up. An independent reviewer checks interpretation, neutral questioning, and grounded repair/application before publication.

Understanding is derived from essential rubric findings plus fresh application, not assigned directly by an agent. Failed review leaves evidence and progress unchanged. Newer usable attempts take precedence over late results from older attempts; unknown evidence preserves earlier usable state. Progress exposes the saved attempts, gaps, and next action. History panels load detailed attempt queries only when expanded.

## Implemented language versions, M08 work

`services/localization.ts` translates journey metadata and assessments into versions keyed by the canonical content/source hash. Generator-owned migration `0006_chubby_professor_monster.sql` stores those versions. A structural identity check and a separate meaning review precede publication. `POST /api/journeys/:id/language` creates a durable preparation job; lesson jobs can prepare the same version first. Baseline grading continues to use canonical IDs and answer keys.

The client commits language preferences before requesting content, includes the selected language in journey/assessment/lesson query keys, and waits for metadata preparation before displaying an assessment. Static interface copy lives in `packages/shared/src/messages.ts`. Dynamic counts use named placeholders. Document language and dates follow the selected preference; saved evidence keeps its original language attributes and exact words. Switching preferences never regrades an earlier attempt. See [language evidence](../languages.md) for verification status.

Lesson generation revision 2 uses a configurable Luna author and a separate source/language reviewer. Generator-owned migration `0007_volatile_vermin.sql` adds the revision to the lesson uniqueness constraint. Querying a current lesson selects that revision; historical practice and Explain Back rows retain their original immutable lesson ID. Job DTOs expose the generation revision so the client ignores obsolete preparation jobs.

Tutor streams now use a configurable Luna author and pass an independent source/language review before becoming completed. The stream remains provisional until its final done event. Failed source review produces a failed partial turn, which never enters later conversation context. Cited IDs must exist in the stored source bundle.

## Implemented M09 speech contracts

`services/audio.ts` wraps the chosen provider's dedicated TTS/STT endpoints, bounds processing, and invokes configured FFmpeg/FFprobe executables with argument arrays. Google TTS PCM is 24 kHz mono signed 16-bit audio and is encoded to 48 kbps MP3. Narration scripts copy lesson summary, sections, examples, visual descriptions, and glossary. Assessment scripts contain only the public question/options and unknown choice; answer keys never enter narration.

`services/speech.ts` scopes generated files and transcripts to the anonymous learner. Generator-owned migration `0008_flashy_bushwacker.sql` adds narration metadata and recording receipts. Narration uses the existing durable worker, maximum two concurrent generation jobs, six pending jobs per owner, 24 new narration requests per day, and the existing bounded retry policy. Media jobs have a ten-minute execution deadline. Narration cache keys include the exact script, context, language, provider/model and voice.

Routes are `POST /api/narrations/read`, `POST /api/narrations`, owner-only `GET /api/narrations/:id/audio` with range requests, `POST /api/transcriptions` multipart upload, and owner-only transcription read/confirmation. The transcription route alone accepts 8 MB plus bounded form overhead. Other API requests remain limited to 64 KB. Recordings are decoded to mono 16 kHz WAV using generated local paths and a file/pipe-only protocol whitelist. Decoded duration is bounded to 90 seconds. No raw upload survives completion, failure, or cancellation; startup clears abandoned temporary files.

At most two transcriptions run server-wide and one per owner, with 24 recorded attempts per day including failures. Speech evidence must be confirmed, owned and bound to the same public assessment question, lesson, or Explain Back revision. Edited words are frozen when used. A later text edit detaches the recording receipt and remains a normal text answer. Clearing history aborts owned work and removes the media directory and cascading transcript rows. M12 adds thirty-day inactivity cleanup and separately retained usage reservations, described below.

M09 completion adds generator-owned migration `0009_dizzy_lenny_balinger.sql` for private narration fidelity reviews. Every published chunk passes recognition plus independent semantic review. Igbo delivery revision 2 has shorter segments and slower instructions, with the revision in cache and job snapshots. Failed narration publishes no file. `GET /api/journeys/:id/assessment` includes owner-scoped matching original/confirmed words under `spokenAnswers`; baseline selection and receipt linkage save in one transaction. Identical spoken selection retries replay saved state. The shared microphone acquisition helper returns a translated fallback on denial/timeout and stops late grants after cancellation.

## M10 implementation direction

The server-owned WebSocket transport and staged OpenRouter voice path are specified in [voice plan](../voice-plan.md) and D029. The earlier WebRTC architecture is a direct OpenAI option, not evidence that the existing OpenRouter credential supports native Realtime. A custom SDK RealtimeSession transport will connect the browser to the server, with one-use app credentials and server-enforced usage policy. Native OpenAI and the staged OpenRouter path need distinct live checks.

## Implemented voice gateway

`POST /api/voice/sessions` issues an owned session and one-use 60-second application credential. `POST /api/voice/sessions/:id/connect` rotates credentials without renewing the absolute deadline or usage counters; `GET` returns saved turn history, and `DELETE` stops the session. The same-origin `/api/voice/connect` WebSocket requires both the anonymous cookie and that credential. It rejects browser context/tool/config overrides. Audio packets are ordered, rate/size bounded 24 kHz mono PCM; raw buffers are transient, with 200 ms onset and 1.4-second silence detection, thirty-second turn maximum, ten-minute deadline, twelve turns and three minutes total input. Capturing stops locally on disconnect, Stop, dismissal or unmount. Provider keys stay on the API process.

OpenRouter uses the existing recognition and source-reviewed tutor services plus synthesized audio fidelity review. Direct OpenAI uses a bounded server `RealtimeAgent`/`RealtimeSession` with authorized lesson/source/history, no model grading tools and buffered reply review. Independent Explain Back/response sessions pause for editable words, require `/api/voice/turns/:id/confirm`, then fill the existing answer form for explicit Save. `/api/voice/turns/:id/audio` serves owner-only MP3 with range support. Generator-owned migration 0010 stores session hashes/deadlines/counters and turn receipts/private review evidence. Failed audio remains unavailable while saved source-approved text is usable. Clearing history stops connections and deletes the existing owner media directory before DB cascades.

The browser supports explicit recorded-audio input through the same voice gateway. It validates the selected file size, audio MIME type and decoded duration locally, then resamples to 24 kHz mono PCM and sends 100 ms frames after **Send recording**. Selection alone sends nothing. Recording mode does not acquire a microphone. Stop, interruption, disconnect and dismissal cancel the frame timer. Server ownership, usage limits and review checks apply unchanged. Microphone capture computes a local signal meter from the PCM frames and reports quiet input after eight seconds; it does not infer microphone permission denial from silence.

The recorded English browser walkthrough confirmed native media playback and saved text after Stop/reload. It does not establish audibility on the user's device or natural microphone conversation. Yoruba/Igbo voice includes an experimental notice, and uncertain generated audio remains unpublished. See [M10 evidence](../evidence/m10.md).

## Implemented M11 video and offline text

`POST /api/videos/read` returns owned cached metadata. `POST /api/videos` saves a video job linked to the immutable lesson and its narration job. The worker waits without spending render attempts while narration is pending. Failed/cancelled narration leaves the video failed with an explicit instruction to retry audio first. The shared narration job is not cancelled when a video job is cancelled. Rendering uses escaped SVG slides, resvg 2.6.2 and FFmpeg H.264/AAC at 960×540, ten frames per second, with a two-minute renderer timeout and 32 MB output limit. Cache keys contain the lesson, narration job and renderer revision. Generated migration 0011 stores owned MP4/VTT names, source IDs, transcript and storyboard.

`GET /api/videos/:id/file` supports owner-only bounded byte ranges; `/captions` returns WebVTT. Neither is public. Captions retain the script and use proportional timing within measured narration chunks; older cached narrations have an explicit estimated timing mode. The player describes timing as approximate and offers transcript/downloads. It is absent until Open video, including low-data mode.

The browser saves up to ten public lesson DTOs and source excerpts for thirty days, bounded to 2 MB of serialized text. A server-derived opaque cache scope clears old copies after the anonymous session changes online. Save failures offer text download. Clear history removes the local copies and scope. The `/saved` page requires no successful server query to read a saved copy. Online grading, tutoring, source-site navigation and media remain online-only.

The production-only service worker precaches the static app shell and saved route dependencies. Its cache revision covers assets and worker code. Navigation uses network then cached shell; static assets match without `Vary: Origin`. It never caches `/api`, media or other origins. Development HMR has no service worker. Build and serve the production preview over localhost or HTTPS to check offline reload.

## M12 usage, expiry and missing media

Generated migration 0012 adds usage reservations without a learner FK. `reserveUsage` checks and inserts rolling 24-hour reservations transactionally before each operation or provider call. History deletion cannot reset global counts. Existing operation rows are backfilled; provider-call counts begin at activation. Records expire after 31 days and contain no learning text or credentials. These request limits supplement duration, token and retry bounds; they are not an exact dollar ledger.

Retention removes expired cookie sessions and inactive owners after thirty days without a surviving session, aborts owned services, removes media and cascades learning data. Startup and ten-minute sweeps require an explicit media directory. Isolated databases must receive an isolated directory. Startup media integrity checks invalidate missing cached files without spending money; the learner must retry explicitly. File ownership stays enforced. Content-review logs retain IDs and categories rather than raw rejection text. See [handoff](../handoff.md) for limits and operational details.

## Spoken objective entry

The home composer reuses the recording/upload and explicit transcription-confirmation control with `objective` context and selected language. Objective capture is bounded to thirty seconds and six hundred confirmed characters. Confirmation fills the objective, and explicit Start learning posts the owned receipt with the existing live journey request. Server checks the ready/confirmed text, owner, exact context/language and unused receipt, then attaches it to the saved journey atomically. Duplicate request IDs reuse that journey; changed objective/language/mode rejects rather than silently replaying another request. Editing the composer or switching language detaches the receipt and continues as typed input.

The existing transcription JSON context stores this variant. Drizzle generation reports no schema changes, so there is no new SQL migration. The existing provider, raw-upload cleanup, recording limits, origin checks and retained usage policy remain in force. This is spoken input followed by explicit confirmation/start, not an autonomous realtime agent starting a course from an unconfirmed recording.

## Narration recovery

Approved intermediate chunks live in the private owner directory under `.narration-jobs/<job-id>`. A bounded, validated manifest binds exact job/cache identity, language, model, voice, chunk index and intended text to a valid review, duration and audio checksum. Retries reuse only matching approved bytes. Missing/corrupt chunks are generated and reviewed again; rejected audio is removed with the transient attempt directory. The manifest retains at most six rejected review records for diagnosis, with no public route.

Only a fully approved combined narration can publish. Success removes intermediate files. Owner deletion/retention removes the entire directory, and the preparation error path clears a cache whose job was deleted. Yoruba recovery revision 3 creates a separate cache entry without rewriting lesson text or old jobs. No SQL schema change is involved. Provider counters, job retry limits and all existing fidelity rules remain enforced. Safe logs expose only stage/index/error category/status, never learning text or provider bodies. See D043 and [isolated cache checks](../evidence/narration-cache-check.json).

Yoruba revision 4 additionally uses 300-character groups and delivery guidance that preserves doubled vowels. The concatenated intended groups equal the original immutable script. Pronunciation guidance is sent only to synthesis, separate from spoken text; recognition has no expected-script hint. The independent fidelity review is unchanged. Earlier revision jobs and failures remain recorded; see D044.

Yoruba narration has a separately configurable recognizer, `OPENROUTER_NARRATION_STT_MODEL_YO`. Its model is part of cache identity and is captured in `jobs.input.narrationSTTModel`. Review evidence names that recognizer. Existing queued jobs retain their old model; learner uploads use the independent general transcription setting. This extends the stored JSON type without adding SQL columns. Completed starting assessments also support read-only question narration replay, preserving their status/answers and progress evidence.

## Local presentation assets

`.data/demo-assets/` contains exported reviewed media and actual browser captures for the accepted D047 presentation. A static preview page can be served on loopback port 5190. It is a local recording aid, not a new app route. The quiz edit uses browser frame timestamps and exact downloaded narration audio. Prepared media is labeled and does not bypass owner-scoped API routes.

The M14 presentation renderer uses Pillow for original motion artwork and FFmpeg for H.264/AAC export. It reads cached presenter audio and prepared actual captures from `.data/demo-production/`, writes the final video/captions/manifest to `deliverables/`, and has no application or database mutation path. Presenter audio is separate from the independently reviewed app lesson audio. See [production notes](../demo-production.md).
