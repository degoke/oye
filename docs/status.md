# Project status

Last updated: 14 October 2026, Africa/Lagos.

Current phase: the original demo is complete for the accepted scope. M00–M12 are complete; M13 adds the user-requested spoken objective and visible 4:50 presentation flow. A local Git repository and pnpm workspace are initialized.

Current milestone: M20 is complete, including GitHub CI and the local check command. M19 is complete, including GitHub repository creation and initial push. M18 is complete, including GitHub repository cleanup. M17 is complete, including Docker Compose local handoff. M16 is complete, including the reusable handoff and static screenshot walkthrough. M15 is complete. M13 is complete for the accepted separate demo-asset scope. Fresh learning/adaptation, four-language text, recorded voice, captioned video, saved offline text, retention, usage bounds, keyboard checks, type checks and production build have recorded evidence. D033 accepts experimental Yoruba/Igbo audio with text fallback. D037 accepts unverified human microphone conversation, physical-phone keyboard behavior and real screen-reader checks as documented demo limitations. No device certification or deployment is claimed. See [final audit](evidence/m12.md), [handoff](handoff.md) and [demo script](demo-script.md).

| Milestone | Status |
| --- | --- |
| M00 · Planning baseline | Complete |
| M01 · Runnable foundation | Complete |
| M02 · Anonymous session and database | Complete |
| M03 · Objective and assessment interface | Complete |
| M04 · Sources and live learning generation | Complete |
| M05 · Lesson and practice | Complete |
| M06 · Contextual text tutor | Complete |
| M07 · Explain Back, repair, and progress | Complete |
| M08 · Four-language text experience | Complete |
| M09 · Narration and spoken turns | Complete with recorded Igbo narration failure |
| M10 · Natural voice conversation | Complete for accepted experimental language scope |
| M11 · Narrated visual explainers and low-data delivery | Complete |
| M12 · Complete demo and handoff | Complete for accepted demo scope |
| M13 · Spoken learning requests and visible presentation flow | Complete for accepted separate demo-asset scope |
| M14 · Finished capstone motion video | Complete; original 4:50 export archived |
| M15 · Pitch revision and narrator selection | Complete; 4:10 Sulafat cut delivered |
| M16 · Reusable handoff and screenshot walkthrough | Complete; source package and isolated startup checked |
| M17 · Docker Compose local handoff | Complete; containers, persistence, media and backup/restore checked |
| M18 · GitHub repository cleanup | Complete; curated assets, ignore rules and package links checked |
| M19 · GitHub repository and initial push | Complete; private degoke/oye, main synchronized |
| M20 · GitHub CI and local checks | Complete; local and hosted typecheck/test/build passed |

## M00 record

Preserved the product overview in `source-brief.md`. Created the product specification, build plan, architecture, design guidance, milestone checklist, and decision log. Updated `AGENTS.md` with confirmed stack preferences, generated-migration rules, sequential delivery, and document locations.

The user confirmed English, Yoruba, Hausa, and Igbo. At the planning baseline, Node.js, SQLite, the package layout, TanStack Query, anonymous-cookie persistence, and rendered video were proposed choices. Later milestone records below describe their implementation and verification.

Checks: planning file existence, relative document links, language/scope consistency, and preservation of the supplied brief. No application tests ran because application code does not exist.

## Update after each milestone

Record the completed tasks, checks performed and their result, decisions made, unmet acceptance criteria, and exact next task. Keep the latest state here and leave detailed acceptance checklists in [milestones](milestones.md).

## M01 record

Created the pnpm workspace, strict TypeScript packages, Hono API, Vite/TanStack routes, Mantine theme, and mobile navigation shell. Exact package versions are in `pnpm-lock.yaml`. The API defaults to port 3187 and the client to 5187 to avoid other local projects. Startup works with an empty OpenAI key.

Checks: `pnpm install`, `pnpm build`, and `pnpm typecheck` passed. Five Playwright checks passed for the health proxy, route refresh/navigation, and overflow/runtime-error checks at 320px, 360px, 768px, and 1280px. Desktop and mobile screenshots were inspected. The preview is running at `http://127.0.0.1:5187/`.

Resolved during checks: TanStack plugin release differs from router release; tsup requires a configuration file for workspace bundling; local IPv6 localhost pointed at another project, so tests use the explicit IPv4 address.

## M02 record

Added Drizzle schema and generator-owned migration `0000_fresh_zaladane.sql`, anonymous cookie sessions, saved preferences, origin checks, and current-learner history deletion. Settings now saves language, format, reading support, session length, and low-data preferences with rollback on failure.

Checks: `pnpm db:generate` and `pnpm db:migrate` passed; generated SQL was inspected. Seven API/persistence tests passed, including reopened-database resume, separate visitors, invalid ownership fields, token hashing, expiry/forgery, deletion cascades, and invalid inputs/origins. Six browser checks passed, including saved Yoruba and low-data choices across reload and isolation in a second browser context. Current type checks and build passed. The compiled Node API also served health and session requests on a temporary port and was then stopped.

## M03 record

Added owner-scoped journey/concept/assessment contracts, generated migration `0001_secret_morlun.sql`, saved journeys, a one-question assessment, unknown answers, skip, and resume. Development fixtures are visibly labeled and remain English until multilingual content arrives. Concept requests open a concept destination; broad requests open a pathway.

