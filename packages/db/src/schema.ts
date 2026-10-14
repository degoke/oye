import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import type { Preferences, PrivateQuestion, AnswerMap, LearningPlan, Source, LessonContent, ExplainEvaluation, ApplicationEvaluation, JourneyContent } from '@oye/shared';

export const learners = sqliteTable('learners', {
  id: text('id').primaryKey(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
export const sessions = sqliteTable('sessions', {
  tokenHash: text('token_hash').primaryKey(),
  learnerId: text('learner_id').notNull().references(() => learners.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
}, table => [index('sessions_learner_idx').on(table.learnerId), index('sessions_expiry_idx').on(table.expiresAt)]);
export const preferences = sqliteTable('preferences', {
  learnerId: text('learner_id').primaryKey().references(() => learners.id, { onDelete: 'cascade' }),
  data: text('data', { mode: 'json' }).$type<Preferences>().notNull(),
});

export const journeys = sqliteTable('journeys', {
  id: text('id').primaryKey(),
  learnerId: text('learner_id').notNull().references(() => learners.id, { onDelete: 'cascade' }),
  requestId: text('request_id').notNull(),
  objective: text('objective').notNull(), title: text('title').notNull(),
  scope: text('scope', { enum: ['concept', 'topic', 'goal'] }).notNull(),
  language: text('language', { enum: ['en', 'yo', 'ha', 'ig'] }).notNull(),
  mode: text('mode', { enum: ['fixture', 'live'] }).notNull(),
  status: text('status', { enum: ['generating', 'assessment', 'learning', 'failed'] }).notNull(),
  lastConceptId: text('last_concept_id'),
  sources: text('sources', { mode: 'json' }).$type<Source[]>().notNull().default([]),
  createdAt: integer('created_at').notNull(), updatedAt: integer('updated_at').notNull(),
}, table => [index('journeys_owner_idx').on(table.learnerId)]);
export const concepts = sqliteTable('concepts', {
  id: text('id').primaryKey(), journeyId: text('journey_id').notNull().references(() => journeys.id, { onDelete: 'cascade' }),
  title: text('title').notNull(), objective: text('objective').notNull(), position: integer('position').notNull(),
  rubric: text('rubric', { mode: 'json' }).$type<LearningPlan['concepts'][number]['rubric']>().notNull(),
  understanding: text('understanding', { enum: ['unknown', 'building', 'needs_practice', 'demonstrated'] }).notNull().default('unknown'),
}, table => [index('concepts_journey_idx').on(table.journeyId)]);
export const assessments = sqliteTable('assessments', {
  journeyId: text('journey_id').primaryKey().references(() => journeys.id, { onDelete: 'cascade' }),
  questions: text('questions', { mode: 'json' }).$type<PrivateQuestion[]>().notNull(),
  answers: text('answers', { mode: 'json' }).$type<AnswerMap>().notNull(),
  status: text('status', { enum: ['draft', 'submitted', 'skipped'] }).notNull().default('draft'),
  score: integer('score'), submittedAt: integer('submitted_at'),
});
export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(), conceptId: text('concept_id').notNull().references(() => concepts.id, { onDelete: 'cascade' }),
  language: text('language', { enum: ['en', 'yo', 'ha', 'ig'] }).notNull(),
  readingSupport: text('reading_support', { enum: ['standard', 'simple'] }).notNull(),
  generationVersion: integer('generation_version').notNull().default(1),
  content: text('content', { mode: 'json' }).$type<LessonContent>().notNull(),
  createdAt: integer('created_at').notNull(),
}, table => [uniqueIndex('lessons_version_idx').on(table.conceptId, table.language, table.readingSupport, table.generationVersion)]);
export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey(), learnerId: text('learner_id').notNull().references(() => learners.id, { onDelete: 'cascade' }),
  journeyId: text('journey_id').notNull().references(() => journeys.id, { onDelete: 'cascade' }),
  conceptId: text('concept_id').references(() => concepts.id, { onDelete: 'cascade' }),
  dedupeKey: text('dedupe_key').notNull(),
  type: text('type', { enum: ['plan', 'lesson', 'explain', 'localize', 'narration', 'video'] }).notNull(),
  status: text('status', { enum: ['queued', 'running', 'succeeded', 'failed', 'cancelled'] }).notNull().default('queued'),
  input: text('input', { mode: 'json' }).$type<{ language: 'en' | 'yo' | 'ha' | 'ig'; readingSupport: 'standard' | 'simple'; generationVersion?: number; contentVersion?: string; attemptId?: string; phase?: 'explore' | 'application'; revision?: number; narrationContext?: import('@oye/shared').NarrationContext; narrationScript?: string; narrationSourceIds?: string[]; narrationModel?: string; narrationVoice?: string; narrationSTTModel?: string; videoLessonId?: string; narrationJobId?: string }>().notNull(),
  attempts: integer('attempts').notNull().default(0), availableAt: integer('available_at').notNull(),
  message: text('message'), outputId: text('output_id'), createdAt: integer('created_at').notNull(), updatedAt: integer('updated_at').notNull(),
}, table => [uniqueIndex('jobs_dedupe_idx').on(table.learnerId, table.dedupeKey), index('jobs_pending_idx').on(table.status, table.availableAt)]);
export const practiceAttempts = sqliteTable('practice_attempts', {
  id: text('id').primaryKey(), learnerId: text('learner_id').notNull().references(() => learners.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  conceptId: text('concept_id').notNull().references(() => concepts.id, { onDelete: 'cascade' }),
  requestId: text('request_id').notNull(), questionId: text('question_id').notNull(), optionId: text('option_id'),
  correct: integer('correct', { mode: 'boolean' }), explanation: text('explanation').notNull(), createdAt: integer('created_at').notNull(),
}, table => [uniqueIndex('practice_request_idx').on(table.learnerId, table.requestId), index('practice_concept_idx').on(table.conceptId)]);
export const conversations = sqliteTable('conversations', {
  id: text('id').primaryKey(), learnerId: text('learner_id').notNull().references(() => learners.id, { onDelete: 'cascade' }),
  requestId: text('request_id').notNull(), conceptId: text('concept_id').references(() => concepts.id, { onDelete: 'cascade' }),
  title: text('title').notNull(), sources: text('sources', { mode: 'json' }).$type<Source[]>().notNull().default([]),
  createdAt: integer('created_at').notNull(), updatedAt: integer('updated_at').notNull(),
}, table => [uniqueIndex('conversation_request_idx').on(table.learnerId, table.requestId)]);
export const tutorTurns = sqliteTable('tutor_turns', {
  id: text('id').primaryKey(), conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  requestId: text('request_id').notNull(), userText: text('user_text').notNull(), assistantText: text('assistant_text').notNull().default(''),
  language: text('language', { enum: ['en', 'yo', 'ha', 'ig'] }).notNull(),
  status: text('status', { enum: ['streaming', 'completed', 'interrupted', 'failed'] }).notNull(), attempts: integer('attempts').notNull().default(1),
  createdAt: integer('created_at').notNull(), updatedAt: integer('updated_at').notNull(),
}, table => [uniqueIndex('tutor_request_idx').on(table.conversationId, table.requestId)]);
export const explainAttempts = sqliteTable('explain_attempts', {
  id: text('id').primaryKey(), learnerId: text('learner_id').notNull().references(() => learners.id, { onDelete: 'cascade' }),
  conceptId: text('concept_id').notNull().references(() => concepts.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  requestId: text('request_id').notNull(), language: text('language', { enum: ['en', 'yo', 'ha', 'ig'] }).notNull(),
  rubricVersion: text('rubric_version').notNull(), rubric: text('rubric', { mode: 'json' }).$type<LearningPlan['concepts'][number]['rubric']>().notNull(),
  sources: text('sources', { mode: 'json' }).$type<Source[]>().notNull(), explanation: text('explanation').notNull(),
  answers: text('answers', { mode: 'json' }).$type<{ question: string; answer: string; requestId: string }[]>().notNull().default([]),
  revision: integer('revision').notNull().default(0),
  status: text('status', { enum: ['processing', 'followup', 'feedback', 'completed'] }).notNull(), question: text('question'),
  evaluation: text('evaluation', { mode: 'json' }).$type<ExplainEvaluation>(),
  applicationAnswer: text('application_answer'), applicationRequestId: text('application_request_id'),
  applicationEvaluation: text('application_evaluation', { mode: 'json' }).$type<ApplicationEvaluation>(),
  understanding: text('understanding', { enum: ['unknown', 'building', 'needs_practice', 'demonstrated'] }).notNull().default('unknown'),
  jobId: text('job_id').notNull(), createdAt: integer('created_at').notNull(), updatedAt: integer('updated_at').notNull(),
}, table => [uniqueIndex('explain_request_idx').on(table.learnerId, table.requestId), index('explain_concept_idx').on(table.conceptId)]);

export const journeyVersions = sqliteTable('journey_versions', {
  id: text('id').primaryKey(), journeyId: text('journey_id').notNull().references(() => journeys.id, { onDelete: 'cascade' }),
  language: text('language', { enum: ['en', 'yo', 'ha', 'ig'] }).notNull(),
  canonicalVersion: text('canonical_version').notNull(),
  content: text('content', { mode: 'json' }).$type<JourneyContent>().notNull(),
  model: text('model').notNull(), review: text('review').notNull(), createdAt: integer('created_at').notNull(),
}, table => [uniqueIndex('journey_language_version_idx').on(table.journeyId, table.language, table.canonicalVersion)]);

export const narrations = sqliteTable('narrations', {
  id: text('id').primaryKey(), learnerId: text('learner_id').notNull().references(() => learners.id, { onDelete: 'cascade' }),
  journeyId: text('journey_id').notNull().references(() => journeys.id, { onDelete: 'cascade' }),
  cacheKey: text('cache_key').notNull(), language: text('language', { enum: ['en', 'yo', 'ha', 'ig'] }).notNull(),
  transcript: text('transcript').notNull(), sourceIds: text('source_ids', { mode: 'json' }).$type<string[]>().notNull(),
  review: text('review', { mode: 'json' }).$type<{ model: string; recognized: string; valid: boolean; reason: string }[]>().notNull().default([]),
  timings: text('timings', { mode: 'json' }).$type<{ text: string; start: number; end: number }[]>().notNull().default([]),
  model: text('model').notNull(), voice: text('voice').notNull(), fileName: text('file_name').notNull(),
  duration: integer('duration', { mode: 'number' }).notNull(), bytes: integer('bytes').notNull(), createdAt: integer('created_at').notNull(),
}, table => [uniqueIndex('narration_cache_idx').on(table.learnerId, table.cacheKey)]);

export const videos = sqliteTable('videos', {
  id: text('id').primaryKey(), learnerId: text('learner_id').notNull().references(() => learners.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  narrationId: text('narration_id').notNull().references(() => narrations.id, { onDelete: 'cascade' }),
  cacheKey: text('cache_key').notNull(), language: text('language', { enum: ['en', 'yo', 'ha', 'ig'] }).notNull(),
  transcript: text('transcript').notNull(), storyboard: text('storyboard', { mode: 'json' }).$type<import('@oye/shared').VideoSlide[]>().notNull(),
  sourceIds: text('source_ids', { mode: 'json' }).$type<string[]>().notNull(),
  captionTiming: text('caption_timing', { enum: ['chunk', 'estimated'] }).notNull(),
  fileName: text('file_name').notNull(), captionsFileName: text('captions_file_name').notNull(),
  duration: integer('duration').notNull(), bytes: integer('bytes').notNull(), createdAt: integer('created_at').notNull(),
}, table => [uniqueIndex('video_cache_idx').on(table.learnerId, table.cacheKey)]);

export const transcriptions = sqliteTable('transcriptions', {
  id: text('id').primaryKey(), learnerId: text('learner_id').notNull().references(() => learners.id, { onDelete: 'cascade' }),
  requestId: text('request_id').notNull(), context: text('context', { mode: 'json' }).$type<import('@oye/shared').SpeechContext>().notNull(),
  language: text('language', { enum: ['en', 'yo', 'ha', 'ig'] }).notNull(),
  text: text('text').notNull(), confirmedText: text('confirmed_text'), confirmedAt: integer('confirmed_at'),
  duration: integer('duration', { mode: 'number' }).notNull(), model: text('model').notNull(),
  usedFor: text('used_for'), selectedOptionId: text('selected_option_id'),
  status: text('status', { enum: ['processing', 'ready', 'failed'] }).notNull(), createdAt: integer('created_at').notNull(),
}, table => [uniqueIndex('transcription_request_idx').on(table.learnerId, table.requestId)]);

export const voiceSessions = sqliteTable('voice_sessions', {
  id: text('id').primaryKey(), learnerId: text('learner_id').notNull().references(() => learners.id, { onDelete: 'cascade' }),
  requestId: text('request_id').notNull(), context: text('context', { mode: 'json' }).$type<import('@oye/shared').VoiceContext>().notNull(),
  lessonId: text('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
  language: text('language', { enum: ['en', 'yo', 'ha', 'ig'] }).notNull(), provider: text('provider', { enum: ['openrouter', 'openai'] }).notNull(),
  transport: text('transport', { enum: ['pipeline', 'openai-realtime'] }).notNull(),
  status: text('status', { enum: ['ready', 'active', 'disconnected', 'closed'] }).notNull().default('ready'),
  credentialHash: text('credential_hash'), credentialExpiresAt: integer('credential_expires_at'), expiresAt: integer('expires_at').notNull(),
  turns: integer('turns').notNull().default(0), inputMilliseconds: integer('input_milliseconds').notNull().default(0),
  createdAt: integer('created_at').notNull(), updatedAt: integer('updated_at').notNull(),
}, table => [uniqueIndex('voice_request_idx').on(table.learnerId, table.requestId), index('voice_expiry_idx').on(table.expiresAt)]);

export const voiceTurns = sqliteTable('voice_turns', {
  id: text('id').primaryKey(), sessionId: text('session_id').notNull().references(() => voiceSessions.id, { onDelete: 'cascade' }),
  transcriptionId: text('transcription_id').references(() => transcriptions.id, { onDelete: 'set null' }),
  tutorTurnId: text('tutor_turn_id').references(() => tutorTurns.id, { onDelete: 'set null' }),
  recognizedText: text('recognized_text').notNull().default(''), assistantText: text('assistant_text').notNull().default(''),
  status: text('status', { enum: ['recognizing', 'awaiting_confirmation', 'replying', 'completed', 'interrupted', 'failed'] }).notNull(),
  fileName: text('file_name'), duration: integer('duration'), model: text('model'),
  review: text('review', { mode: 'json' }).$type<{ model: string; recognized: string; valid: boolean; reason: string }[]>().notNull().default([]),
  createdAt: integer('created_at').notNull(), updatedAt: integer('updated_at').notNull(),
}, table => [index('voice_turn_session_idx').on(table.sessionId)]);

// No learner foreign key: aggregate budget reservations survive clear-history.
// Contains no learning text, credentials or raw learner identifier.
export const usageReservations = sqliteTable('usage_reservations', {
  id: text('id').primaryKey(), kind: text('kind').notNull(), ownerHash: text('owner_hash'), createdAt: integer('created_at').notNull(),
}, table => [index('usage_kind_time_idx').on(table.kind, table.createdAt)]);
