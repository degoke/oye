import { z } from 'zod';

export const languageSchema = z.enum(['en', 'yo', 'ha', 'ig']);
export type Language = z.infer<typeof languageSchema>;
export const languages: { value: Language; label: string; native: string }[] = [
  { value: 'en', label: 'English', native: 'English' },
  { value: 'yo', label: 'Yoruba', native: 'Yorùbá' },
  { value: 'ha', label: 'Hausa', native: 'Hausa' },
  { value: 'ig', label: 'Igbo', native: 'Igbo' },
];
export const healthSchema = z.object({ status: z.literal('ok'), name: z.literal('òye.') });

export const preferencesSchema = z.object({
  language: languageSchema.default('en'),
  format: z.enum(['text', 'audio', 'video']).default('text'),
  readingSupport: z.enum(['standard', 'simple']).default('standard'),
  sessionMinutes: z.number().int().min(5).max(60).default(10),
  lowData: z.boolean().default(false),
}).strict();
export const preferenceUpdateSchema = z.object({
  language: languageSchema.optional(),
  format: z.enum(['text', 'audio', 'video']).optional(),
  readingSupport: z.enum(['standard', 'simple']).optional(),
  sessionMinutes: z.number().int().min(5).max(60).optional(),
  lowData: z.boolean().optional(),
}).strict();
export type Preferences = z.infer<typeof preferencesSchema>;
export const sessionResponseSchema = z.object({ expiresAt: z.number(), preferences: preferencesSchema, cacheScope: z.string().regex(/^[a-f0-9]{64}$/).optional() });
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
