import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { eq, schema, type OyeDatabase } from '@oye/db';
import { preferencesSchema, preferenceUpdateSchema } from '@oye/shared';

const lifetime = 30 * 24 * 60 * 60 * 1000;
export const hashSessionToken = (token: string) => createHash('sha256').update(token).digest('hex');
export function resolveSession(db: OyeDatabase, token: string | undefined, now: number) {
  const hash = token ? hashSessionToken(token) : undefined;
  const found = hash ? db.select().from(schema.sessions).where(eq(schema.sessions.tokenHash, hash)).get() : undefined;
  if (found && found.expiresAt > now) {
    const expiresAt = now + lifetime;
    db.update(schema.sessions).set({ expiresAt }).where(eq(schema.sessions.tokenHash, found.tokenHash)).run();
    db.update(schema.learners).set({ updatedAt: now }).where(eq(schema.learners.id, found.learnerId)).run();
    return { token: token!, learnerId: found.learnerId, expiresAt };
  }
  const newToken = randomBytes(32).toString('base64url');
  const learnerId = randomUUID();
  const expiresAt = now + lifetime;
  db.transaction(tx => {
    tx.insert(schema.learners).values({ id: learnerId, createdAt: now, updatedAt: now }).run();
    tx.insert(schema.preferences).values({ learnerId, data: preferencesSchema.parse({}) }).run();
    tx.insert(schema.sessions).values({ tokenHash: hashSessionToken(newToken), learnerId, expiresAt }).run();
  });
  return { token: newToken, learnerId, expiresAt };
}
export function readPreferences(db: OyeDatabase, learnerId: string) {
  const row = db.select().from(schema.preferences).where(eq(schema.preferences.learnerId, learnerId)).get();
  if (!row) throw new Error('Missing learner preferences');
  return preferencesSchema.parse(row.data);
}
export function updatePreferences(db: OyeDatabase, learnerId: string, input: unknown) {
  const patch = preferenceUpdateSchema.parse(input);
  const data = preferencesSchema.parse({ ...readPreferences(db, learnerId), ...patch });
  db.update(schema.preferences).set({ data }).where(eq(schema.preferences.learnerId, learnerId)).run();
  return data;
}
export function clearLearner(db: OyeDatabase, learnerId: string) {
  db.delete(schema.learners).where(eq(schema.learners.id, learnerId)).run();
}
