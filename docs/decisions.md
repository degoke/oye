# Decisions

Baseline date: 13 October 2026. Status values are `confirmed`, `proposed`, `accepted`, and `superseded`.

`Confirmed` records a user instruction. `Proposed` is a planning choice that can be refined during its milestone without requesting routine approval. `Accepted` records an implemented choice with evidence. Preserve old decisions when replacing them and link the replacement.

## D001 · Brand and purpose

Status: confirmed. Date: 13 October 2026.

Use `òye.` and the lines "Learning that understands you." and "Learn anything. In your language. In your way." The product is the adaptive learning companion in [the supplied brief](source-brief.md).

Consequence: retain the brand diacritic and center the demo on understanding, supported languages, learner-controlled formats, and the Discover → Learn → Ask → Explain → Improve loop.

## D002 · Requested stack and design

Status: confirmed. Date: 13 October 2026.

Use Hono, React, Vite, TanStack Router, pnpm, Mantine UI, and OpenAI models with the Agents SDK. Design for mobile first with a simple, minimal, classy style.

Consequence: use TypeScript across the application, Mantine themes/components, and server-owned OpenAI integration. Interpret the user's "ChatGPT" requirement as GPT-powered product behavior through the OpenAI API. A separate ChatGPT app integration is not specified.

## D003 · No authentication for the demo

Status: confirmed. Date: 13 October 2026.

The demo has no login or signup. Proposed implementation: a server-issued anonymous cookie links the browser to its persisted learning.

Consequence: resume works within the same browser; there is no cross-device recovery. Ownership checks still apply to journeys, conversations, jobs, and media. Provide clear-history controls.

## D004 · Generator-owned migrations

Status: confirmed. Date: 13 October 2026.

Use the Drizzle generator for migrations. Agents edit the TypeScript schema, invoke `drizzle-kit generate`, review its output, and invoke `drizzle-kit migrate`. Do not handwrite migration SQL, snapshots, or journals, and do not bypass this process with `push`.

Consequence: schema changes include generated migration artifacts. A generator limitation needs a documented resolution before changing the migration approach.

## D005 · Four target languages

Status: confirmed. Date: 13 October 2026.

The user selected English, Yoruba, Hausa, and Igbo for the first demo.

Consequence: all four belong in interface and text learning acceptance criteria. Evaluate transcription, narration, and realtime conversation separately. A provider's general multilingual claim is insufficient to establish support for a particular language or modality.

## D006 · pnpm workspace and Node server

Status: proposed. Date: 13 October 2026.

Use `apps/web`, `apps/api`, `packages/shared`, and `packages/db`, with Hono running on Node.js. This keeps frontend, API, contracts, and persistence distinct while sharing TypeScript and a lockfile.

Consequence: configure root scripts, a development proxy, and shared validation. Prefer one origin for deployment. Add packages only when they have a concrete purpose.

## D007 · SQLite for local demo persistence

Status: proposed. Date: 13 October 2026.

Use SQLite with Drizzle and a supported Node driver, initially `better-sqlite3`. A local file avoids requiring a separate database service for the first demo.

Consequence: the initial hosted demo needs one server instance and persistent disk. Confirm driver/runtime compatibility in M02. Moving to PostgreSQL or hosted storage requires a schema/deployment decision and generator-produced migrations.

## D008 · Evidence controls understanding

Status: proposed. Date: 13 October 2026.

Separate content completion from concept understanding. Store attempts and rubric evidence; application rules determine understanding states. Explain Back elicits independent reasoning before correction.

Consequence: create a versioned evaluator contract and a reviewable provisional rubric in M07. Avoid claiming formal mastery or educational effectiveness based on a single AI judgment.

## D009 · Text loop before media

Status: proposed. Date: 13 October 2026.

Implement source-grounded text learning, contextual tutoring, Explain Back, repair, and progress first. Then localize and add audio, natural voice conversation, and video.

Consequence: intermediate demos have limited formats. The final capstone still requires the media capabilities in the product specification. Do not treat their later position as removing them from scope.

## D010 · Durable jobs and simple rendered video

Status: proposed. Date: 13 October 2026.

Use a small database-backed job runner for long generation. Generate video from a grounded storyboard, simple visuals, narration, and captions.

Consequence: add restart recovery and idempotency in M04. Choose and document a renderer in M11 after a small compatibility check. This approach supports a narrated visual explainer without requiring production-scale generative video infrastructure.

## D011 · Documentation and sequential delivery

Status: confirmed. Date: 13 October 2026.

Keep plans, specifications, architecture, milestones, decisions, and progress in `docs/`. `AGENTS.md` maps that documentation and records preferences. Work on small milestones one at a time through completion.

Consequence: update the relevant documents in the same change as implementation choices. The current request starts with planning; implementation starts at M01 in subsequent work.

## Questions to resolve during implementation

| Question | Resolve by | Current approach |
| --- | --- | --- |
| Compatible package/runtime versions | M01 | Select supported versions and pin the workspace |
| OpenAI model IDs and account access | M04, M09, M10 | Configure per role/modality; check live availability when integrating |
| Source coverage for demo tracks | M04 | Review primary educational sources before generating rubrics |
| Educational and language reviewers | M07–M09 | Record available review evidence and gaps without claiming unperformed review |
| Yoruba, Hausa, and Igbo speech quality | M09–M10 | Benchmark representative speech; document and resolve capability failures |
| Renderer and media dependencies | M11 | Choose a small template renderer after checking runtime compatibility |
| Hosting, storage, and retention | Before deployment | One persistent Node instance proposed; hosting not selected |

Add new entries as decisions occur. Do not overwrite a confirmed user preference with an undocumented implementation shortcut.

## D012 · Foundation versions and local delivery

Status: accepted. Date: 13 October 2026.

Use the installed Node.js 24.15.0 and pnpm 12.11.2, React 19.3, Vite 8.3, Mantine 9.7, Hono 4.13, and TanStack Router with its Vite plugin. Exact resolved dependency versions are in the lockfile. The requested application is built in this checkout; deployment remains separate under the original plan.

The design uses the requested warm neutral and dark green palette, a restrained Georgia display face with system sans interface text, and an open question composer as the central interaction. No external font download is required. The shell will be checked at 320px, 360px, tablet, and desktop widths.

