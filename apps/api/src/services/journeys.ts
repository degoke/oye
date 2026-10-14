import { verifiedSpeech, attachSpeech } from './speech-evidence.js';
import { randomUUID } from 'node:crypto';
import { HTTPException } from 'hono/http-exception';
import { and, asc, desc, eq, schema, type OyeDatabase, type OyeTransaction } from '@oye/db';
import { assessmentSchema, answerUpdateSchema, createJourneySchema, journeySchema, planSchema, questionSchema, type LearningPlan, type Source } from '@oye/shared';
import { fixturePlan } from './fixtures.js';
import { canonicalContent, contentVersion, localizedContent } from './localization.js';
import { readPreferences } from './session.js';

export function ownedJourney(db: OyeDatabase, learnerId: string, id: string) {
  const row = db.select().from(schema.journeys).where(and(eq(schema.journeys.id, id), eq(schema.journeys.learnerId, learnerId))).get();
  if (!row) throw new HTTPException(404, { message: 'This learning journey could not be found.' });
  return row;
}
export function journeyDetail(db: OyeDatabase, learnerId: string, id: string) {
  const row = ownedJourney(db, learnerId, id);
  const language = readPreferences(db, learnerId).language;
  const translated = localizedContent(db, row, language);
  const canonical = canonicalContent(db, row);
  const concepts = db.select().from(schema.concepts).where(eq(schema.concepts.journeyId, id)).orderBy(asc(schema.concepts.position)).all();
  return journeySchema.parse({ ...row, contentVersion: canonical ? contentVersion(canonical, row.sources, language) : undefined, title: translated?.title || row.title, contentLanguage: translated ? row.mode === 'fixture' ? 'en' : language : row.language, languageReady: row.status === 'generating' || row.status === 'failed' || !!translated, concepts: concepts.map(c => ({ ...c, ...(translated?.concepts.find(t => t.id === c.id) || {}) })) });
}
export function listJourneys(db: OyeDatabase, learnerId: string) {
  return db.select().from(schema.journeys).where(eq(schema.journeys.learnerId, learnerId)).orderBy(desc(schema.journeys.updatedAt)).limit(50).all().map(j => journeyDetail(db, learnerId, j.id));
}
export function publishPlan(db: OyeDatabase | OyeTransaction, id: string, input: LearningPlan, sources: Source[], now: number) {
  const plan = planSchema.parse(input);
  if (plan.questions.some(q => q.conceptIndex >= plan.concepts.length || !q.options.some(o => o.id === q.correctOptionId)) || new Set(plan.questions.map(q => q.id)).size !== plan.questions.length) throw new Error('Invalid plan references');
  db.transaction(tx => {
    const row = tx.select().from(schema.journeys).where(eq(schema.journeys.id, id)).get();
    if (!row || row.status === 'assessment' || row.status === 'learning') return;
    plan.concepts.forEach((concept, position) => tx.insert(schema.concepts).values({ ...concept, id: randomUUID(), journeyId: id, position }).run());
    tx.insert(schema.assessments).values({ journeyId: id, questions: plan.questions, answers: {} }).run();
    tx.update(schema.journeys).set({ title: plan.title, scope: plan.scope, sources, status: 'assessment', updatedAt: now }).where(eq(schema.journeys.id, id)).run();
  });
}
export function createJourney(db: OyeDatabase, learnerId: string, input: unknown, now: number, fixturesEnabled: boolean) {
  const data = createJourneySchema.parse(input);
  const existing = db.select().from(schema.journeys).where(and(eq(schema.journeys.learnerId, learnerId), eq(schema.journeys.requestId, data.requestId))).get();
  if (existing) {
    if (existing.objective !== data.objective || existing.language !== data.language || existing.mode !== data.mode) throw new HTTPException(409, { message: 'This saved request contains a different objective.' });
    return journeyDetail(db, learnerId, existing.id);
  }
  if (data.mode === 'fixture' && !fixturesEnabled) throw new HTTPException(403, { message: 'Development examples are disabled.' });
  if (listJourneys(db, learnerId).length >= 50) throw new HTTPException(429, { message: 'You have reached the demo limit of 50 journeys. Clear history to start again.' });
  verifiedSpeech(db, learnerId, data.transcriptionId, { type: 'objective', language: data.language }, data.objective);
  const id = randomUUID();
  db.transaction(tx => {
    tx.insert(schema.journeys).values({ id, learnerId, requestId: data.requestId, objective: data.objective, language: data.language, title: data.objective, scope: 'concept', mode: data.mode, status: 'generating', createdAt: now, updatedAt: now }).run();
    attachSpeech(tx, data.transcriptionId, `journey:${id}:objective`);
    if (data.mode === 'fixture') publishPlan(db, id, fixturePlan(data.objective), [], now);
  });
  return journeyDetail(db, learnerId, id);
}
export function readAssessment(db: OyeDatabase, learnerId: string, id: string) {
  const journey = ownedJourney(db, learnerId, id);
  const row = db.select().from(schema.assessments).where(eq(schema.assessments.journeyId, id)).get();
  if (!row) throw new HTTPException(409, { message: 'Your starting questions are still being prepared.' });
  const language = readPreferences(db, learnerId).language;
  const content = localizedContent(db, journey, language);
  const spokenAnswers: Record<string, { language: 'en' | 'yo' | 'ha' | 'ig'; recognizedText: string; confirmedText: string; confirmedAt: number }> = {};
  for (const receipt of db.select().from(schema.transcriptions).where(eq(schema.transcriptions.learnerId, learnerId)).orderBy(desc(schema.transcriptions.createdAt)).all()) {
    const context = receipt.context;
    if (context.type === 'assessment' && context.journeyId === id && receipt.usedFor === `assessment:${id}:${context.questionId}` && receipt.selectedOptionId === row.answers[context.questionId] && receipt.confirmedText && receipt.confirmedAt && !spokenAnswers[context.questionId]) spokenAnswers[context.questionId] = { language: receipt.language, recognizedText: receipt.text, confirmedText: receipt.confirmedText, confirmedAt: receipt.confirmedAt };
  }
  return assessmentSchema.parse({ ...row, spokenAnswers, language: content ? journey.mode === 'fixture' ? 'en' : language : journey.language, questions: (content?.questions || row.questions).map(q => questionSchema.parse(q)), total: row.questions.length });
}
export function updateAnswer(db: OyeDatabase, learnerId: string, id: string, input: unknown, now: number) {
  const update = answerUpdateSchema.parse(input);
  const assessment = readAssessment(db, learnerId, id);
  if (assessment.status !== 'draft') throw new HTTPException(409, { message: 'This assessment has already been saved.' });
  const question = assessment.questions.find(q => q.id === update.questionId);
  if (!question || update.optionId !== null && !question.options.some(o => o.id === update.optionId)) throw new HTTPException(400, { message: 'Choose one of the available answers.' });
  if (update.transcriptionId) {
    const receipt = db.select().from(schema.transcriptions).where(and(eq(schema.transcriptions.id, update.transcriptionId), eq(schema.transcriptions.learnerId, learnerId))).get();
    if (receipt?.usedFor === `assessment:${id}:${update.questionId}` && receipt.selectedOptionId === update.optionId && assessment.answers[update.questionId] === update.optionId) return assessment;
  }
  verifiedSpeech(db, learnerId, update.transcriptionId, { type: 'assessment', journeyId: id, questionId: update.questionId });
  db.transaction(tx => {
    tx.update(schema.assessments).set({ answers: { ...assessment.answers, [update.questionId]: update.optionId } }).where(eq(schema.assessments.journeyId, id)).run();
    tx.update(schema.journeys).set({ updatedAt: now }).where(eq(schema.journeys.id, id)).run();
    attachSpeech(tx, update.transcriptionId, `assessment:${id}:${update.questionId}`, update.optionId);
  });
  return readAssessment(db, learnerId, id);
}
export function submitAssessment(db: OyeDatabase, learnerId: string, id: string, skip: boolean, now: number) {
  const assessment = readAssessment(db, learnerId, id);
  if (assessment.status !== 'draft') return journeyDetail(db, learnerId, id);
  if (!skip && assessment.questions.some(q => !Object.hasOwn(assessment.answers, q.id))) throw new HTTPException(400, { message: 'Answer each question or choose "I don\'t know yet".' });
  const privateRow = db.select().from(schema.assessments).where(eq(schema.assessments.journeyId, id)).get()!;
  const score = skip ? null : privateRow.questions.filter(q => privateRow.answers[q.id] === q.correctOptionId).length;
  db.transaction(tx => {
    tx.update(schema.assessments).set({ status: skip ? 'skipped' : 'submitted', score, submittedAt: now }).where(eq(schema.assessments.journeyId, id)).run();
    tx.update(schema.journeys).set({ status: 'learning', updatedAt: now }).where(eq(schema.journeys.id, id)).run();
  });
  return journeyDetail(db, learnerId, id);
}
