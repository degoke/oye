import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { eq, schema, type OyeDatabase } from '@oye/db';

// Missing files invalidate only their cached output. Explicit retry remains required
// before generation spends money. Historical text and learning evidence stay intact.
export async function reconcileMedia(db: OyeDatabase, directory: string) {
  const exists = (owner: string, name: string) => access(join(directory, owner, name)).then(() => true, () => false);
  let missingNarrations = 0, missingVideos = 0, missingVoiceReplies = 0;
  const invalidate = (outputId: string) => db.update(schema.jobs).set({ status: 'failed', outputId: null, message: 'This media file is no longer available. Read the transcript instead.', updatedAt: Date.now() }).where(eq(schema.jobs.outputId, outputId)).run();
  for (const row of db.select().from(schema.videos).all()) {
    if (await exists(row.learnerId, row.fileName) && await exists(row.learnerId, row.captionsFileName)) continue;
    invalidate(row.id); db.delete(schema.videos).where(eq(schema.videos.id, row.id)).run(); missingVideos++;
  }
  for (const row of db.select().from(schema.narrations).all()) {
    if (await exists(row.learnerId, row.fileName)) continue;
    // The FK also removes dependent videos; their jobs must be retryable first.
    for (const video of db.select().from(schema.videos).where(eq(schema.videos.narrationId, row.id)).all()) invalidate(video.id);
    invalidate(row.id); db.delete(schema.narrations).where(eq(schema.narrations.id, row.id)).run(); missingNarrations++;
  }
  for (const row of db.select().from(schema.voiceTurns).all()) {
    if (!row.fileName) continue;
    const session = db.select().from(schema.voiceSessions).where(eq(schema.voiceSessions.id, row.sessionId)).get();
    if (session && await exists(session.learnerId, row.fileName)) continue;
    db.update(schema.voiceTurns).set({ fileName: null, updatedAt: Date.now() }).where(eq(schema.voiceTurns.id, row.id)).run(); missingVoiceReplies++;
  }
  return { missingNarrations, missingVideos, missingVoiceReplies };
}