## D013 · Dedicated loopback ports

Status: accepted. Date: 13 October 2026.

Use `http://127.0.0.1:5187` for the client and API port 3187. Existing projects already use ports 5173 and 3001, including an IPv6 listener on localhost. Explicit IPv4 URLs and a configurable API proxy keep preview checks scoped to òye.

## D014 · SQLite driver and anonymous session implementation

Status: accepted. Date: 13 October 2026.

Drizzle ORM 0.45.4, Drizzle Kit 0.31.11, and better-sqlite3 13.0.3 work on this Node runtime. The initial learner/session/preferences migration was generated by Drizzle Kit and applied with `pnpm db:migrate`. Foreign keys cascade history deletion.

Sessions use a random token in an HttpOnly, SameSite=Lax cookie, with a SHA-256 digest stored on the server and a sliding 30-day expiry. Mutation requests must match the configured web origin. All preference reads and writes resolve ownership from that token. Optimistic preference updates roll back on failure.

The server build bundles workspace TypeScript and the ORM, while the native SQLite driver remains an external runtime dependency. A compiled-server health/session check passed on a temporary port.

## D015 · OpenRouter and OpenAI

Confirmed by the user on 13 October 2026. Support both providers, prefer inexpensive OpenRouter models, and use the authorized parent project key locally. Default text model is Gemini 2.5 Flash Lite, verified in the public registry. Provider settings, prices, and capability boundaries are in [providers](providers.md). Speech and realtime require separate adapters and checks.

## D016 · Baseline evidence

A baseline assessment saves questions and answers independently of understanding. Correct baseline selections and skipping both leave concept understanding unknown. Server DTOs omit answer keys. Confirmed independent explanations and fresh application drive later understanding transitions.

## D017 · Grounding and durable jobs

Use short reviewed notes from NASA and CFPB for the two demo topics. Fresh requests use OpenRouter Exa search with at most three results from government, university, MDN, or Wikipedia domains. Store returned source excerpts and stable IDs, not model-invented URLs. Lesson generation validates reference IDs and runs a separate source-support review before publishing. Model review is an automated check, not expert certification.

SQLite jobs deduplicate by owner and content version, run at concurrency two, and bound automatic retries and explicit retries. On restart interrupted jobs resume. Completed outputs publish in a database transaction and use a unique lesson version key. Clearing a learner cancels their active work before database cascades.

## D018 · Lesson delivery and practice

Render validated text as plain React text. Visuals are readable list/comparison templates with text available to assistive technology. Practice sends a confirmed selection to the server; server grading and idempotent request IDs preserve attempts. Ordinary practice can set building or needs-practice, and never demonstrated. Save the last visited owned concept for resume; visiting does not grade learning.

## D019 · Tutor streams and source retrieval

Tutor conversations own durable turns with a unique request ID. Completed replays reuse the saved reply; stopped/failed turns reuse the same row on retry, with at most three attempts. Only completed turns enter the next model context. Server restart marks unfinished streams interrupted. Streaming text saves periodically and the client marks partial replies. Tutor interactions do not update understanding.

A standalone factual first turn retrieves sources in application code before starting the tutor. An early live check showed the model could skip a suggested retrieval tool, so tool instructions alone are insufficient. Later turns can request one bounded retrieval when existing sources do not support the question. Contextual conversations receive the owned public lesson DTO and source bundle without answer keys. Markdown rendering disables raw HTML/images and only makes stored source URLs clickable.

## D020 · Explain Back evidence and model roles

Status: accepted. Date: 13 October 2026.

Save the independent explanation before model evaluation. Require one neutral follow-up before correction and allow at most two follow-ups. Keep feedback and the private fresh-application answer hidden while eliciting evidence. Each attempt snapshots its lesson, language, sources, rubric, and a SHA-256 rubric version. Responses use request IDs and revision checks; completed attempts stay inspectable.

Every rubric criterion needs one finding. Findings marked met or misconception must quote actual learner words. The server validates quotes and source IDs, then a separate model call reviews interpretation. Source-supported paraphrases are valid; wrong learner statements are evidence for misconception findings. The server sets demonstrated only when every essential criterion is met with high certainty and a fresh application is correct with high certainty. Essential misconceptions or a clearly wrong application require practice. Uncertain evidence cannot award understanding or erase earlier valid evidence. For concurrent reviews, the latest created attempt with usable evidence determines the concept state.

Use explicitly configured Luna for grading and review, and retain Flash Lite for lessons and tutor text. Flash Lite's grading runs repeatedly rejected supported evidence during the live checks; Luna completed the same evaluation. Both are inexpensive OpenRouter models. This is an explicit role choice with bounded outputs and retries, not automatic provider fallback. Automated review does not establish educational effectiveness or replace expert review.

## D021 · Four-language content versions

Status: accepted. Date: 13 October 2026.

Store translated journey titles, concept objectives, rubrics, and baseline questions in language versions keyed by the canonical content/source hash. Preserve the order and every concept, rubric, question, and option ID, correct-answer ID, and essential flag. Keep baseline answers and understanding in their existing canonical records. A separate automated meaning review must accept the translation before publication.

Language changes save on the server before the client requests preparation, then select a version-specific query key. Show preparation while the selected language is unavailable. Lesson jobs prepare the required language metadata before authoring. Old explanations and conversation turns retain their original words and language, while new Explain Back attempts snapshot the translated criteria under the same canonical rubric hash. Do not translate learner quotes or retroactively regrade evidence when preferences change.

Interface copy is a static English/Yoruba/Hausa/Igbo catalog, generated in bounded batches and reviewed before source publication. It does not call an AI provider at page load. Dynamic counts use placeholders so languages can change word order. Record automated and any available native-speaker review separately. Translation and source review use configured Luna; lesson and tutor text retain Flash Lite. Non-English source requests first become concise English search queries, preserving learning intent for retrieval.

## D022 · Sourced lesson author model

Status: accepted. Date: 13 October 2026.

Use explicit `OPENROUTER_LESSON_MODEL=openai/gpt-6-luna` and `OPENAI_LESSON_MODEL=gpt-6-luna` defaults for lesson authoring. The stricter M08 source reviewer rejected three Flash Lite attempts for adding biological details absent from the short source notes. Retain Flash Lite for initial plans and streamed tutoring. Luna is an inexpensive configured role, with no silent fallback. Keep independent source review and bounded retries. Record live checks separately from this configuration choice.