Checks: generated SQL reviewed and `pnpm db:migrate` passed. Type checks and build passed. Manual browser walkthrough saved an unknown answer, resumed question two after reload, and skipped to the concept destination. HTTP checks confirmed another visitor receives 404, public assessments omit answer keys, a broad request contains two concepts, and skipped understanding stays unknown. This milestone does not claim live model output or completed lessons.

## M04 work so far

OpenRouter text is connected through the Agents SDK, with OpenAI as the configurable alternate. Live concept and broader-topic requests produced valid assessments and first lessons. NASA and CFPB source notes support the sample lessons. A fresh HTML request retrieved and stored MDN excerpts through OpenRouter Exa search. A running HTML generation was interrupted by an API reload and resumed successfully on attempt two. Duplicate request IDs returned the same journey. Generator-owned migration `0002_friendly_reavers.sql` stores durable jobs and unique lesson versions. Type checks and build pass. Baseline adaptation comparison and the remaining recovery checks are still being recorded.

## M04 completion record

Live checks covered a compound-interest concept, a broader photosynthesis topic with two concepts, and fresh HTML source discovery. Baseline variants reached saved sourced lessons. The incorrect/unknown baseline started with a detailed introductory numerical explanation; the all-correct variant had a shorter introduction and a separate comparison section. Both retained the same CFPB source ID. This records observed adaptation and does not certify teaching quality.

A running HTML job resumed successfully after server reload with attempts incremented to two. Duplicate objective request IDs reused one journey. A queued plan was cancelled and retried through the same job ID. Lessons use unique concept/language/reading-support versions, publish transactionally, and pass schema/reference validation and a separate automated source-support review. Errors expose a recoverable message without provider credentials. Type checks and build passed. Direct OpenAI remains implemented but unverified because no direct key is configured.

## M05 record

Rendered structured sections, examples, glossary, readable template visuals, source links, and confirmed practice. Generator-owned migration `0003_glamorous_tag.sql` adds practice attempts and the last visited concept. The server grades practice and saves each confirmed attempt; unknown is distinct from incorrect. Opening a lesson only updates the resume location.

Checks: type checks and build passed. A live lesson walkthrough confirmed a correct answer and an uncertain answer, then reloaded and found both saved results. Another visitor received 404 for practice. A further concept prepared on demand and duplicate preparation reused one job. The lesson fit a 360px viewport without horizontal overflow and its introduction screenshot was inspected. Viewing an unpracticed lesson left understanding unknown. Independent Explain Back evidence and full progress remain M07 work.

## M06 record

Added standalone and contextual Agents SDK tutor conversations, typed SSE streams, saved completed/partial turns, stop/retry, source retrieval, three quick-help actions, and learner-selected conversion from a standalone question to a journey. Generator-owned migration `0004_omniscient_morph.sql` stores conversations and turns.

Checks: type checks and build passed. A contextual question about second-year interest used the saved lesson's numerical example and CFPB source. Refresh preserved the completed reply. Standalone photosynthesis completed with a stored NASA source. Duplicate turn IDs replayed one saved turn. Stopping a reply marked it interrupted; retry reused the same row with attempts incremented to two and completed. Another visitor received 404. The browser created a journey only after selecting the conversion button. A 360×500px viewport showed no horizontal overflow and a 320px-wide accessible composer; this is a reduced-viewport check, not a physical-phone keyboard certification. M12 retains native-device review.

An early standalone run had no source because the model skipped a suggested tool. Source retrieval now runs in application code before the first factual standalone reply, and the new live check confirmed the stored source. Markdown disables raw HTML/images and only links stored source URLs. A further photosynthesis concept also completed its on-demand lesson generation.

## M07 record

Added independent Explain Back, one or two neutral follow-ups before correction, exact learner quotes, a separate evidence reviewer, targeted repair, fresh application, and inspectable progress. Generated migration `0005_nice_nebula.sql` preserves every attempt with its lesson, rubric hash, language, sources, answers, findings, and job. The server requires all essential ideas plus a correct fresh application for demonstrated understanding. Application review distinguishes an explicit wrong claim from insufficient evidence. Unknown attempts preserve earlier usable evidence, and late results from older attempts cannot supersede newer usable attempts.

Checks: generator output reviewed and migration applied. Type checks and production build passed. Live OpenRouter cases covered a correct photosynthesis explanation, reversed inputs/outputs, uncertainty, a partial application, and a corrected explanation followed by a correct fresh aquarium application. The corrected attempt reached demonstrated and the original misconception remained inspectable as needs-practice. A separate native browser compound-interest flow reached demonstrated after a fresh calculation; progress and evidence survived reload. Duplicate request IDs reused attempts/responses, stale revisions returned 409, another visitor received 404, and public progress omitted private expected answers. Collapsed and expanded progress fit 360px without horizontal overflow, and native keyboard Enter expanded the history panel. [Detailed evidence](evidence/m07.md) records the cases and issues found.

Resolved during live checks: Flash Lite repeatedly rejected supported grading evidence, so grading/review now use explicitly configurable inexpensive Luna while lesson/tutor text retains Flash Lite. An early uncertain application was marked incorrect for missing reasoning. The reviewer now independently classifies correct reasoning, explicit contradiction, or insufficient evidence; the repeated uncertainty case returned null/limited and remained unknown. Earlier development attempts remain saved rather than rewritten. Automated review does not certify teaching quality; broader audits remain M12.

## M08 work so far

