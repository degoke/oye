import { HTTPException } from 'hono/http-exception';
import { and, eq, schema, type OyeDatabase, type OyeTransaction } from '@oye/db';
import type { SpeechContext } from '@oye/shared';

export function verifiedSpeech(db: OyeDatabase, learnerId: string, id: string | undefined, context: SpeechContext, text?: string) {
  if (!id) return null;
  const row = db.select().from(schema.transcriptions).where(and(eq(schema.transcriptions.id, id), eq(schema.transcriptions.learnerId, learnerId))).get();
  if (!row) throw new HTTPException(404, { message: 'This recording could not be found.' });
  if (row.status !== 'ready' || !row.confirmedAt || !row.confirmedText || JSON.stringify(row.context) !== JSON.stringify(context) || text !== undefined && row.confirmedText !== text.trim()) throw new HTTPException(409, { message: 'Confirm the recognized words for this answer first.' });
  if (row.usedFor) throw new HTTPException(409, { message: 'Use a new recording for this answer.' });
  return row;
}
export function attachSpeech(db: OyeDatabase | OyeTransaction, id: string | undefined, usedFor: string, selectedOptionId?: string | null) {
  if (id) db.update(schema.transcriptions).set({ usedFor, ...(selectedOptionId !== undefined ? { selectedOptionId } : {}) }).where(eq(schema.transcriptions.id, id)).run();
}