## D023 · Immutable lesson revisions

Status: accepted. Date: 13 October 2026.

Include the lesson-generation revision in the unique lesson key and durable-job deduplication. Generated migration `0007_volatile_vermin.sql` adds that column with revision 1 for existing rows and expands the unique index. Current revision is 2. New readers request the current revision; old Explain Back and practice records keep their original lesson ID. This lets source/language instruction corrections produce new content without rewriting historical evidence.

A reviewed English lesson incorrectly added Spanish glossary terms under an ambiguous bilingual instruction. Revision 2 makes English glossaries monolingual and other target-language glossaries bilingual with English only. The new English sample has the expected English glossary and passed source review. Older development content remains attached to historical records.

Yoruba uses lesson revision 3 after the representative review flagged ambiguity in the plant-mass term. Its journey translation hash also includes translation revision 2. Use a clear expression for physical plant body material and retain the English technical term where useful. The repeated representative review accepted the new assessment/lesson; historical learner words and rubric snapshots remain unchanged. Localize job and assessment query keys now include the content fingerprint so a completed job for an earlier contract cannot prevent preparation of a new version.

## D024 · Tutor completion requires source review

Status: accepted. Date: 13 October 2026.

Use explicit configurable Luna for tutor authoring. A Hausa Flash Lite reply added soil water uptake and animal breathing absent from its source excerpt. After the real model stream finishes, validate cited IDs and run a separate source/language review. Mark a turn completed only after acceptance; rejected/failed partial text stays visibly incomplete and is excluded from future model context. Streaming and review share the existing bounded timeout and retries. Historical development replies retain their original text. The review is automated and cannot establish native-language quality.

## D025 · Application questions and required reasoning

Status: accepted. Date: 13 October 2026.

A fresh application question must explicitly request every reasoning step required in its private expected answer, with changed conditions stated clearly. Grade the solution to that public question, accepting equivalent reasoning without demanding repetition of given facts or additional unasked rubric details. Independent explanation findings still determine whether the essential rubric is covered. An Igbo walkthrough answer received null/limited because the private grading expectation included inputs that its public prompt did not explicitly request. Preserve the limited attempt and check a new attempt under the clearer contract.

## D026 · Speech uses provider-specific models and explicit confirmation

Date: 13 October 2026. Status: implemented; M09 acceptance in progress.

OpenRouter dedicated speech endpoints reuse the authorized local credential. Initial narration defaults were Gemini 3.8 Flash Lite TTS for English/Hausa, Gemini 3.8 Flash TTS for Igbo, and Fish S2 Pro for Yoruba. D027/D028 record the subsequent explicit role choices. Google's published language table includes Igbo only in Flash and does not list Yoruba; Fish's publisher model card explicitly lists Yoruba. Each role remains configurable. There is no silent model fallback. Google narration requires 24 kHz mono PCM on this gateway, converted by FFmpeg into compact MP3. The generic guide's MP3 example did not apply to Google, and live 400 responses confirmed this restriction.

Narration scripts copy saved lesson text and public assessment choices without another authoring model. Cache keys include context, exact script, language, provider, model, and voice. Durable jobs retain that snapshot. Players do not autoplay and use `preload="none"`.

Microphone capture stops at 90 seconds. The server limits uploads to 8 MB, decodes to a generated local WAV path, verifies duration, and deletes temporary bytes in `finally`. Transcription uses configurable Gemini 3.5 Transcribe by default. Recognized words are editable and require a separate confirmation before an answer can reference them. The existing server evaluator grades confirmed text, with ownership, context and revision checked. Original recognition and confirmed words are retained until history is cleared. Audio and transcripts are sent to the chosen provider; upstream retention follows that provider's policy. No raw audio or API errors are logged.

Initial synthetic speech round trips were accurate in English and Hausa, but Yoruba recognition contained word errors and Igbo lost the diacritic in ìhè. Chirp 3 comparison improved Yoruba orthography but still misrecognized sugar and oxygen in the same Fish sample. These checks do not establish human pronunciation quality. M09 records limitations separately; M10 must resolve the required live voice capability before full demo completion.

## D027 · Review generated speech against the script before publication

Date: 13 October 2026. Status: implemented; live narration acceptance in progress.

A short Google Gemini 3.8 Flash TTS Yoruba comparison retained the intended inputs, products and light-energy relationship better in the independent recognition probe than Fish S2 Pro. Yoruba now explicitly defaults to this experimental Google model and Kore voice. This is an observed automated sample result; Google's published language table still does not list Yoruba, and no native-speaker pronunciation review is claimed. The configurable Fish option remains available.

Each narration chunk is now independently transcribed and reviewed by the configured Luna evaluation role against the exact intended script. Missing/changed substantive teaching, unrelated speech, uncertain terminology and wrong language reject publication. Harmless recognition spelling differences do not reject clear meaning. Chunks are bounded to 700 characters to keep recognition within the recording duration cap. Generated migration `0009_dizzy_lenny_balinger.sql` retains the accepted chunk recognition/review results privately. This adds bounded review calls and latency, with the existing job deadline, retry limit and text fallback retained. Synthetic round trips cannot separate every synthesis error from a recognition error, so the UI and capability record must not describe them as human language certification.

## D028 · Record speech failure and keep confirmed words inspectable

Date: 13 October 2026. Status: implemented; Igbo capability gap remains unresolved.

Use explicit Gemini 3.8 Flash TTS for Hausa after full Lite narration failed fidelity checks. The Flash full sample passed on attempt 2. Igbo delivery revision 2 uses shorter 400-character segments and slower, careful pronunciation instructions. Cache and durable job snapshots include that revision; historical attempts retain their script/model/language. It still failed after three attempts, as did the earlier delivery. Keep failed audio unpublished and document the proposed voice/model/native-review remedy. This gap must be resolved before full demo completion.

Return matching baseline speech receipts with original recognition, confirmed words and original language. Show them after reload. Save selection and receipt linkage atomically, and replay an identical saved selection after a lost response. Used words remain immutable. Microphone acquisition has one shared deadline/cancellation helper. The user requested a retry; real capture/Stop/Discard and four focused denial/late-grant checks passed. No ambient microphone recording was uploaded.

