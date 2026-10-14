import { useEffect, useRef, useState } from 'react';
import { Button, FileButton, Group, Paper, Stack, Text, Textarea } from '@mantine/core';
import { transcriptionSchema, type SpeechContext, type Transcription } from '@oye/shared';
import { api } from '../lib/api';
import { useI18n } from '../lib/i18n';
import { Failure } from './QueryState';
import { acquireMicrophone, microphoneFallback } from '../lib/microphone';

export function SpokenAnswer({ context, disabled = false, onConfirmed }: { context: SpeechContext; disabled?: boolean; onConfirmed: (text: string, id: string) => void }) {
  const { t } = useI18n(); const isRequest = context.type === 'objective'; const maxSeconds = isRequest ? 30 : 90; const maxLength = isRequest ? 600 : 6000; const [recording, setRecording] = useState(false); const [seconds, setSeconds] = useState(0); const [clip, setClip] = useState<Blob | null>(null); const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState<Transcription | null>(null); const [words, setWords] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState<Error | null>(null);
  const recorder = useRef<MediaRecorder | null>(null); const stream = useRef<MediaStream | null>(null); const controller = useRef<AbortController | null>(null); const mounted = useRef(true); const discard = useRef(false); const captureGeneration = useRef(0); const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const cleanup = () => { if (timer.current) clearInterval(timer.current); timer.current = null; stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; };
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; discard.current = true; if (recorder.current?.state === 'recording') recorder.current.stop(); cleanup(); controller.current?.abort(); }; }, []);
  useEffect(() => { if (!clip) { setUrl(''); return; } const next = URL.createObjectURL(clip); setUrl(next); return () => URL.revokeObjectURL(next); }, [clip]);
  const stop = () => { if (recorder.current?.state === 'recording') recorder.current.stop(); cleanup(); setRecording(false); };
  const cancel = () => { captureGeneration.current++; setBusy(false); discard.current = true; stop(); controller.current?.abort(); setClip(null); setTranscript(null); setWords(''); setError(null); };
  const start = async () => {
    const generation = ++captureGeneration.current;
    setBusy(true); setError(null); setClip(null); setTranscript(null); setWords(''); setSeconds(0); discard.current = false;
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new Error('Recording is unavailable here. Type your answer or upload audio.');
      const capture = await acquireMicrophone(() => navigator.mediaDevices.getUserMedia({ audio: true }), () => mounted.current && generation === captureGeneration.current && !discard.current);
      if (capture.error) throw capture.error;
      const media = capture.stream; stream.current = media;
      const mimeType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus'].find(type => MediaRecorder.isTypeSupported(type));
      const next = new MediaRecorder(media, { ...(mimeType ? { mimeType } : {}), audioBitsPerSecond: 64000 }); recorder.current = next; const chunks: Blob[] = [];
      next.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      next.onstop = () => { cleanup(); if (mounted.current) { setRecording(false); if (!discard.current) setClip(new Blob(chunks, { type: next.mimeType || 'audio/webm' })); } };
      next.onerror = () => { cleanup(); if (mounted.current) { setRecording(false); setError(new Error('Recording is unavailable here. Type your answer or upload audio.')); } };
      next.start(1000); setRecording(true); const started = Date.now(); timer.current = setInterval(() => { const elapsed = Math.floor((Date.now() - started) / 1000); setSeconds(elapsed); if (elapsed >= maxSeconds) stop(); }, 250);
    } catch { if (generation !== captureGeneration.current) return; cleanup(); if (mounted.current) setError(new Error(microphoneFallback)); } finally { if (mounted.current && generation === captureGeneration.current) setBusy(false); }
  };
  const transcribe = async () => {
    if (!clip) return; if (clip.size > 8 * 1048576) { setError(new Error('Use a recording under 8 MB in a supported audio format.')); return; }
    setBusy(true); setError(null); const abort = new AbortController(); controller.current = abort;
    try { const form = new FormData(); form.set('file', clip, 'recording.' + (clip.type.includes('mp4') ? 'm4a' : clip.type.includes('mpeg') ? 'mp3' : clip.type.includes('wav') ? 'wav' : clip.type.includes('ogg') ? 'ogg' : 'webm')); form.set('context', JSON.stringify(context)); form.set('requestId', crypto.randomUUID()); const response = await fetch('/api/transcriptions', { method: 'POST', body: form, credentials: 'same-origin', signal: abort.signal }); const data = await response.json(); if (!response.ok) throw new Error(data.error?.message || 'We could not recognize usable speech. Try again or type your answer.'); const saved = transcriptionSchema.parse(data); if (mounted.current && !abort.signal.aborted) { setTranscript(saved); setWords(saved.text); setClip(null); } }
    catch (cause) { if (mounted.current && !abort.signal.aborted) setError(cause instanceof Error ? cause : new Error('This request could not be completed. Please try again.')); }
    finally { if (mounted.current) setBusy(false); }
  };
  const confirm = async () => { if (!transcript) return; setBusy(true); setError(null); try { const confirmed = transcriptionSchema.parse(await api('/transcriptions/' + transcript.id + '/confirm', { method: 'POST', body: JSON.stringify({ text: words }) })); if (mounted.current) { onConfirmed(confirmed.confirmedText!, confirmed.id); setTranscript(null); setWords(''); } } catch (cause) { if (mounted.current) setError(cause instanceof Error ? cause : new Error('This request could not be completed. Please try again.')); } finally { if (mounted.current) setBusy(false); } };
  return <Paper withBorder p="md" radius="md" mt="md"><Stack gap="sm"><Text size="sm" fw={600}>{t(isRequest ? 'Speak your request' : 'Speak your answer')}</Text><Text size="xs" c="dimmed">{t(isRequest ? 'Record up to 30 seconds. Confirm the words, then start learning.' : 'Record up to 90 seconds. Review and confirm the words before saving your answer.')}</Text>
    {transcript ? <><Textarea label={t('Recognized words')} value={words} onChange={e => setWords(e.currentTarget.value)} autosize minRows={3} maxLength={maxLength} disabled={busy || disabled} /><Button variant="light" loading={busy} disabled={!words.trim() || words.trim().length > maxLength || disabled} onClick={() => void confirm()}>{t('Use these words')}</Button></> : <>
      <Group>{recording ? <Button color="orange" onClick={stop}>{t('Stop recording')}</Button> : <Button variant="light" disabled={busy || disabled} onClick={() => void start()}>{t(isRequest ? 'Record request' : 'Record answer')}</Button>}<FileButton accept="audio/webm,audio/mp4,audio/mpeg,audio/wav,audio/ogg" onChange={file => { if (file) { setClip(file); setTranscript(null); setError(null); } }}>{props => <Button {...props} variant="subtle" disabled={recording || busy || disabled}>{t('Upload audio')}</Button>}</FileButton></Group>
      {recording && <Text role="status" size="sm">{t('Recording: {seconds} seconds', { seconds })}</Text>}
      {url && <audio controls preload="none" src={url} aria-label={t('Your recording')} style={{ width: '100%' }} />}
      {clip && <Button loading={busy} disabled={disabled} onClick={() => void transcribe()}>{t('Transcribe recording')}</Button>}
    </>}
    {(recording || clip || transcript || busy) && <Button variant="subtle" onClick={cancel}>{t('Discard recording')}</Button>}
    <Text size="xs" c="dimmed">{t('Transcription sends audio to the selected AI provider. òye. deletes the raw upload after processing; recognized and confirmed words remain in your history.')}</Text>
    {error && <Failure error={error} />}
  </Stack></Paper>;
}
