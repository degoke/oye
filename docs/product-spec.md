# òye. product specification

Date: 13 October 2026. Status: demo specification. Implementation evidence is tracked in [status](status.md).

## Product promise

**òye.**

**Learning that understands you.**

Learn anything. In your language. In your way.

The demo should show a learner making progress on a real concept, with teaching that changes based on their answers and preferences. The central loop is Discover → Learn → Ask → Explain → Improve.

## Who the demo serves

Learners using a phone who want help with a question, a subject, or a broader learning goal. The first walkthroughs will cover a science concept and an everyday numeracy concept. Photosynthesis and compound interest are proposed examples, subject to source selection in M04.

English, Yoruba, Hausa, and Igbo are required target languages, confirmed by the user. Learners choose their language and can change it. Text, narration, speech recognition, and voice conversation each need their own quality evidence.

The brand promise describes the product direction. The demo must be clear about its tested languages, available formats, and the limits of generated material.

Demo scope update, 13 October 2026: the user accepts experimental Yoruba/Igbo voice with text fallback. Failed or uncertain audio remains unpublished. English/Hausa have recorded reviewed speech results; synthetic checks do not certify human pronunciation. This accepted limit also applies to narration-dependent video. Natural microphone/device checks remain documented separately in the final audit. See D033.

Final demo scope update, 13 October 2026: the user accepts unverified human microphone conversation, physical-phone keyboard behavior and real screen-reader checks as documented limitations. Local recorded-voice, responsive, keyboard, caption and offline checks provide the demo acceptance evidence. These device checks remain unverified, as recorded in D037, rather than becoming certified capabilities.

## Demo scope

| Capability | Required behavior |
| --- | --- |
| Objective input | Accept a typed or spoken goal, topic, or question without requiring the learner to classify it; confirm recognized words before starting |
| Preferences | Language, reading support, text/audio/video preference, session length, and low-data mode |
| Initial assessment | Three to five short questions, an "I don't know yet" option, and a way to skip |
| Learning structure | A bounded goal/topic/concept pathway, or one focused lesson for a single concept |
| Lessons | Concise explanations, useful visuals, local examples, short practice, and traceable sources |
| Tutor | Streaming text help, standalone questions, and help that knows the current lesson |
| Explain Back | Independent explanation, follow-up questions, feedback on correct ideas and gaps |
| Adaptation | A short repair lesson and a fresh check tied to a specific misconception |
| Progress | Saved attempts, demonstrated understanding, unresolved gaps, and a next step |
| Audio | Narrated lessons, visible transcripts, spoken questions, and spoken responses |
| Voice conversation | Natural voice tutoring with the same learner and lesson context |
| Video | A short narrated visual explainer generated from the grounded lesson script |
| Continuity | Resume on the same browser without signup; clear demo history on request |

All rows belong to the completed demo. Intermediate milestones can have smaller working scope. Video and voice remain required even though they arrive after the text learning loop.

## Learner journey

1. The home screen asks "What would you like to understand?" and offers a few example requests.
2. The learner enters an objective, chooses a language, and can adjust format and session length. Defaults keep this step short.
3. òye. asks a small baseline assessment. Unknown answers and skipped questions remain unknown; they are not evidence of failure.
4. The learner sees a short pathway or goes straight to a concept lesson. A broad goal starts with a manageable first section, rather than generating a whole course.
5. A lesson explains one concept in short sections with an example, a visual when useful, and a quick check. Sources are available beside the relevant material.
6. The learner can ask the tutor for help, another example, a simpler explanation, or another supported language.
7. Explain Back asks the learner to explain the concept independently. The tutor explores uncertainty with one question at a time before providing corrective feedback.
8. Feedback identifies correct ideas, missing ideas, and misconceptions. òye. offers focused practice and a new question that checks transfer to a different example.
9. Progress shows what evidence exists, what needs practice, and where to continue. Returning to the browser restores the journey.

A standalone tutor question can become a saved learning journey only when the learner chooses to continue learning. A single question should not force a course outline.

## Learning contracts

- Each concept has a plain-language objective, prerequisites where needed, key ideas, a source bundle, and an assessment rubric.
- A lesson normally takes about five minutes. This is a content design target to check with real examples, not a measured guarantee.
- Include one concrete example and one opportunity to apply the idea. Local examples should fit the learner's context without assuming identity or ability.
- The learner can request simpler or deeper material and change format at any time. Preferences are choices, not fixed learning-style labels.
- Keep technical terms consistent across translations. Allow a short bilingual glossary when a term needs clarification.
- Ground teaching in retrieved educational material. Missing or contradictory evidence leads to a clarification or a narrower lesson, never invented references.
- Generated diagrams need a text equivalent. Audio and video need transcripts; video needs captions.

## Understanding and adaptation

Track concept understanding as `unknown`, `building`, `needs_practice`, or `demonstrated`. Keep lesson completion separate.