## D029 · Voice sessions stay under server control

Date: 13 October 2026. Status: accepted implementation choice; live capability pending.

Use a custom Agents SDK RealtimeSession transport to an owned WebSocket endpoint. The installed 0.20.0 transport interface supports this integration. OpenRouter uses a staged recognition, source-reviewed tutor and synthesis pipeline; it is not native OpenAI Realtime. Direct OpenAI can use a native server-side RealtimeSession when configured. Both paths keep provider keys on the server and use short-lived, single-use app credentials bound to the anonymous owner. The server enforces deadline, audio/turn counts, origin, payload and concurrency limits.

Keep editable transcripts, explicit Explain Back confirmation and the existing server evaluator. Measure conversational delay and interruption recovery before claiming natural voice. Do not silently treat a staged pipeline as verified low-latency voice or mark the Igbo capability gap resolved. See [voice plan](voice-plan.md).

## D030 · Keep voice confirmation, reviewed audio and budget limits explicit

Date: 13 October 2026. Status: implemented with partial live evidence; acceptance open.

The browser SDK uses the app transport and loads only on Start voice. Mute changes microphone input, Stop ends capture/session, and disconnect stops tracks and preserves server history for credential rotation. Explain Back captures independent words, pauses listening, and fills the existing answer form only after explicit correction/confirmation; the learner still saves before evaluation. The server detects sustained onset and a 1.4-second pause, limits capture to thirty seconds per turn, and bounds total input, turns, time and concurrency. Audio is served only after source/fidelity review, retaining text on synthesis failure. Direct OpenAI native output follows the same checks; its key-dependent path has not been verified live.

English initially produced reviewed contextual audio with about 24 seconds after capture. Yoruba withheld failed audio. Those outcomes are evidence, not a general language-quality certification. Later HTTP 402 recognition failures were traced to the key allowance being below the speech preauthorization floor, while the account still had credits. Ask the user to change that budget or configure a funded key locally. Do not raise key limits, substitute credentials, or keep repeating provider requests automatically. Control/ownership/credential checks continue without provider calls. Keep M10 and full demo completion open until the remaining live language/evidence checks are recorded.
## D031 · Bounded voice delivery revision

Date: 13 October 2026. Status: implemented; live acceptance in progress.

After the user increased the OpenRouter key limit, repeated English and Hausa contextual voice checks completed. Yoruba and Igbo failed the existing audio fidelity gate around sunlight and technical terms. A bounded comparison kept the exact source-reviewed replies, changed the voice to Puck and used slow native-language delivery instructions. Both revised short samples passed the existing Gemini recognition plus Luna fidelity review. An additional OpenAI Mini transcription of those same samples remained uncertain; this disagreement is retained and does not establish human pronunciation quality.

Explicitly select Puck for Yoruba and Igbo, with independent configurable voice settings. Keep the model and recognizer unchanged. Yoruba delivery revision 2 and Igbo revision 3 snapshot instructions in durable jobs and change narration cache identity. Earlier jobs and recordings keep their original delivery. The fidelity gate still withholds uncertain audio. Full narration and contextual app checks must be repeated before resolving the earlier failures.

