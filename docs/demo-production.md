# Demo video production

Date: 14 October 2026. M14 follows the completed demo asset milestone. The user requested a finished motion video using the script and prepared assets, with a simple, minimal, classy, artistic and educational design.

## Visual direction

Keep the app's warm paper `#F8F7F3`, forest green `#275D4A` and charcoal `#202923`. Add sunflower `#EAC65A` for light energy and chalk blue `#8DBDD2` for water. Use Georgia for large titles, Avenir for explanation and captions, and Menlo for real project excerpts. These follow the established app identity.

A small drawn seedling connects the story and the photosynthesis lesson. Moving dotted paths distinguish incoming materials from light energy. The signature motion teaches the demonstrated misconception rather than adding decorative effects to every screen. Real app captures remain legible; chapter transitions and diagram motion carry the artistic treatment. Roliat is a stylized illustrative learner, not a fabricated customer photograph.

## Timeline

| Time | Sequence | Audio |
| --- | --- | --- |
| 0:00–0:40 | Brand opening and Roliat's learning barrier | Synthetic English presenter |
| 0:40–1:15 | Prepared actual English request, resumed starting questions and sourced lesson | Presenter |
| 1:15–2:10 | Actual misconception, follow-up, repair, later explanation and application | Presenter |
| 2:10–3:35 | Yoruba introduction, recorded request, question replay, generated course, reviewed video and language limits | Presenter pauses for original Yoruba audio |
| 3:35–4:15 | Actual AGENTS.md/plan and review evidence; SDK versus Codex distinction | Presenter |
| 4:15–4:50 | Pilot plan, accepted limits and brand close | Presenter |

The captured English journey is resumed rather than presented as a fresh uninterrupted session. The learning examples are synthetic submissions made through the actual browser. Preserve real outcomes, source links and previous attempts. Yoruba footage remains prepared separate media under D047. The newer browser lesson's withheld narration is not replaced or falsely described as successful.

## Production files and checks

Source, captures, voice blocks and renderer are in `.data/demo-production/`; the original output filename was `deliverables/oye-demo.mp4`; the current canonical export is `deliverables/oye-demo-v2.mp4`. Presenter voice uses the already configured inexpensive English OpenRouter TTS role, with nine bounded blocks and cached audio. This is presentation narration, separate from the app's reviewed lesson narration. The original Yoruba request/question/explainer sound is retained. Never place provider credentials in the render assets or output.

Render at 1280 × 720, 30 fps, H.264/AAC, targeting exactly 290 seconds. Use captions, visible prepared/synthetic notices, chapter labels and readable document excerpts. Preserve a captions file and an editable timing/source manifest. Check full-file decoding, audio/video duration, audio presence in each spoken segment and representative frames before delivery. Human microphone/device/native-language certification remains outside the accepted scope.

## Delivered output

M14 is complete. The final cut is exactly 290 seconds, approximately 12 MB, with readable actual app detail captures, English presenter captions and original captioned Yoruba media. Presenter/music audio pauses during the Yoruba request, quiz and explainer. Full decoding and measured track comparison passed, and the finished file played in the browser without a media error. [Checks](evidence/demo-video.json) record the evidence.

The current `deliverables/` contains one MP4, VTT captions, final spoken script and poster. Timing/source evidence stays in `docs/evidence/`; the active editable renderer stays in `.data/demo-production/`. The renderer needs the cached source media and captures in the project’s `.data/` folders. Caption timing for the synthetic presenter is estimated by sentence within fitted voice blocks; Yoruba explainer cues retain the prepared video’s captions. Human listening and native-language certification remain separate.

## Audience revision

The user approved the visual direction and requested a shorter, more confident pitch. D049 changes the promotional copy and overlays. Remove production labels and the end verification checklist. The cut stays a demonstration of real app behavior with a hypothetical learner; it does not claim uninterrupted live capture or real pilot outcomes. Internal source/provenance and capability limits remain here and in evidence files.

The revised timing is 4:10. Story 0:00–0:34, English lesson 0:34–1:00, learning change 1:00–1:55, Yoruba 1:55–3:12, Codex 3:12–3:46, pilot/close 3:46–4:10. The full learning-change section and original Yoruba playback durations remain. The user selected Sulafat. Narrator auditions and the original 4:50 export are retained locally under `.data/repo-archive/deliverables/voice-options/` and `.data/repo-archive/deliverables/archive/`. They are excluded from Git and the source handoff.

The revised cut is delivered as `deliverables/oye-demo-v2.mp4`, exactly 250 seconds. The redundant `oye-demo.mp4` copy was moved to the local archive during repository cleanup. It decoded completely and played in the local browser without a media error. [Revision checks](evidence/demo-video-v2.json) retain audio matching, timing and edit evidence. The narrator is the user-selected Sulafat. The production labels and verification checklist are absent from the promotional copy, with all original internal records retained.


## Repository cleanup

M18 keeps the current pitch, captions, script and one poster in Git, alongside the app walkthrough's fourteen images and Yoruba explainer. Duplicate exports, the old pitch, comparison voices, preview collages and production copies moved to `.data/repo-archive/`. These local archived copies preserve earlier presentation choices; their original filenames remain in dated evidence. The active renderer is `.data/demo-production/render-demo.py`. It needs the local cached inputs and is not a standalone handoff dependency.
