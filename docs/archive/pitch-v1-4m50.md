# òye. capstone pitch

Date: 14 October 2026. Target length: 4 minutes 50 seconds, including spoken input, visible app navigation, a short in-app playback and presentation. Generation waits may be shortened with explicit labels. The prepared Yoruba segment takes about 55 seconds. The produced version uses a synthetic English presenter and a timed 290-second edit; a human presenter rehearsal remains optional. See [video production](../demo-production.md).

Roliat is an illustrative character, not an interviewed customer or a reported success story. Her interrupted schooling explains her reading difficulty. Coming from a village does not imply limited literacy. The first proposed pilot is with learners returning to school who understand spoken Yoruba more easily than written English, supported by teachers.

Use photosynthesis throughout. Show the learning loop in English so the panel can follow the evidence, then show the same concept in Yoruba. Avoid a second topic or a tour of every feature.

## Run of show

| Time | Screen and action | What it proves |
| --- | --- | --- |
| 0:00–0:40 | Home, Roliat's story | The learner and language/reading barrier |
| 0:40–1:15 | Enter English objective → Start learning → preparation → starting questions → lesson | A request produces a saved learning journey |
| 1:15–2:10 | Explain Back → neutral follow-up → repair → improved application | Teaching responds to evidence |
| 2:10–3:35 | Recorded Yoruba request → saved generated course → spoken question replay → prepared captioned video | Audible Yoruba input, spoken quiz and reviewed explainer |
| 3:35–4:15 | AGENTS.md, milestones and a documented fix | Codex across development and review |
| 4:15–4:50 | Pilot plan and close | Concrete next work and honest limitations |

The Yoruba section uses prepared edited clips as accepted in D047. Keep their labels and the actual app screens visible.

## Spoken script and screen cues

### 0:00–0:40 · Meet Roliat

> Imagine Roliat. Her family has moved from a village to a town, and she's returning to school after interrupted education.
>
> She speaks Yoruba confidently. She's still learning to read.
>
> She's watched vegetables grow at home. Now her teacher asks her to explain photosynthesis. The textbook is in English. Roliat looks down at the page and stays quiet.
>
> What would a lesson built around her needs look like?

**Screen:** Keep the home screen visible. Pause after "stays quiet". Roliat is illustrative; do not claim a real customer or measured outcome.

### 0:40–1:15 · Start a real English journey

> This is òye. Learning that understands you.
>
> I'll start in English so you can follow the learning loop. I enter what I want to understand and start learning. The app prepares a journey and asks about my starting point.
>
> For this demonstration, I'll skip those questions and open the sourced lesson.

**Screen:** Show the actual input "Teach me photosynthesis", Start learning, the real preparation state, starting questions, the Skip action, and the resulting lesson/source. These must belong to the same journey. An unknown or skipped answer remains unknown. Keep language choice visible.

### 1:15–2:10 · Show the change

> Here's a misconception: "Sunlight becomes the material in the plant."
>
> òye. asks a follow-up before giving corrective feedback. It shows the learner's words that support the finding, then targets that gap.
>
> The repair separates materials from energy: carbon dioxide and water supply materials; light supplies energy.
>
> A later explanation and a fresh application show whether the learner can use that distinction. Both attempts stay saved. Understanding changes when there's supporting evidence. These AI judgments still need evaluation with real learners.

**Screen:** Show actual saved independent input, a neutral follow-up, feedback/repair and the later correct application. Use footage of the real submissions and completed results. The exact application varies, so answer its actual conditions. Preparation of this demonstration can happen before recording; it must not be described as an unedited live result.

### 2:10–3:35 · Hear Roliat's language

> Now hear a learning request in Yoruba. This is a recorded demo sample.
>
> [Play the nine-second request.]
>
> The app recognized and confirmed these words and generated this saved course. Here is òye. reading one of its starting questions.
>
> [Play the fourteen-second quiz replay.]
>
> The lesson includes explanations, a diagram and sources. Here is a prepared video from another saved photosynthesis lesson, speaking Yoruba too.
>
> [Show the course screens, then play the twenty-second captioned explainer.]
>
> English, Yoruba, Hausa and Igbo text are implemented. Yoruba and Igbo audio are experimental. Saved text opens offline; voice and generation need a connection.

