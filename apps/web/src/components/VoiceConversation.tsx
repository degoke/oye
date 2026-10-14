import { useEffect, useRef, useState } from 'react';
import type { RealtimeSession } from '@openai/agents/realtime';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, Badge, Button, FileInput, Group, Modal, Paper, Progress, Stack, Text, Textarea } from '@mantine/core';
import { transcriptionSchema, voiceCredentialSchema, voiceDetailSchema, type VoiceContext, type VoiceSession, type VoiceTurn, type VoiceServerMessage } from '@oye/shared';
import { api } from '../lib/api';
import { useI18n } from '../lib/i18n';
import { acquireMicrophone, microphoneFallback } from '../lib/microphone';
import type { OyeVoiceTransport } from '../lib/voice-transport';
import { prepareVoiceRecording, sendVoiceRecording, startVoiceCapture } from '../lib/voice-capture';

const stateLabels: Record<string, string> = { idle: 'Ready to talk', connecting: 'Connecting voice…', listening: 'Listening', recognizing: 'Recognizing your words…', thinking: 'Thinking…', speaking: 'Speaking', awaiting_confirmation: 'Check your words', muted: 'Microphone muted', stopped: 'Voice stopped', disconnected: 'Voice disconnected' };
export function VoiceConversation({ context, disabled, onConfirmed }: { context: VoiceContext; disabled?: boolean; onConfirmed?: (words: string, receiptId: string) => void }) {
  const { t, language } = useI18n(); const client = useQueryClient();
  const [opened, setOpened] = useState(false); const [state, setState] = useState('idle'); const [error, setError] = useState(''); const [history, setHistory] = useState<VoiceTurn[]>([]); const [snapshot, setSnapshot] = useState<VoiceSession | null>(null); const [draft, setDraft] = useState(''); const [confirming, setConfirming] = useState(false); const [now, setNow] = useState(Date.now()); const [audioUrl, setAudioUrl] = useState('');
  const [recording, setRecording] = useState<File | null>(null); const [preparingRecording, setPreparingRecording] = useState(false); const [level, setLevel] = useState(0); const [inputMode, setInputMode] = useState<'microphone' | 'file'>('microphone'); const lastSignal = useRef(Date.now()); const inputKind = useRef<'microphone' | 'file'>('microphone');
  const epoch = useRef(0); const session = useRef<RealtimeSession | null>(null); const transport = useRef<OyeVoiceTransport | null>(null); const capture = useRef<(() => void) | null>(null); const media = useRef<MediaStream | null>(null); const audio = useRef<HTMLAudioElement>(null); const sessionId = useRef<string | null>(null); const stopped = useRef(true); const isMuted = useRef(false);
  const haltAudio = () => { audio.current?.pause(); if (audio.current) audio.current.currentTime = 0; setAudioUrl(''); };
  const release = () => { epoch.current++; capture.current?.(); capture.current = null; media.current?.getTracks().forEach(track => track.stop()); media.current = null; session.current?.close(); session.current = null; transport.current = null; audio.current?.pause(); };
  const stop = () => { stopped.current = true; release(); haltAudio(); setState('stopped'); if (sessionId.current) void api(`/voice/sessions/${sessionId.current}`, { method: 'DELETE' }).catch(() => {}); void client.invalidateQueries({ queryKey: ['conversation'] }); };
  useEffect(() => () => { stopped.current = true; release(); }, []);
  useEffect(() => { if (!opened) return; const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, [opened]);
  useEffect(() => { if (snapshot && snapshot.expiresAt <= now && !stopped.current) stop(); }, [now, snapshot]);
  useEffect(() => { if (!audioUrl || !audio.current) return; void audio.current.play().catch(() => setError('Press play to hear the reply.')); }, [audioUrl]);
  const receive = (message: VoiceServerMessage) => {
    if (message.type === 'ready') setSnapshot(message.session);
    if (message.type === 'state') { setState(message.state); if (message.state === 'awaiting_confirmation') { isMuted.current = true; transport.current?.mute(true); } }
    if (message.type === 'turn') { setHistory(previous => { const index = previous.findIndex(turn => turn.id === message.turn.id); if (index < 0) return [...previous, message.turn]; return previous.map(turn => turn.id === message.turn.id ? message.turn : turn); }); if (message.turn.status === 'awaiting_confirmation') setDraft(message.turn.confirmedText || message.turn.recognizedText); }
    if (message.type === 'delta') setHistory(previous => previous.map(turn => turn.id === message.turnId ? { ...turn, assistantText: turn.assistantText + message.text } : turn));
    if (message.type === 'audio') setAudioUrl(message.url);
    if (message.type === 'interrupted') { haltAudio(); setState(isMuted.current ? 'muted' : 'listening'); }
    if (message.type === 'error') { setError(message.message); haltAudio(); }
  };
  const streamRecording = (pcm: ArrayBuffer, current: number) => { capture.current?.(); capture.current = sendVoiceRecording(pcm, bytes => { if (epoch.current === current && !stopped.current) session.current?.sendAudio(bytes); }, () => { if (epoch.current === current && !stopped.current) { transport.current?.commit(); capture.current = null; } }); };
  const connect = async (reconnect = false, pcm?: ArrayBuffer) => {
    session.current?.close(); session.current = null; transport.current = null;
    const current = ++epoch.current; stopped.current = false; isMuted.current = false; setError(''); setState('connecting');
    const usingFile = !!pcm || reconnect && inputKind.current === 'file'; inputKind.current = usingFile ? 'file' : 'microphone'; setInputMode(inputKind.current); setLevel(0); lastSignal.current = Date.now();
    const acquired = usingFile ? { stream: undefined, error: undefined } : await acquireMicrophone(() => navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }), () => epoch.current === current);
    if (epoch.current !== current) return;
    if (acquired.error) { stopped.current = true; setError(microphoneFallback); setState('stopped'); return; }
    media.current = acquired.stream || null;
    try {
      const credential = voiceCredentialSchema.parse(await api(reconnect && sessionId.current ? `/voice/sessions/${sessionId.current}/connect` : '/voice/sessions', { method: 'POST', ...(!reconnect ? { body: JSON.stringify({ context, requestId: crypto.randomUUID() }) } : {}) }));
      if (epoch.current !== current) { void api(`/voice/sessions/${credential.session.id}`, { method: 'DELETE' }).catch(() => {}); acquired.stream?.getTracks().forEach(track => track.stop()); return; }
      sessionId.current = credential.session.id; setSnapshot(credential.session);
      const detail = voiceDetailSchema.parse(await api(`/voice/sessions/${credential.session.id}`)); if (epoch.current !== current) { acquired.stream?.getTracks().forEach(track => track.stop()); return; } setHistory(detail.history);
      const [{ RealtimeAgent, RealtimeSession }, { OyeVoiceTransport }] = await Promise.all([import('@openai/agents/realtime'), import('../lib/voice-transport')]);
      if (epoch.current !== current) { acquired.stream?.getTracks().forEach(track => track.stop()); return; }
      const adapter = new OyeVoiceTransport(credential.session.id, message => { if (epoch.current === current) receive(message); }, () => { if (epoch.current !== current || stopped.current) return; capture.current?.(); capture.current = null; media.current?.getTracks().forEach(track => track.stop()); media.current = null; haltAudio(); setState('disconnected'); setError('Voice disconnected. Use text or reconnect.'); void client.invalidateQueries({ queryKey: ['conversation'] }); });
      transport.current = adapter;
      const sdk = new RealtimeSession(new RealtimeAgent({ name: 'òye voice', instructions: 'The server supplies authorized learning context and tools.' }), { transport: adapter, tracingDisabled: true, historyStoreAudio: false }); session.current = sdk;
      sdk.on('error', () => { if (epoch.current === current) setError('The voice reply could not finish. Read the saved text or try again.'); });
      await sdk.connect({ apiKey: credential.credential });
      if (epoch.current !== current) { sdk.close(); return; }
      if (usingFile) { if (pcm) streamRecording(pcm, current); return; }
      const cleanup = await startVoiceCapture(acquired.stream!, pcm => { if (epoch.current === current && !stopped.current) sdk.sendAudio(pcm); }, value => { if (epoch.current === current) { setLevel(value); if (value > 0.08) lastSignal.current = Date.now(); } });
      if (epoch.current !== current) { cleanup(); return; } capture.current = cleanup;
    } catch (cause) { if (epoch.current !== current) return; release(); stopped.current = true; setState('stopped'); setError(cause instanceof Error ? cause.message : 'Voice could not connect. Use text or reconnect.'); }
  };
  const awaiting = [...history].reverse().find(turn => turn.status === 'awaiting_confirmation');
  const connected = !['idle', 'connecting', 'stopped', 'disconnected'].includes(state);
  const usable = snapshot && snapshot.expiresAt > now && state === 'disconnected';
  const canSendRecording = !awaiting && ['idle', 'stopped', 'disconnected', 'listening', 'muted', 'speaking'].includes(state);
  const submitRecording = async () => { if (!recording || !canSendRecording || preparingRecording) return; const current = epoch.current; setPreparingRecording(true); setError(''); try { const pcm = await prepareVoiceRecording(recording); if (epoch.current !== current) return; setRecording(null); if (connected) { capture.current?.(); capture.current = null; media.current?.getTracks().forEach(track => track.stop()); media.current = null; inputKind.current = 'file'; setInputMode('file'); isMuted.current = false; session.current?.interrupt(); session.current?.mute(false); haltAudio(); streamRecording(pcm, current); } else { inputKind.current = 'file'; await connect(!!usable, pcm); } } catch (cause) { if (epoch.current === current) setError(cause instanceof Error ? cause.message : 'Use an audio recording up to 30 seconds and 8 MB.'); } finally { setPreparingRecording(false); } };
  const confirm = async () => { if (!awaiting) return; setConfirming(true); setError(''); try { const receipt = transcriptionSchema.parse(await api(`/voice/turns/${awaiting.id}/confirm`, { method: 'POST', body: JSON.stringify({ text: draft }) })); if (!receipt.confirmedText) throw new Error('Check your words'); onConfirmed?.(receipt.confirmedText, receipt.id); stop(); setOpened(false); } catch (cause) { setError(cause instanceof Error ? cause.message : 'This request could not be completed. Please try again.'); } finally { setConfirming(false); } };
  return <>
    <Button variant="light" mt="sm" disabled={disabled} onClick={() => { if (stopped.current) { sessionId.current = null; setSnapshot(null); setHistory([]); setDraft(''); setRecording(null); setError(''); setState('idle'); } setOpened(true); }}>{t(context.type === 'tutor' ? 'Talk with òye.' : 'Explain by voice')}</Button>
    <Modal opened={opened} onClose={() => { stop(); setOpened(false); }} title={t(context.type === 'tutor' ? 'Talk with òye.' : 'Explain by voice')} size="lg" centered closeButtonProps={{ 'aria-label': t('Close voice') }} closeOnClickOutside={false}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">{t(context.type === 'tutor' ? 'Speak naturally. òye may pause while preparing a reply. You can interrupt or continue by typing.' : 'Explain independently. Check the recognized words before saving them for feedback.')}</Text>
        {['yo', 'ig'].includes(snapshot?.language || language) && <Text size="xs" c="dimmed">{t('AI voice is experimental in this language. Read the text if audio is unclear or unavailable.')}</Text>}
        <Text size="xs" c="dimmed">{t('Voice sends microphone audio or your selected recording to the AI provider. Stop ends capture; saved words remain in your history.')}</Text>
        <Group justify="space-between"><Badge variant="light" color={state === 'listening' ? 'forest' : 'gray'} aria-live="polite">{t(stateLabels[state] || 'Ready to talk')}</Badge>{snapshot && state !== 'stopped' && <Text size="xs" c="dimmed">{t('{seconds}s remaining', { seconds: Math.max(0, Math.min(600, Math.ceil((snapshot.expiresAt - now) / 1000))) })}</Text>}</Group>
        {['idle', 'stopped'].includes(state) && <Button disabled={preparingRecording} onClick={() => void connect()}>{t('Start voice')}</Button>}
        {usable && <Button onClick={() => void connect(true)}>{t('Reconnect voice')}</Button>}
        {(connected || state === 'connecting') && <Group gap="xs">{connected && !awaiting && <>{inputMode === 'microphone' && <><Button variant="light" onClick={() => { const muted = !isMuted.current; isMuted.current = muted; session.current?.mute(muted); setState(muted ? 'muted' : 'listening'); }}>{t(isMuted.current ? 'Unmute microphone' : 'Mute microphone')}</Button><Button variant="subtle" disabled={isMuted.current} onClick={() => transport.current?.commit()}>{t('Finish speaking')}</Button></>}{context.type === 'tutor' && <Button variant="subtle" onClick={() => { if (inputKind.current === 'file') { capture.current?.(); capture.current = null; } session.current?.interrupt(); haltAudio(); }}>{t('Interrupt reply')}</Button>}</>}<Button variant="outline" onClick={stop}>{t('Stop voice')}</Button></Group>}
        {connected && inputMode === 'microphone' && !isMuted.current && <><Progress value={level * 100} aria-label={t('Microphone signal')} size="sm" />{state === 'listening' && now - lastSignal.current > 8000 && <Text size="sm" c="dimmed">{t('No sound detected. Speak, check your microphone, or send a recording.')}</Text>}</>}
        {!awaiting && <Group align="end"><FileInput style={{ flex: 1, minWidth: 180 }} label={t('Choose a recording')} description={t('Use an audio recording up to 30 seconds and 8 MB.')} accept="audio/*" value={recording} onChange={file => { setRecording(file); setError(''); }} clearable clearButtonProps={{ 'aria-label': t('Remove recording') }} disabled={!canSendRecording || preparingRecording} /><Button variant="light" disabled={!recording || !canSendRecording} loading={preparingRecording} onClick={() => void submitRecording()}>{t('Send recording')}</Button></Group>}
        {error && <Alert color="orange" role="alert">{t(error)}</Alert>}
        {audioUrl && <audio ref={audio} src={audioUrl} controls preload="none" aria-label={t('Voice reply')} onEnded={() => setState(isMuted.current ? 'muted' : 'listening')} style={{ width: '100%' }} />}
        <Stack gap="sm" aria-label={t('Voice transcript')}>{history.map(turn => <Paper key={turn.id} withBorder p="md" radius="md"><Text size="xs" c="dimmed">{t('You')}</Text><Text lang={turn.language} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{turn.confirmedText || turn.recognizedText || t('Recognizing your words…')}</Text>{turn.assistantText && <><Text size="xs" c="dimmed" mt="md">òye.</Text><Text lang={turn.language} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{turn.assistantText}</Text></>}{['failed', 'interrupted'].includes(turn.status) && <Text size="xs" c="dimmed" mt="sm">{t(turn.status === 'interrupted' ? 'Interrupted reply' : 'Failed reply')}</Text>}</Paper>)}</Stack>
        {awaiting && onConfirmed && <><Textarea label={t('Check your words')} value={draft} onChange={event => setDraft(event.currentTarget.value)} maxLength={context.type === 'explain' ? 6000 : 4000} autosize minRows={3} /><Text size="xs" c="dimmed">{t('Confirming fills your answer. Save it in the lesson to request feedback.')}</Text><Button disabled={draft.trim().length < 3} loading={confirming} onClick={() => void confirm()}>{t('Use these words')}</Button></>}
        <Text size="xs" c="dimmed">{t('Completed voice turns stay in your history. Use Explain Back to show understanding.')}</Text>
      </Stack>
    </Modal>
  </>;
}