Published 241 static interface messages in Yoruba, Hausa, and Igbo, with 27 accepted automated batch reviews and exact placeholder checks. All four language choices are saved server-side. Journey/assessment language versions preserve IDs, answer keys, rubric intent, and saved answers. Generated migration `0006_chubby_professor_monster.sql` stores translation versions. The client gates content during preparation and selects language-specific cache keys. Earlier learner words keep their original language.

Stricter source review rejected Flash Lite lesson attempts for unsupported biology details. Lesson authoring now explicitly uses configurable inexpensive Luna; initial plans and streamed tutoring retain Flash Lite. A new English sourced lesson passed review. A bilingual instruction initially introduced Spanish glossary terms into English; generation revision 2 corrects that instruction and produces a new immutable lesson. Generated migration `0007_volatile_vermin.sql` adds the revision to lesson uniqueness. Existing evidence retains its original lesson IDs.

Checks so far: both generated migrations were reviewed and applied; type checks and production build passed, and the final build after the revision changes passed. Yoruba live metadata, lesson, confirmed correct practice, tutor stream, neutral follow-ups, and targeted repair succeeded. Representative automated review flagged an ambiguous Yoruba plant-mass term. A new translated contract and Yoruba lesson revision 3 clarify plant body material and passed the repeated representative review. The earlier attempt remains unchanged. Yoruba fresh application reached demonstrated with the canonical rubric hash retained. Switching to English, Hausa, and Igbo preserved progress, baseline answers, and saved learner words. A fresh Yoruba source objective resolved to the NASA source bundle. Settings fit 360px in Yoruba, Hausa, and Igbo and use the matching document language; Igbo home also fit 360px. Browser review caught and corrected a Hausa brand spelling in the home accessibility label. A translated recovery message appeared during API reload and the retry restored preferences. Full Hausa/Igbo learning loops, complete language-switch evidence, and speech checks remain unfinished. See [language capabilities](languages.md) and [interface review evidence](evidence/m08-ui-review.json).


## M08 completion record

All four languages completed sourced lessons, confirmed practice, source-reviewed tutor replies, independent Explain Back, neutral follow-ups, and correct fresh applications. Each retained source s1 and the same canonical rubric hash. The newest Igbo application clarified that photosynthesis needs light and reached demonstrated. The earlier partial Igbo attempt remains inspectable. English and Hausa also completed targeted repair; Yoruba completed repair before the terminology clarification, with the original evidence preserved. Current Yoruba revision 3 passed the repeated representative review.

Switching among all four languages loaded the current lesson and preserved demonstrated progress, assessment question/option IDs, baseline answers, and saved words. Duplicate language preparations reused one job, and another anonymous owner received 404. All 241 interface keys have translations, exact placeholders, and 27 accepted automated batch reviews. Mobile settings in all three Nigerian languages, Igbo home, and saved Yoruba assessment were inspected at 360px without horizontal overflow.

Luna now authors tutor replies as well as lessons and grading. A final source/language review guards completed tutor turns. Fresh application prompts explicitly ask the reasoning needed for grading; private expected answers cannot add unasked requirements. Representative automated reviews accepted English, Yoruba, Hausa, and Igbo samples. No native-speaker review is claimed. Detailed evidence is in [M08 evidence](evidence/m08.md). Speech remains M09/M10 work.

M08 final check: `pnpm typecheck` and `pnpm build` passed after the application grading contract change.

## M09 work so far

Added generator-owned migration `0008_flashy_bushwacker.sql`, cached narration jobs, owner-only ranged audio, bounded recording/transcription, editable confirmation, and speech receipts bound to assessment/Explain Back context. The browser has on-demand audio playback/transcript/download and 90-second recording with text fallback. Type checks passed. Four short narration probes produced decodable audio through OpenRouter. Synthetic TTS-to-STT probes passed English/Hausa meaning, found an Igbo diacritic loss, and found Yoruba word errors. Quality, full endpoint walkthroughs, mobile controls, low-data behavior, denied microphone, and negative upload checks are still in progress.

## M09 completion record

Added cached narration, owner-only ranged media, microphone capture, 90-second/8-MB transcription bounds, editable confirmation and context-bound receipts. Confirmed spoken assessment words and original recognition remain inspectable after reload. Identical saved selection retries are idempotent. Spoken Explain Back reaches the same server evaluator in all four languages. Generated migrations 0008 and 0009 were reviewed and applied.

Full English, Yoruba and Hausa narration passed independent recognition/fidelity review. Full Igbo narration failed two delivery versions, six bounded attempts, and was withheld; changing recognizer alone did not establish fidelity. M09 explicitly permits a recorded language failure and proposed remedy. [M09 evidence](evidence/m09.md) records that gap. M10/M12 must resolve the required voice scope or obtain an explicit user-approved change. Yoruba narration remains experimental and lacks native-speaker certification.

Native 360px checks covered playback, pause, speed, visible transcript, saved Yoruba spoken selection, original/confirmed words, low-data mode and idle media after reload. A timed-out microphone request recovered with enabled text/upload controls. At the user's request to retry, real capture started, Stop created a local preview, and Discard removed it without upload. Four requested focused microphone checks passed, including mocked NotAllowedError denial and late-grant cleanup. No real browser Deny-button click or physical-phone certification is claimed. Upload/origin/ownership/confirmation/deduplication/deletion checks passed. Type checks and production build passed.

## M10 work so far

