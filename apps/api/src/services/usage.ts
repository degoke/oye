import { createHash, randomUUID } from 'node:crypto';
import { HTTPException } from 'hono/http-exception';
import { eq, lt, schema, type OyeDatabase, type OyeTransaction } from '@oye/db';
const day = 86400000;
export const ownerUsageHash = (owner: string) => createHash('sha256').update('oye-usage:' + owner).digest('hex');
const limits: Record<string, { global: number; owner?: number }> = {
  voice: { global: 20, owner: 8 }, transcription: { global: 120, owner: 24 }, narration: { global: 36, owner: 24 }, video: { global: 24, owner: 12 },
  'provider-text': { global: 320 }, 'provider-search': { global: 24 }, 'provider-tts': { global: 96 }, 'provider-stt': { global: 160 }, 'provider-native': { global: 24 },
};
export function reserveUsage(db: OyeDatabase | OyeTransaction, kind: string, owner?: string, id = randomUUID(), now = Date.now()) {
  return db.transaction(tx => {
  const reservationId = kind + ':' + id; if (tx.select().from(schema.usageReservations).where(eq(schema.usageReservations.id, reservationId)).get()) return;
  const ownerHash = owner ? ownerUsageHash(owner) : null; const policy = limits[kind]; if (!policy) throw new Error('Unknown usage category');
  const recent = tx.select().from(schema.usageReservations).where(eq(schema.usageReservations.kind, kind)).all().filter(row => row.createdAt > now - day);
  if (recent.length >= policy.global || ownerHash && policy.owner && recent.filter(row => row.ownerHash === ownerHash).length >= policy.owner) throw new HTTPException(429, { message: 'The demo usage limit has been reached. Read saved text for now.' });
  tx.insert(schema.usageReservations).values({ id: reservationId, kind, ownerHash, createdAt: now }).run();
  });
}
export function backfillUsage(db: OyeDatabase) {
  // Backfill existing operation reservations once, including failed requests. Idempotent on restart.
  db.transaction(tx => {
    const add = (kind: string, id: string, owner: string, createdAt: number) => { if (createdAt > Date.now() - 31 * day) tx.insert(schema.usageReservations).values({ id: kind + ':' + id, kind, ownerHash: ownerUsageHash(owner), createdAt }).onConflictDoNothing().run(); };
    for (const row of tx.select().from(schema.voiceSessions).all()) add('voice', row.id, row.learnerId, row.createdAt);
    for (const row of tx.select().from(schema.transcriptions).all()) add('transcription', row.id, row.learnerId, row.createdAt);
    for (const row of tx.select().from(schema.jobs).all()) if (['narration', 'video'].includes(row.type)) add(row.type, row.id, row.learnerId, row.createdAt);
  });
  db.delete(schema.usageReservations).where(lt(schema.usageReservations.createdAt, Date.now() - 31 * day)).run();
}
