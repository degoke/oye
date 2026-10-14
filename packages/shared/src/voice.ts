import { z } from 'zod';
import { languageSchema } from './preferences.js';

export const voiceContextSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('tutor'), conversationId: z.uuid() }).strict(),
  z.object({ type: z.literal('explain'), lessonId: z.uuid() }).strict(),
  z.object({ type: z.literal('response'), attemptId: z.uuid(), revision: z.number().int().min(0) }).strict(),
]);
export type VoiceContext = z.infer<typeof voiceContextSchema>;
export const voiceCreateSchema = z.object({ context: voiceContextSchema, requestId: z.uuid() }).strict();
export const voiceSessionSchema = z.object({ id: z.uuid(), context: voiceContextSchema, language: languageSchema, transport: z.enum(['pipeline', 'openai-realtime']), status: z.enum(['ready', 'active', 'disconnected', 'closed']), expiresAt: z.number(), turns: z.number(), inputMilliseconds: z.number(), maxTurns: z.number(), maxInputMilliseconds: z.number(), createdAt: z.number() });
export type VoiceSession = z.infer<typeof voiceSessionSchema>;
export const voiceCredentialSchema = z.object({ session: voiceSessionSchema, credential: z.string(), credentialExpiresAt: z.number() });
export const voiceTurnSchema = z.object({ id: z.uuid(), sessionId: z.uuid(), language: languageSchema, transcriptionId: z.uuid().nullable(), tutorTurnId: z.uuid().nullable(), recognizedText: z.string(), confirmedText: z.string().nullable(), assistantText: z.string(), status: z.enum(['recognizing', 'awaiting_confirmation', 'replying', 'completed', 'interrupted', 'failed']), audioAvailable: z.boolean(), createdAt: z.number(), updatedAt: z.number() });
export type VoiceTurn = z.infer<typeof voiceTurnSchema>;
export const voiceDetailSchema = voiceSessionSchema.extend({ history: z.array(voiceTurnSchema) });
export const voiceClientMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('authenticate'), sessionId: z.uuid(), credential: z.string().min(32).max(100) }).strict(),
  z.object({ type: z.literal('audio'), data: z.string().min(4).max(24000).regex(/^[A-Za-z0-9+/]+={0,2}$/), sequence: z.number().int().min(0) }).strict(),
  z.object({ type: z.literal('commit') }).strict(),
  z.object({ type: z.literal('mute'), muted: z.boolean() }).strict(),
  z.object({ type: z.literal('interrupt') }).strict(),
  z.object({ type: z.literal('stop') }).strict(),
  z.object({ type: z.literal('ping') }).strict(),
]);
export type VoiceClientMessage = z.infer<typeof voiceClientMessageSchema>;
export const voiceServerMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('ready'), session: voiceSessionSchema }),
  z.object({ type: z.literal('state'), state: z.enum(['listening', 'recognizing', 'thinking', 'speaking', 'awaiting_confirmation', 'muted', 'stopped']) }),
  z.object({ type: z.literal('turn'), turn: voiceTurnSchema }),
  z.object({ type: z.literal('delta'), turnId: z.uuid(), text: z.string() }),
  z.object({ type: z.literal('audio'), turnId: z.uuid(), url: z.string().regex(/^\/api\/voice\/turns\/[a-f0-9-]+\/audio$/), format: z.enum(['mp3', 'pcm']) }),
  z.object({ type: z.literal('interrupted'), turnId: z.uuid().optional() }),
  z.object({ type: z.literal('error'), message: z.string() }),
  z.object({ type: z.literal('pong') }),
]);
export type VoiceServerMessage = z.infer<typeof voiceServerMessageSchema>;
