# Milestones

Date: 13 October 2026. Work proceeds in this order, one milestone at a time.

Statuses and check evidence live in [status](status.md). All unchecked items are planned work.

## M00 · Planning baseline

Outcome: the product and build are defined before implementation.

- [x] Preserve the supplied product overview.
- [x] Document demo scope, learning contracts, and success criteria.
- [x] Document architecture, design, decisions, and milestone order.
- [x] Record English, Yoruba, Hausa, and Igbo as target languages.
- [x] Update `AGENTS.md` with preferences and the documentation map.

Complete when all planning documents exist, agree on the required scope, and link to one another. Application behavior remains unimplemented.

## M01 · Runnable foundation

Depends on M00. Outcome: the client and API run together.

- [x] Create the pnpm workspace, web/API/shared/db packages, strict TypeScript, and root scripts.
- [x] Select compatible runtime/package versions and record them.
- [x] Add React/Vite, TanStack Router, Mantine provider/styles/theme, and the mobile navigation shell.
- [x] Add a Hono health endpoint, development proxy, and configuration validation.
- [x] Add `.env.example`, ignore local secrets/data, and document startup. Initialize local Git if needed.

Acceptance: `pnpm install` and the new `pnpm dev` work from the root; the client reaches the health endpoint; direct route refresh works; the shell fits phone and desktop widths. Type checks and build pass. A missing OpenAI key does not prevent the shell from running.

## M02 · Anonymous session and database

Depends on M01. Outcome: preferences survive a reload without signup.

- [x] Define learner, session, and preference schemas and owner-scoped repositories.
- [x] Configure Drizzle and expose `pnpm db:generate` / `pnpm db:migrate`.
- [x] Generate the initial migration with Drizzle Kit and apply it to a disposable local database.
- [x] Implement session creation/resume, expiry, preference updates, and clear-history behavior.
- [x] Add session ownership checks and focused persistence checks.

Acceptance: no SQL migration is handwritten; the generated migration initializes a fresh database; changing language persists across reload and server restart; a second session cannot read or alter the first. Clearing history produces a fresh empty learner state. No auth screens exist.

## M03 · Objective and assessment interface

Depends on M02. Outcome: a learner can start an objective and complete the assessment flow.

- [x] Build My Learning, objective input, concise preferences, saved journeys, and useful empty states.
- [x] Add journey/concept/assessment contracts and generate any required schema migration.
- [x] Build a one-question-at-a-time assessment with unknown, skip, and resume behavior.
- [x] Exercise the flow with clearly labeled deterministic development fixtures.

Acceptance: an objective and partial answers survive reload; skipped assessment remains unknown; a concept request has a direct lesson destination while a broad request has a pathway destination. Validate input and show usable network errors. Fixtures are clearly distinguished from live AI output.

## M04 · Sources and live learning generation

Depends on M03. Outcome: a fresh request becomes a grounded assessment and first lesson.

- [x] Add the first server Agents SDK workflow and configurable model adapters.
- [x] Select and review source bundles for two demo tracks; add search for fresh requests.
- [x] Generate validated scope, a bounded pathway, rubric, and baseline questions from sources.
- [x] Generate a concise first lesson after baseline submission or skip.
- [x] Add durable generation jobs with polling, idempotency, bounded retries, and restart recovery.

Acceptance: one concept and one broad objective work with live API calls; baseline generation precedes teaching; source references resolve to stored retrieved material; different baseline evidence changes the starting explanation. Invalid output or failed retrieval is recoverable. Duplicate submission and server restart do not publish duplicate lessons.

## M05 · Lesson and practice

Depends on M04. Outcome: a learner can read, apply, and revisit the concept.

- [x] Render structured lesson sections, examples, glossary, approved visual templates, and source links.
- [x] Add practice questions, confirmed answers, explanations, and saved attempts.
- [x] Load further concepts on demand and resume the last useful location.
- [x] Add clear loading, empty, failed, and retry states for content.

Acceptance: a sourced lesson and practice work on mobile, with keyboard access and text alternatives for visuals. A correct answer and an unknown answer produce distinct saved evidence. Opening or finishing the lesson does not mark understanding demonstrated.

## M06 · Contextual text tutor

Depends on M05. Outcome: a learner can ask for help without restating the lesson.

- [x] Add standalone and contextual conversations through the Agents SDK.
- [x] Stream replies, persist completed turns, and mark interrupted turns accurately.
- [x] Add "simpler explanation", "another example", and "help me practice" actions.
- [x] Allow a standalone conversation to create a journey after the learner chooses to continue.