OpenRouter documents that Gemini delivery instructions are sent separately as speech metadata: [speech endpoint documentation](https://openrouter.ai/docs/guides/overview/multimodal/tts). Google's [language table](https://ai.google.dev/gemini-api/docs/speech-generation) lists Igbo for Flash and still omits Yoruba. Yoruba remains experimental.

## D032 · Recorded voice input and microphone signal

Date: 13 October 2026. Status: implemented; recorded-input walkthrough passed, natural microphone acceptance remains open.

The user reported no voice playback and a nonworking microphone. That attempt provides no usable recognition or playback evidence. Add an explicit recording option to the voice dialog so a learner can send known audio without acquiring a microphone. Keep file selection local until **Send recording**. Limit files to 8 MB and decoded audio to 0.3–30 seconds, resample locally, and reuse the existing server-controlled PCM gateway. Do not create a second grading or provider path.

Show a local microphone signal meter and a quiet-input hint after eight seconds. Silence does not mean permission was denied. Preserve text entry and the recording option after capture failure. A known English synthetic MP3 produced a saved sourced reply and native browser playback without a media error. A 30.5-second file was rejected before connection. The dialog fit 360 px without horizontal overflow. Record these separately from human microphone and native-language pronunciation checks in [M10 evidence](evidence/m10.md).

Yoruba/Igbo voice now states that it is experimental and directs the learner to saved text when audio is unclear or unavailable. This notice does not resolve the required capability gap or authorize milestone completion. An explicit demo scope decision is pending.

## D033 · Demo accepts experimental Yoruba/Igbo voice

Date: 13 October 2026. Status: accepted by the user.

The user chose "Accept experimental Yoruba/Igbo voice with text fallback for the demo" in response to the scope question about moving on to video. Reliable Yoruba/Igbo audio is no longer a demo completion requirement. Keep the experimental notices, saved text and existing fidelity gate. Do not publish rejected audio or claim native pronunciation quality. This applies to narration used by video as well as conversation, since the unresolved narration reliability is part of the same capability matrix.

Advance to M11 using the recorded contextual synthetic speech, real SDK interruption/reconnect, browser recorded-input playback, four-language confirmed evaluator evidence and policy checks. The user's nonworking microphone does not become a successful microphone test. Keep natural human microphone conversation and actual device review in the M12 audit. Direct OpenAI remains an implemented alternate without live-key evidence. The full demo still needs M11 and M12.

## D034 · Video from the reviewed narration and saved lesson

Date: 13 October 2026. Status: implemented and checked in M11.

Render 960×540 SVG lesson slides to PNG with resvg, then combine those images and approved MP3 narration into H.264/AAC MP4 with FFmpeg. Copy the immutable saved lesson text instead of asking another model to author teaching. Retain source IDs, transcript and downloadable WebVTT captions. Generation is explicit, owned and cached by lesson/narration/renderer version through the durable queue. A failed narration never produces a narrated video; text remains usable. English/Hausa follow the reviewed speech path, and Yoruba/Igbo retain the accepted experimental limits.

Store saved text lessons locally by explicit learner choice, with a bounded cache, sources and public practice prompts. Exclude answer keys and learning evidence. Cache the application shell through a service worker so the saved-text page opens offline. Online tutoring, assessment and generation remain unavailable offline. Clear history removes local saved lessons.

Renderer references: [resvg Node API](https://github.com/thx/resvg-js) and [FFmpeg concat formats](https://ffmpeg.org/ffmpeg-formats.html). Exact dependency versions remain in the pnpm lockfile.

## D035 · Retain anonymous usage reservations after history deletion

Date: 13 October 2026. Status: implemented; isolated retention and budget checks passed.

History deletion previously reset daily counters by removing the session/job rows they counted. Add a generator-owned usage table without a learner foreign key. Retain only operation category, timestamp, random reservation ID and an optional hash of the random learner ID for 31 days. It contains no learning text, recordings, credentials or raw learner ID. Backfill existing voice, transcription and media requests once, including failed requests. Keep global limits after history deletion; a new anonymous identity still receives a new owner allowance.

Reserve provider calls before text, search, synthesis, recognition and native voice requests. Bound global call counts separately from operation counts, token limits and media deadlines. These are request bounds, not an exact dollar-spend ledger. The provider key's user-set spending limit remains the external dollar cap; do not raise it or replace keys automatically.

Remove expired cookie sessions and learner data after thirty days of inactivity, on startup and at ten-minute intervals. Abort owned work, remove media, then cascade data. Remove orphan owner media directories after a crash. Preserve only the limited usage reservation record under its separate retention policy.

## D036 · Isolate retention checks and recover missing media

Date: 13 October 2026. Status: implemented and checked.

An isolated M12 database was incorrectly paired with the production media directory. Its orphan sweep deleted local cached narration/video/voice audio. Lesson text, learning evidence and database ownership survived. Require an explicit media directory for retention and use a separate fixture directory for isolated checks. Preserve the incident in [recovery evidence](evidence/m12-media-recovery.json).

Restore English/Hausa MP4 and captions from exact local copies; recover their spoken track into MP3 and record the codec change. Four other missing narrations, one compound-interest video and four voice reply clips had no original copy. Invalidate those cache outputs and leave saved text and explicit retry. Do not claim those historical files were restored or silently spend money regenerating them. Add startup integrity reconciliation so a lost file cannot remain a successful cached player indefinitely. Repeat retention checks against the isolated directory and record the result.

The compound-interest narration and video subsequently completed explicit browser retries. These are new reviewed outputs, not restored originals. The new captioned video played to its full 107.4-second duration. See [native recovery evidence](evidence/m12-native-recovery.json).

## D037 · Accept documented device-check limits for the demo

Date: 13 October 2026. Status: explicitly accepted by the user.

The user answered "Accept these device limitations for the demo" to the final M12 scope question. Natural human microphone conversation, a physical phone's software keyboard and a real screen-reader walkthrough remain unverified. Recorded voice, responsive layouts, keyboard navigation, captions and offline text have local acceptance evidence. The accepted scope permits completing M12 using that evidence while preserving these three limits.

Keep microphone capture, text/recording fallback, semantic controls, keyboard focus and media alternatives implemented. This decision accepts the missing device verification for the demo; it does not certify those devices or remove accessibility behavior from the product. Retain false verification flags and the user's earlier nonworking microphone report. Deployment and any future device certification remain separate work.

## D038 · A 4:30 pitch with an English and Yoruba learning demo

Date: 14 October 2026. Status: requested by the user; script and selected media prepared, timed rehearsal pending.

The user wants a captivating story about Roliat, a Yoruba-speaking learner with limited reading ability, followed by English and Yoruba demonstration. Use Roliat as an illustrative character returning to school after interrupted education, not a real-user testimonial or an assumption about village learners. Keep photosynthesis as the single topic so the language switch remains understandable.

Prepare a 4:30 run of show with the misconception, repair and fresh application first in English, then the Yoruba version and a short reviewed narration/video excerpt. A teacher supports navigation in the illustrative scenario because independent use by nonreaders has not been verified. Keep the experimental audio notice and distinguish offline saved text from future offline listening. Show Codex's documented planning, review and handoff work, then propose a measured learner/teacher pilot for the next month. See [pitch](pitch.md).

## D039 · Select a separately reviewed Yoruba excerpt for the pitch

Date: 14 October 2026. Status: prepared; general Yoruba speech remains experimental.

Generate the existing immutable Yoruba photosynthesis lesson through the normal narration/video queue. The first narration attempt was withheld; the second passed three chunk fidelity reviews and rendered a 140.4-second video. A separate review of a fifteen-second energy/material excerpt found unclear recognized wording around plant mass. Preserve the result and exclude that excerpt from the pitch.

Select a different introductory fifteen-second excerpt that states the process, light energy, carbon dioxide/water inputs and sugar/oxygen products. Its separate recognition and semantic review passed. Label it Yoruba, experimental AI voice, and keep captions/text available. This is a real generated teaching sample; it is not a native pronunciation certificate, a reliable full-language guarantee, a real learner's outcome or proof of independent use by nonreaders. Keep the prior failed evidence and D033/D037 limits.

## D040 · Start the demo with a spoken request and show its app flow

Date: 14 October 2026. Status: implementation in progress.

The user rejected a standalone fifteen-second clip as insufficient evidence of the working product and permitted a twenty-second extension to 4:50. Follow the visible app from language choice and spoken photosynthesis request through recognition, explicit confirmation, starting questions, saved sourced lesson, media preparation and the player. Shorten actual generation waits only with a visible elapsed-time/jump label. Keep the same journey/lesson visible across the flow.

The home composer previously had typed entry only. Add objective speech context to the existing recording/transcription service rather than implying that later tutor voice already provided home-page voice input. Bound requests to thirty seconds and six hundred confirmed characters, preserve owner/language binding and existing usage limits, and require explicit Start learning after confirmation. Editing the objective detaches its recording receipt. JSON context storage needs no SQL schema change; Drizzle generation reported no migration.

D040 verification update: type checks/build passed, and six new interface messages received accepted automated Yoruba/Hausa/Igbo reviews. The synthetic recorded Yoruba request reached a saved, receipt-linked live journey and sourced lesson. Isolated checks rejected unconfirmed, foreign, reused, wrong-context, changed-text, changed-language, oversized and stale requests. Narration for the new lesson failed three fidelity reviews; the matching video was withheld. The earlier accepted media remains a backup, not evidence of this new request producing video. Browser capture was rejected by the browser tool's URL policy. Further paid speech checks await additional key allowance; the latest read-only snapshot was approximately $0.55 with a $0.50 speech availability requirement.

## D041 · Preserve failed narration and select a lesson within the spoken pathway

Date: 14 October 2026. Status: selected media verified; browser capture and rehearsal pending.

The key allowance increased to $2, with approximately $0.73 available before resuming. A bounded unpublished diagnostic of the sunlight lesson failed the production fidelity instructions because recognition changed sunlight to heat. Fish S2.1 Pro comparisons at 700 and 200 characters also failed, changing or obscuring the plant-material claim and its negation. Preserve [all three results](evidence/spoken-objective-narration-comparison.json). Do not weaken the review, publish these files, change the configured provider automatically or replace the immutable lesson.

The same spoken request produced three concepts. Prepare its existing Carbon Dioxide and Water concept as the next presentation candidate. This is an explicit lesson selection inside the saved pathway, with its own sourced lesson and normal narration/video jobs. The failed sunlight lesson remains available as text and retains its failed jobs. An unrelated older video cannot stand in for this selected lesson.

Current primary references were checked on 14 October: [Google's language table](https://ai.google.dev/gemini-api/docs/speech-generation#supported-languages) still omits Yoruba; [OpenRouter's TTS adapter](https://openrouter.ai/docs/guides/overview/multimodal/tts) separates delivery instructions from Gemini's transcript; [Fish S2.1 Pro](https://openrouter.ai/fish-audio/s2.1-pro) is an explicit comparison, not a selected fallback. Model support claims and these automated checks do not establish native pronunciation quality.

D041 result: Carbon Dioxide and Water passed source review on its second attempt. Both narration chunks passed fidelity review on the first narration attempt, and the matching video rendered on attempt one. Keep Gemini/Puck configured; no fallback or weaker gate was introduced. [Media evidence](evidence/spoken-objective-media-review.json) verifies the same receipt/journey/lesson and reviewed video, with local full-file decoding and frame inspection. The original sunlight failures remain in the [flow record](evidence/spoken-objective-flow.json). The 4:50 script now shows this explicit lesson selection. Browser capture and timed rehearsal remain pending.

## D042 · Retry the live home tab and preserve the fresh browser result

Date: 14 October 2026. Status: browser request-to-lesson verified; browser video withheld.

The user explicitly asked to retry browser automation. The old tutor tab was now a connection-error data page, while the existing HTTP home tab was accessible. Reloading that home tab loaded the current spoken-objective build. The browser proceeded through synthetic recording upload, real recognition, confirmation, explicit Start, live planning, starting questions, explicit skip and a new sourced Yoruba lesson. Retain the previous URL-policy error as historical evidence; it is no longer a blanket blocker on browser automation.

The browser created its own anonymous journey and media jobs. Its narration failed three bounded attempts, so video remained withheld and text saving stayed usable. Preserve [this browser result](evidence/spoken-objective-browser.json) and [screenshots](evidence/m13-browser/README.md). The earlier approved API-owner video cannot stand in for this browser lesson. Do not trigger further paid speech with the observed $0.22 balance below the $0.50 requirement. No provider/model setting, review gate or retry limit changed.

The capability inventory supports screenshots and exposes no screen-recording API. Actual continuous footage and rehearsal remain pending. The visible generated concept objective also needs semantic/native-language review; neither successful browser navigation nor source-approved lesson text certifies every planning label.

## D043 · Recover approved narration chunks across retries

Date: 14 October 2026. Status: implementation complete; browser media verification in progress.

The user increased the key allowance to $5 and requested working video for the demo. A funded retry of the browser's saved narration failed; stage-only diagnostics then identified a fidelity rejection in chunk zero on another attempt. A separate bounded first-chunk probe passed the same fidelity instructions, showing variable outcomes. Keep every prior failed job/attempt and the unchanged fidelity criteria.

Previously, one rejected chunk discarded every approved chunk from that attempt. Add a private cache beneath the job's owner directory. Bind it to the exact job/dedupe key, language, model, voice, chunk index/text and SHA-256 audio checksum. Only chunks with valid reviews can be reused. Missing, altered or mismatched files require a new reviewed synthesis. Store up to six failed review records privately for diagnosis. Unreviewed audio stays transient and no route serves intermediate files.

A retry continues with unfinished chunks, then publishes only after all reviews pass and the combined narration remains within existing size/duration limits. Successful publication removes the intermediate cache. History deletion and owner retention remove the owner directory; deletion during preparation also removes a newly written cache if its job is gone. No SQL schema changes are needed because these are private intermediate media files. Yoruba recovery revision 3 gets a distinct narration/video cache entry for the same immutable lesson; the earlier revision's failed jobs remain unchanged. Retry and spending limits remain in force.

Safe operational logs include job ID, stage, chunk index, an allowlisted error type and numeric provider status. They exclude raw provider messages, lesson words, review reasons and credentials. Private review reasons stay in the owner-bound manifest. Provider/model selection and delivery instructions are unchanged.

## D044 · Short Yoruba narration groups and doubled-vowel delivery

Date: 14 October 2026. Status: browser media check in progress.

Recovery revision 3 rejected its first 700-character chunk on three attempts. The [recorded reviews](evidence/narration-recovery-failures.json) consistently found recognition changing the phrase for living things from `alààyè` to `alaye`. Preserve those failures and do not accept the changed claim.

Revision 4 splits Yoruba narration into groups of at most 300 characters, preserving every original character in order. Delivery instructions explicitly ask for doubled vowels to stay distinct, including `alààyè`. Instructions remain separate from the verbatim transcript, as documented by [OpenRouter's Gemini TTS adapter](https://openrouter.ai/docs/guides/overview/multimodal/tts). Its [segmentation guidance](https://openrouter.ai/docs/guides/overview/multimodal/tts#best-practices) also recommends shorter segments for reliability. The recognizer receives no expected lesson text or vocabulary hint; each chunk still needs the same independent semantic review. Provider, model, voice, lesson text, sources, job retry limits and progress evidence remain unchanged.

The new delivery/chunking revision creates a distinct cache/job for the same immutable browser-owned lesson. Revisions 2 and 3 retain their failed attempts; their counters are not reset. Approved chunk recovery remains available, so a failed later group does not discard earlier accepted audio. Native pronunciation and general Yoruba reliability remain unverified.

## D045 · Include audible Yoruba exchanges in the demo

Date: 14 October 2026. Status: user requirement accepted; playback/capture preparation in progress.

The user requires the app's spoken language in the demo, including spoken learning requests/questions and the video explainer. Record system/browser audio so the Yoruba learner request, òye.'s spoken starting question and the Yoruba explainer narration are audible. Presenter speech pauses during these moments. Captions accompany the sound; silent screenshots do not satisfy the final recording requirement.

Completed/skipped starting assessments now expose a read-only Starting questions disclosure with existing owned narration controls. This permits replay of the actual questions without resetting answers, starting another assessment or altering understanding. Existing translated labels are reused. A new learner's capture should play the initial question before skipping; replay footage of a saved assessment must be identified accurately. Continuous recording and its exported audio track remain unverified until the final file exists.

## D046 · A separate recognizer for Yoruba narration fidelity

Date: 14 October 2026. Status: explicit local configuration selected; full browser media check in progress.

Revision 4 reached six approved groups but its final glossary group failed on attempts five and six. Preserve [all failures](evidence/narration-recovery-v4-failures.json). The bounded Fish comparison omitted content and remained unpublished; a Kore comparison also failed Gemini recognition. No TTS model or voice switch was selected.

An independent Scribe V2 transcription of the same Kore audio retained a different Yoruba spelling and passed the unchanged fidelity review. [Comparison evidence](evidence/yoruba-narration-stt-comparison.json) preserves both transcripts, the rejection history and the accepted comparison. [ElevenLabs' documentation](https://elevenlabs.io/docs/overview/capabilities/speech-to-text#supported-languages) includes Yoruba in its moderate-accuracy category, so this is not a native pronunciation certificate or a reliability guarantee.

Explicitly configure `OPENROUTER_NARRATION_STT_MODEL_YO=elevenlabs/scribe-v2` for narration review only. Learner recording recognition remains `OPENROUTER_STT_MODEL`. Snapshot the narration recognizer in each new job, record it in review evidence and include it in Yoruba's cache identity. Existing jobs keep their recognizer and counters; no automatic model fallback or expected-script hint is used. All chunks must pass the same independent semantic review before publication. The JSON input type changes without a SQL schema change; Drizzle generation verifies that distinction.

## D047 · Prepare separate demo clips and stop expanding scope

Date: 14 October 2026. Status: accepted by the user; assets prepared.

The user explicitly requested working assets as soon as possible, accepting separate clips of the AI reading a Yoruba quiz, generated course content and a watched Yoruba video that can be joined. A single uninterrupted fresh journey is no longer required for this presentation. Prioritize existing approved media and actual saved app screens; stop additional narration recovery work for the recording task.

Export the actual question audio, capture its real browser player frames and pair them in the edit. Use actual saved course stills and the synthetic recorded objective. Use the previously reviewed captioned Yoruba explainer from its separate saved lesson, with a prepared-media label. Keep failed narration unpublished and do not imply the newer browser lesson produced that video. This changes presentation scope, not review gates, ownership, progress evidence or accepted language/device limitations.

The numbered MP4s, joined Yoruba segment, full question audio and English/Yoruba explainers are in `.data/demo-assets/`, with a local player page. Full presenter recording and timing remain to be done. [Evidence](evidence/demo-assets.json) records the capture method and decoding checks.

## D048 · A finished motion demo with an AI presenter

Date: 14 October 2026. Status: finished video produced and locally checked.

The user requested the finished demo using the assets and script, with a minimal, classy, artistic educational treatment. Produce a 4:50 H.264/AAC video with original drawn learning diagrams, actual app captures, real project-document excerpts and the existing Yoruba audio. Use the configured inexpensive English TTS role for a synthetic presenter; do not imply it is the user's recorded voice. Cache nine bounded voice blocks to avoid repeat generation during visual edits.

Roliat remains illustrative. English examples are synthetic submissions through the actual app. Preserve source-linked outcomes and earlier attempts. Prepared Yoruba clips remain separately identified under D047. Presentation narration is distinct from app narration review. Keep experimental Yoruba/Igbo voice and accepted device limits visible. Rendering and local asset packaging do not deploy or change the application's learning rules.

## D049 · Tighten the audience-facing pitch and audition warmer narration

Date: 14 October 2026. Status: completed with the user-selected Sulafat narrator.

The user liked the video and asked to remove capture-method footers, the phrase about a video from another saved lesson, and the ending's device-verification checklist. Make the story flow as a cohesive demonstration and shorten the cut while preserving the English misconception/repair/application, audible Yoruba request/question/explainer, Codex workflow and pilot plan.

Replace production terminology in narration with ordinary product language, including "Here is a video." Target 4:10 rather than 4:50. Keep the actual grades and source content; do not invent an uninterrupted live session, a real Roliat success story or reliable speech in all four languages. Preserve the original 4:50 file and all internal provenance and limitation records. The user's latest presentation preference supersedes the previous requirements to place those production notes and a verification checklist in the promotional video.

Audition Sulafat, Aoede and Puck using the same short script and expressive educational delivery. [Google's voice guide](https://ai.google.dev/gemini-api/docs/speech-generation#voice-options) describes them as warm, breezy and upbeat. [OpenRouter's TTS guide](https://openrouter.ai/docs/guides/overview/multimodal/tts) supports delivery instructions separate from the transcript. Generate three bounded cached samples; recommend Sulafat as a warm working narrator. The user subsequently selected Sulafat explicitly. This affects the presenter only, not the app's configured speech voices or review gate.


## D050 · OpenAI defaults and a portable developer handoff

Date: 14 October 2026. Status: implemented at the user's request, with isolated startup and controlled provider checks.

The user clarified that OpenAI through the OpenAI Agents SDK is the default. Apply that preference to configuration, the environment template, `AGENTS.md` and current documentation. OpenRouter remains an explicit alternate. Preserve the existing ignored local OpenRouter override because no direct OpenAI key is configured and the recorded demo already works with it. Do not claim paid OpenAI validation from gateway evidence.

Route source discovery through the selected provider. Direct OpenAI uses Responses web search with approved educational domains, one built-in tool call and validated citation notes. These notes are derived from cited answer paragraphs, not verbatim page excerpts. Curated source bundles and existing source-support review remain. Disable fixed development fixtures by default; they require explicit opt-in.

Package source, generated migrations, one workspace lockfile, docs, walkthrough images and the current pitch into a ZIP with file hashes and a checksum. Exclude runtime data and credentials. Provide current setup, code-location, contributor and deployment guidance, plus a prominent static screenshot walkthrough at the top of README. Keep the earlier proposed architecture as a dated archive and document the implemented structure in the current architecture file.

An isolated extraction installed frozen dependencies, applied thirteen generated migrations, type-checked, built and started without credentials. Controlled responses checked the direct search adapter; live direct OpenAI and hosted deployment remain unverified. [M16 evidence](evidence/m16.md) records the checks. This adds a reusable handoff, without changing learning evidence or accepted language/device scope.


## D051 · Make the video explainer visible in the walkthrough

Date: 14 October 2026. Status: implemented after the user's walkthrough review.

The user could not see the video explainer in the screenshot tour. The initial image was small, placed in a combined offline/media section and embedded as raw HTML. Use standard Markdown for all walkthrough images. Give video its own section near the sourced lesson and a direct README link. Replace the small mobile video shot with the existing larger app capture showing playback at 0:51, captions and download/transcript controls.

Add a frame and the full previously reviewed Yoruba photosynthesis explainer with captions. Preserve media provenance in capture metadata. This improves documentation; it does not generate new content, alter review gates or change accepted language/device scope.


## D052 · Docker Compose for local adoption

Date: 14 October 2026. Status: implemented; isolated container acceptance passed on Linux/amd64.

The user requested Docker/Compose to simplify running the handoff. Build separate API/web targets, with one generated-migration job gating API startup and API health gating the web proxy. Keep the prototype's one-process job/voice coordination and SQLite; no database server is needed. Include FFmpeg/FFprobe and Unicode fonts so media has the same prerequisites in every container.

Use `.env.docker` for runtime provider configuration, independently of the existing native `.env`; default to OpenAI through the Agents SDK. Exclude credentials and runtime data from build context and source packages. API/migration run as the Node user and share one named data volume. Publish only a loopback web port; bind Hono to the internal container network via explicit `API_HOST`. Native bind behavior stays loopback. Make the video font configurable so Docker can select installed Noto Sans while native setup keeps Arial.

The local workflow applies existing Drizzle migrations, never generates or edits them. Document persistent data, backups, updates and explicit alternate ports. No paid provider calls are required to check this packaging. Live-provider/language evidence and accepted device limitations remain separate.

D052 acceptance: fresh builds/migrations, proxy/ownership routing, media/fonts, container-recreation persistence and coherent backup/fresh-volume restore passed without provider keys. The source handoff includes the setup. See [M17 evidence](evidence/m17.md).


## D053 · Curate the repository before GitHub publishing

Date: 14 October 2026. Status: completed; repository, documentation and source-package checks passed.

The user requested removing unnecessary files, folders, videos and images from what will go to GitHub. Retain one current 4:10 pitch with its captions/script/poster, and the walkthrough's fourteen images plus reviewed Yoruba explainer/captions. Those assets support the README product tour. Preserve source, existing tests, generated migrations/metadata, Docker setup, documentation and failed-review evidence.

Move old/duplicate videos, voice auditions, preview collages and local-only production copies to `.data/repo-archive/`, outside Git and the source handoff. Keep the active renderer/cached editing inputs local. Remove the agent-created isolated source/dependency copy used for M16 acceptance. Live learner data and working dependencies/builds remain local and ignored.

Use an explicit Git allowlist for current presentation deliverables; ignore generated caches, logs, coverage, ZIPs and runtime data. Keep the source packager's output curated too. Update current production/handoff guidance while leaving original filenames in dated evidence. No GitHub publishing or staging is included in this cleanup.


## D054 · Create the personal GitHub repository

Date: 14 October 2026. Status: completed under the user's explicit authorization; private repository and main push verified.

The user asked to create a repository in their account and push the project. The authenticated personal account is `degoke`; use the available ASCII brand slug `oye`, preserve the existing `main` branch and initially create a private repository. Public visibility was not specified. Upload the cleaned source/documentation/container setup and curated demo assets, preserving runtime/credential/archive exclusions. No hosted application deployment is included. Verify remote ownership and commit synchronization before reporting completion.

D054 result: [degoke/oye](https://github.com/degoke/oye) was created privately, with `main` pushed and the initial remote tree/blob hashes matched to the local commit. Ownership is `degoke`. Runtime/credential files remain excluded.


## D055 · One check command locally and in CI

Date: 14 October 2026. Status: complete; local and hosted checks passed.

The user requested GitHub CI for typecheck/tests/build and a local command doing all three. Define `pnpm check` as sequential `pnpm typecheck`, `pnpm test`, `pnpm build`, stopping at the first failure. Reuse that exact command in the workflow rather than maintaining a separate task order. Existing package tests use Vitest; browser checks remain their separate opt-in command and paid/device checks retain separate evidence.

Use Ubuntu 24.04, Node from `.nvmrc`, pnpm's manifest-pinned version, frozen installation and dependency-store caching. Pin third-party actions to verified release commits, keep read-only repository permissions, bound run time and cancel superseded runs. Trigger main pushes, PRs and manual dispatch. No provider keys, live databases or migration generation are used in CI. Add `.github` to source packaging so an extracted handoff retains the same check configuration.

D055 result: local `pnpm check` and [the hosted workflow](https://github.com/degoke/oye/actions/runs/38615125646) passed, including eleven package tests. Workflow/source-package checks passed.


## D056 · Keep the README focused on the app

Date: 14 October 2026. Status: implemented at the user's request.

The user clarified that the capstone presentation is separate from the app. Remove the README's pitch/video and source-ZIP promotion block. Keep app features, product walkthrough, setup, providers, development checks and deployment/status guidance. Remove the presentation shortcut from the walkthrough navigation; retain the app's narrated video explainer sections. Presentation and packaging records remain in their dedicated documentation.