Baseline answers estimate a starting point. Independent practice and Explain Back provide stronger evidence. An evaluator returns rubric-based findings with the learner's supporting words or answer IDs. Application rules decide state transitions after validating those findings.

For the demo, `demonstrated` requires correct evidence for each essential rubric idea and a correct fresh application check, with no unresolved essential misconception. This is a provisional product rule, not a validated psychometric measure. Store the rubric version and evidence so the result can be inspected.

Do not promote understanding based only on viewing a lesson, playing audio, tutor praise, or a model's confidence score. Contradictory later evidence can return a concept to `needs_practice` without removing earlier attempts.

After feedback, generate a repair focused on the identified gap. Preserve the earlier attempt and compare it with a new attempt. Keep attempts tied to the lesson, language, and rubric version.

## Accessibility and bandwidth

- All core actions work through text, keyboard navigation, and screen readers. Use readable contrast, visible focus, descriptive labels, and useful error messages.
- Use large touch targets and a single column on phones. The mobile keyboard must not hide the chat composer or submit button.
- Narrate assessment prompts and choices when audio mode is enabled. Accept spoken choices and let the learner confirm the recognized answer.
- In low-data mode, load text and lightweight visuals first. Generate and download media only after an explicit action. Do not autoplay.
- Cache recently saved text lessons locally and offer a lightweight downloadable text/transcript version. Offline tutoring, generation, and voice are outside demo scope; show this clearly.
- Changing language keeps the learner's progress while creating the appropriate content version. Do not translate an answer key in the browser and assume it remains correct.

## Persistence and privacy

There is no signup, login, or account recovery in the demo. An anonymous browser session owns its preferences, journeys, conversations, and evidence. The same browser can resume while the server retains its data. Clearing the cookie or changing device starts a fresh session.

Provide "Clear my demo history" with a clear confirmation. Delete session-owned database records and generated files, and remove local saved lessons. Explain whether diagnostic records remain under the configured retention policy. Raw microphone recordings are transient by default; save confirmed transcripts and learning feedback instead.

## Demo success criteria

- A learner completes the full loop on a sourced concept and sees a targeted change after an incorrect explanation.
- A broader goal produces a bounded, navigable pathway; a narrow question produces a direct lesson.
- The same concept can be read, heard, and watched, with equivalent teaching and accessible alternatives.
- Content and text tutoring work in all four target languages with recorded language checks. Publish the actual speech capability matrix.
- A voice conversation and a spoken Explain Back attempt preserve context and evidence.
- Reloading resumes the journey. A second browser session cannot access the first session's private learning data.
- Missing API credentials, invalid AI output, slow requests, denied microphone access, and unavailable media have usable recovery states.

## Later scope

Accounts and cross-device sync, certifications, a content marketplace, partnerships, full exam curricula, production-scale media infrastructure, and broad offline interaction are later work. A WAEC goal in the demo is a starter pathway unless an official syllabus has been retrieved and its coverage checked.

## Accepted demo asset scope, 14 October 2026

D047 permits separately captured prepared clips for the presentation. Required assets are audible Yoruba objective input, the app's spoken starting question, generated course screens and an approved captioned Yoruba video, with English media available. Identify synthetic input and separate saved lesson media. No continuous fresh journey or native pronunciation certification is implied. Presenter recording and timed rehearsal are separate presentation tasks.

## Developer adoption and static walkthrough

M16 packages the application for another developer. OpenAI through the OpenAI Agents SDK is the default; OpenRouter is an explicit alternate. Credentials stay on the server. Source discovery follows the selected provider, and fixed development fixtures are opt-in.

The README links a static screenshot walkthrough before setup. The tour shows request, baseline, lesson, Explain Back, follow-up, repair, new explanation/application, language/media and offline text. Setup, developer and deployment guides accompany a credential-free source archive with generated migrations and one lockfile. Acceptance includes isolated keyless installation/build/migration/startup; live paid provider validation is tracked separately.

The static walkthrough gives the video explainer its own section near the lesson, showing playback controls and captions in the app. It also includes a Yoruba photosynthesis frame and a link to the full narrated explainer. Use standard Markdown image embeds so the screenshots appear in Markdown viewers.


## Container adoption, M17

A developer with Docker Compose can build/start the app without installing Node, pnpm, SQLite tooling, FFmpeg or fonts separately. Existing generated migrations apply before API startup. SQLite and media persist across container recreation, and runtime keys stay outside images. OpenAI/Agents SDK remains the default. Native development and the static walkthrough remain available. Acceptance includes isolated container build/start, proxy/deep-link checks, restart persistence and media/font rendering, with paid provider quality tracked separately.

## Repository scope, M18

The source repository retains runnable app/container code, generated migrations, tests, developer/product documentation, linked walkthrough assets and one current pitch. Cached runtime data, credentials, compiled/dependency output, old/duplicate presentation exports and trial media are excluded. Preserve failed-review/capability evidence and maintain working README/walkthrough links.
