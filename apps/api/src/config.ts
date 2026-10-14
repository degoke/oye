import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { z } from 'zod';

export const projectRoot = fileURLToPath(new URL('../../../', import.meta.url));
loadEnv({ path: resolve(projectRoot, '.env'), quiet: true });
const parsed = z.object({
  API_HOST: z.enum(['127.0.0.1', '0.0.0.0']).default('127.0.0.1'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3187),
  WEB_ORIGIN: z.url().default('http://127.0.0.1:5187'),
  DATABASE_PATH: z.string().default('.data/oye.sqlite'),
  MEDIA_PATH: z.string().default('.data/media'),
  OPENAI_API_KEY: z.string().optional(),
  AI_PROVIDER: z.enum(['openrouter', 'openai']).default('openai'),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_TEXT_MODEL: z.string().default('google/gemini-2.5-flash-lite'),
  OPENROUTER_TUTOR_MODEL: z.string().default('openai/gpt-6-luna'),
  OPENROUTER_LESSON_MODEL: z.string().default('openai/gpt-6-luna'),
  OPENROUTER_EVALUATION_MODEL: z.string().default('openai/gpt-6-luna'),
  OPENAI_TEXT_MODEL: z.string().default('gpt-6-luna'),
  OPENAI_TUTOR_MODEL: z.string().default('gpt-6-luna'),
  OPENAI_LESSON_MODEL: z.string().default('gpt-6-luna'),
  OPENAI_EVALUATION_MODEL: z.string().default('gpt-6-luna'),
  OPENAI_SEARCH_MODEL: z.string().default('gpt-6-luna'),
  OPENROUTER_TTS_MODEL: z.string().default('google/gemini-3.8-flash-lite-tts'),
  OPENROUTER_TTS_MODEL_YO: z.string().default('google/gemini-3.8-flash-tts'),
  OPENROUTER_TTS_MODEL_HA: z.string().default('google/gemini-3.8-flash-tts'),
  OPENROUTER_TTS_MODEL_IG: z.string().default('google/gemini-3.8-flash-tts'),
  OPENROUTER_TTS_VOICE: z.string().default('Kore'),
  OPENROUTER_TTS_VOICE_YO: z.string().default('Puck'),
  OPENROUTER_TTS_VOICE_IG: z.string().default('Puck'),
  OPENROUTER_STT_MODEL: z.string().default('google/gemini-3.5-transcribe'),
  OPENROUTER_NARRATION_STT_MODEL_YO: z.string().default('google/gemini-3.5-transcribe'),
  OPENAI_REALTIME_MODEL: z.string().default('gpt-realtime-2.1-mini'),
  OPENAI_REALTIME_VOICE: z.string().default('coral'),
  OPENAI_TTS_MODEL: z.string().default('gpt-4o-mini-tts'),
  OPENAI_TTS_VOICE: z.string().default('coral'),
  OPENAI_STT_MODEL: z.string().default('gpt-4o-mini-transcribe'),
  FFMPEG_PATH: z.string().default('ffmpeg'),
  FFPROBE_PATH: z.string().default('ffprobe'),
  VIDEO_FONT_FAMILY: z.string().trim().min(1).max(100).default('Arial'),
  AI_MAX_OUTPUT_TOKENS: z.coerce.number().int().min(128).max(16000).default(6000),
  ENABLE_FIXTURES: z.enum(['true', 'false']).default('false'),
}).safeParse(process.env);
if (!parsed.success) throw new Error('Invalid server configuration: ' + parsed.error.issues.map(i => i.path.join('.') + ': ' + i.message).join(', '));
export const config = parsed.data;
