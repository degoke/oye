import { z } from 'zod';
import { languageSchema } from './preferences.js';
import { rubricSchema, sourceSchema, understandingSchema } from './learning.js';

export const findingSchema = z.object({
  criterionId: z.string(), status: z.enum(['met', 'missing', 'misconception', 'uncertain']),
  answerIndex: z.number().int().min(0).max(2), quote: z.string().max(800).nullable(),
  explanation: z.string().min(1).max(1200), certainty: z.enum(['high', 'limited']),
});
export const explainEvaluationSchema = z.object({
  findings: z.array(findingSchema).min(2).max(5),
  summary: z.string().min(1).max(1500),
  followup: z.string().min(1).max(1500).nullable(),
  repair: z.object({ heading: z.string().max(150), body: z.string().min(1).max(2200), example: z.string().max(1500), sourceIds: z.array(z.string()).min(1).max(5) }).nullable(),
  application: z.object({ question: z.string().min(1).max(1800), expectedAnswer: z.string().min(1).max(1500), sourceIds: z.array(z.string()).min(1).max(5) }),
});
export type ExplainEvaluation = z.infer<typeof explainEvaluationSchema>;
export const applicationEvaluationSchema = z.object({ correct: z.boolean().nullable(), quote: z.string().max(1500).nullable(), explanation: z.string().min(1).max(1500), certainty: z.enum(['high', 'limited']) });
export type ApplicationEvaluation = z.infer<typeof applicationEvaluationSchema>;
export const explainAnswerSchema = z.object({ question: z.string(), answer: z.string(), requestId: z.uuid() });
export const explainStateSchema = z.object({
  id: z.uuid(), lessonId: z.uuid(), conceptId: z.uuid(), language: languageSchema,
  rubricVersion: z.string(), rubric: rubricSchema, sources: z.array(sourceSchema),
  explanation: z.string(), answers: z.array(explainAnswerSchema).max(2),
  revision: z.number().int(), status: z.enum(['processing', 'followup', 'feedback', 'completed']),
  question: z.string().nullable(),
  evaluation: explainEvaluationSchema.omit({ application: true }).extend({ application: explainEvaluationSchema.shape.application.omit({ expectedAnswer: true }) }).nullable(),
  applicationAnswer: z.string().nullable(), applicationEvaluation: applicationEvaluationSchema.nullable(),
  understanding: understandingSchema, jobId: z.uuid(), createdAt: z.number(), updatedAt: z.number(),
});
export type ExplainState = z.infer<typeof explainStateSchema>;
export const explainCreateSchema = z.object({ lessonId: z.uuid(), explanation: z.string().trim().min(3).max(6000), requestId: z.uuid(), transcriptionId: z.uuid().optional() }).strict();
export const explainRespondSchema = z.object({ answer: z.string().trim().min(1).max(4000), revision: z.number().int().min(0), requestId: z.uuid(), transcriptionId: z.uuid().optional() }).strict();
export const progressSchema = z.array(z.object({ journeyId: z.uuid(), journeyTitle: z.string(), conceptId: z.uuid(), conceptTitle: z.string(), understanding: understandingSchema, viewed: z.boolean(), practiceCount: z.number(), attempts: z.array(explainStateSchema), nextStep: z.string() }));
