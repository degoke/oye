# Working on òye.

òye. is an adaptive learning companion. Keep the brand spelling and diacritic.

> Learning that understands you.
>
> Learn anything. In your language. In your way.

## Read before working

Start with [docs/README.md](docs/README.md) and [docs/status.md](docs/status.md). Then read the specification and milestone that apply to the task.

| Document | Purpose |
| --- | --- |
| [Screenshot walkthrough](docs/walkthrough.md) | Static app tour with real screenshots |
| [Docker Compose](docs/docker.md) | Local container setup, storage and updates |
| [Getting started](docs/getting-started.md) | Fresh installation and OpenAI configuration |
| [Developer guide](docs/development.md) | Code locations, workflows and contribution habits |
| [Deployment](docs/deployment.md) | Single-server hosted pilot and recovery path |
| [Product specification](docs/product-spec.md) | User journeys, scope, and product acceptance criteria |
| [Build plan](docs/plan.md) | Delivery order, dependencies, and completion rules |
| [Milestones](docs/milestones.md) | Small tasks and observable completion criteria |
| [Architecture](docs/architecture.md) | Packages, data, API, AI, media, and migration workflow |
| [Design guidance](docs/design.md) | Mobile layout, Mantine theme, accessibility, and copy |
| [Decisions](docs/decisions.md) | Confirmed preferences, implementation choices, and open questions |
| [Status](docs/status.md) | Current milestone, completed work, checks, and next task |
| [Language capabilities](docs/languages.md) | Per-language text and speech evidence and review limitations |
| [Voice plan](docs/voice-plan.md) | M10 integration, limits and provider distinctions |
| [Handoff](docs/handoff.md) | Startup, deployment requirements, retention and usage limits |
| [Panel pitch](docs/pitch.md) | Current 4:10 presentation, learner story and media cues |
| [Video production](docs/demo-production.md) | Motion treatment, current export, narrator choice and checks |
| [Demo script](docs/demo-script.md) | End-to-end walkthrough and device acceptance steps |
| [Original brief](docs/source-brief.md) | User-provided product vision, preserved as received |

## Project preferences

- Use TypeScript, Hono, React, Vite, and TanStack Router.
- Use pnpm for dependency management and scripts. Maintain one workspace lockfile.
- Use Mantine UI components, its theme, and CSS modules. Design for mobile first. The style is simple, minimal, and classy.
- Use OpenAI through the OpenAI Agents SDK by default. Support OpenRouter as an explicit alternate for inexpensive demo models. Keep provider/model configurable and credentials on the server. Read [provider notes](docs/providers.md) before changing integrations.
- The demo has no authentication or signup. Persist each visitor's learning through an anonymous session.
- Target English, Yoruba, Hausa, and Igbo. Track text, transcription, narration, and conversation quality separately for each language.
- The user accepted experimental Yoruba/Igbo voice with text fallback for the demo. Preserve failed audio checks and notices; see D033 in [decisions](docs/decisions.md).
- The user accepted unverified human microphone conversation, physical-phone keyboard behavior and real screen-reader checks as documented demo limitations. Keep verified local checks separate from these unverified capabilities; see D037. This permits demo completion without claiming device certification.
- Use Drizzle ORM. Change the TypeScript schema, run `drizzle-kit generate`, review its output, and apply it with `drizzle-kit migrate`.
- Never handwrite or hand-edit migration SQL, snapshots, or journals. Do not use `drizzle-kit push` as a shortcut. Document any migration problem before choosing a different approach.

## Delivery and documentation

- Work through one milestone at a time in the documented order. Finish its acceptance checks before advancing.
- Implementation is authorized for the full documented demo. Continue through the milestones and record unfinished requirements accurately.
- Update `docs/status.md` and the milestone checklist after each completed milestone.
- Record meaningful choices in `docs/decisions.md` when making them. Update the affected specification or architecture document in the same change.
- Mark assumptions, planned work, implemented behavior, and verified behavior accurately. A checked box requires evidence.
- Keep this file as the guide to preferences and documentation. Keep detailed plans and work history in `docs/`.

## Implementation habits

- Inspect existing files and applicable nested `AGENTS.md` instructions before editing. Preserve user changes and keep work in this project.
- Use validated contracts at API and AI boundaries. Generated content, retrieved sources, and browser input are untrusted.
- Keep learning progress tied to assessment evidence. Opening a lesson or finishing media does not establish understanding.
- Keep text available when media fails. Keep every lesson's sources visible and traceable.
- Use focused checks for changed behavior and the milestone's acceptance criteria. Report what passed and what remains unverified.
- Read current official documentation when integrating an SDK. Keep model IDs configurable and dependency versions pinned in the lockfile.