Generated, reviewed and applied `0010_powerful_the_hunter.sql` for owned voice sessions and turns. Added the server WebSocket gateway, one-use 60-second credentials, absolute deadlines, per-owner/global session bounds, PCM capture, an Agents SDK custom transport, saved transcripts, mute/stop/interrupt/reconnect, and independent spoken Explain Back confirmation. Voice controls are integrated into tutor, explanation and follow-up/application screens. The SDK loads on Start voice. Raw capture is transient and owner audio URLs support bounded range reads.

A server-only direct OpenAI native reply adapter is implemented with authorized sources/history and buffered source/fidelity checks, but remains unverified because no direct key is configured. OpenRouter uses the existing recognizer, source-reviewed tutor and reviewed synthesis. Initial live evidence: English completed with roughly 24 seconds after capture; Yoruba withheld audio after a fidelity failure; a longer Hausa sample split at a pause and reached the earlier owner's transcription cap. Turn onset/pause handling has been adjusted and fresh, explicitly seeded owned lesson copies are used for subsequent checks. Type checks and the initial production build passed. Four-language voice acceptance, recovery/security checks and interface review are ongoing; M10 remains open.

M10 update: 45 new interface messages have separate automated Yoruba/Hausa/Igbo reviews. The direct native adapter, updated pause detection and lazy SDK loading pass type checks and production build. A credential/ownership walkthrough without provider calls verified HTTP 404 for foreign sessions/context, HTTP 403 for wrong origin, rejected superseded/replayed tokens, accepted mute/interruption/heartbeat, retained reconnect deadline/counters and HTTP 410 after Stop. A later short English capture and a direct recognition probe returned HTTP 402 before recognition; key allowance is below the speech preauthorization requirement. Live voice checks are waiting for the user's key budget update. That provider limit is distinct from the earlier Hausa turn/owner-cap issue. M10 is not complete, and M11/M12 remain pending.

Additional M10 checks: an actually expired 60-second credential was rejected; two owners connected and a third was rejected; active owner duplicate creation/credential rotation returned 409; clearing a disposable owner closed its connection and removed its session. Evidence is in `docs/evidence/m10-controls.json`, `m10-expiry.json` and `m10-concurrency.json`. The mobile idle dialog has no horizontal overflow at 360px, and Escape returns focus to its launcher. Capturing was not started during that dialog check.

## M10 resumed checks

The user increased the key limit to $1.50; a read-only check showed about $0.76 remaining before resuming and about $0.70 after these checks. The earlier funding block is resolved. Repeated English and Hausa contextual voice checks saved transcripts and reviewed audio, with about 20 and 23 seconds respectively after capture. Yoruba and Igbo reply audio failed fidelity review and remained unpublished. Slower Puck delivery passed bounded short probes but failed repeated contextual checks; an additional recognizer disagreed with the short probes. One Fish S2.1 Pro Yoruba comparison passed, but that model is not selected automatically and has not established full reliability.

Independent synthetic voice Explain Back → correction/confirmation → explicit Save reached the existing evaluator in all four languages. Each kept source s1, its lesson snapshot and the canonical rubric hash. Each awaited a neutral follow-up and retained unknown understanding. The real Agents SDK plus app transport interrupted an actual reply delta, retained interrupted history, reconnected with rotated credentials and kept the deadline. This SDK check used Node with a browser socket shim; it is distinct from the browser check.

After the user reported a nonworking microphone, added an explicit recorded-audio option and a local microphone signal meter with a no-signal hint. Files are decoded locally, bounded to 30 seconds/8 MB, resampled to PCM and sent through the same owned gateway only after Send recording. Native in-app browser selection of a known synthetic recording produced the saved question, a source-approved reply and an 11.24-second playable audio response (readyState 4, paused false, no media error). Stop and reload preserved the text. A 30.5-second file was rejected before connecting. The fallback fits 360px; Escape returns focus. No ambient recording or microphone capture was used for this check.

Isolated boundary fixtures applied the generated migrations and exercised the production gateway's twelve-turn cap, three-minute input cap, absolute deadline, eight-owner/day and twenty-global/day caps without provider calls. The deadline fixture was shortened to 600 ms; this does not claim a ten-minute wall-clock wait. The local demo has now reached twenty persisted voice sessions for the day, so new live voice sessions are blocked by its app quota. History deletion can still reset counts because the current daily counter uses session rows; a separate retained usage ledger remains required before handoff. See [M10 evidence](evidence/m10.md). M10 acceptance remains open; no four-language reliable audio or human pronunciation certification is claimed.

Final checks after recording input, signal display and the experimental language notice: `pnpm typecheck` and `pnpm build` passed. Vite still reports the lazy realtime SDK chunk over 500 kB; it loads only when voice is started or a recording is sent. D032 documents the recording choice. A demo scope question is pending before advancing under the sequential milestone rule.


## M10 scope acceptance and M11 implementation

The user accepted experimental Yoruba/Igbo voice with text fallback, allowing advancement to video. D033 records the scope decision without rewriting failed audio evidence or claiming a working human microphone. M10 implementation checks are complete for this demo scope; natural microphone/device acceptance remains in M12.

Generated migration `0011_burly_master_chief.sql` was reviewed and applied. It adds owned video outputs and optional narration chunk timings. The FFmpeg/resvg renderer, durable narration dependency, owner-only MP4/VTT routes, explicit player/download/transcript, local saved-text page and production service worker are implemented. M11 checks are in progress.