Acceptance: a lesson question uses its concept and sources; standalone Q&A works; refresh preserves history; a cancelled or failed stream can be retried without duplicate turns. Sessions remain isolated and the mobile composer stays accessible with the keyboard open.

## M07 · Explain Back, repair, and progress

Depends on M06. Outcome: feedback changes the next learning activity.

- [x] Add a distinct Explain Back mode with independent explanation and bounded follow-up questions.
- [x] Validate rubric-based feedback and its supporting learner evidence.
- [x] Implement deterministic understanding transitions and preserve each attempt.
- [x] Generate a focused repair and a fresh application question for the identified gap.
- [x] Build My Progress with evidence, gaps, before/after attempts, and resume actions.

Acceptance: a correct explanation, a known misconception, and an uncertain answer produce appropriate different feedback. A learner can correct a gap and demonstrate it through fresh practice. Progress changes because of evidence, survives reload, and remains inspectable. Uncertain evaluation does not silently award understanding.

## M08 · Four-language text experience

Depends on M07. Outcome: English, Yoruba, Hausa, and Igbo work across the text learning loop.

- [x] Localize interface messages and add the four language choices.
- [x] Generate language-specific assessments, lessons, tutor replies, feedback, and repair content.
- [x] Preserve source IDs, rubric intent, terminology, and understanding evidence across language changes.
- [x] Check diacritics, layout, local examples, and a glossary for technical terms.
- [x] Record representative language reviews and start the per-language speech capability matrix.

Acceptance: the same sourced concept completes the loop in each target language; switching language preserves progress and loads the right content version. Review samples for meaning and misconceptions, with native-speaker review where available. Record exactly who or what reviewed each sample; automated checks alone do not establish language quality.

## M09 · Narration and spoken turns

Depends on M08. Outcome: a learner can listen and submit a spoken explanation.

- [x] Generate cached lesson narration with a visible transcript and playback controls.
- [x] Add microphone recording, bounded transcription uploads, transcript confirmation, and text fallback.
- [x] Narrate assessment prompts/options and confirm spoken selections.
- [x] Send confirmed spoken explanations through the existing Explain Back evaluator.
- [x] Check narration and recognition separately for all four languages; document retention and limitations.

Acceptance: listening teaches the same key ideas as text; a spoken assessment and Explain Back turn save confirmed evidence. Test each target language, denied microphone permission, bad recognition, and low-data mode. If a language is unreliable, document the capability failure and proposed remedy; do not silently claim that speech works because text does.

## M10 · Natural voice conversation

Depends on M09. Outcome: the learner can talk with a contextual tutor.

- [x] Integrate Agents SDK realtime with server-created short-lived session credentials.
- [x] Share the authorized concept, language, learner context, and server tool restrictions.
- [x] Add mute, stop, interruption, connection states, transcripts, and reconnect behavior.
- [x] Route confirmed voice Explain Back evidence to the server evaluator.
- [x] Enforce usage/session limits on the server and record per-language live speech checks.
- [x] Record an explicit demo scope change for experimental Yoruba/Igbo voice and preserve the remaining human microphone/device check in M12.

Implementation and focused checks are recorded in [M10 evidence](evidence/m10.md). The recorded demo scope decision below permits advancement while preserving unverified device behavior.

The user accepted experimental Yoruba/Igbo voice with text fallback on 13 October 2026, permitting advancement to video. M10 is complete for this accepted demo scope. D033 and the evidence record retain failed audio and the unverified natural human microphone check for M12.

Acceptance: a natural voice conversation retains context and produces a saved transcript; an interruption and reconnect recover cleanly; the permanent API key never reaches the browser. Explain Back saves server-validated evidence. Record the supported/limited/failed result for each language and resolve any required capability gap before claiming the full language-and-voice scope complete.

## M11 · Narrated visual explainers and low-data delivery

Depends on M10. Outcome: the same grounded lesson has a short watchable format.

- [x] Choose and document the simplest suitable renderer, media storage, and required executables.
- [x] Generate source-linked storyboards, template visuals, narration, timings, captions, and a playable output.
- [x] Reuse durable jobs, on-demand generation, versioned caching, cancellation, and retry behavior.
- [x] Add the video player, transcript, download option, and media-failure fallback.
- [x] Add local saved text lessons and lightweight text/transcript export for intermittent connectivity.

Completed checks and limits are in [M11 evidence](evidence/m11.md). Yoruba/Igbo narration-dependent video retains the accepted experimental scope.

