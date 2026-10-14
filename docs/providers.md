# AI providers

Current default, confirmed 14 October 2026: **OpenAI through the OpenAI Agents SDK**. Set `OPENAI_API_KEY`; new configurations use `AI_PROVIDER=openai`. OpenAI text roles use the Responses adapter. OpenRouter is an explicit optional gateway through the SDK Chat Completions adapter. No automatic fallback changes providers.

The existing local demonstration explicitly selects OpenRouter in its ignored `.env`; its key was funded for the recorded checks. That local override does not change the repository default. A direct OpenAI key is not configured in this workspace, so historical OpenRouter checks are not presented as live OpenAI validation.

See the [official Agents SDK guide](https://developers.openai.com/api/docs/guides/agents/sdk) and [GPT-6 Luna model page](https://developers.openai.com/api/docs/models/gpt-6-luna). The default model IDs remain configurable; SDK dependencies stay pinned in the lockfile.

`OPENROUTER_API_KEY` was configured from the locally authorized parent project. The value is only in the ignored root `.env`, with file permissions 0600. Never copy it into documentation, browser code, command arguments, logs, or commits.

## Optional OpenRouter model choices

Verified against [OpenRouter's model registry](https://openrouter.ai/api/v1/models) on 13 October 2026. USD per million tokens, excluding other provider charges. Prices can change.

| Model ID | Input | Output | Use |
| --- | ---: | ---: | --- |
| `google/gemini-2.5-flash-lite` | 0.10 | 0.40 | OpenRouter planning role |
| `openai/gpt-6-luna` | 0.10 | 0.50 | Configurable alternative |
| `deepseek/deepseek-v4-flash-0731` | 0.016 | 0.64 | Configurable alternative |
| `deepseek/deepseek-v4-flash` | 0.05 | 1.28 | Configurable alternative |

No automatic fallback to a more expensive model. A provider error remains visible and retryable. Catalogue presence does not prove the key has access; record live checks separately.

## Configuration

- `AI_PROVIDER`: `openai` by default, or explicit `openrouter`.
- `OPENROUTER_API_KEY`, `OPENROUTER_TEXT_MODEL`: server text credentials and model.
- `OPENROUTER_TUTOR_MODEL`: streamed tutor, defaults to `openai/gpt-6-luna`.
- `OPENROUTER_LESSON_MODEL`: sourced lesson author, defaults to `openai/gpt-6-luna`.
- `OPENROUTER_EVALUATION_MODEL`: Explain Back evaluator and independent reviewer. Defaults to `openai/gpt-6-luna`; initial plan text retains Flash Lite.
- `OPENAI_API_KEY`, `OPENAI_TEXT_MODEL`: default direct OpenAI credentials and planning role.
- `OPENAI_TUTOR_MODEL`: direct OpenAI tutor, defaults to `gpt-6-luna`.
- `OPENAI_LESSON_MODEL`: direct OpenAI lesson author, defaults to `gpt-6-luna`.
- `OPENAI_EVALUATION_MODEL`: direct OpenAI evaluation role, defaults to `gpt-6-luna`.
- `OPENAI_SEARCH_MODEL`: Responses web-search role, defaults to `gpt-6-luna`; use a model supporting the hosted web-search tool.
- `OPENAI_TTS_MODEL`, `OPENAI_TTS_VOICE`: direct narration, default `gpt-4o-mini-tts` and `coral`.
- `OPENAI_STT_MODEL`: direct recognition, default `gpt-4o-mini-transcribe`.
- `OPENAI_REALTIME_MODEL`, `OPENAI_REALTIME_VOICE`: direct voice session, default `gpt-realtime-2.1-mini` and `coral`.
- `AI_MAX_OUTPUT_TOKENS`: bounded output per run. Jobs also bound retries and concurrency.
- `ENABLE_FIXTURES`: enables the explicitly labeled development assessment route. Fixtures never stand in for live generation checks.

Speech and realtime have separate provider capabilities. The text gateway is not evidence that transcription, narration, or realtime voice work. M09/M10 evidence covers the accepted OpenRouter demo scope. Direct OpenAI paid speech/realtime remains unverified without its key. The dated sections below preserve implementation history.

References: [OpenRouter OpenAI SDK integration](https://openrouter.ai/docs/guides/community/openai-sdk), [OpenAI Agents SDK models](https://openai.github.io/openai-agents-js/guides/models/).

## Live connection evidence

Gemini 2.5 Flash Lite returned a validated structured response through `OpenAIChatCompletionsModel` and the Agents SDK on 13 October 2026. The API key is usable for this text path. Direct OpenAI and other model IDs remain unverified. Anonymous content tracing is disabled so an OpenRouter request is not also exported to OpenAI tracing.

Fresh source discovery uses the [OpenRouter web plugin](https://openrouter.ai/docs/guides/features/plugins/web-search) with the Exa engine and three results. This adds search charges to token charges. Searches returned MDN excerpts for a fresh HTML objective. Curated demo topics reuse reviewed source notes and avoid a paid search on every request.

During M07, Flash Lite repeatedly rejected valid evidence in a structured grading workflow. Progress remained unchanged on review failure. A live Luna evaluation completed the same workflow, so grading now has an explicit, configurable Luna model. This is a role selection, with no automatic fallback. The public registry still lists Luna at USD 0.10/M input and 0.50/M output on 13 October 2026. Four first-stage evaluations subsequently produced saved neutral follow-ups through the worker; the complete repair/application checks are recorded in status when finished.

During M08, the independent source review rejected Flash Lite lessons for extra biology claims absent from the supplied excerpts. Lesson authoring now has an explicit configurable Luna role. Initial plan generation retains Flash Lite. No automatic provider or model fallback is used.

M08 representative tutoring also exposed details absent from the short source bundle. Tutor authoring now uses explicit configurable Luna, with a separate source/language review before a streamed turn becomes completed. A rejected reply remains failed partial text, excluded from future conversation context; retry stays bounded. Historical development conversations retain their original words.

## Speech discovery before M09

On 13 October 2026, OpenRouter documents dedicated [speech synthesis](https://openrouter.ai/docs/guides/overview/multimodal/tts) and [transcription](https://openrouter.ai/docs/guides/overview/multimodal/stt) endpoints compatible with the OpenAI Audio APIs. These use the existing OpenRouter credential. The public registry query `output_modalities=speech,transcription` returned dedicated models, including Gemini Flash Lite TTS and Whisper variants. This is discovery evidence only. No speech adapter, live audio capability, or four-language quality is verified yet. M09 must check model-specific formats, voices, language support and pricing units before choosing a default.

## M09 speech configuration and discovery

The optional OpenRouter narration models are Gemini 3.8 Flash Lite TTS for English and Gemini 3.8 Flash TTS for Hausa/Igbo/Yoruba. English/Hausa use Kore; the later accepted demo configuration uses Puck for Yoruba/Igbo. Yoruba is experimental. Google's [published TTS language table](https://ai.google.dev/gemini-api/docs/speech-generation) lists English/Hausa in both models and Igbo in Flash only; it does not list Yoruba. A short Yoruba Google comparison preserved the intended meaning in independent recognition more clearly than Fish S2 Pro. Fish's [publisher model card](https://huggingface.co/fishaudio/s2-pro/blob/main/README.md) explicitly lists Yoruba and remains a configurable alternative. These are discovery and synthetic sample checks, not native human certification.

The [OpenRouter synthesis API](https://openrouter.ai/docs/guides/overview/multimodal/tts) sends delivery instructions separately from text. Live Google requests rejected MP3 with 400, so the adapter requests PCM and encodes 24 kHz mono signed 16-bit output locally. Fish returned MP3 successfully. The [transcription API](https://openrouter.ai/docs/guides/overview/multimodal/stt) accepts OpenAI-compatible multipart requests. Current recognition uses `google/gemini-3.5-transcribe`. Explicit model/voice environment settings are in `.env.example`. Direct OpenAI adapters use the configured TTS/transcription models and remain unverified without a direct key.

Model registry checked 13 October 2026: Gemini Flash Lite TTS reports $0.50/M input tokens and $6/M output audio tokens; Flash TTS reports $0.50/M and $9/M. Gemini 3.5 Transcribe reports $2/M input and $12/M output tokens. Fish S2 Pro reports $0.000015 per input character. These units differ, so text price comparisons cannot predict speech cost. The M10 direct adapter later selects configurable gpt-realtime-2.1-mini; its live path remains unverified without a direct key.

Every published narration chunk requires recognition plus a separate configured evaluation review. Those calls add cost and processing time. Speech requests have 24-per-owner daily caps, duration/size bounds, no provider-client automatic retries, and durable narration retry limits. No media downloads or autoplay occur automatically, including in low-data mode. API keys remain server-side and provider errors are not returned to the browser.

M09 published full English, Yoruba and Hausa narration after independent fidelity checks. Full Igbo narration failed both delivery versions and remains withheld. Synthetic recognition and confirmed Explain Back routing were checked in all four languages. See [speech evidence](evidence/m09.md). Scribe V2 comparison improved spelling in a short Igbo sample but did not establish full narration fidelity, so it did not replace the default recognizer.

## M10 voice paths and current request limit

The OpenRouter path uses server-owned Agents SDK sessions over the app WebSocket transport and the independently reviewed recognition/tutor/synthesis pipeline. The direct OpenAI path uses server-side RealtimeSession with configurable `OPENAI_REALTIME_MODEL=gpt-realtime-2.1-mini` and `OPENAI_REALTIME_VOICE=coral`. Native replies are buffered until source and fidelity reviews pass. Direct OpenAI remains unverified without a direct key. Neither path exposes permanent credentials or accepts browser tool overrides.

During M10 acceptance on 13 October, transcription began returning HTTP 402. Read-only key metadata showed remaining key allowance below the speech endpoint's $0.50 preauthorization requirement. The account still had credits; the key's spending limit was the constraint. The user was asked to raise that limit or configure another funded credential locally. Do not alter the budget or replace keys automatically. No repeated paid checks run while this condition persists. Voice control/ownership/credential checks use no provider requests. Model price and key budget are separate from the app's session/count limits.

## Accepted demo and current bounds

The user raised the key limit, resolving the earlier funding block. A read-only final-audit check on 13 October reported $0.65056 remaining before fresh M12 text checks. That snapshot is not a promise of current balance. Keep speech preauthorization requirements separate from app quotas. Yoruba and Igbo use configurable Puck voices and remain experimental under D033. English/Hausa reviewed video is implemented in M11. Direct OpenAI remains unverified without its own key.

M12 reserves provider requests before SDK text/stream requests, search, synthesis, recognition and native voice calls. Counts survive history deletion and expire after 31 days. See [handoff](handoff.md) for rolling limits. The external key limit remains the dollar cap; private development helpers must use bounded explicit calls and are not part of API-process counters. No provider or model switch occurs automatically after a failed review.

## Yoruba narration review, M13

The current local demo explicitly selects `OPENROUTER_NARRATION_STT_MODEL_YO=elevenlabs/scribe-v2` for synthesized narration checks. Learner recordings still use the separate `OPENROUTER_STT_MODEL=google/gemini-3.5-transcribe`. English/Hausa/Igbo narration recognition keeps its existing model. Direct OpenAI keeps its configured recognizer.

This follows a bounded same-audio comparison where Scribe's Yoruba transcript passed the unchanged fidelity reviewer while Gemini's word form was rejected. Both transcripts and earlier failures are retained. Scribe's publisher reports moderate Yoruba recognition accuracy; no native certification or automatic fallback is claimed. The narration job snapshots the chosen recognizer and cache identity, so changing it prepares a separate reviewed output without rewriting old attempts. See D046 and [comparison evidence](evidence/yoruba-narration-stt-comparison.json).

## Source discovery with the selected provider

Photosynthesis and compound interest retain their reviewed source bundles. Other objectives use the selected provider’s discovery path. OpenAI uses Responses `web_search` with approved educational domains, one built-in tool call, bounded output, no stored response and no SDK retries. Returned message/citation data is validated; only HTTPS URLs on approved domains with valid citation positions and usable notes are saved. OpenRouter retains the existing Exa web-plugin path.

OpenAI’s source notes are bounded cited paragraphs from the web-search answer, not verbatim article excerpts. Preserve that distinction when interpreting `Source.excerpt`. Lessons still pass the existing source-support checks and show links to the underlying sources. The adapter was checked against controlled response fixtures and a fresh keyless setup; a paid direct OpenAI search/generation has not been exercised without a key. The official [web-search guide](https://developers.openai.com/api/docs/guides/tools-web-search) describes citations and domain filters.

New configurations disable fixed development fixtures with `ENABLE_FIXTURES=false`. Set it to `true` explicitly for development aids; those results are visibly labeled and never count as live provider evidence.
