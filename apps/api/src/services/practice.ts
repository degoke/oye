import { randomUUID } from 'node:crypto';
import { HTTPException } from 'hono/http-exception';
import { and, desc, eq, schema, type OyeDatabase } from '@oye/db';
import { practiceAttemptSchema, practiceInputSchema } from '@oye/shared';
import { ownedConcept } from './generation.js';

export function visitConcept(db: OyeDatabase, learnerId: string, conceptId: string, now: number) {
  const { journey } = ownedConcept(db, learnerId, conceptId);
  if (journey.status !== 'learning') throw new HTTPException(409, { message: 'Complete your starting questions first.' });
  db.update(schema.journeys).set({ lastConceptId: conceptId, updatedAt: now }).where(eq(schema.journeys.id, journey.id)).run();
  return { saved: true };
}
export function readPractice(db: OyeDatabase, learnerId: string, conceptId: string) {
  ownedConcept(db, learnerId, conceptId);
  return db.select().from(schema.practiceAttempts).where(and(eq(schema.practiceAttempts.learnerId, learnerId), eq(schema.practiceAttempts.conceptId, conceptId))).orderBy(desc(schema.practiceAttempts.createdAt)).limit(100).all().map(a => practiceAttemptSchema.parse(a));
}
export function savePractice(db: OyeDatabase, learnerId: string, conceptId: string, input: unknown, now: number) {
  const data = practiceInputSchema.parse(input);
  ownedConcept(db, learnerId, conceptId);
  const existing = db.select().from(schema.practiceAttempts).where(and(eq(schema.practiceAttempts.learnerId, learnerId), eq(schema.practiceAttempts.requestId, data.requestId))).get();
  if (existing) {
    if (existing.conceptId !== conceptId || existing.lessonId !== data.lessonId || existing.questionId !== data.questionId || existing.optionId !== data.optionId) throw new HTTPException(409, { message: 'This saved answer belongs to a different question. Please try again.' });
    return practiceAttemptSchema.parse(existing);
  }
  const lesson = db.select().from(schema.lessons).where(and(eq(schema.lessons.id, data.lessonId), eq(schema.lessons.conceptId, conceptId))).get();
  if (!lesson) throw new HTTPException(404, { message: 'This lesson could not be found.' });
  const question = lesson.content.practice.find(q => q.id === data.questionId);
  if (!question || data.optionId !== null && !question.options.some(o => o.id === data.optionId)) throw new HTTPException(400, { message: 'Choose an available answer or say you are unsure.' });
  const attempt = { ...data, id: randomUUID(), learnerId, conceptId, correct: data.optionId === null ? null : data.optionId === question.correctOptionId, explanation: question.explanation, createdAt: now };
  db.transaction(tx => {
    tx.insert(schema.practiceAttempts).values(attempt).run();
    // Ordinary practice can show developing knowledge. Independent evidence is still required for demonstrated.
    if (attempt.correct !== null) tx.update(schema.concepts).set({ understanding: attempt.correct ? 'building' : 'needs_practice' }).where(and(eq(schema.concepts.id, conceptId), eq(schema.concepts.understanding, 'unknown'))).run();
  });
  return practiceAttemptSchema.parse(attempt);
}
