import { z } from 'zod';
import { languageSchema } from './preferences.js';

export const lessonGenerationVersion = 2;
export const lessonGenerationVersionForLanguage = (language: z.infer<typeof languageSchema>) => language === 'yo' ? 3 : lessonGenerationVersion;
export const scopeSchema = z.enum(['concept', 'topic', 'goal']);
export const understandingSchema = z.enum(['unknown', 'building', 'needs_practice', 'demonstrated']);
export const questionSchema = z.object({
  id: z.string().min(1), conceptIndex: z.number().int().min(0),
  prompt: z.string().min(1).max(2000),
  options: z.array(z.object({ id: z.string().min(1), text: z.string().min(1).max(1000) })).min(2).max(5),
});
export const privateQuestionSchema = questionSchema.extend({ correctOptionId: z.string(), explanation: z.string().min(1) });
export type Question = z.infer<typeof questionSchema>;
export type PrivateQuestion = z.infer<typeof privateQuestionSchema>;
export const answerMapSchema = z.record(z.string(), z.string().nullable());
export type AnswerMap = z.infer<typeof answerMapSchema>;
export const rubricSchema = z.array(z.object({ id: z.string().min(1), criterion: z.string().min(1), essential: z.boolean() })).min(2).max(5);
export const sourceSchema = z.object({ id: z.string(), title: z.string(), url: z.url(), excerpt: z.string(), retrievedAt: z.number() });
export type Source = z.infer<typeof sourceSchema>;
export const planSchema = z.object({
  title: z.string().min(1).max(120), scope: scopeSchema,
  concepts: z.array(z.object({ title: z.string().min(1).max(120), objective: z.string().min(1).max(800), rubric: rubricSchema })).min(1).max(5),
  questions: z.array(privateQuestionSchema).min(3).max(5),
});
export type LearningPlan = z.infer<typeof planSchema>;
export const journeyContentSchema = z.object({
  title: z.string().min(1).max(150),
  concepts: z.array(z.object({ id: z.uuid(), title: z.string().min(1).max(150), objective: z.string().min(1).max(1000), rubric: rubricSchema })).min(1).max(5),
  questions: z.array(privateQuestionSchema).min(3).max(5),
});
export type JourneyContent = z.infer<typeof journeyContentSchema>;
export const createJourneySchema = z.object({ objective: z.string().trim().min(3).max(600), language: languageSchema, mode: z.enum(['fixture', 'live']), requestId: z.uuid(), transcriptionId: z.uuid().optional() }).strict();
export const journeySchema = z.object({
  id: z.uuid(), objective: z.string(), title: z.string(), scope: scopeSchema, language: languageSchema,
  mode: z.enum(['fixture', 'live']), status: z.enum(['generating', 'assessment', 'learning', 'failed']),
  createdAt: z.number(), updatedAt: z.number(),
  lastConceptId: z.uuid().nullable(),
  contentLanguage: languageSchema.optional(), contentVersion: z.string().optional(), languageReady: z.boolean().default(true),
  concepts: z.array(z.object({ id: z.uuid(), title: z.string(), objective: z.string(), position: z.number(), understanding: understandingSchema })),
});
export type Journey = z.infer<typeof journeySchema>;
export const assessmentSchema = z.object({ journeyId: z.uuid(), language: languageSchema.optional(), questions: z.array(questionSchema), answers: answerMapSchema, spokenAnswers: z.record(z.string(), z.object({ language: languageSchema, recognizedText: z.string(), confirmedText: z.string(), confirmedAt: z.number() })).default({}), status: z.enum(['draft', 'submitted', 'skipped']), score: z.number().nullable(), total: z.number() });
export type Assessment = z.infer<typeof assessmentSchema>;
export const answerUpdateSchema = z.object({ questionId: z.string(), optionId: z.string().nullable(), transcriptionId: z.uuid().optional() }).strict();
export const assessmentSubmitSchema = z.object({ skip: z.boolean().default(false) }).strict();

