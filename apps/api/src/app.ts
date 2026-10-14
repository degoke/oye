import { Hono } from 'hono';
import { createHash } from 'node:crypto';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { bodyLimit } from 'hono/body-limit';
import { streamSSE } from 'hono/streaming';
import { ZodError } from 'zod';
import { HTTPException } from 'hono/http-exception';
import { assessmentSubmitSchema, healthSchema, sessionResponseSchema, translate, type Language } from '@oye/shared';
import type { OyeDatabase } from '@oye/db';
import { resolveSession, readPreferences, updatePreferences, clearLearner } from './services/session.js';
import { createJourney, journeyDetail, listJourneys, readAssessment, submitAssessment, updateAnswer } from './services/journeys.js';
import { lessonVersion, ownedConcept, type GenerationService } from './services/generation.js';
import { providerInfo } from './services/ai.js';
import { readPractice, savePractice, visitConcept } from './services/practice.js';
import { createTutor, type TutorService } from './services/tutor.js';
import { createSpeech, type SpeechService } from './services/speech.js';
import { createVoice, type VoiceService } from './services/voice.js';
import { createExplain, type ExplainService } from './services/explain.js';
import { createVideo, type VideoService } from './services/video.js';

export type Variables = { learnerId: string; token: string; expiresAt: number; language: Language };
export type AppDependencies = { db: OyeDatabase; origin: string; clock?: () => number; fixturesEnabled?: boolean; generation?: GenerationService; tutor?: TutorService; explain?: ExplainService; speech?: SpeechService; voice?: VoiceService; video?: VideoService };
export function createApplication({ db, origin, clock = Date.now, fixturesEnabled = true, generation, tutor = createTutor(db), explain = createExplain(db), speech = createSpeech(db), voice = createVoice(db, tutor, speech), video = createVideo(db, speech) }: AppDependencies) {
  const app = new Hono<{ Variables: Variables }>();
  const secure = new URL(origin).protocol === 'https:';
  const error = (code: string, message: string, retryable = false) => ({ error: { code, message, retryable } });
  app.use('/api/*', async (c, next) => bodyLimit({ maxSize: c.req.path === '/api/transcriptions' ? 8 * 1024 * 1024 + 16384 : 64 * 1024, onError: c => c.json(error('PAYLOAD_TOO_LARGE', 'This request is too large.'), 413) })(c, next));
  app.get('/api/health', c => c.json(healthSchema.parse({ status: 'ok', name: 'òye.' })));
  app.use('/api/*', async (c, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(c.req.method) && c.req.header('origin') !== origin) {
      return c.json(error('INVALID_ORIGIN', 'This request must come from òye.'), 403);
    }
    const session = resolveSession(db, getCookie(c, 'oye_session'), clock());
    c.set('learnerId', session.learnerId); c.set('token', session.token); c.set('expiresAt', session.expiresAt);
    c.set('language', readPreferences(db, session.learnerId).language);
    setCookie(c, 'oye_session', session.token, { httpOnly: true, secure, sameSite: 'Lax', path: '/', maxAge: 30 * 24 * 60 * 60 });
    c.header('Cache-Control', 'no-store');
    await next();
  });
  app.get('/api/session', c => c.json(sessionResponseSchema.parse({ expiresAt: c.get('expiresAt'), preferences: readPreferences(db, c.get('learnerId')), cacheScope: createHash('sha256').update('oye-cache:' + c.get('learnerId')).digest('hex') })));
  app.get('/api/preferences', c => c.json(readPreferences(db, c.get('learnerId'))));
  app.patch('/api/preferences', async c => c.json(updatePreferences(db, c.get('learnerId'), await c.req.json())));
  app.get('/api/journeys', c => c.json(listJourneys(db, c.get('learnerId'))));
  app.post('/api/journeys/:id/language', c => {
    if (!generation) throw new HTTPException(503, { message: 'Translation is unavailable.' });
    return c.json(generation.enqueue(c.get('learnerId'), c.req.param('id'), 'localize'), 202);
  });
  app.get('/api/capabilities', c => c.json({ text: providerInfo(), fixtures: fixturesEnabled }));
  app.post('/api/videos/read', async c => c.json(video.state(c.get('learnerId'), await c.req.json())));
  app.post('/api/videos', async c => { if (!generation) throw new HTTPException(503, { message: 'Video is not configured yet. Read the text instead.' }); return c.json(video.prepare(c.get('learnerId'), await c.req.json(), generation), 202); });
  app.get('/api/videos/:id/captions', async c => { c.header('Content-Type', 'text/vtt; charset=utf-8'); return c.body(await video.file(c.get('learnerId'), c.req.param('id'), 'captions')); });
  app.get('/api/videos/:id/file', async c => {
    const bytes = await video.file(c.get('learnerId'), c.req.param('id'), 'video'); c.header('Content-Type', 'video/mp4'); c.header('Accept-Ranges', 'bytes');
    const range = c.req.header('range'); if (range) { const match = /^bytes=(\d*)-(\d*)$/.exec(range); let start = Number(match?.[1] || 0); let end = Number(match?.[2] || bytes.length - 1); if (match && !match[1] && match[2]) { start = Math.max(0, bytes.length - Number(match[2])); end = bytes.length - 1; } if (!match || start > end || start >= bytes.length || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) { c.header('Content-Range', 'bytes */' + bytes.length); return c.body(null, 416); } end = Math.min(end, bytes.length - 1); c.header('Content-Range', `bytes ${start}-${end}/${bytes.length}`); c.header('Content-Length', String(end - start + 1)); return c.body(bytes.subarray(start, end + 1), 206); } c.header('Content-Length', String(bytes.length)); return c.body(bytes);
  });
  app.post('/api/narrations/read', async c => c.json(speech.narrationState(c.get('learnerId'), await c.req.json())));
  app.post('/api/narrations', async c => { if (!generation) throw new HTTPException(503, { message: 'Speech is not configured yet.' }); return c.json(speech.prepareNarration(c.get('learnerId'), await c.req.json(), generation), 202); });
  app.get('/api/narrations/:id/audio', async c => {
    const { bytes } = await speech.file(c.get('learnerId'), c.req.param('id'));
    const range = c.req.header('range'); c.header('Content-Type', 'audio/mpeg'); c.header('Accept-Ranges', 'bytes');
    if (range) { const match = /^bytes=(\d*)-(\d*)$/.exec(range); let start = Number(match?.[1] || 0); let end = Number(match?.[2] || bytes.length - 1); if (match && !match[1] && match[2]) { start = Math.max(0, bytes.length - Number(match[2])); end = bytes.length - 1; } if (!match || start > end || start >= bytes.length) { c.header('Content-Range', 'bytes */' + bytes.length); return c.body(null, 416); } end = Math.min(end, bytes.length - 1); c.header('Content-Range', `bytes ${start}-${end}/${bytes.length}`); c.header('Content-Length', String(end - start + 1)); return c.body(bytes.subarray(start, end + 1), 206); }
    c.header('Content-Length', String(bytes.length)); return c.body(bytes);
  });
  app.post('/api/transcriptions', async c => { const form = await c.req.formData(); const file = form.get('file'); if (!(file instanceof File)) throw new HTTPException(400, { message: 'Choose a recording to transcribe.' }); return c.json(await speech.transcribe(c.get('learnerId'), JSON.parse(String(form.get('context'))), form.get('requestId'), file, c.req.raw.signal), 201); });
  app.get('/api/transcriptions/:id', c => c.json(speech.read(c.get('learnerId'), c.req.param('id'))));
  app.post('/api/transcriptions/:id/confirm', async c => c.json(speech.confirm(c.get('learnerId'), c.req.param('id'), await c.req.json())));
  app.post('/api/voice/sessions', async c => c.json(voice.create(c.get('learnerId'), await c.req.json()), 201));
  app.get('/api/voice/sessions/:id', c => c.json(voice.read(c.get('learnerId'), c.req.param('id'))));
  app.post('/api/voice/sessions/:id/connect', c => c.json(voice.credential(c.get('learnerId'), c.req.param('id'))));
  app.delete('/api/voice/sessions/:id', c => c.json(voice.close(c.get('learnerId'), c.req.param('id'))));
  app.post('/api/voice/turns/:id/confirm', async c => c.json(voice.confirm(c.get('learnerId'), c.req.param('id'), await c.req.json())));
  app.get('/api/voice/turns/:id/audio', async c => {
    const bytes = await voice.file(c.get('learnerId'), c.req.param('id')); c.header('Content-Type', 'audio/mpeg'); c.header('Accept-Ranges', 'bytes');
    const range = c.req.header('range');
    if (range) { const match = /^bytes=(\d*)-(\d*)$/.exec(range); let start = Number(match?.[1] || 0); let end = Number(match?.[2] || bytes.length - 1); if (match && !match[1] && match[2]) { start = Math.max(0, bytes.length - Number(match[2])); end = bytes.length - 1; } if (!match || start > end || start >= bytes.length) { c.header('Content-Range', 'bytes */' + bytes.length); return c.body(null, 416); } end = Math.min(end, bytes.length - 1); c.header('Content-Range', `bytes ${start}-${end}/${bytes.length}`); return c.body(bytes.subarray(start, end + 1), 206); }
    return c.body(bytes);
  });
  app.get('/api/progress', c => c.json(explain.progress(c.get('learnerId'))));
  app.get('/api/concepts/:id/explanations', c => c.json(explain.list(c.get('learnerId'), c.req.param('id'))));
  app.post('/api/concepts/:id/explanations', async c => {
    if (!generation) throw new HTTPException(503, { message: 'Explain Back is unavailable.' });
    return c.json(explain.create(c.get('learnerId'), c.req.param('id'), await c.req.json(), generation), 202);
  });
  app.get('/api/explanations/:id', c => c.json(explain.read(c.get('learnerId'), c.req.param('id'))));
  app.post('/api/explanations/:id/responses', async c => {
    if (!generation) throw new HTTPException(503, { message: 'Explain Back is unavailable.' });
    return c.json(explain.respond(c.get('learnerId'), c.req.param('id'), await c.req.json(), generation), 202);
  });
  app.get('/api/conversations', c => c.json(tutor.list(c.get('learnerId'))));
  app.post('/api/conversations', async c => c.json(tutor.create(c.get('learnerId'), await c.req.json()), 201));
  app.get('/api/conversations/:id', c => c.json({ ...tutor.owned(c.get('learnerId'), c.req.param('id')), learnerId: undefined, requestId: undefined, turns: tutor.turns(c.get('learnerId'), c.req.param('id')) }));
  app.post('/api/conversations/:id/stop', c => c.json(tutor.cancel(c.get('learnerId'), c.req.param('id'))));
  app.post('/api/conversations/:id/turns', async c => {
    const turn = tutor.prepare(c.get('learnerId'), c.req.param('id'), await c.req.json());
    return streamSSE(c, async stream => {
      const controller = new AbortController();
      stream.onAbort(() => controller.abort());
      try { for await (const event of tutor.reply(c.get('learnerId'), c.req.param('id'), turn, controller.signal)) await stream.writeSSE({ event: event.type, data: JSON.stringify(event) }); }
      finally { try { tutor.cancel(c.get('learnerId'), c.req.param('id'), turn.id); } catch (error) { if (!(error instanceof HTTPException && error.status === 404)) throw error; } }
    });
  });
  app.post('/api/journeys', async c => {
    const input = await c.req.json();
    if (input?.mode === 'live' && (!generation || !providerInfo().configured)) throw new HTTPException(503, { message: 'The learning provider is not configured yet.' });
    const journey = db.transaction(() => {
      const result = createJourney(db, c.get('learnerId'), input, clock(), fixturesEnabled);
      if (result.mode === 'live' && result.status === 'generating') generation!.enqueue(c.get('learnerId'), result.id, 'plan');
      return result;
    });
    return c.json(journey, 201);
  });
  app.get('/api/journeys/:id', c => c.json(journeyDetail(db, c.get('learnerId'), c.req.param('id'))));
  app.get('/api/journeys/:id/assessment', c => c.json(readAssessment(db, c.get('learnerId'), c.req.param('id'))));
  app.patch('/api/journeys/:id/assessment', async c => c.json(updateAnswer(db, c.get('learnerId'), c.req.param('id'), await c.req.json(), clock())));
  app.post('/api/journeys/:id/assessment', async c => {
    const journey = submitAssessment(db, c.get('learnerId'), c.req.param('id'), assessmentSubmitSchema.parse(await c.req.json()).skip, clock());
    if (journey.mode === 'live') generation?.enqueue(c.get('learnerId'), journey.id, 'lesson', journey.concepts[0]!.id);
    return c.json(journey);
  });
  app.get('/api/journeys/:id/jobs', c => c.json(generation?.list(c.get('learnerId'), c.req.param('id')) || []));
  app.get('/api/jobs/:id', c => c.json(generation!.getJob(c.get('learnerId'), c.req.param('id'))));
  app.post('/api/jobs/:id/retry', c => c.json(generation!.retry(c.get('learnerId'), c.req.param('id'))));
  app.post('/api/jobs/:id/cancel', c => c.json(generation!.cancel(c.get('learnerId'), c.req.param('id'))));
  app.get('/api/concepts/:id/lesson', c => c.json(lessonVersion(db, c.get('learnerId'), c.req.param('id'))));
  app.post('/api/concepts/:id/visit', c => c.json(visitConcept(db, c.get('learnerId'), c.req.param('id'), clock())));
  app.get('/api/concepts/:id/practice', c => c.json(readPractice(db, c.get('learnerId'), c.req.param('id'))));
  app.post('/api/concepts/:id/practice', async c => c.json(savePractice(db, c.get('learnerId'), c.req.param('id'), await c.req.json(), clock()), 201));
  app.post('/api/concepts/:id/lesson', c => {
    const { journey } = ownedConcept(db, c.get('learnerId'), c.req.param('id'));
    return c.json(generation!.enqueue(c.get('learnerId'), journey.id, 'lesson', c.req.param('id')), 202);
  });
  app.delete('/api/session', async c => {
    voice.clearOwner(c.get('learnerId'));
    generation?.clearOwner(c.get('learnerId'));
    tutor.clearOwner(c.get('learnerId'));
    await speech.clearOwner(c.get('learnerId'));
    clearLearner(db, c.get('learnerId'));
    deleteCookie(c, 'oye_session', { path: '/', secure, httpOnly: true, sameSite: 'Lax' });
    return c.json({ cleared: true });
  });
  app.notFound(c => c.json(error('NOT_FOUND', 'This resource could not be found.'), 404));
  app.onError((cause, c) => {
    const failure = (code: string, message: string, retryable = false) => error(code, translate(c.get('language') || 'en', message), retryable);
    if (cause instanceof HTTPException) return c.json(failure('REQUEST_ERROR', cause.message, cause.status >= 500), cause.status);
    if (cause instanceof ZodError) return c.json(failure('INVALID_INPUT', 'Check your choices and try again.'), 400);
    if (cause instanceof SyntaxError) return c.json(failure('INVALID_JSON', 'This request could not be read.'), 400);
    console.error('Request failed:', cause.name);
    return c.json(failure('INTERNAL_ERROR', 'This request could not be completed. Please try again.', true), 500);
  });
  return app;
}