Acceptance: generate and play a short explainer for a demo concept, verify its teaching against the source lesson, and check captions/transcript. Exercise language-specific scripts and narration using the capability matrix. Low-data mode avoids automatic media downloads; saved text opens offline and online-only features show their connection requirement. Rendering failure leaves text usable.

## M12 · Complete demo and handoff

Depends on M11. Outcome: the full demo meets the product acceptance criteria.

- [x] Run concept and broad-goal walkthroughs, including an incorrect explanation followed by targeted improvement.
- [x] Verify fresh AI generation and same-browser resume, not only stored fixtures.
- [x] Check all four text languages and publish the speech/media capability matrix.
- [x] Check responsive layouts, keyboard flows, delayed responses, offline saved text, job recovery, ownership isolation and clear-history behavior; record the user-accepted unverified human microphone, physical-phone keyboard and real screen-reader limits in D037.
- [x] Review source traceability, generated claims, evaluation findings, media equivalence, and API-spend limits.
- [x] Document startup, environment variables, generated migration workflow, demo script, verified behavior, known limitations, and deployment requirements.

M12 is complete for the accepted demo scope. [M12 evidence](evidence/m12.md) records the passed checks, and D037 records the user's explicit acceptance of the three unverified device checks. Those checks remain unverified; the completed checklist records their accepted scope resolution.

Acceptance: all required product behaviors have recorded evidence; relevant type checks, build, automated behavior checks, and manual walkthroughs pass. Any unmet requirement has a recorded resolution or an explicit user-approved scope change. No required capability is hidden behind a silently checked milestone. Update status to complete only after this audit. Publishing remains a separate deployment task.

## M13 · Spoken learning requests and a visible 4:50 demo flow

Added after the completed original demo, at the user's request on 14 October 2026. Outcome: the presentation follows a spoken learning objective through the app to its sourced lesson and video.

- [x] Add home-page recording/upload, recognition, editable confirmation and explicit Start learning.
- [x] Bind confirmed objective receipts to the owned language/request, with single-use attachment, length/duration bounds and typed fallback.
- [x] Complete the spoken request → plan → lesson → reviewed video API path. The owned confirmed request created a three-concept Yoruba pathway. Its Carbon Dioxide and Water lesson passed source review, two narration chunk checks and matching video rendering/linkage. The earlier sunlight lesson retains its failed audio checks and text fallback. See [flow evidence](evidence/spoken-objective-flow.json) and [media review](evidence/spoken-objective-media-review.json).
- [x] Check the home spoken control through recording upload, recognition, confirmation, explicit Start, live plan, starting questions, sourced lesson and saved-text confirmation in the actual browser. [Evidence and screenshots](evidence/m13-browser/README.md) preserve the fresh journey and its withheld video.
- [x] Prepare separate audible Yoruba request/question/video clips and generated course screens for joining, per the user-approved D047 scope. Full fresh browser-journey video and continuous recording are superseded for this demo asset task. The newer lesson's failed media remains withheld.
- [x] Revise the 4:50 pitch/shot list so app navigation and generation connect the input to the in-app player.

The earlier error-page access was rejected by URL policy. The user-requested retry connected to the existing HTTP home tab and verified the flow through the lesson. No alternate browser, cookie injection or raw automation workaround was used.

The API-owner full lesson video is ready for review, with captions, local full-file decoding and an inspected frame. Browser screenshots now exist. D047 accepts separate prepared clips. M13 is complete for demo asset preparation, with [export evidence](evidence/demo-assets.json). The final presenter recording and timed rehearsal remain presentation tasks. The original accepted demo scope is complete.

## M14 · Produce the finished capstone video

Added at the user's request on 14 October 2026. Depends on completed M13. Outcome: a 4:50 motion video assembled from the script, actual app captures and prepared audible media.

- [x] Document the timeline, visual direction, synthetic presenter and prepared-media treatment in [production notes](demo-production.md).
- [x] Prepare cached English presenter voice blocks and retain the original Yoruba request/question/explainer audio.
- [x] Capture the actual English misconception → follow-up → repair → later explanation → fresh application results without inventing a grade.
- [x] Render original educational motion artwork, readable app captures, real Codex documents and a pilot close.
- [x] Decode the complete export, check its 290-second duration, spoken audio and representative frames, then deliver the MP4, captions and editable timing/source manifest.

Accepted experimental language and device limits remain visible. The video is an edited prepared demonstration with synthetic learning examples, not a continuous live recording or a real learner impact claim.