export const lessonContentSchema = z.object({
  title: z.string().min(1).max(150), summary: z.string().min(1).max(1500),
  sections: z.array(z.object({ heading: z.string().max(150), body: z.string().min(1).max(3000), sourceIds: z.array(z.string()).min(1).max(5) })).min(2).max(5),
  examples: z.array(z.object({ title: z.string().max(150), explanation: z.string().min(1).max(2000), sourceIds: z.array(z.string()).min(1).max(5) })).min(1).max(3),
  glossary: z.array(z.object({ term: z.string().max(100), meaning: z.string().min(1).max(500) })).min(2).max(6),
  visual: z.object({ type: z.enum(['steps', 'cycle', 'comparison']), title: z.string().max(150), items: z.array(z.object({ label: z.string().max(150), detail: z.string().max(600) })).min(2).max(5), sourceIds: z.array(z.string()).min(1).max(5) }),
  practice: z.array(privateQuestionSchema).min(2).max(4),
});
export type LessonContent = z.infer<typeof lessonContentSchema>;
export const lessonSchema = z.object({ id: z.uuid(), conceptId: z.uuid(), language: languageSchema, readingSupport: z.enum(['standard', 'simple']), createdAt: z.number(), content: lessonContentSchema.omit({ practice: true }).extend({ practice: z.array(questionSchema) }), sources: z.array(sourceSchema) });
export type Lesson = z.infer<typeof lessonSchema>;
export const jobSchema = z.object({ id: z.uuid(), journeyId: z.uuid(), conceptId: z.uuid().nullable(), language: languageSchema.optional(), readingSupport: z.enum(['standard', 'simple']).optional(), generationVersion: z.number().int().default(1), contentVersion: z.string().optional(), type: z.enum(['plan', 'lesson', 'explain', 'localize', 'narration', 'video']), status: z.enum(['queued', 'running', 'succeeded', 'failed', 'cancelled']), attempts: z.number(), message: z.string().nullable(), outputId: z.string().nullable(), createdAt: z.number(), updatedAt: z.number() });
export type GenerationJob = z.infer<typeof jobSchema>;
export const practiceInputSchema = z.object({ lessonId: z.uuid(), questionId: z.string(), optionId: z.string().nullable(), requestId: z.uuid() }).strict();
export const practiceAttemptSchema = z.object({ id: z.uuid(), lessonId: z.uuid(), conceptId: z.uuid(), questionId: z.string(), optionId: z.string().nullable(), correct: z.boolean().nullable(), explanation: z.string(), createdAt: z.number() });
export type PracticeAttempt = z.infer<typeof practiceAttemptSchema>;
export const conversationSchema = z.object({ id: z.uuid(), title: z.string(), conceptId: z.uuid().nullable(), createdAt: z.number(), updatedAt: z.number(), sources: z.array(sourceSchema) });
export type Conversation = z.infer<typeof conversationSchema>;
export const turnSchema = z.object({ id: z.uuid(), conversationId: z.uuid(), requestId: z.uuid(), userText: z.string(), assistantText: z.string(), status: z.enum(['streaming', 'completed', 'interrupted', 'failed']), attempts: z.number(), language: languageSchema, createdAt: z.number(), updatedAt: z.number() });
export type TutorTurn = z.infer<typeof turnSchema>;
export const conversationCreateSchema = z.object({ conceptId: z.uuid().nullable().default(null), requestId: z.uuid() }).strict();
export const tutorInputSchema = z.object({ text: z.string().trim().min(1).max(3000), requestId: z.uuid() }).strict();
export const conversationDetailSchema = conversationSchema.extend({ turns: z.array(turnSchema) });
export const tutorEventSchema = z.discriminatedUnion('type', [z.object({ type: z.literal('turn'), turn: turnSchema }), z.object({ type: z.literal('delta'), text: z.string() }), z.object({ type: z.literal('done'), turn: turnSchema }), z.object({ type: z.literal('error'), message: z.string() })]);
