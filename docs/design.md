# Design guidance

Date: 13 October 2026. Status: implemented direction, with evidence and remaining device checks in M12.

## Visual character

Simple, minimal, and classy, as requested. Use a quiet reading environment with generous spacing, restrained color, and a clear next action. Lessons and conversation are the main content.

The name is `òye.`. Preserve the accent in the logo, page title, and copy. Confirm that the selected fonts render Yoruba and other target-language diacritics correctly.

## Implemented theme

| Token | Direction |
| --- | --- |
| Background | Warm off-white, `#F8F7F3` |
| Main text | Deep charcoal, `#202923` |
| Primary action | Dark green, `#275D4A` |
| Surfaces | White or a slightly warmer neutral |
| Borders | Subtle neutral lines; verify visibility where boundaries matter |
| Typography | A restrained serif for the wordmark and major titles; a readable system sans for interface and lessons |
| Shape | Soft corners, modest rounding on buttons and panels |
| Motion | Brief functional transitions; honor reduced-motion preferences |

Mantine owns the forest palette and control defaults in `apps/web/src/theme.ts`; layout and reading colors are in `styles.css`. M12 records measured contrast, focus and responsive checks separately from a real screen-reader walkthrough.

Use Mantine inputs, buttons, menus, tabs, overlays, and layout primitives. Compose project components such as `ObjectiveComposer`, `LessonSection`, `SourceList`, `TutorPanel`, and `UnderstandingStatus`. Use CSS modules for layouts and editorial styling.

## Screens and routes

| Route | Screen and primary action |
| --- | --- |
| `/` | My Learning. Brand promise, objective input, examples, saved journeys, and resume |
| `/learn/$journeyId/assessment` | One assessment question at a time; unknown and skip actions |
| `/learn/$journeyId` | A short pathway with the next concept and evidence of progress |
| `/learn/$journeyId/concepts/$conceptId` | Lesson, formats, practice, sources, Ask òye, and Explain Back |
| `/tutor` | Standalone/contextual tutor with clearly labeled Tutor and Explain Back modes |
| `/progress` | Understanding evidence, gaps, recent attempts, and next steps |
| `/saved` | Explicitly saved text lessons, sources and offline reading |
| `/settings` | Language, formats, reading support, session length, low-data choice, and history deletion |

Tutor conversations use `/tutor/$conversationId`; the owned conversation record retains the optional concept context across refresh. The server verifies ownership.

On phones, use a bottom navigation for Learning, Tutor, Progress and Saved. Preferences are accessible from the header. On larger screens, adapt navigation and spacing; keep lesson text to a comfortable reading width. Tutor can sit beside a lesson on desktop and open as a full-height panel on mobile.

## Interaction details

- Design at 360px width first and check at 320px, tablet, and desktop sizes. Use at least 44px touch targets.
- Start with the objective input and a short language choice. Keep detailed preferences in an optional sheet, with useful defaults.
- Make assessments encouraging. "I don't know yet" is a normal response. Show question position without a timer.
- Display stages while creating a lesson, and offer retry or cancel when applicable. Avoid fabricated countdowns.
- Keep the chat composer visible above the mobile keyboard and safe-area inset. Distinguish sending, streaming, interrupted, and failed turns.
- Keep Explain Back visually recognizable as a mode. Ask one follow-up at a time and show useful feedback without grades that imply a formal exam.
- Show reading, listening, and watching as choices when available. Keep text present during loading and media failures.
- Show microphone state, a stop control, transcript confirmation, and connection state in voice mode. Never start recording without a learner action.
- Keep unknown understanding neutral. Use text as well as color for needs-practice and demonstrated states.

## Copy and accessibility

Use short, direct prompts. The homepage uses the exact brand copy supplied by the user. Tutor responses should match the selected language, use familiar examples, and avoid patronizing praise or unexplained jargon.

Use semantic headings, labeled controls, visible focus, keyboard access, screen-reader descriptions, and a skip link. Manage focus when overlays open or close. Do not announce every streaming token; provide useful completed-turn announcements. Add transcripts, captions, and text equivalents for instructional visuals.

Low-data mode must change actual requests, not only the appearance of the settings switch. Saved offline text needs a visible freshness/version indicator; online actions should clearly indicate when a connection is required.
