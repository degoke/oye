# òye. documentation

Planning baseline: 13 October 2026. M00–M12 are complete for the accepted demo scope. See status and the final audit for verified behavior and accepted limitations.

òye. helps learners understand a subject through short lessons, contextual tutoring, Explain Back, and practice tailored to the gaps they demonstrate.

For a product tour, start with [the screenshot walkthrough](walkthrough.md). New developers should use [Getting started](getting-started.md), [the developer guide](development.md), and [deployment](deployment.md).

Start with [status](status.md) to see where work stands. Use [the build plan](plan.md) for delivery order and [milestones](milestones.md) for the next task.

| Document | What belongs here |
| --- | --- |
| [Screenshot walkthrough](walkthrough.md) | Guided product flow with actual app images |
| [Docker Compose](docker.md) | Container setup, persistent data and updates |
| [Getting started](getting-started.md) | Fresh install, OpenAI setup and troubleshooting |
| [Developer guide](development.md) | Code locations, contracts and commands |
| [Deployment](deployment.md) | Hosted pilot, storage and recovery |
| [Product specification](product-spec.md) | What learners can do and how we accept the demo |
| [Build plan](plan.md) | Scope boundaries, sequence, and delivery method |
| [Milestones](milestones.md) | Tasks, dependencies, and completion criteria |
| [Architecture](architecture.md) | Technical structure and integration contracts |
| [Design guidance](design.md) | Visual direction, screens, interaction, and accessibility |
| [Decisions](decisions.md) | Choices, reasons, consequences, and unresolved questions |
| [Status](status.md) | Current milestone and evidence of completed work |
| [Handoff](handoff.md) | Setup, production preview, migrations, retention, usage and deployment requirements |
| [Panel pitch](pitch.md) | Presentation story, narration and demo cues |
| [Video production](demo-production.md) | Motion direction, timing, assets and export checks |
| [Demo script](demo-script.md) | Fresh learning walkthrough and remaining human/device checks |
| [Language capabilities](languages.md) | Separate text, narration, recognition, and live voice evidence for each language |
| [Voice implementation plan](voice-plan.md) | M10 transport, server policy, provider distinctions and acceptance work |
| [Original brief](source-brief.md) | Unedited product overview supplied by the user |
| [Agent instructions](../AGENTS.md) | Project preferences and this documentation map |

The original brief describes the long-term vision and capstone requirements. The product specification defines how we will demonstrate them. User instructions take precedence when the documents disagree.

Update the relevant documents as work changes. Record a decision when choosing a runtime, changing a contract, narrowing scope, selecting a provider, or changing how learner understanding is measured. Include its date, reason, consequence, and status. Update status after each milestone with the actual checks performed.

The pnpm workspace and database scripts are runnable. See the root README and status for startup and completed behavior. Unchecked milestone items remain planned work.

[AI provider configuration](providers.md) records OpenRouter/OpenAI choices, prices checked at implementation time, and live capability evidence.

- [Voice evidence for the accepted demo scope](evidence/m10.md): implemented controls, funded live results, recorded-audio browser playback and unresolved language/device limits.

- [Video and offline text evidence](evidence/m11.md): reviewed narration, rendered files, captions, recovery, ownership and server-unavailable reload.

- [Final demo audit](evidence/m12.md): fresh adaptation, retention and usage bounds, media recovery, offline/keyboard checks and accepted device limitations.