M14 complete: the 290-second, 1280 × 720, 30 fps H.264/AAC export decoded fully. All three Yoruba speech intervals match their exact prepared tracks after encoding and contain no presenter/music overlap. English source-linked submissions reached demonstrated only after a later correct independent explanation and fresh light/dark application; the previous needs-practice attempt remains saved. [Video checks](evidence/demo-video.json) and [learning evidence](evidence/demo-english-learning.json) record the results. Final MP4, captions, script and editable source/manifest are in `deliverables/`. Human listening/native-language/device certification remains unclaimed.

## M15 · Tighten the pitch and select narration

Added at the user's request after M14. Outcome: a shorter cohesive product demonstration with warmer narrator options.

- [x] Preserve the original export and revise to a 4:10 timeline without removing the core learning evidence or audible Yoruba media.
- [x] Remove audience-facing production footers, the separate-lesson narration and the closing verification checklist; retain internal evidence.
- [x] Generate comparable Sulafat, Aoede and Puck voice samples and offer the user a choice.
- [x] Render the revised presenter and motion edit, check duration/media/audio preservation, and deliver the shortened version.

The user explicitly selected Sulafat. The demonstration does not claim uninterrupted live recording or real learner pilot results.

M15 complete: the 250-second Sulafat export decoded fully and played unmuted in the browser without a media error. All three original Yoruba intervals retain their prepared tracks with correlations above 0.9998, with no overlapping presenter or music. The core learning sequence remains 55 seconds; the original 4:50 file is archived. [Revision checks](evidence/demo-video-v2.json) retain the measured results.

## M16 · Reusable handoff and screenshot walkthrough

Added at the user's request after M15. Outcome: another developer can explore, install and run the prototype with their own provider key.

- [x] Set OpenAI/Agents SDK as the repository default; preserve OpenRouter as an explicit option and route source discovery by provider.
- [x] Link a static app walkthrough near the top of README, with real repository-contained screenshots.
- [x] Give the video explainer a dedicated walkthrough section with visible playback/captions, plus a Yoruba frame and full-video link.
- [x] Provide current setup, developer, contributor, architecture and deployment guidance.
- [x] Add source packaging with generated migrations, a lockfile, screenshots and no private runtime data.
- [x] Check documentation links/assets, provider boundaries, package contents and isolated install/build/migration/startup. See [M16 evidence](evidence/m16.md).

The local funded OpenRouter override remains explicit; a missing direct OpenAI key does not justify claiming live OpenAI validation. No deployment or public repository publishing is included in this milestone.


## M17 · Docker Compose local handoff

Added at the user's request after M16. Outcome: run the complete local prototype with Docker instead of installing Node, pnpm, FFmpeg and fonts on the host.

- [x] Add container images for the API and built web client, with native dependencies, media tools and fonts.
- [x] Apply existing generated migrations through a one-off Compose service before API startup.
- [x] Preserve SQLite/media in a named volume, keep credentials outside images and retain OpenAI defaults.
- [x] Document first run, alternate ports, configuration, updates, logs, stop/restart and data recovery.
- [x] Check a fresh build/start, web/API proxy, route refresh, preferences across restart, WebSocket routing and local media rendering.
- [x] Include the Docker setup in the source handoff and record the evidence.

M17 complete: container/native builds, fresh migrations, proxy/deep-link checks, WebSocket routing, Unicode/media rendering, restart persistence, coherent backup and fresh-volume restore passed without paid calls. See [M17 evidence](evidence/m17.md).


## M18 · GitHub repository cleanup

Added at the user's request after M17. Outcome: a curated source repository with useful demo assets and no redundant exports/runtime bulk.

- [x] Inventory Git candidate sizes, duplicate media and credential-like evidence fields.
- [x] Archive old/duplicate exports, auditions, preview collages and local-only production copies.
- [x] Keep the current pitch and linked walkthrough assets; preserve verification/failed-review history.
- [x] Ignore caches, coverage/logs, generated ZIPs and unapproved presentation exports.
- [x] Remove the generated isolated handoff source/dependency copy.
- [x] Check remaining Git candidates, documentation links, ignore behavior and refreshed source-package contents. See [M18 evidence](evidence/m18.md).


## M19 · GitHub repository and initial push

Added at the user's request after M18. Outcome: the cleaned project is available in the user's GitHub account.

- [x] Confirm the authenticated account, available repository name and cleaned files.
- [x] Create `degoke/oye` with initial private visibility and configure origin.
- [x] Commit/push `main` and verify remote commit/file contents.
- [x] Record the repository URL, visibility and completed handoff.

M19 complete: [degoke/oye](https://github.com/degoke/oye) is private, `main` is pushed, and the initial remote tree/blob hashes match the cleaned local commit. [Repository evidence](evidence/m19-github.json) records the checks.
