# M10 voice implementation

Date: 13 October 2026. Status: implemented; acceptance remains open. See [current evidence](evidence/m10.md).

The user's preferred OpenRouter key supports the dedicated speech endpoints already checked in M09. It does not establish native OpenAI Realtime API access. The [official voice guide](https://developers.openai.com/api/docs/guides/voice-agents) distinguishes speech-to-speech sessions from a replaceable recognition, agent and synthesis pipeline. The installed Agents SDK 0.20.0 exposes `RealtimeTransportLayer`, and `RealtimeSession` accepts that custom transport.

## Delivery

1. Generate Drizzle tables for owned voice sessions and turns. Snapshot authorized context and language. Store credential hashes, expiry, counters, original/confirmed transcripts and interruption status.
2. Add server-issued, single-use credentials with a 60-second connection window. Bind them to the anonymous cookie and session. Add a same-origin WebSocket endpoint with bounded payloads, authentication timeout, one connection per owner and a global concurrency cap.
3. Implement an Agents SDK transport for that endpoint. Server-side voice activity detection commits bounded audio turns. OpenRouter uses the configured recognizer, the source-reviewed Agents SDK tutor and configured synthesis. Review synthesized teaching before playback. Show the actual processing state and measure delay.
4. Add direct OpenAI Realtime through the server when a direct key is configured. Use `RealtimeAgent`/`RealtimeSession` there. Keep the permanent provider key off the browser and retain server deadlines/tool restrictions. Check that adapter separately; a configured path is not live evidence.
5. Add continuous listening, mute, stop, interruption and reconnect. Keep text and transcripts visible. For Explain Back, collect independent words, pause for explicit editing/confirmation, then attach the receipt to the existing evaluator. Do not let the voice model award understanding.
6. Check owned context, interruption/reconnect, credential replay/expiry, limits and each language. Keep the Igbo narration gap visible under the user-accepted experimental scope in D033.

## Initial bounds

Ten-minute absolute session deadline, twelve turns, thirty seconds per captured turn, three minutes of input audio per session, one active session per owner, two active sessions globally, eight new sessions per owner per day and twenty new sessions globally per day. Reconnect rotates the credential and retains the original deadline/counters. Audio buffers are transient. Counts are server policy, not a claimed dollar budget.

The OpenRouter path will be described as a conversational speech pipeline. It must not be presented as native OpenAI Realtime, full duplex provider capability, or verified low latency. A required natural-conversation gap remains open until the actual interaction and delay are checked.

## Implementation update

The custom browser transport and cookie-owned WebSocket gateway are implemented, along with PCM capture, 200 ms onset detection, 1.4-second pause detection, and bounded turns. The SDK bundle loads only after Start voice. The gateway rejects browser-supplied tools and provider configuration. A generator-owned migration adds session/turn persistence.

The direct OpenAI adapter is implemented server-side using `RealtimeAgent`, `RealtimeSession` and `OpenAIRealtimeWebSocket`. It recognizes the original captured turn for the saved receipt, sends that turn to a bounded native session with authorized lesson/source/history context, and buffers the reply until separate source and audio fidelity reviews pass. This buffering trades latency for checked teaching. It uses configurable [`gpt-realtime-2.1-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini) and coral defaults. It is **unverified without a direct OpenAI key**; no native-provider latency or language quality is claimed. Explain Back remains independent recognition plus explicit confirmation in both provider configurations.

Initial OpenRouter walkthrough: English saved a contextual transcript and approved reply audio, with about 24 seconds from end of capture to audio. Yoruba saved an approved text reply but withheld audio after a fidelity failure. A longer Hausa synthetic sample was split at a pause and reached the earlier owner's transcription cap. Those outcomes are preserved as initial evidence, not successful Hausa or Yoruba voice checks. Subsequent checks use a disposable owned copy of the already reviewed M08 concept and four lesson versions, with fresh session counters. This setup is explicitly seeded evidence, not fresh content generation.

After funding resumed, English/Hausa synthetic replies passed; Yoruba/Igbo remained unreliable. All four confirmed independent explanations reached the evaluator. SDK interruption/reconnect and isolated policy boundaries passed. The recorded-audio browser path decodes at most 30 seconds/8 MB locally and sends bounded PCM through the same SDK/gateway after explicit submission. It requests no microphone access. Native playback and saved transcript persistence passed; microphone signal/capture and natural human conversation remain unverified. New voice sessions are currently limited by the twenty-session daily app quota. D033 accepts experimental Yoruba/Igbo audio; natural human microphone/device checks remain unverified and are accepted demo limitations in D037.