## M11 completion

English/Hausa videos rendered from approved narration. A fresh browser compound-interest lesson/narration/video completed and played to its full 146.6-second duration with visible captions and no media error. Full transcripts and source IDs remain available. Recorded queue checks cover waiting without spent attempts, cancellation, failed narration and explicit retry. Production saved text opened after a full reload while the web server was stopped. The initial static-cache failure was fixed and rechecked. Thirty-six interface messages have separate accepted automated language reviews. Type checks/build pass. See [M11 evidence](evidence/m11.md). M12 is now in progress.

## M12 local audit

Generated migration 0012 stores retained usage reservations. Expiry cleanup, deletion-resistant global limits, provider request bounds and missing-file reconciliation are implemented and checked against isolated databases/directories. Fresh live concept and broad-goal workflows produced new sourced lessons. A wrong independent explanation, quoted findings, focused repair and later correct fresh application reached demonstrated while preserving the earlier attempt. The disposable owner was cleared afterward. Existing four-language demonstrated evidence and source links remain in the database.

The final production build passed saved-text reload with the web server stopped, UTF-8 text download, 360px layout, resumed progress, keyboard disclosures, modal focus trapping/Escape and skip-to-main focus. Corrected the unlabeled history-dialog close control and disclosed the 31-day usage retention policy without promising deletion of external downloaded files. Final type checks/build and repeated generated migrations passed.

The retention check initially deleted local cached media by pairing its isolated DB with the production directory. The check now requires an explicit isolated directory. Exact English/Hausa video/caption copies were restored; narration was extracted from those approved tracks with a recorded codec change. Missing other cached audio/video was invalidated without deleting lessons or learning evidence. The full incident and recovery are preserved in [M12 evidence](evidence/m12.md), with [handoff](handoff.md) and [demo script](demo-script.md). Human microphone conversation, a physical phone keyboard and a real screen-reader walkthrough remain unverified. M12 remains open under the sequential acceptance rule.

The compound-interest narration and video subsequently passed explicit browser retries. New media IDs and fidelity/equivalence checks are in [native recovery](evidence/m12-native-recovery.json). The lost originals remain identified as lost; these are newly generated reviewed outputs.

The replacement compound-interest video completed native playback at 107.4 seconds with readyState 4 and no media error. A final explicit scope question is pending for the unverified human microphone, physical phone keyboard and real screen-reader checks. All other implementation and local audit work is complete.

## M12 completion

The user explicitly accepted the unverified human microphone, physical-phone keyboard and real screen-reader checks as documented demo limitations. D037 and the product specification record this scope decision. Local verification flags remain unchanged. The final audit, all milestone checklists, setup instructions and demo script are complete for the accepted scope. No implementation work remains in the documented demo; publishing is separate.

## Presentation preparation, 14 October 2026

Prepared [a 4:30 panel pitch](pitch.md) using Roliat as an illustrative Yoruba-speaking learner returning to school after interrupted education. The presentation shows photosynthesis first in English, then Yoruba, followed by Codex's development workflow and the next-month pilot. The script contains about 475 spoken words plus playback and click time; timing is planned and has not been rehearsed aloud.

Generated a revised Yoruba narration/video through the existing queue, then selected a fifteen-second introduction with a separate accepted semantic fidelity review and an experimental-voice label. Preserved a rejected energy/material excerpt rather than presenting it. The media uses the saved sourced lesson; no learner success story is claimed. D038/D039 record these presentation choices. The implementation milestones remain complete for the accepted demo scope.

## M13 in progress

The user requested the visible app flow from a spoken photosynthesis objective to the lesson/video, with a twenty-second pitch extension. Added the previously missing home-page spoken-request entry point, explicit confirmation/start and owned single-use receipt attachment. Request capture is limited to thirty seconds and six hundred characters. Reviewed interface translations, type checks and build passed. Drizzle generation reported no schema changes.

A synthetic recorded Yoruba request reached confirmed words, a live plan with four questions, and a sourced Yoruba lesson. Media preparation for that exact lesson is being checked. An initial recognition request returned 422; the same input subsequently succeeded. Isolated boundary checks cover ownership, context, confirmation, text changes, reuse, stale payloads and limits. Browser automation was rejected by its URL security policy, so the new browser capture remains unverified and must not be claimed as recorded.

M13 update: request-to-lesson and isolated receipt-boundary checks passed. Matching Yoruba narration failed three fidelity checks and video remained withheld, with text usable. The 4:50 script now shows the complete intended app flow and records this failed media result rather than substituting an older clip. New browser recording is blocked by the browser tool's URL security policy. Paid speech work awaits additional allowance because approximately $0.55 remains and speech needs $0.50 available. M13 remains in progress; the previously accepted M00–M12 scope is unchanged.

M13 funding update: read-only key metadata now shows a $2 allowance, with about $0.73 available before resuming. One unpublished diagnostic using the production fidelity instructions rejected the sunlight lesson's first chunk because recognition repeatedly changed sunlight to heat. Fish S2.1 Pro comparisons at 700 and 200 characters also failed on the plant-material claim/negation. [Comparison evidence](evidence/spoken-objective-narration-comparison.json) preserves all three. The app's provider configuration and review gate have not changed. The next media candidate is the Carbon Dioxide and Water concept in this same spoken-request pathway, now preparing through the normal lesson queue. No new browser capture or successful request-to-video result is claimed.

