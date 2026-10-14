import { reserveUsage } from './usage.js';
import { config } from '../config.js';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { HTTPException } from 'hono/http-exception';
import { and, eq, schema, type OyeDatabase } from '@oye/db';
import { videoContextSchema, videoSchema, type VideoSlide } from '@oye/shared';
import { ownedConcept, type GenerationService, type JobRow } from './generation.js';
import { audioDuration, ffmpeg, mediaRoot, speechChunks, withAudioTemp } from './audio.js';
import type { SpeechService } from './speech.js';

export class MediaPending extends Error {}
export class MediaUnavailable extends Error {}
const rendererVersion = 1;
const escape = (text: string) => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);
function lines(text: string, width: number) {
  const result: string[] = []; let line = '';
  for (const word of text.replace(/\s+/g, ' ').trim().split(' ')) {
    if (line && [...line + ' ' + word].length > width) { result.push(line); line = ''; }
    // Long tokens are split rather than allowed to escape the frame.
    const points = [...word]; while (points.length > width) { if (line) { result.push(line); line = ''; } result.push(points.splice(0, width).join('')); }
    line += (line ? ' ' : '') + points.join('');
  }
  if (line) result.push(line); return result;
}
export function slideSvg(title: string, slide: VideoSlide, index: number, total: number) {
  const titleLines = lines(title, 51).slice(0, 2); const body = lines(slide.text, 52);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540"><rect width="960" height="540" fill="#f8faf8"/><rect x="0" y="0" width="12" height="540" fill="#245542"/><text x="48" y="52" font-family="${escape(config.VIDEO_FONT_FAMILY)}" font-size="25" fill="#245542">òye.</text><text x="910" y="52" text-anchor="end" font-family="${escape(config.VIDEO_FONT_FAMILY)}" font-size="18" fill="#52625a">${index + 1} / ${total}</text>${titleLines.map((line, i) => `<text x="48" y="${98 + i * 32}" font-family="${escape(config.VIDEO_FONT_FAMILY)}" font-size="28" font-weight="bold" fill="#17291f">${escape(line)}</text>`).join('')}<path d="M48 154H910" stroke="#d8e3dc"/>${body.map((line, i) => `<text x="48" y="${203 + i * 37}" font-family="${escape(config.VIDEO_FONT_FAMILY)}" font-size="29" fill="#17291f">${escape(line)}</text>`).join('')}<text x="48" y="505" font-family="${escape(config.VIDEO_FONT_FAMILY)}" font-size="17" fill="#52625a">${escape(slide.sourceIds.join(' · '))}</text><rect x="48" y="521" width="862" height="3" fill="#d8e3dc"/><rect x="48" y="521" width="${862 * (index + 1) / total}" height="3" fill="#245542"/></svg>`;
}
const stamp = (seconds: number) => { const ms = Math.round(seconds * 1000); return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`; };
export function timedSlides(segments: { text: string; start: number; end: number }[], sourceIds: string[]) {
  return segments.flatMap(segment => { const pieces = speechChunks(segment.text, 260); const length = pieces.reduce((sum, text) => sum + text.length, 0); let elapsed = segment.start; return pieces.map(text => { const start = elapsed; elapsed += (segment.end - segment.start) * text.length / length; return { text: text.trim(), sourceIds, start, end: elapsed }; }); });
}
export function captions(slides: VideoSlide[]) {
  return 'WEBVTT\n\n' + slides.flatMap(slide => { const pieces = speechChunks(slide.text, 110); const length = pieces.reduce((sum, text) => sum + text.length, 0); let elapsed = slide.start; return pieces.map(text => { const start = elapsed; elapsed += (slide.end - slide.start) * text.length / length; return `${stamp(start)} --> ${stamp(elapsed)}\n${lines(text.replace(/-->/g, '→'), 52).map(line => line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')).join('\n')}\n`; }); }).join('\n');
}

export function createVideo(db: OyeDatabase, speech: SpeechService) {
  const ownedLesson = (learnerId: string, id: string) => { const row = db.select().from(schema.lessons).where(eq(schema.lessons.id, id)).get(); if (!row) throw new HTTPException(404, { message: 'This lesson could not be found.' }); return { row, journey: ownedConcept(db, learnerId, row.conceptId).journey }; };
  const input = (learnerId: string, raw: unknown) => { const context = videoContextSchema.parse(raw); const lesson = ownedLesson(learnerId, context.lessonId); const narration = speech.narrationState(learnerId, { type: 'lesson', lessonId: context.lessonId }); const cacheKey = createHash('sha256').update(JSON.stringify({ context, narrationJob: narration.jobId, rendererVersion })).digest('hex'); return { ...lesson, narration, cacheKey }; };
  const state = (learnerId: string, raw: unknown) => { const data = input(learnerId, raw); const video = db.select().from(schema.videos).where(and(eq(schema.videos.learnerId, learnerId), eq(schema.videos.cacheKey, data.cacheKey))).get(); const job = db.select().from(schema.jobs).where(and(eq(schema.jobs.learnerId, learnerId), eq(schema.jobs.dedupeKey, 'video:' + data.cacheKey))).get(); return { video: video ? videoSchema.parse(video) : null, jobId: job?.id || null }; };
  const prepare = (learnerId: string, raw: unknown, generation: GenerationService) => {
    const context = videoContextSchema.parse(raw); ownedLesson(learnerId, context.lessonId);
    const already = state(learnerId, raw); if (already.jobId) return generation.getJob(learnerId, already.jobId);
    const ownerJobs = db.select().from(schema.jobs).where(eq(schema.jobs.learnerId, learnerId)).all();
    if (ownerJobs.filter(j => j.type === 'video' && j.createdAt > Date.now() - 86400000).length >= 12 || ownerJobs.filter(j => ['queued', 'running'].includes(j.status)).length >= 5) throw new HTTPException(429, { message: 'The demo media limit has been reached. Read the text for now.' });
    const narrationJob = speech.prepareNarration(learnerId, { type: 'lesson', lessonId: context.lessonId }, generation);
    const data = input(learnerId, raw); const existing = state(learnerId, raw); if (existing.jobId) return generation.getJob(learnerId, existing.jobId);
    const id = randomUUID(); const now = Date.now(); reserveUsage(db, 'video', learnerId, id, now); db.insert(schema.jobs).values({ id, learnerId, journeyId: data.journey.id, conceptId: data.row.conceptId, type: 'video', dedupeKey: 'video:' + data.cacheKey, input: { language: data.row.language, readingSupport: data.row.readingSupport, videoLessonId: data.row.id, narrationJobId: narrationJob.id, generationVersion: rendererVersion }, availableAt: now, createdAt: now, updatedAt: now }).run(); return generation.getJob(learnerId, id);
  };
  const execute = async (job: JobRow, signal: AbortSignal) => {
    if (!job.input.videoLessonId || !job.input.narrationJobId) throw new MediaUnavailable('This video request is incomplete. Read the text instead.');
    const { row: lesson } = ownedLesson(job.learnerId, job.input.videoLessonId);
    const dependency = db.select().from(schema.jobs).where(and(eq(schema.jobs.id, job.input.narrationJobId), eq(schema.jobs.learnerId, job.learnerId))).get();
    if (dependency && ['queued', 'running'].includes(dependency.status)) throw new MediaPending('Preparing reviewed narration before video.');
    if (dependency?.status !== 'succeeded' || !dependency.outputId) throw new MediaUnavailable('Narration is unavailable. Retry audio preparation first, then retry video, or read the lesson.');
    const narration = await speech.file(job.learnerId, dependency.outputId);
    if (!narration.row.review.length || narration.row.review.some(review => !review.valid)) throw new MediaUnavailable('Reviewed narration is unavailable. Read the text instead.');
    await withAudioTemp(async directory => {
      const sound = join(directory, 'audio.mp3'); await writeFile(sound, narration.bytes, { mode: 0o600 }); const duration = await audioDuration(sound);
      const segments = narration.row.timings.length ? narration.row.timings : [{ text: narration.row.transcript, start: 0, end: duration }];
      const lastEnd = segments.at(-1)!.end; const slides = timedSlides(segments.map(segment => ({ ...segment, start: segment.start * duration / lastEnd, end: segment.end * duration / lastEnd })), narration.row.sourceIds);
      if (slides.length > 100 || duration > 900) throw new MediaUnavailable('This lesson is too long for demo video. Read or listen instead.');
      for (const [i, slide] of slides.entries()) { signal.throwIfAborted(); await writeFile(join(directory, `${i}.png`), new Resvg(slideSvg(lesson.content.title, slide, i, slides.length), { font: { loadSystemFonts: true, defaultFontFamily: config.VIDEO_FONT_FAMILY } }).render().asPng(), { mode: 0o600 }); }
      const list = join(directory, 'slides.txt'); await writeFile(list, slides.map((slide, i) => `file '${i}.png'\nduration ${(slide.end - slide.start).toFixed(6)}`).join('\n') + `\nfile '${slides.length - 1}.png'\n`);
      const output = join(directory, 'video.mp4'); await ffmpeg(['-protocol_whitelist', 'file,pipe', '-f', 'concat', '-safe', '1', '-i', list, '-i', sound, '-map', '0:v:0', '-map', '1:a:0', '-vf', 'fps=10,format=yuv420p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '30', '-c:a', 'aac', '-b:a', '48k', '-t', duration.toFixed(3), '-movflags', '+faststart', output], signal, 120_000);
      const bytes = (await stat(output)).size; if (bytes > 32 * 1024 * 1024) throw new MediaUnavailable('This video exceeds the demo size limit. Read or listen instead.');
      signal.throwIfAborted(); if (!db.select().from(schema.jobs).where(and(eq(schema.jobs.id, job.id), eq(schema.jobs.status, 'running'))).get()) return;
      const id = randomUUID(); const owner = join(mediaRoot, job.learnerId); const fileName = id + '.mp4'; const captionsFileName = id + '.vtt'; await mkdir(owner, { recursive: true, mode: 0o700 }); await writeFile(join(owner, captionsFileName), captions(slides), { mode: 0o600 }); await rename(output, join(owner, fileName));
      try { db.transaction(tx => { tx.insert(schema.videos).values({ id, learnerId: job.learnerId, lessonId: lesson.id, narrationId: narration.row.id, cacheKey: job.dedupeKey.slice(6), language: lesson.language, transcript: narration.row.transcript, storyboard: slides, sourceIds: narration.row.sourceIds, captionTiming: narration.row.timings.length ? 'chunk' : 'estimated', fileName, captionsFileName, duration: Math.ceil(duration), bytes, createdAt: Date.now() }).run(); tx.update(schema.jobs).set({ status: 'succeeded', outputId: id, updatedAt: Date.now() }).where(eq(schema.jobs.id, job.id)).run(); }); } catch (cause) { await Promise.all([rm(join(owner, fileName), { force: true }), rm(join(owner, captionsFileName), { force: true })]); throw cause; }
    });
  };
  return { state, prepare, execute, file: async (learnerId: string, id: string, kind: 'video' | 'captions') => { const row = db.select().from(schema.videos).where(and(eq(schema.videos.id, id), eq(schema.videos.learnerId, learnerId))).get(); if (!row) throw new HTTPException(404, { message: 'This video could not be found.' }); try { return await readFile(join(mediaRoot, learnerId, kind === 'video' ? row.fileName : row.captionsFileName)); } catch { throw new HTTPException(410, { message: 'This media file is no longer available. Read the transcript instead.' }); } } };
}
export type VideoService = ReturnType<typeof createVideo>;
