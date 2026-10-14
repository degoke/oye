# Build plan

Date: 13 October 2026. Status: M00–M12 complete for the accepted demo scope in D033 and D037. See [status](status.md) for current evidence.

## Delivery order

Build a persistent text learning loop first. Then reuse its content, rubrics, and context for localization, audio, voice, and video. This order exposes problems with teaching and adaptation before they spread into expensive media generation.

| Stage | Milestones | Outcome |
| --- | --- | --- |
| Planning | M00 | Product, architecture, design, decisions, and delivery criteria documented |
| Foundation | M01–M03 | A mobile app with saved anonymous sessions and a working objective flow |
| Text learning loop | M04–M07 | Source-grounded lessons, tutoring, Explain Back, repair, and evidence-based progress |
| Languages and media | M08–M11 | Four target languages, audio, voice conversation, and narrated visual explainers |
| Demo completion | M12 | The complete learner journeys checked and the demo documented for handoff |
| Presentation extension | M13 | Spoken home objectives and a visible 4:50 English/Yoruba app flow |

See [milestones](milestones.md) for the tasks and completion criteria. Dependencies are sequential. Do not mark a later milestone complete while an earlier required capability remains missing.

## How to work

1. Read [status](status.md), the next milestone, and the relevant specification.
2. Mark one milestone `in_progress` and break its work into the listed tasks.
3. Implement the smallest complete behavior that satisfies its acceptance criteria.
4. Perform its relevant checks. Record failures, fixes, and remaining uncertainty.
5. Update the milestone checklist, status, decisions, and any changed contracts.
6. Mark it complete only when the criteria have evidence, then move to the next milestone.

A design or architecture decision should be recorded when it is made, rather than reconstructed at the end. If an integration blocks progress, document the exact missing capability and continue independent work within the current milestone. Use an explicit scope decision before treating a required feature as optional.

## Practical scope controls

- Start with one grounded concept, then add a broad objective. Use two repeatable demo tracks to evaluate the same learning loop.
- Build the first working AI role before adding specialists. Application code chooses workflows and owns learner state.
- Generate the next needed lesson on demand. Do not generate an entire curriculum or every media format for a new objective.
- Keep external APIs behind server adapters so deterministic fixtures can exercise the UI and persistence without API spend.
- Keep fixtures visibly separate from real generated results. Fixtures are development aids, not evidence that the live integration works.
- Use one Node server, SQLite, and a small durable job queue for the demo. Record any infrastructure change before introducing another service.

## Checks and completion

Each implementation milestone includes relevant type checks, a build, and focused behavior checks. Use automated tests for contracts, persistence isolation, evaluation rules, and failure handling where they provide useful evidence. Use browser checks for mobile layout, navigation, accessibility, streaming, and media.

AI quality needs reviewed examples as well as passing schemas. Use fixed cases with expected concepts and misconceptions, compare the stored result with its sources, and record configuration and observations. A successful API call does not prove educational accuracy or language quality.

All capstone capabilities in [the product specification](product-spec.md) must be implemented or have an explicit user-approved change in scope. The final demo includes fresh generation, saved-session resume, an adaptive repair, supported language checks, and media failure recovery.

## Original first implementation task

M01 creates the pnpm workspace, strict TypeScript projects, Hono health endpoint, React/Vite entry point, TanStack Router, and Mantine mobile shell. No application code is created during the initial planning task.

This planning baseline needed no credentials. The repository defaults to server-only OpenAI credentials and the OpenAI Agents SDK. OpenRouter is an explicit alternate; earlier demo checks used that local override. Current setup and evidence are in [handoff](handoff.md) and [providers](providers.md).

## Handoff extension

M16 strengthens reuse after the completed app/presentation milestones: current setup and architecture, OpenAI defaults, a static screenshot tour, contributor/deployment notes, a source archive, and an isolated startup check. See milestones for its recorded acceptance.


## M17 handoff extension

At the user's request, add Docker Compose after M16. Package the built web/API with runtime dependencies, generated-migration startup and persistent storage. Check the local container path in isolation, document lifecycle/configuration and include it in the source handoff. This does not expand learning or paid-provider scope.

## M18 repository cleanup

Before GitHub publishing, remove redundant presentation copies from Git candidates, archive earlier media locally, tighten ignore/source-package rules and check public documentation links. Preserve the runnable workspace, generated migrations, current demo/walkthrough and verification evidence. This milestone does not publish the repository.

## M19 GitHub handoff

At the user's request, create the project's repository in the authenticated personal GitHub account and push the cleaned source. Use the brand's ASCII slug `oye`, initial private visibility and the existing `main` branch. Check staged content, remote ownership and commit synchronization. This publishes source and documentation, not the hosted app.

## M20 CI and local checks

At the user's request, add a shared `pnpm check` command for typecheck, package tests and build. GitHub Actions installs pinned dependencies and runs that same gate on main pushes and PRs. Verify the local command and a hosted workflow run before completing this milestone.