M13 media result: the same confirmed spoken request's Carbon Dioxide and Water lesson passed source review on attempt two. Narration passed both chunks on its first normal attempt, and its matching captioned video rendered on attempt one. Receipt → journey → selected concept → immutable lesson → approved narration → video linkage was verified against saved records. The owned MP4 returned HTTP 200, foreign receipt returned 404, and the full 116.4-second H.264/AAC file decoded locally. An extracted frame was inspected. [API flow](evidence/spoken-objective-flow.json) and [media review](evidence/spoken-objective-media-review.json) retain the earlier failed sunlight lesson and jobs. The final read-only key snapshot showed about $0.65 available. No provider/model configuration or review rule changed.

Next task after the API check was browser capture and timed rehearsal. The subsequent browser retry below supersedes the general access blocker. M13 stays in progress.

## M13 browser retry

At the user's request, retried the existing in-app browser. The old tutor URL no longer matched a live HTTP tab: that tab had become a connection-error `data:` page. Selecting the existing HTTP home tab succeeded, and reloading loaded the spoken-objective build. Browser automation is usable again.

The actual browser uploaded the synthetic Yoruba recording, recognized and confirmed its words, selected Start learning, waited for a new live plan, showed three starting questions, explicitly skipped and opened its new sourced Photosynthesis lesson. Saved-record inspection verified receipt attachment to that same browser journey. This is a fresh browser-owned journey, separate from the earlier API-owner media.

The browser lesson's narration failed its three bounded attempts and its video remained withheld. The local text-saving control showed its successful save confirmation. [Browser evidence](evidence/spoken-objective-browser.json) and [real screenshots](evidence/m13-browser/README.md) preserve the result. The final read-only key snapshot showed approximately $0.22 available, below the $0.50 speech requirement; no further paid retry was triggered. Native review of generated objective wording remains outstanding.

Next task: resolve/review narration for the browser's own lesson when funding permits, capture the continuous English/Yoruba walkthrough and rehearse the 4:50 timing. Current browser capabilities expose screenshots but no video-recording tool. Human microphone checks remain unverified under D037. M13 remains in progress.

## M13 funded recovery and audible demo preparation

The user raised the key allowance to $5 and requested working video plus audible Yoruba requests/questions/explanation in the final demo. Funded checks identified narration fidelity failures rather than treating every failure as a budget issue. Added safe stage diagnostics, private approved-chunk recovery and a 300-character Yoruba delivery profile with doubled-vowel guidance. Isolated cache integrity/ownership checks, script-concatenation checks, type checks and builds passed. Old failed jobs/counters remain intact.

Revision 4 accumulated six approved groups but exhausted its six attempts on the final glossary phrase. A same-audio Scribe comparison passed the unchanged semantic review while Gemini's word form failed. Explicitly configured Scribe V2 for Yoruba narration review only, with its model in each job snapshot/cache identity; learner recording recognition stays unchanged. Drizzle generation reported no SQL schema changes. Full narration/video verification under this separate recognizer is in progress. D043–D046 preserve the choices and evidence.

Completed starting assessments now expose read-only question/audio replay, so the original Yoruba question can be heard without resetting learning evidence. The browser is preparing the first question's narration alongside the same lesson's video. The pitch now requires system/browser sound, presenter pauses during Yoruba playback and an audio-track/listening check of the final recording. Continuous recording and final-file audio capture are still unverified.

## M13 demo assets ready

The user explicitly narrowed the remaining work to usable separate clips, prioritizing recording readiness over a continuous fresh journey. D047 records this decision. Exported synthetic Yoruba request audio, the actual reviewed 35-second starting-question narration, generated course screens, the reviewed 116.4-second captioned Yoruba explainer and an English explainer. Created four numbered short MP4s and a joined approximately 55-second Yoruba segment. The course section is silent; request, question and explainer contain speech.

The quiz player was observed unmuted and playing without a media error; 149 timestamped real browser frames were captured over fourteen seconds. Its exact downloaded app audio is added in the edit. Course/request segments use actual saved browser stills. The explainer comes from the separately reviewed API-owner lesson and carries a prepared-media label. Failed media in the newer browser lesson remains withheld. No ownership bypass or new paid generation was needed.

All exported short clips and the joined file decoded successfully; the joined output has H.264 video and a non-silent AAC track. A local preview page at http://127.0.0.1:5190 provides players and downloads. [Asset evidence](evidence/demo-assets.json) records the method. Assets are in `.data/demo-assets/`. M13 is complete for this accepted preparation scope. Final presenter recording, human listening review and 4:50 rehearsal are still outstanding presentation tasks, with existing device/native-language limitations unchanged.

Preview check: the prepared full Yoruba explainer played to 19.6 seconds in the browser, unmuted, readyState 4, with no media error. The corrected joined export is 55.12 seconds with aligned video/audio durations and 48 kHz stereo AAC. An exported captioned frame was visually inspected.

## M14 in progress

Prepared the 4:50 production timeline, original educational visual direction and nine cached English AI-presenter voice blocks. The actual browser resumed the saved English photosynthesis journey, explicitly skipped its remaining starting questions and generated a new sourced lesson. A synthetic misconception received a neutral follow-up and targeted materials/energy repair. A later correct independent explanation and fresh light/dark application are being checked before inclusion. Original Yoruba request/question/explainer audio remains prepared under D047.

## M14 completed