Use the numbered clips in `.data/demo-assets/`, or the joined `oye-yoruba-demo-segments.mp4`. The joined segment is about 55 seconds, with audible request, question and explainer. Pause presenter speech during these. The twelve-second course section is silent for commentary.

The user explicitly accepted separate clips that can be joined, prioritizing assets ready for recording. These clips show prepared results rather than one uninterrupted live generation. The request/course are actual saved app stills. Quiz footage uses timestamped real browser frames with its exact downloaded app audio. The reviewed explainer belongs to a different saved lesson and is labeled accordingly. The newer browser lesson's failed narration remains withheld. Do not claim a human microphone recording or native pronunciation certification.

Preview at `http://127.0.0.1:5190/`. The full question audio, full captioned Yoruba video and English explainer are available there too. Files decoded successfully and the exported joined video contains a non-silent AAC track. M14 produces the complete timed video with synthetic presenter narration. Human listening/native-language review remains separate.

### 3:35–4:15 · Show how Codex built it

> Codex worked through this project from the beginning.
>
> AGENTS.md records our stack and working rules. The plan divides the build into milestones. Decisions document what changed and why.
>
> A review found that clearing history could reset usage limits. Codex implemented retained counters and checked them separately. We also found and added the missing spoken-request entry point for this demonstration.
>
> Setup and deployment instructions let another developer continue the project.

**Screen:** Show actual AGENTS.md, milestones, D035/retention evidence and the new spoken-objective decision. The Agents SDK runs the app's AI; Codex powered development. Do not claim formal Plan mode, a custom skill or a named MCP unless you can show its use.

### 4:15–4:50 · Another month and the close

> With another month, we'd pilot with learners and teachers, measure whether misconceptions improve, and commission native Yoruba reviews. We'd complete device checks and deploy a hosted pilot.
>
> Human microphone, physical-phone keyboard and screen-reader checks remain unverified.
>
> For Roliat, the aim is concrete: hear an idea, make sense of it, and explain it in her own words.
>
> òye. Learn anything. In your language. In your way.

**Screen:** Return to the brand promise. The rendered target is 4:50 including narration and Yoruba playback. It is an edited prepared demonstration, not an uninterrupted live session.

## Capture checklist

- Show English first, including the misconception, targeted repair and fresh application.
- Use the prepared Yoruba clips with their labels. Keep the request, spoken question and video audible.
- Show the generated lesson, diagram and sources. Keep synthetic input and separate saved media identified.
- Preserve experimental audio notices and prior failures. Keep credentials and cookies off screen.
- Use the 4:50 produced cut or replace its synthetic presenter with a personal recording. Describe learner impact and native pronunciation quality as pilot questions.

## Backup media and review evidence

The newly checked full lesson video is `.data/pitch-media/yoruba-spoken-request-video.mp4`, with captions beside it. It matches the selected Carbon Dioxide and Water lesson in the recorded request's saved journey. It is teaching media, not a screen recording of the app flow. A new browser request creates its own owned journey and media; do not imply that opening a prepared MP4 proves those new browser steps ran.

The prior separately reviewed fifteen-second introduction is `.data/pitch-media/yoruba-pitch-excerpt.mp4`, with VTT beside it. Its [excerpt review](../evidence/pitch-clip-review.json) passed; an earlier energy/material excerpt was [withheld](../evidence/pitch-clip-review-initial.json). The prior full narration passed the app's three chunk checks after its first attempt was withheld. These results do not certify general Yoruba reliability or prove the new spoken-request flow.

The prepared English backup is `.data/pitch-media/english-photosynthesis.mp4`, copied from the verified M11 example. Label any use of these files as prepared backup media.
