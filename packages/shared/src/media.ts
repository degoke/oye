import { z } from 'zod';
import { languageSchema } from './preferences.js';

export const speechContextSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('objective'), language: languageSchema }).strict(),
  z.object({ type: z.literal('assessment'), journeyId: z.uuid(), questionId: z.string().min(1).max(100) }).strict(),
  z.object({ type: z.literal('explain'), lessonId: z.uuid() }).strict(),
  z.object({ type: z.literal('response'), attemptId: z.uuid(), revision: z.number().int().min(0) }).strict(),
  z.object({ type: z.literal('tutor'), conversationId: z.uuid() }).strict(),
]);
export type SpeechContext = z.infer<typeof speechContextSchema>;
export const narrationContextSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('lesson'), lessonId: z.uuid() }).strict(),
  z.object({ type: z.literal('assessment'), journeyId: z.uuid(), questionId: z.string().min(1).max(100) }).strict(),
]);
export type NarrationContext = z.infer<typeof narrationContextSchema>;
export const narrationSchema = z.object({ id: z.uuid(), language: languageSchema, transcript: z.string(), duration: z.number(), bytes: z.number(), sourceIds: z.array(z.string()), createdAt: z.number() });
export type Narration = z.infer<typeof narrationSchema>;
export const narrationStateSchema = z.object({ narration: narrationSchema.nullable(), jobId: z.uuid().nullable() });
export const transcriptionSchema = z.object({ id: z.uuid(), language: languageSchema, text: z.string(), confirmedText: z.string().nullable(), confirmedAt: z.number().nullable(), duration: z.number(), createdAt: z.number() });
export type Transcription = z.infer<typeof transcriptionSchema>;
export const transcriptionConfirmationSchema = z.object({ text: z.string().trim().min(1).max(6000) }).strict();

export const videoContextSchema = z.object({ lessonId: z.uuid() }).strict();
export const videoSlideSchema = z.object({ text: z.string(), sourceIds: z.array(z.string()), start: z.number(), end: z.number() });
export type VideoSlide = z.infer<typeof videoSlideSchema>;
export const videoSchema = z.object({ id: z.uuid(), lessonId: z.uuid(), language: languageSchema, transcript: z.string(), storyboard: z.array(videoSlideSchema), sourceIds: z.array(z.string()), duration: z.number(), bytes: z.number(), captionTiming: z.enum(['chunk', 'estimated']), createdAt: z.number() });
export type LessonVideo = z.infer<typeof videoSchema>;
export const videoStateSchema = z.object({ video: videoSchema.nullable(), jobId: z.uuid().nullable() });