Produced `deliverables/oye-demo.mp4`, exactly 290 seconds, 1280 × 720 at 30 fps, H.264 with stereo AAC, approximately 12 MB. The finished cut includes a stylized illustrative Roliat, original seedling/materials/energy motion, real English app captures and saved demonstrated result, audible Yoruba input/question/video, actual Codex document excerpts, a recorded review fix and the next-month pilot plan. AI presenter and prepared/synthetic media remain disclosed.

Full decoding passed. All five main presenter sections contain speech. Each of the three Yoruba intervals correlates above 0.9997 with its exact fitted prepared track after final encoding, with no presenter or music overlap. Representative frames were inspected and adjusted to keep app detail crops readable and titles/doc excerpts within their areas. The browser opened the finished video with duration 290 seconds, unmuted playback and no media error. [Export evidence](evidence/demo-video.json), [voice blocks](evidence/demo-voiceover.json) and [new English evidence](evidence/demo-english-learning.json) preserve the checks.

The original incorrect explanation and the later demonstrated explanation remain stored as separate attempts in the actual browser-owned English journey. The fresh application required reasoning about sunlight versus a dark cabinet. No fake grade, progress reset, ownership bypass or weakened narration review was used.

Also delivered a caption file, final presenter script, timing/source manifest and editable renderer. The preview at http://127.0.0.1:5190 now includes the finished 4:50 video. M14 is complete. Human listening/native-language certification and accepted device limitations remain unverified; the video does not claim real learner impact.

## M15 in progress

The user approved the video’s design and asked to remove production terminology, the separate-video phrase and closing verification checklist, with a shorter cut. Revised the script and visuals to 4:10, preserving the complete learning-change section and original audible Yoruba clips. Archived the original video. Generated three same-script narrator samples, Sulafat/Aoede/Puck, and requested the user’s preference while continuing the edit. Sulafat is the stated working recommendation. D049 records the presentation change without changing app behavior or internal evidence.

M15 voice selection: the user explicitly selected Sulafat. The revised 4:10 render uses that voice with expressive, conversational delivery. Narration and motion are being checked before delivery.

## M15 completed

The user selected Sulafat. Delivered `deliverables/oye-demo-v2.mp4`, exactly 250 seconds, approximately 10.44 MB, with warm expressive narration. Removed the editorial capture-method footers, separate-lesson line and ending’s verification checklist. The story flows through product actions, and the ending now focuses on the pilot and brand promise. The full 55-second learning-change section and audible Yoruba request/question/video durations remain.

Full decoding passed. The browser played the revised file unmuted, duration 250, readyState 4, without a media error. The three Yoruba audio intervals correlate above 0.9998 with their exact prepared tracks after encoding, with no presenter/music overlap. [Revision evidence](evidence/demo-video-v2.json) and [presenter metadata](evidence/demo-voiceover-v2.json) record the results. The original 4:50 export is preserved in `deliverables/archive/`, and source/provenance/device/language records remain unchanged. No uninterrupted live session or real learner outcome is claimed.

Updated the public script, captions, local preview and editable source. The sample voices remain available for comparison; Sulafat is the confirmed choice. M15 is complete.

## M16 in progress

Added the README-first screenshot tour with thirteen actual app images, new setup/developer/deployment/contributor docs, and source packaging. Repository defaults now select OpenAI through the existing Agents SDK path and disable fixed fixtures unless selected. The existing local `.env` explicitly uses funded OpenRouter, with no direct OpenAI key, and stays unchanged. Source discovery now follows the chosen provider instead of requiring an OpenRouter key under OpenAI. Type checks passed after accommodating the documented tool-call bound in the pinned SDK type. Isolated startup/package/documentation checks are in progress.


## M16 completed

Delivered thirteen actual app screenshots in a static walkthrough linked prominently at the top of README. Added current setup, developer, contributor, architecture and deployment docs; repaired archived/exported document links. The source packager includes sources, generated migrations, one lockfile, docs, screenshots and the current pitch, with file hashes and an external checksum. Credentials, runtime data and dependencies are excluded. OpenAI through the Agents SDK is the default; source search follows the selected provider. Fixed fixtures now require explicit opt-in. The existing ignored OpenRouter demo override remains unchanged.

Checks: root and extracted type checks/builds passed. A clean ZIP extraction installed 312 dependency packages with the frozen lockfile and local pnpm cache, applied thirteen generated migrations, and started the compiled API/web preview on isolated ports. Health, OpenAI/default capability reporting, anonymous session, empty history, preference persistence, origin/fixture guards, keyless-generation rejection, deep-link fallback, entry assets and service-worker delivery passed. Controlled responses checked the OpenAI search request and citation boundaries with no paid calls. Source ZIP integrity, per-file hashes, exclusions and bundled document links were checked. `.nvmrc` and the setup guide address a local shell hook selecting Node 18. [M16 evidence](evidence/m16.md) records exact scope.

Direct OpenAI paid generation/search/speech, hosted deployment and real devices remain unverified. The existing realtime bundle size warning remains. No full test suite or new paid generation ran for M16. No further implementation milestone is open; a hosted learner/teacher pilot is the documented next phase when requested.


## M16 walkthrough video follow-up

