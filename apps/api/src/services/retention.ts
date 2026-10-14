import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { eq, lt, schema, type OyeDatabase } from '@oye/db';
import type { GenerationService } from './generation.js';
import type { SpeechService } from './speech.js';
import type { TutorService } from './tutor.js';
import type { VoiceService } from './voice.js';
import { backfillUsage } from './usage.js';

export function createRetention(db: OyeDatabase, services: { voice: VoiceService; tutor: TutorService; generation: GenerationService; speech: SpeechService }, mediaDirectory: string) {
  let timer: ReturnType<typeof setInterval> | undefined; let running: Promise<void> | undefined;
  const sweep = (now = Date.now()) => {
    if (running) return running;
    running = (async () => {
      db.delete(schema.sessions).where(lt(schema.sessions.expiresAt, now)).run();
      const stale = db.select().from(schema.learners).where(lt(schema.learners.updatedAt, now - 30 * 86400000)).all();
      for (const learner of stale) {
        if (db.select().from(schema.sessions).where(eq(schema.sessions.learnerId, learner.id)).get()) continue;
        services.voice.clearOwner(learner.id); services.generation.clearOwner(learner.id); services.tutor.clearOwner(learner.id);
        await services.speech.clearOwner(learner.id);
        db.delete(schema.learners).where(eq(schema.learners.id, learner.id)).run();
      }
      // Recover orphaned published files left by a crash between filesystem and DB changes.
      const owners = new Set(db.select().from(schema.learners).all().map(row => row.id));
      for (const entry of await readdir(mediaDirectory, { withFileTypes: true }).catch(() => [])) if (entry.isDirectory() && /^[a-f0-9-]{36}$/.test(entry.name) && !owners.has(entry.name)) await rm(join(mediaDirectory, entry.name), { recursive: true, force: true });
      backfillUsage(db);
    })().finally(() => { running = undefined; });
    return running;
  };
  return { sweep, start: () => { timer = setInterval(() => { void sweep().catch(() => console.warn('Retention cleanup deferred.')); }, 600000); timer.unref(); }, stop: async () => { clearInterval(timer); await running; } };
}