The user reported that the explainer was not visible in the tour. Video now has a dedicated section near the lesson, a larger actual app screenshot showing playback/captions and a direct README link. Standard Markdown replaces the HTML image tags. A frame from the reviewed Yoruba photosynthesis video and links to its full 116.4-second MP4/caption file are included. The tour now contains fourteen images. Existing approved media was reused; no paid generation or app behavior changed. The source handoff was refreshed with the walkthrough assets.


## M17 in progress

Adding Docker Compose at the user's request. The setup builds the web client and API, runs existing generated migrations before startup, includes FFmpeg/Unicode fonts and persists SQLite/media in one named volume. OpenAI remains the default. An ignored `.env.docker` is separate from the current native demo configuration. Container acceptance checks are pending.


## M17 completed

Added the multi-stage Dockerfile, Compose services, NGINX proxy, runtime environment template, build exclusions and Docker guide. Docker is the README's recommended local handoff. Existing generated migrations run before API startup; SQLite/media share a named volume. Only the web loopback port is published. API/migration run as UID 1000. OpenAI through the Agents SDK remains the default, and `.env.docker` is separate from the current native `.env`. Container video uses installed Noto Sans through a configurable font; native bind/font defaults stay loopback/Arial.

Checks passed on Linux/amd64: container and native type/build, thirteen fresh migrations, API/web health, default-provider reporting, anonymous preferences, origin guards, SPA fallback, service-worker delivery, WebSocket upgrade/invalid-origin rejection, multilingual slide rendering, H.264/AAC/MP3 encoding, preferences/volume persistence across recreation, coherent backup and restore into an empty volume with valid SQLite integrity. No paid calls or full test suite ran. SSE settings were inspected, and ARM64/full human voice remain unverified. [Evidence](evidence/m17.md) records details. The isolated check stack was stopped; the native demo remains unchanged. Source packaging now includes the Docker setup and documentation.


## M18 in progress

The Git inventory found 37.9 MB eligible for Git, mostly duplicated/old presentation media. Moved old exports, auditions, preview collages and production copies to an ignored local archive. Kept one current pitch and linked walkthrough assets. Added a presentation allowlist and generated-cache ignores. Removed the agent-created isolated M16 source/dependency copy, removing approximately 420 MB of generated files. Public docs/package/ignore checks are pending; no staging or push has occurred.


## M18 completed

Archived duplicate/old pitch videos, audition audio, preview collages, production copies and one unreferenced intermediate screenshot locally. Git keeps one current pitch, its captions/script/poster, the walkthrough assets, source/container files, generated migrations, tests and meaningful documentation/evidence. The current demo bytes are unchanged. Removed the generated isolated source/dependency extraction, approximately 420 MB of files; its verification evidence is retained.

The presentation allowlist, cache/log/coverage ignores and source-packager exclusions passed focused checks. Documentary credential fields were scanned without printing values. Public links and refreshed ZIP contents/integrity were checked. No app behavior changed, no app tests ran, and no staging/commit/push occurred. [M18 evidence](evidence/m18.md) records the archive inventory and checks.

M18 final inventory: 255 Git candidate files, approximately 14.7 MB versus 37.9 MB before cleanup, a 61.2% reduction. All 310 bundled local links resolve. The source archive matches the Git candidate file set, with verified integrity/file hashes.


## M19 in progress

The user explicitly requested creating a repository in their GitHub account and pushing the cleaned project. The authenticated account is `degoke`, `oye` is available and the existing local branch is `main` without earlier commits. Initial visibility is private. The pre-upload inventory contains 255 cleaned files, approximately 14.7 MB, with blank environment templates, no runtime/dependency folders and no detected credential patterns. Creation/push verification is pending.


## M19 completed

Created [degoke/oye](https://github.com/degoke/oye) in the authenticated personal account with initial private visibility. Committed the cleaned project on the existing `main` branch and pushed it to `origin`. The initial remote commit and all 255 remote blob hashes match the local commit. Only blank environment templates are uploaded; credentials, databases, dependency/build/runtime folders, local archives and source ZIPs are excluded. Added the repository link and clone instructions to current documentation.

[Repository evidence](evidence/m19-github.json) records ownership, visibility, branch and initial commit/tree verification. The source repository is uploaded; no hosted application deployment or application test run was part of this task.


## M20 in progress

Added `pnpm check` to run typecheck, package tests and production build sequentially. GitHub Actions uses the same command with frozen dependency installation, Node from `.nvmrc`, pnpm from `packageManager`, cached dependencies and immutable action pins. It runs without provider secrets on main pushes, PRs and manual dispatch. Local and hosted acceptance are pending.

M20 local acceptance: `pnpm check` passed all workspace type checks, both Vitest test files with eleven passing tests, and the production build. The existing realtime chunk-size warning remains. Hosted CI verification is pending the workflow push.


## M20 completed

The root `pnpm check` runs typecheck, existing package tests and production build in order. GitHub CI runs the same command on main pushes, PRs and manual dispatch, using Node from `.nvmrc`, pnpm from the manifest, a frozen lockfile, dependency caching, immutable action pins and read-only repository permissions. The workflow is included in source packaging. README/contributor/developer guidance documents the shared gate and separate browser/provider/device checks.

Local checks passed: all workspace types, two Vitest files with eleven passing tests, and production build. [Hosted run 38615125646](https://github.com/degoke/oye/actions/runs/38615125646) also passed; its log confirms eleven passing tests. No provider keys, paid requests or live databases were required. The existing realtime chunk-size warning remains. [CI evidence](evidence/m20-ci.json) records the run and scope.
